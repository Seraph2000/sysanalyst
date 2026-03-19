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
      <h3 className="text-xs tracking-[0.3em] uppercase text-[#C4B89A]/60">{label}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#C4B89A]/10">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`text-left p-4 transition-colors border-l-2 ${
              value === opt.value
                ? 'bg-[#C4B89A]/10 border-[#C4B89A] text-[#F2EDE4]'
                : 'bg-[#0D0D0D] border-transparent text-[#C4B89A]/50 hover:bg-[#C4B89A]/5 hover:text-[#C4B89A]'
            }`}
          >
            <div className="text-sm font-bold tracking-wide uppercase">{opt.label}</div>
            <div className="text-xs text-[#C4B89A]/40 mt-0.5">{opt.description}</div>
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
      setDriveMessage('Google Drive connected successfully.');
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
      setTimeout(() => {
        setSaved(false);
        router.refresh();
      }, 1000);
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
      <div className="max-w-2xl mx-auto font-mono py-16 flex items-center gap-3 text-[#C4B89A]/40">
        <div className="w-4 h-4 border border-[#C4B89A]/30 border-t-[#C4B89A] rounded-full animate-spin" />
        <span className="text-xs tracking-widest uppercase">Loading...</span>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto font-mono">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-12 bg-[#C4B89A]/40" />
          <span className="text-xs tracking-[0.3em] uppercase text-[#C4B89A]/60">Preferences</span>
        </div>
        <h1 className="text-3xl font-bold text-[#F2EDE4]"
          style={{ fontFamily: 'Georgia, serif' }}>
          Settings
        </h1>
        <p className="text-sm text-[#C4B89A]/50 mt-2">
          Customise how {prefs.agent_name} communicates and analyses.
        </p>
      </div>

      <div className="space-y-10">
        {/* Agent Name */}
        <div className="space-y-3">
          <h3 className="text-xs tracking-[0.3em] uppercase text-[#C4B89A]/60">Agent Name</h3>
          <p className="text-xs text-[#C4B89A]/30">Give your analyst a name</p>
          <input
            type="text"
            value={prefs.agent_name}
            onChange={(e) => setPrefs({ ...prefs, agent_name: e.target.value })}
            placeholder="e.g. Atlas, Nova, Sage..."
            maxLength={30}
            className="w-full sm:w-72 p-3 bg-[#0D0D0D] border border-[#C4B89A]/20 text-[#F2EDE4] placeholder:text-[#C4B89A]/20 focus:outline-none focus:border-[#C4B89A]/60 text-sm font-mono"
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

        <div className="flex items-center gap-4 pt-6 border-t border-[#C4B89A]/10">
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-xs tracking-widest uppercase bg-[#C4B89A] text-[#0D0D0D] px-6 py-3 font-bold hover:bg-[#F2EDE4] transition-colors disabled:opacity-40"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </button>
          <button
            onClick={handleReset}
            className="text-xs tracking-widest uppercase border border-[#C4B89A]/20 px-6 py-3 text-[#C4B89A]/50 hover:text-[#C4B89A] hover:border-[#C4B89A]/40 transition-colors"
          >
            Reset
          </button>
          {saved && (
            <span className="text-xs tracking-widest uppercase text-[#C4B89A]/60">Saved.</span>
          )}
        </div>

        {/* Connected Services */}
        <div className="space-y-4 pt-8 border-t border-[#C4B89A]/10">
          <h3 className="text-xs tracking-[0.3em] uppercase text-[#C4B89A]/60">Connected Services</h3>

          {driveMessage && (
            <div className={`text-xs px-4 py-3 border ${
              driveMessage.includes('successfully') || driveMessage.includes('disconnected')
                ? 'border-[#C4B89A]/20 text-[#C4B89A]/60'
                : 'border-red-900/40 text-red-400/70'
            }`}>
              {driveMessage}
            </div>
          )}

          <div className="flex items-center justify-between p-4 border border-[#C4B89A]/10">
            <div>
              <p className="text-sm text-[#F2EDE4]">Google Drive</p>
              <p className="text-xs text-[#C4B89A]/40 mt-0.5">
                {driveConnected === null
                  ? 'Checking...'
                  : driveConnected
                  ? 'Connected — folder names only, no file contents'
                  : 'Not connected'}
              </p>
            </div>

            {driveConnected === null ? null : driveConnected ? (
              <button
                onClick={handleDriveDisconnect}
                disabled={driveDisconnecting}
                className="text-xs tracking-widest uppercase text-[#C4B89A]/40 hover:text-[#C4B89A] transition-colors disabled:opacity-40"
              >
                {driveDisconnecting ? 'Disconnecting...' : 'Disconnect'}
              </button>
            ) : (
              <a
                href="/api/auth/google"
                className="text-xs tracking-widest uppercase bg-[#C4B89A] text-[#0D0D0D] px-4 py-2 font-bold hover:bg-[#F2EDE4] transition-colors"
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
