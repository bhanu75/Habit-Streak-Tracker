"use client";

import { motion } from "framer-motion";
import { StreakData, Habit } from "@/types/habit";

interface Props {
  habit: Habit;
  streakData: StreakData;
}

export default function StreakHeroCard({ habit, streakData }: Props) {
  const { currentStreak, longestStreak, progress, totalCheckIns } = streakData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-3xl p-8 text-white shadow-2xl"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>
      </div>

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-5xl">{habit.emoji}</span>
            <div>
              <h2 className="text-2xl font-bold">{habit.name}</h2>
              <p className="text-white/80 text-sm">
                {totalCheckIns} / {habit.targetDays} days
              </p>
            </div>
          </div>
        </div>

        {/* Current Streak */}
        <div className="mb-6">
          <motion.div
            key={currentStreak}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center"
          >
            <div className="text-6xl font-black mb-2">
              {currentStreak}
              <span className="text-3xl ml-2">🔥</span>
            </div>
            <div className="text-xl font-medium text-white/90">
              Day Streak
            </div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-white/80">Progress</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-white rounded-full shadow-lg"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold">{longestStreak}</div>
            <div className="text-sm text-white/80">Longest Streak</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-3xl font-bold">{totalCheckIns}</div>
            <div className="text-sm text-white/80">Total Check-ins</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
