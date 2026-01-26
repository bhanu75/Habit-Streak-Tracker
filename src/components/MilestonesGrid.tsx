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
          <span className="text-white/70">🏆</span>
          <span>Milestones</span>
        </div>

        {nextMilestone && (
          <div className="text-white/60 text-xs">
            Next: {nextMilestone.days - currentStreak}d to go
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {displayMilestones.map((milestone, index) => (
          <motion.div
            key={milestone.days}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className={[
              "rounded-2xl border backdrop-blur-xl p-3",
              "flex items-center gap-3",
              milestone.achieved
                ? "ring-1 ring-orange-400/40 bg-white/10 border-white/15"
                : "bg-white/5 border-white/10 opacity-60",
            ].join(" ")}
          >
            <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 text-lg flex-shrink-0">
              {milestone.emoji}
            </div>
            <div className="min-w-0">
              <div className="text-white/90 font-semibold text-sm truncate">
                {milestone.label}
              </div>
              <div className="text-white/60 text-xs">{milestone.days} days</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
