import { Habit } from "@/types/habit";
import { getTodayISO } from "./date";
import toast from "react-hot-toast";

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    return "denied";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (error) {
    console.error("Notification permission error:", error);
    return "denied";
  }
}

// Fire a browser notification
export function fireBrowserNotification(title: string, body: string, icon?: string) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  try {
    new Notification(title, {
      body,
      icon: icon || "/favicon.ico",
      badge: "/favicon.ico",
      vibrate: [200, 100, 200],
      tag: "habit-reminder",
      requireInteraction: false,
    });
  } catch (error) {
    console.error("Failed to show notification:", error);
  }
}

// Get current time in HH:MM format
function getCurrentTimeHHMM(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

// Check if it's time to notify for a habit
export function shouldNotify(
  habit: Habit,
  firedToday: { [habitId: string]: boolean }
): boolean {
  if (!habit.notificationEnabled || !habit.notificationTime) {
    return false;
  }

  // Already fired today
  if (firedToday[habit.id]) {
    return false;
  }

  // Check if current time matches notification time
  const currentTime = getCurrentTimeHHMM();
  return currentTime === habit.notificationTime;
}

// Process all habits and fire notifications if needed
export function checkAndFireNotifications(
  habits: Habit[],
  firedToday: { [habitId: string]: boolean },
  onNotificationFired: (habitId: string) => void
) {
  const today = getTodayISO();

  habits.forEach((habit) => {
    if (shouldNotify(habit, firedToday)) {
      // Fire browser notification
      fireBrowserNotification(
        `⏰ ${habit.emoji} Time to Check-in!`,
        `Don't forget your "${habit.name}" habit! Keep your streak alive 🔥`
      );

      // Fire in-app toast
      toast(
        (t) => (
          <div className="flex items-center gap-3">
            <span className="text-3xl">{habit.emoji}</span>
            <div>
              <div className="font-semibold text-white">Time for {habit.name}!</div>
              <div className="text-sm text-white/80">Keep your streak going 🔥</div>
            </div>
          </div>
        ),
        {
          duration: 5000,
          icon: "⏰",
          style: {
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "#fff",
            padding: "16px",
            borderRadius: "16px",
          },
        }
      );

      // Mark as fired
      onNotificationFired(habit.id);
    }
  });
}

// Start notification checker (runs every minute)
export function startNotificationChecker(
  habits: Habit[],
  firedToday: { [habitId: string]: boolean },
  onNotificationFired: (habitId: string) => void
): NodeJS.Timeout {
  // Check immediately
  checkAndFireNotifications(habits, firedToday, onNotificationFired);

  // Then check every minute
  const interval = setInterval(() => {
    checkAndFireNotifications(habits, firedToday, onNotificationFired);
  }, 60000); // Check every 60 seconds

  return interval;
}

// Stop notification checker
export function stopNotificationChecker(interval: NodeJS.Timeout) {
  clearInterval(interval);
}
