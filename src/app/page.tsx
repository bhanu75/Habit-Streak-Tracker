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
  const { habits, activeHabitId, initialize, deleteHabit } = useHabitsStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportExport, setShowImportExport] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const activeHabit = habits.find((h) => h.id === activeHabitId);
  const streakData = activeHabit ? calculateStreakData(activeHabit) : null;

  // Show welcome screen if no habits
  if (habits.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <Toaster position="top-right" />

        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center max-w-md">
            <div className="text-8xl mb-6">🎯</div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Habit Streak Tracker
            </h1>
            <p className="text-gray-600 mb-8">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg shadow-sm z-30 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Habit Tracker
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowImportExport(true)}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                💾 Backup
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all text-sm font-medium"
              >
                + New Habit
              </button>
            </div>
          </div>
          <HabitSelector />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Hero Card */}
        <StreakHeroCard habit={activeHabit} streakData={streakData} />

        {/* Check-in Button */}
        <CheckInButton
          habitId={activeHabit.id}
          isCompleted={streakData.isCompletedToday}
        />

        {/* Stats Cards */}
        <StatsCards streakData={streakData} />

        {/* Calendar */}
        <CalendarCheckIns habit={activeHabit} days={28} />

        {/* Milestones */}
        <MilestonesGrid
          currentStreak={streakData.currentStreak}
          longestStreak={streakData.longestStreak}
        />

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100">
          <h3 className="text-lg font-semibold text-red-600 mb-3">
            ⚠️ Danger Zone
          </h3>
          <button
            onClick={() => {
              if (
                confirm(
                  `Delete "${activeHabit.name}"? This cannot be undone.`
                )
              ) {
                deleteHabit(activeHabit.id);
              }
            }}
            className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors font-medium"
          >
            Delete This Habit
          </button>
        </div>
      </div>

      {/* Modals */}
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
