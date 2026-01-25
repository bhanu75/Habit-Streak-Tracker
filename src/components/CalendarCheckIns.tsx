"use client";

import { motion } from "framer-motion";
import { Habit } from "@/types/habit";
import { getLastNDays, formatDateShort } from "@/lib/date";

interface Props {
  habit: Habit;
  days?: number;
}

export default function CalendarCheckIns({ habit, days = 30 }: Props) {
  const dates = getLastNDays(days);
  const checkInSet = new Set(habit.checkIns);

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">📅 Last {days} Days</h3>
      <div className="grid grid-cols-7 gap-2">
        {dates.map((date, index) => {
          const hasCheckIn = checkInSet.has(date);

          return (
            <motion.div
              key={date}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              className="aspect-square"
            >
              <div
                className={`
                  w-full h-full rounded-lg flex flex-col items-center justify-center
                  transition-all duration-200
                  ${
                    hasCheckIn
                      ? "bg-green-500 text-white shadow-md scale-105"
                      : "bg-gray-100 text-gray-400"
                  }
                `}
              >
                <div className="text-xs font-medium">
                  {formatDateShort(date).split(" ")[1]}
                </div>
                {hasCheckIn && <div className="text-lg">✓</div>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
