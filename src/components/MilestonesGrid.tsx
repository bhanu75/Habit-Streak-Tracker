"use client";

import { motion } from "framer-motion";
import { getMilestones, getNextMilestone } from "@/lib/streak";

interface Props {
  currentStreak: number;
  longestStreak: number;
}

export default function MilestonesGrid({ currentStreak, longestStreak }: Props) {
  const milestones = getMilestones(currentStreak, longestStreak);
  const nextMilestone = getNextMilestone(currentStreak);

  return (
    <div>
      {/* Next Milestone */}
      {nextMilestone && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white"
        >
          <h3 className="text-lg font-semibold mb-2">🎯 Next Milestone</h3>
          <div className="flex items-center gap-3">
            <span className="text-4xl">{nextMilestone.emoji}</span>
            <div>
              <div className="text-xl font-bold">{nextMilestone.label}</div>
              <div className="text-white/90">
                {nextMilestone.days - currentStreak} days to go
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Milestones Grid */}
      <h3 className="text-xl font-bold mb-4">🏆 Milestones</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {milestones.map((milestone, index) => (
          <motion.div
            key={milestone.days}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={`
              rounded-xl p-4 text-center transition-all
              ${
                milestone.achieved
                  ? "bg-green-500 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-400"
              }
            `}
          >
            <div className="text-3xl mb-2">{milestone.emoji}</div>
            <div className="font-semibold text-sm mb-1">{milestone.label}</div>
            <div className="text-xs opacity-80">{milestone.days} days</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
