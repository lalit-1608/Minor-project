import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import {
  Settings,
  Building2,
  Sliders,
  Sun,
  Moon,
  Laptop,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export function SettingsPage() {
  const { settings, updateSettings, resetDemoData } = useData();
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();

  const [institutionName, setInstitutionName] = useState(settings?.institutionName || 'Apex Institute of Technology & Science');
  const [minFeedbackThreshold, setMinFeedbackThreshold] = useState(settings?.minFeedbackThreshold ?? 5);
  const [topThreshold, setTopThreshold] = useState(settings?.topThreshold ?? 4.0);
  const [strongThreshold, setStrongThreshold] = useState(settings?.strongThreshold ?? 3.5);
  const [opportunityThreshold, setOpportunityThreshold] = useState(settings?.opportunityThreshold ?? 3.0);

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings({
        institutionName,
        minFeedbackThreshold: Number(minFeedbackThreshold),
        topThreshold: Number(topThreshold),
        strongThreshold: Number(strongThreshold),
        opportunityThreshold: Number(opportunityThreshold),
        theme
      });
      addToast('Settings updated and persisted successfully!', 'success');
    } catch (err) {
      addToast('Failed to update settings.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmReset = async () => {
    try {
      await resetDemoData();
      addToast('Demo data restored successfully. All seed records and duplicate registry reset.', 'success');
    } catch (err) {
      addToast('Failed to reset demo data.', 'error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Platform Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize institution parameters, performance evaluation thresholds, interface theme, and demo data state.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Institution Branding */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Institution Details
            </h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Institution / University Name
            </label>
            <input
              type="text"
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Calculation & Status Thresholds */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Ranking & Performance Thresholds
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Minimum Feedback Threshold
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={minFeedbackThreshold}
                onChange={(e) => setMinFeedbackThreshold(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400">
                Faculty with fewer submissions are labeled "Insufficient Feedback" and excluded from Top rankings.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Top Performing Threshold (&gt;=)
              </label>
              <input
                type="number"
                step="0.1"
                min="3.0"
                max="5.0"
                value={topThreshold}
                onChange={(e) => setTopThreshold(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400">
                Default: 4.0. Displays green "Top Performing" status badge.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Strong Performance Threshold (&gt;=)
              </label>
              <input
                type="number"
                step="0.1"
                min="2.5"
                max="4.5"
                value={strongThreshold}
                onChange={(e) => setStrongThreshold(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400">
                Default: 3.5. Displays blue "Strong Performance" status badge.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Opportunity for Improvement Threshold (&gt;=)
              </label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="4.0"
                value={opportunityThreshold}
                onChange={(e) => setOpportunityThreshold(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-400">
                Scores below this are marked "Requires Improvement" (Red badge).
              </p>
            </div>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Sun className="w-5 h-5 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Display Theme
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all ${
                theme === 'light'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Sun className="w-5 h-5 text-amber-500" />
              <span>Light Mode</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all ${
                theme === 'dark'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Moon className="w-5 h-5 text-indigo-400" />
              <span>Dark Mode</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`p-4 rounded-xl border flex flex-col items-center gap-2 text-xs font-semibold transition-all ${
                theme === 'system'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Laptop className="w-5 h-5 text-slate-500" />
              <span>System</span>
            </button>
          </div>
        </div>

        {/* Save Settings Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>

      {/* Demo Data Reset Zone */}
      <div className="bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-200 dark:border-rose-900/60 p-6 space-y-3">
        <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Reset Demo Data
          </h3>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          Restore fresh demonstration dataset (12 faculty, 18 subjects, 115+ evaluation entries) and reset local duplicate submission registries. Note: This restores the synthetic demo dataset for prototype testing.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmDialog
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset Demo Data?"
        message="Are you sure you want to reset all demo feedback? This will restore the pristine seed dataset across all departments and clear all browser submission keys."
        confirmText="Reset All Data"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
