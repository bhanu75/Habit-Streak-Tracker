import { AppState, ExportData, Habit } from "@/types/habit";
import { getNowISO } from "./date";

const STORAGE_KEY = "habit-tracker-data";
const STORAGE_VERSION = "1.0.0";

/**
 * Load app state from localStorage
 */
export function loadFromStorage(): AppState | null {
  if (typeof window === "undefined") return null;

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data) as AppState;
    return parsed;
  } catch (error) {
    console.error("Failed to load from storage:", error);
    return null;
  }
}

/**
 * Save app state to localStorage
 */
export function saveToStorage(state: AppState): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save to storage:", error);
  }
}

/**
 * Export data as JSON file
 */
export function exportToJSON(state: AppState): void {
  const exportData: ExportData = {
    version: STORAGE_VERSION,
    exportedAt: getNowISO(),
    habits: state.habits,
    activeHabitId: state.activeHabitId,
    userName: state.userName,
    theme: state.theme,
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `habit-tracker-backup-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export check-ins as CSV
 */
export function exportToCSV(habits: Habit[]): void {
  const rows: string[] = [
    "Habit,Date,Streak Day", // Header
  ];

  habits.forEach((habit) => {
    habit.checkIns.forEach((date, index) => {
      rows.push(`"${habit.name}","${date}",${index + 1}`);
    });
  });

  const csvContent = rows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `habit-tracker-checkins-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Import data from JSON file
 */
export async function importFromJSON(file: File): Promise<ExportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as ExportData;

        // Validate structure
        if (!data.habits || !Array.isArray(data.habits)) {
          throw new Error("Invalid data structure");
        }

        resolve(data);
      } catch (error) {
        reject(new Error("Failed to parse JSON file"));
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

/**
 * Merge imported data with existing data
 */
export function mergeImportedData(
  currentState: AppState,
  importedData: ExportData
): AppState {
  const existingHabitIds = new Set(currentState.habits.map((h) => h.id));
  const newHabits = importedData.habits.filter(
    (h) => !existingHabitIds.has(h.id)
  );

  return {
    habits: [...currentState.habits, ...newHabits],
    activeHabitId: currentState.activeHabitId,
    userName: currentState.userName,
    theme: currentState.theme,
  };
}

/**
 * Replace all data with imported data
 */
export function replaceWithImportedData(importedData: ExportData): AppState {
  return {
    habits: importedData.habits,
    activeHabitId: importedData.activeHabitId || null,
    userName: importedData.userName ?? "",
    theme: importedData.theme ?? "dark",
  };
}

/**
 * Clear all data from storage
 */
export function clearStorage(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Get storage size in KB
 */
export function getStorageSize(): number {
  if (typeof window === "undefined") return 0;

  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return 0;

  return new Blob([data]).size / 1024; // Size in KB
}
