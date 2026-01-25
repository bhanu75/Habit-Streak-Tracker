import { create } from "zustand";
import { Habit, AppState } from "@/types/habit";
import { getTodayISO, getNowISO } from "@/lib/date";
import { saveToStorage, loadFromStorage } from "@/lib/storage";
import { calculateStreakData } from "@/lib/streak";

interface HabitsStore extends AppState {
  // Actions
  initialize: () => void;
  createHabit: (name: string, emoji: string, targetDays: number) => void;
  deleteHabit: (habitId: string) => void;
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  setActiveHabit: (habitId: string | null) => void;
  toggleCheckIn: (habitId: string) => void;
  getActiveHabit: () => Habit | null;
  importData: (data: AppState) => void;
  clearAllData: () => void;
}

export const useHabitsStore = create<HabitsStore>((set, get) => ({
  habits: [],
  activeHabitId: null,

  // Initialize store from localStorage
  initialize: () => {
    const saved = loadFromStorage();
    if (saved) {
      set(saved);
    }
  },

  // Create new habit
  createHabit: (name, emoji, targetDays) => {
    const newHabit: Habit = {
      id: `h_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      emoji,
      targetDays,
      createdAt: getNowISO(),
      checkIns: [],
    };

    set((state) => {
      const newState = {
        habits: [...state.habits, newHabit],
        activeHabitId: state.activeHabitId || newHabit.id,
      };
      saveToStorage(newState);
      return newState;
    });
  },

  // Delete habit
  deleteHabit: (habitId) => {
    set((state) => {
      const newHabits = state.habits.filter((h) => h.id !== habitId);
      const newActiveId =
        state.activeHabitId === habitId
          ? newHabits[0]?.id || null
          : state.activeHabitId;

      const newState = {
        habits: newHabits,
        activeHabitId: newActiveId,
      };
      saveToStorage(newState);
      return newState;
    });
  },

  // Update habit
  updateHabit: (habitId, updates) => {
    set((state) => {
      const newState = {
        ...state,
        habits: state.habits.map((h) =>
          h.id === habitId ? { ...h, ...updates } : h
        ),
      };
      saveToStorage(newState);
      return newState;
    });
  },

  // Set active habit
  setActiveHabit: (habitId) => {
    set((state) => {
      const newState = { ...state, activeHabitId: habitId };
      saveToStorage(newState);
      return newState;
    });
  },

  // Toggle check-in for today
  toggleCheckIn: (habitId) => {
    const today = getTodayISO();

    set((state) => {
      const habit = state.habits.find((h) => h.id === habitId);
      if (!habit) return state;

      const hasCheckIn = habit.checkIns.includes(today);
      const newCheckIns = hasCheckIn
        ? habit.checkIns.filter((d) => d !== today)
        : [...habit.checkIns, today];

      const newState = {
        ...state,
        habits: state.habits.map((h) =>
          h.id === habitId ? { ...h, checkIns: newCheckIns } : h
        ),
      };
      saveToStorage(newState);
      return newState;
    });
  },

  // Get active habit
  getActiveHabit: () => {
    const state = get();
    return state.habits.find((h) => h.id === state.activeHabitId) || null;
  },

  // Import data
  importData: (data) => {
    set(data);
    saveToStorage(data);
  },

  // Clear all data
  clearAllData: () => {
    const newState = { habits: [], activeHabitId: null };
    set(newState);
    saveToStorage(newState);
  },
}));

// Utility hook to get streak data for active habit
export function useActiveHabitStreak() {
  const activeHabit = useHabitsStore((state) => state.getActiveHabit());
  if (!activeHabit) return null;
  return calculateStreakData(activeHabit);
}
