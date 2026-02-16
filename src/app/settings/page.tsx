'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { getPreferences, savePreferences } from '@/lib/preferences';
import {
  UserPreferences,
  DEFAULT_PREFERENCES,
  Tone,
  Depth,
  RiskTolerance,
  ArchitectureStyle,
} from '@/lib/types';

const TONE_OPTIONS: { value: Tone; label: string; description: string }[] = [
  { value: 'gentle', label: 'Gentle', description: 'Warm, supportive, encouraging' },
  { value: 'crisp', label: 'Crisp', description: 'Clear, precise, no fluff' },
  { value: 'blunt', label: 'Blunt', description: 'Direct, to the point' },
  { value: 'playful', label: 'Playful', description: 'Light-hearted, witty, fun' },
];

const DEPTH_OPTIONS: { value: Depth; label: string; description: string }[] = [
  { value: 'beginner', label: 'Beginner', description: 'Simple explanations, no jargon' },
  { value: 'intermediate', label: 'Intermediate', description: 'Working knowledge assumed' },
  { value: 'advanced', label: 'Advanced', description: 'Technical terminology used freely' },
  { value: 'expert', label: 'Expert', description: 'Deep expertise, nuance and edge cases' },
];

const RISK_OPTIONS: { value: RiskTolerance; label: string; description: string }[] = [
  { value: 'conservative', label: 'Conservative', description: 'Flag every risk, err on caution' },
  { value: 'balanced', label: 'Balanced', description: 'Flag significant risks only' },
  { value: 'aggressive', label: 'Aggressive', description: 'Focus on opportunities, skip minor risks' },
];

const ARCH_OPTIONS: { value: ArchitectureStyle; label: string; description: string }[] = [
  { value: 'api-first', label: 'API-First', description: 'Clean interfaces, service boundaries' },
  { value: 'agent-first', label: 'Agent-First', description: 'Autonomous modules, event-driven' },
  { value: 'modular', label: 'Modular', description: 'Decoupled, swappable components' },
  { value: 'monolith', label: 'Monolith', description: 'Keep it simple, split later' },
];

type OptionGroup<T extends string> = { value: T; label: string; description: string };

function RadioGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: OptionGroup<T>[];
  value: T;
  onChange: (val: T) => void;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">{label}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`text-left p-3 rounded-xl border-2 transition-all ${
              value === opt.value
                ? 'border-violet-500 bg-violet-50'
                : 'border-stone-200 hover:border-stone-300 bg-white'
            }`}
          >
            <div className={`text-sm font-medium ${value === opt.value ? 'text-violet-700' : 'text-stone-700'}`}>
              {opt.label}
            </div>
            <div className="text-xs text-stone-400 mt-0.5">{opt.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    getPreferences(user.id).then((p) => {
      setPrefs(p);
      setLoading(false);
    });
  }, [user]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    try {
      await savePreferences(user.id, prefs);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save preferences:', err);
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setPrefs(DEFAULT_PREFERENCES);
    setSaved(false);
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-16">
          <div className="inline-flex items-center gap-3 text-stone-500">
            <div className="w-5 h-5 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
            <span>Loading your preferences...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">Settings</h1>
        <p className="text-stone-500 mt-1">
          Customise how Seraphina communicates and analyses.
        </p>
      </div>

      <div className="space-y-8">
        <RadioGroup
          label="Tone"
          options={TONE_OPTIONS}
          value={prefs.tone}
          onChange={(tone) => setPrefs({ ...prefs, tone })}
        />

        <RadioGroup
          label="Technical Depth"
          options={DEPTH_OPTIONS}
          value={prefs.depth}
          onChange={(depth) => setPrefs({ ...prefs, depth })}
        />

        <RadioGroup
          label="Risk Tolerance"
          options={RISK_OPTIONS}
          value={prefs.risk_tolerance}
          onChange={(risk_tolerance) => setPrefs({ ...prefs, risk_tolerance })}
        />

        <RadioGroup
          label="Architecture Style"
          options={ARCH_OPTIONS}
          value={prefs.architecture_style}
          onChange={(architecture_style) => setPrefs({ ...prefs, architecture_style })}
        />

        <div className="flex items-center gap-3 pt-4 border-t border-stone-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="py-2.5 px-8 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors disabled:opacity-40"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
          <button
            onClick={handleReset}
            className="py-2.5 px-6 text-stone-500 hover:text-stone-700 font-medium transition-colors"
          >
            Reset to Defaults
          </button>
          {saved && (
            <span className="text-sm text-emerald-600 font-medium">Saved!</span>
          )}
        </div>
      </div>
    </div>
  );
}
