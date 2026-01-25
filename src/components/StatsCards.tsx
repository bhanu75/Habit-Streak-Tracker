"use client";

import { motion } from "framer-motion";
import { StreakData } from "@/types/habit";
import { formatDate } from "@/lib/date";

interface Props {
  streakData: StreakData;
}

export default function StatsCards({ streakData }: Props) {
  const { lastCheckInDate, isCompletedToday } = streakData;

  const stats = [
    {
      icon: "📅",
      label: "Last Check-in",
      value: lastCheckInDate ? formatDate(lastCheckInDate) : "Never",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: isCompletedToday ? "✅" : "⏰",
      label: "Today's Status",
      value: isCompletedToday ? "Completed" : "Pending",
      color: isCompletedToday
        ? "from-green-500 to-emerald-500"
        : "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`
            bg-gradient-to-br ${stat.color} 
            rounded-2xl p-6 text-white shadow-lg
          `}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{stat.icon}</span>
            <h3 className="font-semibold text-white/90">{stat.label}</h3>
          </div>
          <div className="text-2xl font-bold">{stat.value}</div>
        </motion.div>
      ))}
    </div>
  );
}
