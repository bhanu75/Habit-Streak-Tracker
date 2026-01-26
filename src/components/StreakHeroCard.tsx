import React, { memo } from "react";
import { motion } from "framer-motion";
import { StreakData, Habit } from "@/types/habit";
import { getLastNDays, formatDateShort } from "@/lib/date";

interface Props {
  habit: Habit;
  streakData: StreakData;
  onDateClick?: (date: string) => void;
}

const StreakHeroCard = ({ habit, streakData, onDateClick }: Props) => {
  const { currentStreak, progress, totalCheckIns } = streakData;
  
  // Calendar data
  const days = getLastNDays(30);
  const checkInSet = new Set(habit.checkIns);
  
  // Get current month/year
  const currentDate = new Date();
  const monthYear = currentDate.toLocaleDateString("en-US", { 
    month: "long", 
    year: "numeric" 
  });

  return (
    <div className="mt-5 rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-5 shadow-xl">
      {/* Habit Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 text-xl">
          {habit.emoji}
        </div>
        <div>
          <p className="text-white font-semibold leading-tight">{habit.name}</p>
          <p className="text-white/60 text-sm">{totalCheckIns} / {habit.targetDays} days</p>
        </div>
      </div>

      {/* Streak Display */}
      <div className="mt-4 text-center">
        <motion.div
          key={currentStreak}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-white text-5xl font-bold leading-none"
        >
          {currentStreak} <span className="text-4xl">🔥</span>
        </motion.div>
        <div className="text-white/80 text-sm mt-1">Day Streak</div>
      </div>

      {/* Progress Bar */}
      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>Progress</span>
          <span className="text-orange-300 font-medium">{progress}%</span>
        </div>

        <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-pink-400"
          />
        </div>
      </div>

      {/* Calendar */}
      <div className="mt-5 rounded-2xl bg-white/5 border border-white/10 p-4">
        <div className="flex items-center justify-between mb-3">
          <button className="text-white/60 hover:text-white transition">‹</button>
          <p className="text-white/80 font-medium text-sm">{monthYear}</p>
          <button className="text-white/60 hover:text-white transition">›</button>
        </div>

        {/* Week header */}
        <div className="grid grid-cols-7 gap-2 text-[11px] text-white/50 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center">{d}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => {
            const hasCheckIn = checkInSet.has(date);
            const dayNum = new Date(date).getDate();
            const isToday = date === new Date().toISOString().split("T")[0];
            const isFuture = new Date(date) > new Date();

            return (
              <motion.button
                key={date}
                onClick={() => !isFuture && onDateClick?.(date)}
                disabled={isFuture}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={!isFuture ? { scale: 1.05 } : {}}
                whileTap={!isFuture ? { scale: 0.95 } : {}}
                transition={{ delay: index * 0.01, duration: 0.2 }}
                className={[
                  "aspect-square rounded-xl flex items-center justify-center text-sm select-none",
                  "border transition-all",
                  hasCheckIn
                    ? "bg-green-400/30 text-white shadow-md shadow-green-400/20 border-green-400/40"
                    : "bg-white/5 text-white/70 border-white/10",
                  isToday && !hasCheckIn ? "ring-1 ring-orange-400/40" : "",
                  isFuture ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-white/10",
                ].join(" ")}
              >
                {dayNum}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(StreakHeroCard);
