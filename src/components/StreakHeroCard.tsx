import React, { memo, useState } from "react";
import { motion } from "framer-motion";
import { StreakData, Habit } from "@/types/habit";

interface Props {
  habit: Habit;
  streakData: StreakData;
  onDateClick?: (date: string) => void;
}

const StreakHeroCard = ({ habit, streakData, onDateClick }: Props) => {
  const { currentStreak, progress, totalCheckIns } = streakData;
  
  // Calendar state - start with current month
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  
  const checkInSet = new Set(habit.checkIns);
  
  // Get month/year display
  const monthYear = currentMonth.toLocaleDateString("en-US", { 
    month: "long", 
    year: "numeric" 
  });
  
  // Generate calendar days for current month
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of month
    const firstDay = new Date(year, month, 1);
    // Last day of month
    const lastDay = new Date(year, month + 1, 0);
    
    // Days from previous month to fill first week
    const startingDayOfWeek = firstDay.getDay();
    const prevMonthDays: Date[] = [];
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      prevMonthDays.push(d);
    }
    
    // Days in current month
    const currentMonthDays: Date[] = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      currentMonthDays.push(new Date(year, month, i));
    }
    
    // Days from next month to complete grid (42 cells = 6 rows)
    const totalCells = 42;
    const nextMonthDays: Date[] = [];
    const remainingCells = totalCells - prevMonthDays.length - currentMonthDays.length;
    for (let i = 1; i <= remainingCells; i++) {
      nextMonthDays.push(new Date(year, month + 1, i));
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };
  
  const days = getCalendarDays();
  
  // Navigation handlers
  const goToPrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };
  
  const goToToday = () => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  };

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
          <button 
            onClick={goToPrevMonth}
            className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
          >
            ‹
          </button>
          <button 
            onClick={goToToday}
            className="text-white/80 font-medium text-sm hover:text-white transition-colors"
          >
            {monthYear}
          </button>
          <button 
            onClick={goToNextMonth}
            className="h-8 w-8 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
          >
            ›
          </button>
        </div>

        {/* Week header */}
        <div className="grid grid-cols-7 gap-2 text-[11px] text-white/50 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center">{d}</div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((dateObj, index) => {
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, "0");
            const day = String(dateObj.getDate()).padStart(2, "0");
            const dateStr = `${year}-${month}-${day}`;
            
            const hasCheckIn = checkInSet.has(dateStr);
            const dayNum = dateObj.getDate();
            
            const today = new Date();
            const isToday = dateObj.toDateString() === today.toDateString();
            const isFuture = dateObj > today;
            const isCurrentMonth = dateObj.getMonth() === currentMonth.getMonth();

            return (
              <motion.button
                key={`${dateStr}-${index}`}
                onClick={() => !isFuture && onDateClick?.(dateStr)}
                disabled={isFuture}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={!isFuture && isCurrentMonth ? { scale: 1.05 } : {}}
                whileTap={!isFuture && isCurrentMonth ? { scale: 0.95 } : {}}
                transition={{ delay: index * 0.005, duration: 0.15 }}
                className={[
                  "aspect-square rounded-xl flex items-center justify-center text-sm select-none",
                  "border transition-all",
                  !isCurrentMonth ? "text-white/30 border-white/5" : "",
                  hasCheckIn && isCurrentMonth
                    ? "bg-green-400/30 text-white shadow-md shadow-green-400/20 border-green-400/40"
                    : isCurrentMonth
                    ? "bg-white/5 text-white/70 border-white/10"
                    : "bg-transparent border-transparent",
                  isToday && !hasCheckIn && isCurrentMonth ? "ring-1 ring-orange-400/40" : "",
                  isFuture ? "opacity-40 cursor-not-allowed" : isCurrentMonth ? "cursor-pointer hover:bg-white/10" : "cursor-default",
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
