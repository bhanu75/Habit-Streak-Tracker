import toast from "react-hot-toast";

// Success notifications
export const notify = {
  checkIn: (streak: number) => {
    toast.success(`Check-in complete! 🔥 ${streak} day streak`, {
      duration: 3000,
      icon: "✅",
    });
  },

  checkInRemoved: () => {
    toast.error("Check-in removed", {
      duration: 2000,
      icon: "↩️",
    });
  },

  habitCreated: (name: string) => {
    toast.success(`"${name}" habit created!`, {
      duration: 3000,
      icon: "🎯",
    });
  },

  habitDeleted: (name: string) => {
    toast.success(`"${name}" deleted`, {
      duration: 2000,
      icon: "🗑️",
    });
  },

  milestone: (days: number, label: string, emoji: string) => {
    toast.success(`${emoji} ${label} achieved!\n${days} days streak!`, {
      duration: 5000,
      icon: "🎉",
      style: {
        background: "#10b981",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "16px",
      },
    });
  },

  dataExported: (type: "JSON" | "CSV") => {
    toast.success(`Data exported as ${type}`, {
      duration: 3000,
      icon: "📥",
    });
  },

  dataImported: (count: number, mode: "merged" | "replaced") => {
    const msg =
      mode === "merged"
        ? `${count} habits merged`
        : `Data replaced with ${count} habits`;
    toast.success(msg, {
      duration: 3000,
      icon: "📤",
    });
  },

  dataCopied: () => {
    toast.success("Copied to clipboard!", {
      duration: 2000,
      icon: "📋",
    });
  },
};

// Warning notifications
export const notifyWarning = {
  streakAtRisk: (days: number) => {
    toast("⚠️ Your streak is at risk!\nCheck in today to keep your momentum", {
      duration: 4000,
      icon: "⏰",
      style: {
        background: "#f59e0b",
        color: "#fff",
      },
    });
  },

  noHabits: () => {
    toast("Create your first habit to start tracking!", {
      duration: 3000,
      icon: "💡",
    });
  },
};

// Error notifications
export const notifyError = {
  importFailed: () => {
    toast.error("Failed to import data. Check file format.", {
      duration: 4000,
    });
  },

  invalidFile: () => {
    toast.error("Invalid file type. Use JSON only.", {
      duration: 3000,
    });
  },

  generic: (message: string) => {
    toast.error(message, {
      duration: 3000,
    });
  },
};

// Loading notifications
export const notifyLoading = {
  importing: () => {
    return toast.loading("Importing data...");
  },

  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },
};
