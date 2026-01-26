"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHabitsStore } from "@/store/useHabitsStore";
import { requestNotificationPermission } from "@/lib/notificationScheduler";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  habitId: string;
}

export default function NotificationSettings({ isOpen, onClose, habitId }: Props) {
  const { habits, updateHabit } = useHabitsStore();
  const habit = habits.find((h) => h.id === habitId);

  const [notificationTime, setNotificationTime] = useState(habit?.notificationTime || "09:00");
  const [notificationEnabled, setNotificationEnabled] = useState(habit?.notificationEnabled || false);
  const [permission, setPermission] = useState<NotificationPermission>(
    "Notification" in window ? Notification.permission : "denied"
  );

  useEffect(() => {
    if (habit) {
      setNotificationTime(habit.notificationTime || "09:00");
      setNotificationEnabled(habit.notificationEnabled || false);
    }
  }, [habit]);

  const handleRequestPermission = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);

    if (result === "granted") {
      toast.success("✅ Notifications enabled!", { duration: 3000 });
    } else if (result === "denied") {
      toast.error("❌ Notifications blocked. Enable in browser settings.", { duration: 4000 });
    } else {
      toast.error("⚠️ Notifications not supported", { duration: 3000 });
    }
  };

  const handleSave = () => {
    if (!habit) return;

    if (notificationEnabled && permission !== "granted") {
      toast.error("⚠️ Please enable notifications first", { duration: 3000 });
      return;
    }

    updateHabit(habit.id, {
      notificationTime,
      notificationEnabled,
    });

    toast.success(`🔔 Notification ${notificationEnabled ? 'enabled' : 'disabled'}!`, {
      duration: 3000,
    });

    onClose();
  };

  if (!habit) return null;

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
              <h2 className="text-xl font-bold mb-2 text-white flex items-center gap-2">
                <span>🔔</span>
                <span>Daily Reminder</span>
              </h2>
              <p className="text-white/60 text-sm mb-5">
                Get notified to check-in for "{habit.name}"
              </p>

              {/* Permission Status */}
              <div className="mb-5 p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white/90 font-semibold text-sm">Browser Notifications</div>
                    <div className="text-white/60 text-xs mt-1">
                      {permission === "granted" ? "✅ Enabled" : 
                       permission === "denied" ? "❌ Blocked" : "⚠️ Not enabled"}
                    </div>
                  </div>
                  {permission !== "granted" && (
                    <button
                      onClick={handleRequestPermission}
                      className="px-3 py-2 rounded-lg bg-orange-400/30 border border-orange-400/40 text-white text-xs font-semibold hover:bg-orange-400/40 transition-all"
                    >
                      Enable
                    </button>
                  )}
                </div>
              </div>

              {/* Toggle Notification */}
              <div className="mb-5">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-white/90 font-semibold text-sm">Daily Reminder</div>
                    <div className="text-white/60 text-xs mt-1">
                      Receive notification at set time
                    </div>
                  </div>
                  <button
                    onClick={() => setNotificationEnabled(!notificationEnabled)}
                    className={[
                      "relative w-12 h-6 rounded-full transition-all border",
                      notificationEnabled
                        ? "bg-green-400/30 border-green-400/40"
                        : "bg-white/10 border-white/20",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all",
                        notificationEnabled ? "right-0.5" : "left-0.5",
                      ].join(" ")}
                    />
                  </button>
                </label>
              </div>

              {/* Time Picker */}
              {notificationEnabled && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5"
                >
                  <label className="block text-sm font-medium mb-2 text-white/70">
                    Reminder Time
                  </label>
                  <input
                    type="time"
                    value={notificationTime}
                    onChange={(e) => setNotificationTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:border-orange-400/50 focus:bg-white/10 outline-none transition-all"
                  />
                  <p className="text-white/50 text-xs mt-2">
                    💡 Keep the app open in browser for best results
                  </p>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-400 to-pink-400 text-white font-semibold hover:shadow-lg hover:shadow-orange-400/30 transition-all"
                >
                  Save
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
