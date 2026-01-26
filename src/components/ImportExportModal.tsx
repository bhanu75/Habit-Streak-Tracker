"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useHabitsStore } from "@/store/useHabitsStore";
import {
  exportToJSON,
  exportToCSV,
  importFromJSON,
  mergeImportedData,
  replaceWithImportedData,
} from "@/lib/storage";
import { notify, notifyError, notifyLoading } from "@/lib/notifications";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportExportModal({ isOpen, onClose }: Props) {
  const { habits, activeHabitId, userName, theme, importData } = useHabitsStore();

  const [importMode, setImportMode] = useState<"merge" | "replace">("merge");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    exportToJSON({ habits, activeHabitId, userName, theme });
    notify.dataExported("JSON");
  };

  const handleExportCSV = () => {
    exportToCSV(habits);
    notify.dataExported("CSV");
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".json")) {
      notifyError.invalidFile();
      return;
    }

    const loadingToast = notifyLoading.importing();

    try {
      const imported = await importFromJSON(file);
      const currentState = { habits, activeHabitId, userName, theme };

      const newState =
        importMode === "merge"
          ? mergeImportedData(currentState, imported)
          : replaceWithImportedData(imported);

      importData(newState);

      notifyLoading.dismiss(loadingToast);
      notify.dataImported(
        newState.habits.length,
        importMode === "merge" ? "merged" : "replaced"
      );

      onClose();
    } catch (error) {
      notifyLoading.dismiss(loadingToast);
      notifyError.importFailed();
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 max-w-md w-full shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-white">💾 Backup & Restore</h2>

              {/* Export Section */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-white/90">Export Data</h3>
                <div className="space-y-2">
                  <button
                    onClick={handleExportJSON}
                    className="w-full py-3 px-4 rounded-xl bg-blue-500/30 border border-blue-400/40 text-white font-semibold hover:bg-blue-500/40 transition-colors flex items-center justify-center gap-2"
                  >
                    📥 Export as JSON
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="w-full py-3 px-4 rounded-xl bg-green-500/30 border border-green-400/40 text-white font-semibold hover:bg-green-500/40 transition-colors flex items-center justify-center gap-2"
                  >
                    📊 Export as CSV
                  </button>
                </div>
              </div>

              {/* Import Section */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-white/90">Import Data</h3>

                {/* Import Mode */}
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => setImportMode("merge")}
                    className={[
                      "flex-1 py-2 px-3 rounded-lg font-medium transition-colors border",
                      importMode === "merge"
                        ? "bg-orange-400/30 text-white border-orange-400/40"
                        : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10",
                    ].join(" ")}
                  >
                    Merge
                  </button>
                  <button
                    onClick={() => setImportMode("replace")}
                    className={[
                      "flex-1 py-2 px-3 rounded-lg font-medium transition-colors border",
                      importMode === "replace"
                        ? "bg-orange-400/30 text-white border-orange-400/40"
                        : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10",
                    ].join(" ")}
                  >
                    Replace
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 rounded-xl bg-purple-500/30 border border-purple-400/40 text-white font-semibold hover:bg-purple-500/40 transition-colors flex items-center justify-center gap-2"
                >
                  📤 Import from JSON
                </button>

                <p className="text-xs text-white/50 mt-2">
                  {importMode === "merge"
                    ? "Add new habits without removing existing ones"
                    : "Replace all data with imported file"}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
