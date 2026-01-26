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
  isFrozen: boolean;
}

export default function CheckInButton({ habitId, isCompleted, isFrozen }: Props) {
  const { toggleCheckIn, habits } = useHabitsStore();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCheckIn = () => {
    if (isFrozen) return;

    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    const oldStreak = calculateStreakData(habit).currentStreak;
    toggleCheckIn(habitId);

    if (!isCompleted) {
      setIsAnimating(true);

      const newHabit = habits.find((h) => h.id === habitId);
      if (newHabit) {
        const newStreakData = calculateStreakData(newHabit);
        const newStreak = newStreakData.currentStreak + 1;

        notify.checkIn(newStreak);

        const milestone = checkMilestoneAchieved(oldStreak, newStreak);
        if (milestone) {
          notify.milestone(milestone.days, milestone.label, milestone.emoji);
        }

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#fb923c", "#ec4899", "#f97316"],
        });

        setTimeout(() => setIsAnimating(false), 1000);
      }
    } else {
      notify.checkInRemoved();
    }
  };

  if (isFrozen) {
    return (
      <div className="mt-5 w-full py-4 rounded-2xl font-semibold text-white text-center bg-blue-500/30 border border-blue-400/40">
        <span className="flex items-center justify-center gap-2">
          <span>❄️</span>
          <span>Day Frozen - Streak Protected</span>
        </span>
      </div>
    );
  }

  return (
    <motion.button
      onClick={handleCheckIn}
      disabled={isAnimating}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={[
        "relative mt-5 w-full py-4 rounded-2xl font-semibold",
        "transition-all duration-300 backdrop-blur-xl border",
        isCompleted
          ? "bg-green-500/30 text-white shadow-lg shadow-green-400/20 border-green-400/40"
          : "bg-gradient-to-r from-orange-400/30 to-pink-400/30 text-white border-orange-400/40 hover:shadow-lg hover:shadow-orange-400/20",
      ].join(" ")}
    >
      {isAnimating && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.5, 0] }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-yellow-400/30 rounded-2xl"
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
