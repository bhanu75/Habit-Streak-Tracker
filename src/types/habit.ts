// ISO Date Types for proper type safety
export type ISODate = string; // Format: "YYYY-MM-DD"
export type ISODateTime = string; // Format: "YYYY-MM-DDTHH:mm:ss.sssZ"

// Check-in type (date-only storage)
export interface CheckIn {
  date: ISODate; // "2026-01-24"
}

// Habit interface
export interface Habit {
  id: string;
  name: string;
  emoji: string;
  targetDays: number;
  createdAt: ISODateTime;
  checkIns: ISODate[]; // Array of ISO dates
  freezeDays: ISODate[]; // Days when streak is protected (weekends/holidays)
  notificationTime?: string; // "HH:MM" format (e.g., "09:00")
  notificationEnabled?: boolean; // Whether notifications are enabled
}

// Computed streak data (calculated, not stored)
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalCheckIns: number;
  progress: number; // percentage (0-100)
  isCompletedToday: boolean;
  lastCheckInDate: ISODate | null;
  isFrozen: boolean; // Is today a freeze day
}

// Milestone definition
export interface Milestone {
  days: number;
  label: string;
  emoji: string;
  achieved: boolean;
}

// Target preset options
export interface TargetPreset {
  days: number;
  label: string;
  emoji: string;
}

// App state structure
export interface AppState {
  habits: Habit[];
  activeHabitId: string | null;
  userName: string; // User's name for personalization
  theme: "light" | "dark";
  notificationPermission?: "granted" | "denied" | "default";
  firedNotifications?: { [date: string]: { [habitId: string]: boolean } };
}

// Export data format
export interface ExportData {
  version: string;
  exportedAt: ISODateTime;
  habits: Habit[];
  activeHabitId: string | null;
  userName: string;
  theme: "light" | "dark";
}

// Target presets constant
export const TARGET_PRESETS: TargetPreset[] = [
  { days: 7, label: "7 Days", emoji: "🔥" },
  { days: 21, label: "21 Days", emoji: "⭐" },
  { days: 30, label: "30 Days", emoji: "💪" },
  { days: 60, label: "60 Days", emoji: "🏆" },
  { days: 90, label: "90 Days", emoji: "👑" },
  { days: 180, label: "180 Days", emoji: "💎" },
];

// Milestone definitions
export const MILESTONE_DEFINITIONS = [
  { days: 7, label: "Week Warrior", emoji: "🔥" },
  { days: 14, label: "Two Week Champion", emoji: "💪" },
  { days: 21, label: "Habit Former", emoji: "⭐" },
  { days: 30, label: "Month Master", emoji: "🏆" },
  { days: 60, label: "Double Month", emoji: "👑" },
  { days: 90, label: "Quarter Legend", emoji: "💎" },
  { days: 100, label: "Century Club", emoji: "🎯" },
  { days: 180, label: "Half Year Hero", emoji: "🚀" },
  { days: 365, label: "Year Champion", emoji: "🏅" },
];
