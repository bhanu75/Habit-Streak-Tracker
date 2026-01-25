"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHabitsStore } from "@/store/useHabitsStore";
import { TARGET_PRESETS } from "@/types/habit";
import { notify } from "@/lib/notifications";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const EMOJI_OPTIONS = [
  "🏋️", "📚", "💧", "🧘", "🏃", "🎨", "💻", "🎯",
  "🌱", "💪", "🎵", "📝", "🍎", "🚴", "🧠", "⚡",
];

export default function CreateHabitModal({ isOpen, onClose }: Props) {
  const { createHabit } = useHabitsStore();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [targetDays, setTargetDays] = useState(21);
  const [customDays, setCustomDays] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const days = customDays ? parseInt(customDays) : targetDays;
    createHabit(name.trim(), emoji, days);
    notify.habitCreated(name.trim());

    // Reset form
    setName("");
    setEmoji("🎯");
    setTargetDays(21);
    setCustomDays("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">Create New Habit</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Habit Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Habit Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Morning Workout"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none transition-colors"
                    required
                  />
                </div>

                {/* Emoji Picker */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Choose Icon
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {EMOJI_OPTIONS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setEmoji(e)}
                        className={`
                          text-3xl p-2 rounded-lg transition-all
                          ${
                            emoji === e
                              ? "bg-purple-500 scale-110"
                              : "bg-gray-100 hover:bg-gray-200"
                          }
                        `}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Days */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Target Days
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {TARGET_PRESETS.map((preset) => (
                      <button
                        key={preset.days}
                        type="button"
                        onClick={() => {
                          setTargetDays(preset.days);
                          setCustomDays("");
                        }}
                        className={`
                          py-3 rounded-xl font-semibold transition-all
                          ${
                            targetDays === preset.days && !customDays
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                              : "bg-gray-100 hover:bg-gray-200"
                          }
                        `}
                      >
                        {preset.emoji} {preset.days}d
                      </button>
                    ))}
                  </div>

                  {/* Custom Days */}
                  <input
                    type="number"
                    value={customDays}
                    onChange={(e) => setCustomDays(e.target.value)}
                    placeholder="Or enter custom days"
                    min="1"
                    max="365"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 outline-none transition-colors"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transition-all"
                  >
                    Create Habit
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
