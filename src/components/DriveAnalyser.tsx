'use client';

import { useState, useEffect } from 'react';
import { DirectoryEntry, UserPreferences } from '@/lib/types';
import { saveDirectoryAnalysis } from '@/lib/storage';
import { getPreferences } from '@/lib/preferences';
import { useAuth } from './AuthProvider';
import { useAgentName } from '@/lib/hooks';
import AnalysisOutput from './AnalysisOutput';

function renderTree(entries: DirectoryEntry[], indent = 0): React.ReactNode {
  return entries.map((entry, i) => (
    <div key={`${indent}-${i}`} style={{ paddingLeft: `${indent * 20}px` }}>
      <span className="text-stone-500">
        {entry.type === 'directory' ? '📁 ' : '📄 '}
      </span>
      <span className={entry.type === 'directory' ? 'font-medium text-stone-700' : 'text-stone-600'}>
        {entry.name}
      </span>
      {entry.children && renderTree(entry.children, indent + 1)}
    </div>
  ));
}

export default function DriveAnalyser() {
  const { user } = useAuth();
  const agentName = useAgentName();

  const [connected, setConnected] = useState<boolean | null>(null);
  const [tree, setTree] = useState<DirectoryEntry[] | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | undefined>();

  useEffect(() => {
    if (user) {
      getPreferences(user.id).then(setPreferences);
    }
  }, [user]);

  useEffect(() => {
    fetch('/api/drive/status')
      .then((r) => r.json())
      .then((d) => setConnected(d.connected))
      .catch(() => setConnected(false));
  }, []);

  async function handleFetch() {
    setIsFetching(true);
    setError(null);
    setTree(null);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/drive/fetch');
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch Drive structure');

      setTree(data.tree);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsFetching(false);
    }
  }

  async function handleAnalyse() {
    if (!tree) return;
    setIsAnalysing(true);
    setError(null);

    try {
      const res = await fetch('/api/directory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tree, preferences }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');

      setAnalysisResult(data.result);

      if (user) {
        await saveDirectoryAnalysis(user.id, 'Google Drive', tree, data.result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsAnalysing(false);
    }
  }

  // Loading connection status
  if (connected === null) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center py-16">
          <div className="inline-flex items-center gap-3 text-stone-500">
            <div className="w-5 h-5 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
            <span>Checking connection...</span>
          </div>
        </div>
      </div>
    );
  }

  // Not connected
  if (!connected) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-stone-800">Google Drive Analyser</h1>
          <p className="text-stone-500 mt-1">
            Connect your Google Drive so {agentName} can review your folder structure.
          </p>
        </div>

        <div className="border-2 border-dashed border-stone-300 rounded-xl p-10 text-center space-y-4">
          <div className="text-4xl">☁️</div>
          <p className="text-stone-600 font-medium">Google Drive not connected</p>
          <p className="text-sm text-stone-400">
            {agentName} only reads folder and file names — never file contents.
          </p>
          <a
            href="/settings"
            className="inline-block mt-2 py-2.5 px-6 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors"
          >
            Connect in Settings →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">Google Drive Analyser</h1>
        <p className="text-stone-500 mt-1">
          Let {agentName} review your Drive folder structure and suggest improvements.
        </p>
        <p className="text-xs text-stone-400 mt-2">
          Only folder and file names are read. {agentName} never accesses file contents.
        </p>
      </div>

      <div className="space-y-4">
        {/* Fetch button */}
        {!tree && (
          <button
            onClick={handleFetch}
            disabled={isFetching}
            className="w-full py-4 px-6 border-2 border-dashed border-stone-300 rounded-xl text-stone-500 hover:border-violet-400 hover:text-violet-600 transition-colors disabled:opacity-40"
          >
            {isFetching ? 'Fetching your Drive structure...' : '☁️ Load My Google Drive Structure'}
          </button>
        )}

        {/* Tree preview */}
        {tree && (
          <>
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 max-h-64 overflow-y-auto font-mono text-sm">
              {renderTree(tree)}
            </div>

            {!analysisResult && (
              <div className="flex gap-3">
                <button
                  onClick={handleAnalyse}
                  disabled={isAnalysing}
                  className="flex-1 py-3 px-6 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors disabled:opacity-40"
                >
                  {isAnalysing ? 'Analysing...' : 'Analyse This Structure'}
                </button>
                <button
                  onClick={() => { setTree(null); setError(null); }}
                  className="py-3 px-4 border border-stone-200 rounded-xl text-stone-500 hover:text-stone-700 transition-colors"
                >
                  Reload
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Loading */}
      {(isFetching || isAnalysing) && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-3 text-stone-500">
            <div className="w-5 h-5 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
            <span>
              {isFetching
                ? 'Reading your Drive structure...'
                : `${agentName} is reviewing your folders...`}
            </span>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Result */}
      {analysisResult && (
        <div className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-stone-800">Drive Analysis</h2>
            <button
              onClick={() => { setTree(null); setAnalysisResult(null); }}
              className="text-sm text-violet-600 hover:text-violet-700 font-medium"
            >
              Analyse Again
            </button>
          </div>
          <AnalysisOutput rawMarkdown={analysisResult} />
        </div>
      )}
    </div>
  );
}
