"use client";


import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useHabitsStore } from "@/store/useHabitsStore";
import { calculateStreakData } from "@/lib/streak";
import HabitSelector from "@/components/HabitSelector";
import StreakHeroCard from "@/components/StreakHeroCard";
import CheckInButton from "@/components/CheckInButton";
import StatsCards from "@/components/StatsCards";
import MilestonesGrid from "@/components/MilestonesGrid";
import CalendarCheckIns from "@/components/CalendarCheckIns";
import CreateHabitModal from "@/components/CreateHabitModal";
import ImportExportModal from "@/components/ImportExportModal";
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
  const [tempName, setTempName] = useState("");

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!userName && habits.length > 0) {
      setShowNameModal(true);
    }
  }, [userName, habits.length]);

  const activeHabit = habits.find((h) => h.id === activeHabitId);
  const streakData = activeHabit ? calculateStreakData(activeHabit) : null;

  const isDark = theme === "dark";
  const bgClass = isDark
    ? "bg-gradient-to-br from-gray-900 via-purple-900 to-black"
    : "bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50";
  const textClass = isDark ? "text-white" : "text-gray-900";

  if (habits.length === 0) {
    return (
      <div className={`min-h-screen ${bgClass}`}>
        <Toaster position="top-right" />

        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center max-w-md">
            <div className="text-8xl mb-6">🎯</div>
            <h1
              className={`text-4xl font-bold mb-4 ${
                isDark ? "text-white" : "bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
              }`}
            >
              Habit Streak Tracker
            </h1>
            <p className={`mb-8 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              Build lasting habits, track your progress, and achieve your goals!
            </p>
            <button
              onClick={() => {
                setShowCreateModal(true);
                notifyWarning.noHabits();
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
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

  const greeting = userName
    ? `Hey ${userName}! 👋`
    : "Welcome! 👋";

  return (
    <div className={`min-h-screen ${bgClass}`}>
      <Toaster position="top-right" />

      {/* Header */}
      <div
        className={`sticky top-0 ${
          isDark ? "bg-gray-900/80" : "bg-white/80"
        } backdrop-blur-lg shadow-sm z-30 border-b ${
          isDark ? "border-gray-700" : "border-gray-100"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1
                className={`text-2xl font-bold ${
                  isDark ? "text-white" : "bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
                }`}
              >
                {greeting}
              </h1>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                Keep the momentum going! 🔥
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleTheme}
                className={`px-4 py-2 rounded-xl ${
                  isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
                } transition-colors text-sm font-medium`}
                title={`Switch to ${isDark ? "light" : "dark"} mode`}
              >
                {isDark ? "☀️" : "🌙"}
              </button>
              <button
                onClick={() => setShowImportExport(true)}
                className={`px-4 py-2 rounded-xl ${
                  isDark ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"
                } transition-colors text-sm font-medium`}
              >
                💾
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all text-sm font-medium"
              >
                + New
              </button>
            </div>
          </div>
          <HabitSelector />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <StreakHeroCard habit={activeHabit} streakData={streakData} />
        <CheckInButton
          habitId={activeHabit.id}
          isCompleted={streakData.isCompletedToday}
          isFrozen={streakData.isFrozen}
        />
        <StatsCards streakData={streakData} />

        {/* Freeze Day Manager */}
        <div
          className={`${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          } rounded-2xl p-6 shadow-sm border`}
        >
          <h3 className={`text-lg font-semibold mb-3 ${textClass}`}>
            ❄️ Freeze Today (Weekend/Holiday)
          </h3>
          <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Mark today as a freeze day to protect your streak
          </p>
          <button
            onClick={() => toggleFreezeDay(activeHabit.id, new Date().toISOString().split("T")[0])}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              streakData.isFrozen
                ? "bg-blue-500 text-white"
                : isDark
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {streakData.isFrozen ? "✓ Frozen" : "Freeze Today"}
          </button>
        </div>

        <CalendarCheckIns habit={activeHabit} days={28} />
        <MilestonesGrid
          currentStreak={streakData.currentStreak}
          longestStreak={streakData.longestStreak}
        />

        {/* Danger Zone */}
        <div
          className={`${
            isDark ? "bg-red-900/20 border-red-800" : "bg-white border-red-100"
          } rounded-2xl p-6 shadow-sm border`}
        >
          <h3 className={`text-lg font-semibold text-red-600 mb-3`}>
            ⚠️ Danger Zone
          </h3>
          <button
            onClick={() => {
              if (confirm(`Delete "${activeHabit.name}"? This cannot be undone.`)) {
                deleteHabit(activeHabit.id);
              }
            }}
            className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors font-medium"
          >
            Delete This Habit
          </button>
        </div>
      </div>

      {/* Name Modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`${isDark ? "bg-gray-800" : "bg-white"} rounded-3xl p-8 max-w-md w-full shadow-2xl`}>
            <h2 className={`text-2xl font-bold mb-4 ${textClass}`}>What's your name?</h2>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Enter your name"
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                isDark ? "bg-gray-700 border-gray-600 text-white" : "border-gray-200"
              } focus:border-purple-500 outline-none transition-colors mb-4`}
              autoFocus
            />
            <button
              onClick={() => {
                if (tempName.trim()) {
                  setUserName(tempName.trim());
                  setShowNameModal(false);
                }
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:shadow-lg transition-all"
            >
              Save
            </button>
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
    </div>
  );
}
