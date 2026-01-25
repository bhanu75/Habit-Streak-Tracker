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
 * Calculate all streak data for a habit
 */
export function calculateStreakData(habit: Habit): StreakData {
  const checkIns = habit.checkIns || [];
  
  // Remove duplicates and sort descending
  const uniqueDates = Array.from(new Set(checkIns));
  const sortedDates = sortDatesDesc(uniqueDates);

  const today = getTodayISO();
  const totalCheckIns = uniqueDates.length;
  const isCompletedToday = uniqueDates.includes(today);
  const lastCheckInDate = sortedDates[0] || null;

  // Calculate current streak
  const currentStreak = calculateCurrentStreak(sortedDates);

  // Calculate longest streak
  const longestStreak = calculateLongestStreak(sortedDates);

  // Calculate progress percentage
  const progress = Math.min((totalCheckIns / habit.targetDays) * 100, 100);

  return {
    currentStreak,
    longestStreak,
    totalCheckIns,
    progress: Math.round(progress),
    isCompletedToday,
    lastCheckInDate,
  };
}

/**
 * Calculate current active streak
 * Rules:
 * - If last check-in is today: count back from today
 * - If last check-in is yesterday: count back from yesterday (streak still valid)
 * - If gap > 1 day: streak is broken (return 0)
 */
function calculateCurrentStreak(sortedDates: string[]): number {
  if (sortedDates.length === 0) return 0;

  const lastDate = sortedDates[0];
  const today = getTodayISO();

  // Check if streak is still active
  if (!isToday(lastDate) && !isYesterday(lastDate)) {
    return 0; // Streak broken
  }

  // Count consecutive days backwards
  let streak = 0;
  let checkDate = isToday(lastDate) ? today : lastDate;

  for (const date of sortedDates) {
    if (isSameDay(date, checkDate)) {
      streak++;
      // Move to previous day
      const d = new Date(checkDate);
      d.setDate(d.getDate() - 1);
      checkDate = d.toISOString().split("T")[0];
    } else if (date < checkDate) {
      // Found a gap, check if it's the next expected day
      const gap = daysBetween(date, checkDate);
      if (gap === 1) {
        streak++;
        checkDate = date;
      } else {
        break; // Gap found, stop counting
      }
    }
  }

  return streak;
}

/**
 * Calculate longest streak ever
 */
function calculateLongestStreak(sortedDates: string[]): number {
  if (sortedDates.length === 0) return 0;

  const dates = [...sortedDates].reverse(); // Sort ascending for easier iteration
  let longest = 1;
  let current = 1;

  for (let i = 1; i < dates.length; i++) {
    const gap = daysBetween(dates[i - 1], dates[i]);

    if (gap === 1) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 1;
    }
  }

  return longest;
}

/**
 * Get milestones with achievement status
 */
export function getMilestones(currentStreak: number, longestStreak: number): Milestone[] {
  return MILESTONE_DEFINITIONS.map((m) => ({
    days: m.days,
    label: m.label,
    emoji: m.emoji,
    achieved: longestStreak >= m.days,
  }));
}

/**
 * Get next milestone to achieve
 */
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

/**
 * Check if a new milestone was just achieved
 */
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
