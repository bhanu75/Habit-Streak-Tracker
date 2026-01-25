import { create } from "zustand";
import { Habit, AppState } from "@/types/habit";
import { getTodayISO, getNowISO } from "@/lib/date";
import { saveToStorage, loadFromStorage } from "@/lib/storage";

interface HabitsStore extends AppState {
  initialize: () => void;
  createHabit: (name: string, emoji: string, targetDays: number) => void;
  deleteHabit: (habitId: string) => void;
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  setActiveHabit: (habitId: string | null) => void;
  toggleCheckIn: (habitId: string) => void;
  toggleFreezeDay: (habitId: string, date: string) => void;
  getActiveHabit: () => Habit | null;
  importData: (data: AppState) => void;
  clearAllData: () => void;
  setUserName: (name: string) => void;
  toggleTheme: () => void;
}

export const useHabitsStore = create<HabitsStore>((set, get) => ({
  habits: [],
  activeHabitId: null,
  userName: "",
  theme: "dark",

  initialize: () => {
    const saved = loadFromStorage();
    if (saved) {
      set(saved);
    }
  },

  createHabit: (name, emoji, targetDays) => {
    const newHabit: Habit = {
      id: `h_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      emoji,
      targetDays,
      createdAt: getNowISO(),
      checkIns: [],
      freezeDays: [],
    };

    set((state) => {
      const newState = {
        ...state,
        habits: [...state.habits, newHabit],
        activeHabitId: state.activeHabitId || newHabit.id,
      };
      saveToStorage(newState);
      return newState;
    });
  },

  deleteHabit: (habitId) => {
    set((state) => {
      const newHabits = state.habits.filter((h) => h.id !== habitId);
      const newActiveId =
        state.activeHabitId === habitId
          ? newHabits[0]?.id || null
          : state.activeHabitId;

      const newState = {
        ...state,
        habits: newHabits,
        activeHabitId: newActiveId,
      };
      saveToStorage(newState);
      return newState;
    });
  },

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

  setActiveHabit: (habitId) => {
    set((state) => {
      const newState = { ...state, activeHabitId: habitId };
      saveToStorage(newState);
      return newState;
    });
  },

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

  toggleFreezeDay: (habitId, date) => {
    set((state) => {
      const habit = state.habits.find((h) => h.id === habitId);
      if (!habit) return state;

      const hasFreezeDay = habit.freezeDays.includes(date);
      const newFreezeDays = hasFreezeDay
        ? habit.freezeDays.filter((d) => d !== date)
        : [...habit.freezeDays, date];

      const newState = {
        ...state,
        habits: state.habits.map((h) =>
          h.id === habitId ? { ...h, freezeDays: newFreezeDays } : h
        ),
      };
      saveToStorage(newState);
      return newState;
    });
  },

  getActiveHabit: () => {
    const state = get();
    return state.habits.find((h) => h.id === state.activeHabitId) || null;
  },

  importData: (data) => {
    set(data);
    saveToStorage(data);
  },

  clearAllData: () => {
    const newState = {
      habits: [],
      activeHabitId: null,
      userName: "",
      theme: "dark" as const,
    };
    set(newState);
    saveToStorage(newState);
  },

  setUserName: (name) => {
    set((state) => {
      const newState = { ...state, userName: name };
      saveToStorage(newState);
      return newState;
    });
  },

  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === "dark" ? "light" : "dark";
      const newState = { ...state, theme: newTheme };
      saveToStorage(newState);
      return newState;
    });
  },
}));
