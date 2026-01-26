"use client";

import { useEffect, useState, useCallback, memo } from "react";
import { Toaster } from "react-hot-toast";
import { useHabitsStore } from "@/store/useHabitsStore";
import { calculateStreakData } from "@/lib/streak";
import { startNotificationChecker, stopNotificationChecker } from "@/lib/notificationScheduler";
import { getTodayISO } from "@/lib/date";
import HabitSelector from "@/components/HabitSelector";
import StreakHeroCard from "@/components/StreakHeroCard";
import CheckInButton from "@/components/CheckInButton";
import MilestonesGrid from "@/components/MilestonesGrid";
import CreateHabitModal from "@/components/CreateHabitModal";
import ImportExportModal from "@/components/ImportExportModal";
import NotificationSettings from "@/components/NotificationSettings";
import { notifyWarning } from "@/lib/notifications";

export default function App() {
  const {
    habits,
    activeHabitId,
    userName,
    theme,
    initialize,
    deleteHabit,
    setUserName,
    toggleTheme,
    toggleFreezeDay,
  } = useHabitsStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [tempName, setTempName] = useState("");

  // Notification state
  const [firedNotifications, setFiredNotifications] = useState<{ [habitId: string]: boolean }>({});

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Initialize notification checker
  useEffect(() => {
    const interval = startNotificationChecker(
      habits,
      firedNotifications,
      (habitId) => {
        setFiredNotifications(prev => ({ ...prev, [habitId]: true }));
      }
    );

    return () => stopNotificationChecker(interval);
  }, [habits, firedNotifications]);

  // Reset fired notifications daily
  useEffect(() => {
    const today = getTodayISO();
    const lastResetDate = localStorage.getItem("lastNotificationReset");

    if (lastResetDate !== today) {
      setFiredNotifications({});
      localStorage.setItem("lastNotificationReset", today);
    }
  }, []);

  useEffect(() => {
    if (!userName && habits.length > 0) {
      setShowNameModal(true);
    }
  }, [userName, habits.length]);

  const activeHabit = habits.find((h) => h.id === activeHabitId);
  const streakData = activeHabit ? calculateStreakData(activeHabit) : null;

  // Calendar date confirmation state
  const [dateToConfirm, setDateToConfirm] = useState<{date: string; hasCheckIn: boolean} | null>(null);

  // Handle calendar date click with confirmation
  const handleDateClick = useCallback((date: string) => {
    if (!activeHabit) return;
    
    const hasCheckIn = activeHabit.checkIns.includes(date);
    setDateToConfirm({ date, hasCheckIn });
  }, [activeHabit]);

  // Confirm check-in action
  const confirmCheckIn = useCallback(() => {
    if (!activeHabit || !dateToConfirm) return;

    const { date, hasCheckIn } = dateToConfirm;
    const updatedCheckIns = hasCheckIn
      ? activeHabit.checkIns.filter(d => d !== date)
      : [...activeHabit.checkIns, date].sort();
    
    const { updateHabit } = useHabitsStore.getState();
    updateHabit(activeHabit.id, { checkIns: updatedCheckIns });
    
    setDateToConfirm(null);
  }, [activeHabit, dateToConfirm]);

  if (habits.length === 0) {
    return (
      <div className="min-h-screen w-full bg-black">
        <Toaster position="top-right" />

        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-600/40 blur-3xl" />
          <div className="absolute top-10 right-0 h-72 w-72 rounded-full bg-orange-500/40 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl" />
        </div>

        <div className="relative flex items-center justify-center min-h-screen p-4">
          <div className="text-center max-w-md">
            <div className="text-8xl mb-6">🎯</div>
            <h1 className="text-4xl font-bold mb-4 text-white">
              Habit Streak Tracker
            </h1>
            <p className="mb-8 text-white/70">
              Build lasting habits, track your progress, and achieve your goals!
            </p>
            <button
              onClick={() => {
                setShowCreateModal(true);
                notifyWarning.noHabits();
              }}
              className="rounded-2xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl px-8 py-4 font-bold text-lg text-white hover:bg-white/15 transition-all"
            >
              Create Your First Habit
            </button>
          </div>
        </div>

        <CreateHabitModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      </div>
    );
  }

  if (!activeHabit || !streakData) return null;

  const greeting = userName ? `Hey ${userName}! 👋` : "Welcome! 👋";

  return (
    <div className="min-h-screen w-full bg-black">
      <Toaster position="top-right" />

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-purple-600/40 blur-3xl" />
        <div className="absolute top-10 right-0 h-72 w-72 rounded-full bg-orange-500/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-500/30 blur-3xl" />
      </div>

      {/* Main Container - Phone Frame */}
      <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-[420px] rounded-[38px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl p-5">
          
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h1 className="text-white text-2xl font-semibold">
                {greeting}
              </h1>
              <p className="text-white/70 text-sm mt-1">
                Keep the momentum going! 🔥
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowNameModal(true)}
                className="h-10 w-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/15 transition-colors"
              >
                👤
              </button>
              <button
                onClick={() => setShowNotificationSettings(true)}
                className="h-10 w-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/15 transition-colors"
                title="Set notification time"
              >
                🔔
              </button>
              <button
                onClick={() => setShowImportExport(true)}
                className="h-10 w-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/15 transition-colors"
              >
                💾
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="h-10 w-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/15 transition-colors"
              >
                ➕
              </button>
            </div>
          </div>

          {/* Habit Selector */}
          <HabitSelector />

          {/* Main Streak Card with Calendar */}
          <StreakHeroCard 
            habit={activeHabit} 
            streakData={streakData} 
            onDateClick={handleDateClick}
          />

          {/* Check In Button */}
          <CheckInButton
            habitId={activeHabit.id}
            isCompleted={streakData.isCompletedToday}
            isFrozen={streakData.isFrozen}
          />

          {/* Freeze Day Manager */}
          <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white/90 font-semibold flex items-center gap-2">
                <span>❄️</span>
                <span>Freeze Day</span>
              </h3>
              <button
                onClick={() => toggleFreezeDay(activeHabit.id, new Date().toISOString().split("T")[0])}
                className={`px-4 py-2 rounded-xl font-medium transition-colors text-sm ${
                  streakData.isFrozen
                    ? "bg-blue-500/30 text-white border border-blue-400/40"
                    : "bg-white/10 border border-white/10 text-white/70 hover:bg-white/15"
                }`}
              >
                {streakData.isFrozen ? "✓ Frozen" : "Freeze Today"}
              </button>
            </div>
            <p className="text-white/60 text-xs">
              Mark today as a freeze day to protect your streak
            </p>
          </div>

          {/* Milestones */}
          <MilestonesGrid
            currentStreak={streakData.currentStreak}
            longestStreak={streakData.longestStreak}
          />

          {/* Danger Zone */}
          <div className="mt-5 rounded-3xl border border-red-500/20 bg-red-500/5 backdrop-blur-xl p-4">
            <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
              <span>⚠️</span>
              <span>Danger Zone</span>
            </h3>
            <button
              onClick={() => {
                if (confirm(`Delete "${activeHabit.name}"? This cannot be undone.`)) {
                  deleteHabit(activeHabit.id);
                }
              }}
              className="w-full px-4 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors font-medium text-sm"
            >
              Delete This Habit
            </button>
          </div>

          {/* Footer */}
          <div className="mt-4 text-center text-xs text-white/40">
            Glassmorphic Design • Premium UI
          </div>
        </div>
      </div>

      {/* Date Confirmation Modal */}
      {dateToConfirm && activeHabit && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center mb-5">
              <div className="text-5xl mb-3">{activeHabit.emoji}</div>
              <h3 className="text-xl font-bold text-white mb-2">
                {dateToConfirm.hasCheckIn ? "Remove Check-in?" : "Mark as Complete?"}
              </h3>
              <p className="text-white/70 text-sm">
                {dateToConfirm.hasCheckIn 
                  ? `Remove check-in for ${new Date(dateToConfirm.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}?`
                  : `Did you complete "${activeHabit.name}" on ${new Date(dateToConfirm.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}?`
                }
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDateToConfirm(null)}
                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmCheckIn}
                className={[
                  "flex-1 py-3 rounded-xl font-semibold transition-all",
                  dateToConfirm.hasCheckIn
                    ? "bg-red-500/30 border border-red-400/40 text-white hover:bg-red-500/40"
                    : "bg-gradient-to-r from-green-400 to-emerald-400 text-white hover:shadow-lg hover:shadow-green-400/30"
                ].join(" ")}
              >
                {dateToConfirm.hasCheckIn ? "Remove" : "Yes, I Did! ✓"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Name Modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 max-w-md w-full shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setShowNameModal(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 transition-all"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4 text-white">What's your name?</h2>
            <p className="text-white/60 text-sm mb-4">Optional - makes the experience personal</p>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/10 text-white placeholder:text-white/50 focus:border-orange-400/40 focus:ring-1 focus:ring-orange-400/40 outline-none transition-colors mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowNameModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 font-semibold transition-all"
              >
                Skip
              </button>
              <button
                onClick={() => {
                  if (tempName.trim()) {
                    setUserName(tempName.trim());
                  }
                  setShowNameModal(false);
                }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-pink-400 text-white font-semibold hover:shadow-lg hover:shadow-orange-400/20 transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <CreateHabitModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      <ImportExportModal
        isOpen={showImportExport}
        onClose={() => setShowImportExport(false)}
      />
      {activeHabit && (
        <NotificationSettings
          isOpen={showNotificationSettings}
          onClose={() => setShowNotificationSettings(false)}
          habitId={activeHabit.id}
        />
      )}
    </div>
  );
}
