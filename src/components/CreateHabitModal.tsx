"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHabitsStore } from "@/store/useHabitsStore";
import { notify } from "@/lib/notifications";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Simple, most used emojis only
const EMOJI_OPTIONS = ["🏋️", "📚", "💧", "🏃", "💻"];

export default function CreateHabitModal({ isOpen, onClose }: Props) {
  const { createHabit } = useHabitsStore();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🎯");
  const [targetDays, setTargetDays] = useState(21);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createHabit(name.trim(), emoji, targetDays);
    notify.habitCreated(name.trim());

    setName("");
    setEmoji("🎯");
    setTargetDays(21);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-6 max-w-sm w-full shadow-2xl">
              <h2 className="text-xl font-bold mb-5 text-white">Create New Habit</h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Habit Name */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">
                    Habit Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Morning Workout"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder:text-white/40 focus:border-orange-400/50 focus:bg-white/10 outline-none transition-all"
                    required
                    autoFocus
                  />
                </div>

                {/* Emoji Picker - Only 5 */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">
                    Choose Icon
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {EMOJI_OPTIONS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setEmoji(e)}
                        className={[
                          "text-3xl p-2.5 rounded-xl transition-all border aspect-square flex items-center justify-center",
                          emoji === e
                            ? "bg-orange-400/30 border-orange-400/50 scale-105 shadow-lg shadow-orange-400/20"
                            : "bg-white/5 border-white/10 hover:bg-white/10 hover:scale-105",
                        ].join(" ")}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Days - Only 3 options */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/70">
                    Target Days
                  </label>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { days: 7, emoji: "🔥" },
                      { days: 21, emoji: "⭐" },
                      { days: 30, emoji: "💪" },
                    ].map((preset) => (
                      <button
                        key={preset.days}
                        type="button"
                        onClick={() => setTargetDays(preset.days)}
                        className={[
                          "py-3 rounded-xl font-semibold transition-all border text-sm",
                          targetDays === preset.days
                            ? "bg-gradient-to-r from-orange-400/30 to-pink-400/30 text-white border-orange-400/50 shadow-lg"
                            : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10",
                        ].join(" ")}
                      >
                        {preset.emoji} {preset.days}d
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    value={targetDays}
                    onChange={(e) => setTargetDays(parseInt(e.target.value) || 21)}
                    placeholder="Custom days"
                    min="1"
                    max="365"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-sm placeholder:text-white/40 focus:border-orange-400/50 focus:bg-white/10 outline-none transition-all"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl font-semibold bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white/80 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-orange-400 to-pink-400 text-white hover:shadow-lg hover:shadow-orange-400/30 transition-all"
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
