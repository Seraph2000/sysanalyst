'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const router = useRouter();

  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [driveConnected, setDriveConnected] = useState<boolean | null>(null);
  const [driveMessage, setDriveMessage] = useState<string | null>(null);
  const [driveDisconnecting, setDriveDisconnecting] = useState(false);

  useEffect(() => {
    if (!user) return;
    getPreferences(user.id).then((p) => {
      setPrefs(p);
      setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    fetch('/api/drive/status')
      .then((r) => r.json())
      .then((d) => setDriveConnected(d.connected))
      .catch(() => setDriveConnected(false));
  }, []);

  useEffect(() => {
    const connected = searchParams.get('connected');
    const error = searchParams.get('error');

    if (connected === 'google') {
      setDriveConnected(true);
      setDriveMessage('Google Drive connected successfully!');
      router.replace('/settings');
    } else if (error) {
      const messages: Record<string, string> = {
        google_denied: 'Google Drive connection was cancelled.',
        invalid_state: 'Connection failed: security check failed. Please try again.',
        token_exchange_failed: 'Connection failed: could not exchange tokens. Please try again.',
        not_authenticated: 'Connection failed: you must be signed in.',
        storage_failed: 'Connection failed: could not save credentials. Please try again.',
      };
      setDriveMessage(messages[error] ?? 'Connection failed. Please try again.');
      router.replace('/settings');
    }
  }, [searchParams, router]);

  async function handleDriveDisconnect() {
    setDriveDisconnecting(true);
    try {
      await fetch('/api/drive/disconnect', { method: 'POST' });
      setDriveConnected(false);
      setDriveMessage('Google Drive disconnected.');
    } catch {
      setDriveMessage('Failed to disconnect. Please try again.');
    } finally {
      setDriveDisconnecting(false);
    }
  }

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
          Customise how {prefs.agent_name} communicates and analyses.
        </p>
      </div>

      <div className="space-y-8">
        {/* Agent Name */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Agent Name</h3>
          <p className="text-xs text-stone-400">Give your analyst a name</p>
          <input
            type="text"
            value={prefs.agent_name}
            onChange={(e) => setPrefs({ ...prefs, agent_name: e.target.value })}
            placeholder="e.g. Atlas, Nova, Sage..."
            maxLength={30}
            className="w-full sm:w-72 p-3 border-2 border-stone-200 rounded-xl text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300"
          />
        </div>

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

        {/* Connected Services */}
        <div className="space-y-3 pt-8 border-t border-stone-200">
          <h3 className="text-sm font-semibold text-stone-700 uppercase tracking-wide">Connected Services</h3>

          {driveMessage && (
            <div className={`text-sm px-3 py-2 rounded-lg ${
              driveMessage.includes('successfully')
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-700'
            }`}>
              {driveMessage}
            </div>
          )}

          <div className="flex items-center justify-between p-4 border border-stone-200 rounded-xl bg-white">
            <div className="flex items-center gap-3">
              <span className="text-2xl">☁️</span>
              <div>
                <p className="text-sm font-medium text-stone-700">Google Drive</p>
                <p className="text-xs text-stone-400">
                  {driveConnected === null
                    ? 'Checking...'
                    : driveConnected
                    ? 'Connected — folder names only, no file contents'
                    : 'Not connected'}
                </p>
              </div>
            </div>

            {driveConnected === null ? null : driveConnected ? (
              <button
                onClick={handleDriveDisconnect}
                disabled={driveDisconnecting}
                className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors disabled:opacity-40"
              >
                {driveDisconnecting ? 'Disconnecting...' : 'Disconnect'}
              </button>
            ) : (
              <a
                href="/api/auth/google"
                className="text-sm py-1.5 px-4 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
              >
                Connect
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
