"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useHabitsStore } from "@/store/useHabitsStore";
import { calculateStreakData } from "@/lib/streak";
import { checkMilestoneAchieved } from "@/lib/streak";
import { notify } from "@/lib/notifications";

interface Props {
  habitId: string;
  isCompleted: boolean;
}

export default function CheckInButton({ habitId, isCompleted }: Props) {
  const { toggleCheckIn, habits } = useHabitsStore();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCheckIn = () => {
    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const oldStreak = calculateStreakData(habit).currentStreak;

    // Toggle check-in
    toggleCheckIn(habitId);

    if (!isCompleted) {
      // Adding check-in
      setIsAnimating(true);

      // Calculate new streak
      const newHabit = habits.find((h) => h.id === habitId);
      if (newHabit) {
        const newStreakData = calculateStreakData(newHabit);
        const newStreak = newStreakData.currentStreak + 1;

        // Show notification
        notify.checkIn(newStreak);

        // Check for milestone
        const milestone = checkMilestoneAchieved(oldStreak, newStreak);
        if (milestone) {
          notify.milestone(milestone.days, milestone.label, milestone.emoji);
        }

        // Confetti effect
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#9333ea", "#ec4899", "#f97316"],
        });

        setTimeout(() => setIsAnimating(false), 1000);
      }
    } else {
      // Removing check-in
      notify.checkInRemoved();
    }
  };

  return (
    <motion.button
      onClick={handleCheckIn}
      disabled={isAnimating}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative w-full py-6 rounded-2xl font-bold text-lg
        transition-all duration-300 shadow-lg
        ${
          isCompleted
            ? "bg-green-500 text-white"
            : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-2xl"
        }
      `}
    >
      {isAnimating && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 0] }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-yellow-400 rounded-2xl opacity-50"
        />
      )}

      <span className="relative z-10 flex items-center justify-center gap-2">
        {isCompleted ? (
          <>
            <span>✅</span>
            <span>Completed Today!</span>
          </>
        ) : (
          <>
            <span>🎯</span>
            <span>Check In Now</span>
          </>
        )}
      </span>
    </motion.button>
  );
}
