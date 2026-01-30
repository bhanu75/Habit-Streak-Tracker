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

  // Show only first 4 milestones
  const displayMilestones = milestones.slice(0, 4);

  return (
    <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-white/90 font-semibold">
          <span className="text-lg">🏆</span>
          <span>Milestones</span>
        </div>

        {nextMilestone && (
          <div className="text-white/60 text-xs">
            Next: {nextMilestone.days - currentStreak}d to go
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {displayMilestones.map((milestone, index) => {
          const isCurrentTarget = nextMilestone && nextMilestone.days === milestone.days;
          
          return (
            <motion.div
              key={milestone.days}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03, duration: 0.2 }}
              className={[
                "rounded-2xl border backdrop-blur-xl p-3",
                "flex flex-col items-center text-center",
                milestone.achieved
                  ? "ring-2 ring-green-400/60 bg-green-400/20 border-green-400/40 shadow-lg shadow-green-400/20"
                  : isCurrentTarget
                  ? "ring-2 ring-orange-400/60 bg-orange-400/20 border-orange-400/40 shadow-lg shadow-orange-400/20"
                  : "bg-white/5 border-white/10 opacity-60",
              ].join(" ")}
            >
              <div 
                className={[
                  "h-12 w-12 rounded-2xl flex items-center justify-center border text-2xl mb-2",
                  milestone.achieved
                    ? "bg-green-400/30 border-green-400/40"
                    : isCurrentTarget
                    ? "bg-orange-400/30 border-orange-400/40"
                    : "bg-white/10 border-white/10"
                ].join(" ")}
              >
                {milestone.emoji}
              </div>
              <div className="w-full">
                <div className="text-white/90 font-semibold text-xs leading-tight mb-1">
                  {milestone.label}
                </div>
                <div className="text-white/60 text-xs">{milestone.days} days</div>
                {isCurrentTarget && !milestone.achieved && (
                  <div className="text-orange-300 text-[10px] mt-1 font-medium">
                    🎯 Next Goal
                  </div>
                )}
                {milestone.achieved && (
                  <div className="text-green-300 text-[10px] mt-1 font-medium">
                    ✓ Unlocked
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
