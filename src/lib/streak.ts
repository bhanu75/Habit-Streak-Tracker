import { Habit, StreakData, Milestone, MILESTONE_DEFINITIONS } from "@/types/habit";
import {
  getTodayISO,
  isToday,
  isYesterday,
  daysBetween,
  sortDatesDesc,
  isSameDay,
} from "./date";

/**
 * Calculate all streak data for a habit (with freeze day support)
 */
export function calculateStreakData(habit: Habit): StreakData {
  const checkIns = habit.checkIns || [];
  const freezeDays = habit.freezeDays || [];
  
  const uniqueDates = Array.from(new Set(checkIns));
  const sortedDates = sortDatesDesc(uniqueDates);

  const today = getTodayISO();
  const totalCheckIns = uniqueDates.length;
  const isCompletedToday = uniqueDates.includes(today);
  const isFrozen = freezeDays.includes(today);
  const lastCheckInDate = sortedDates[0] || null;

  const currentStreak = calculateCurrentStreak(sortedDates, freezeDays);
  const longestStreak = calculateLongestStreak(sortedDates, freezeDays);
  const progress = Math.min((totalCheckIns / habit.targetDays) * 100, 100);

  return {
    currentStreak,
    longestStreak,
    totalCheckIns,
    progress: Math.round(progress),
    isCompletedToday,
    lastCheckInDate,
    isFrozen,
  };
}

/**
 * Calculate current streak with freeze day support
 */
function calculateCurrentStreak(sortedDates: string[], freezeDays: string[]): number {
  if (sortedDates.length === 0) return 0;

  const lastDate = sortedDates[0];
  const today = getTodayISO();
  const freezeSet = new Set(freezeDays);

  // Check if streak is still active
  if (!isToday(lastDate) && !isYesterday(lastDate) && !freezeSet.has(today)) {
    return 0;
  }

  let streak = 0;
  let checkDate = isToday(lastDate) ? today : lastDate;

  for (const date of sortedDates) {
    if (isSameDay(date, checkDate)) {
      streak++;
      const d = new Date(checkDate);
      d.setDate(d.getDate() - 1);
      checkDate = d.toISOString().split("T")[0];
    } else if (date < checkDate) {
      const gap = daysBetween(date, checkDate);
      
      // Check if gap is covered by freeze days
      const gapDays = getDatesBetween(date, checkDate);
      const allFrozen = gapDays.every(d => freezeSet.has(d));
      
      if (gap === 1 || allFrozen) {
        streak++;
        checkDate = date;
      } else {
        break;
      }
    }
  }

  return streak;
}

/**
 * Get all dates between two dates (exclusive)
 */
function getDatesBetween(start: string, end: string): string[] {
  const dates: string[] = [];
  const d = new Date(start);
  const endDate = new Date(end);
  
  d.setDate(d.getDate() + 1);
  
  while (d < endDate) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    dates.push(`${year}-${month}-${day}`);
    d.setDate(d.getDate() + 1);
  }
  
  return dates;
}

/**
 * Calculate longest streak with freeze days
 */
function calculateLongestStreak(sortedDates: string[], freezeDays: string[]): number {
  if (sortedDates.length === 0) return 0;

  const dates = [...sortedDates].reverse();
  const freezeSet = new Set(freezeDays);
  let longest = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    const gap = daysBetween(dates[i - 1], dates[i]);
    const gapDays = getDatesBetween(dates[i - 1], dates[i]);
    const allFrozen = gapDays.every(d => freezeSet.has(d));

    if (gap === 1 || allFrozen) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}

export function getMilestones(currentStreak: number, longestStreak: number): Milestone[] {
  return MILESTONE_DEFINITIONS.map((m) => ({
    days: m.days,
    label: m.label,
    emoji: m.emoji,
    achieved: longestStreak >= m.days,
  }));
}

export function getNextMilestone(currentStreak: number): Milestone | null {
  const next = MILESTONE_DEFINITIONS.find((m) => m.days > currentStreak);
  if (!next) return null;

  return {
    days: next.days,
    label: next.label,
    emoji: next.emoji,
    achieved: false,
  };
}

export function checkMilestoneAchieved(
  previousStreak: number,
  newStreak: number
): Milestone | null {
  const milestone = MILESTONE_DEFINITIONS.find(
    (m) => m.days === newStreak && previousStreak < m.days
  );

  if (!milestone) return null;

  return {
    days: milestone.days,
    label: milestone.label,
    emoji: milestone.emoji,
    achieved: true,
  };
}
