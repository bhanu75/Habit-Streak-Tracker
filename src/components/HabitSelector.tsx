"use client";

import { useHabitsStore } from "@/store/useHabitsStore";
import { motion, AnimatePresence } from "framer-motion";
import { calculateStreakData } from "@/lib/streak";

export default function HabitSelector() {
  const { habits, activeHabitId, setActiveHabit } = useHabitsStore();

  if (habits.length === 0) return null;

  return (
    <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex gap-2 min-w-min">
        <AnimatePresence mode="popLayout">
          {habits.map((habit) => {
            const isActive = habit.id === activeHabitId;
            const streakData = calculateStreakData(habit);

            return (
              <motion.button
                key={habit.id}
                onClick={() => setActiveHabit(habit.id)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl
                  transition-all duration-200 whitespace-nowrap
                  ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }
                `}
              >
                <span className="text-2xl">{habit.emoji}</span>
                <div className="text-left">
                  <div className="font-semibold text-sm">{habit.name}</div>
                  <div
                    className={`text-xs ${
                      isActive ? "text-white/90" : "text-gray-600"
                    }`}
                  >
                    🔥 {streakData.currentStreak} days
                  </div>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
