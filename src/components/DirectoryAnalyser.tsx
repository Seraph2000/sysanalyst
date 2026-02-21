'use client';

import { useState, useEffect } from 'react';
import { DirectoryEntry, UserPreferences } from '@/lib/types';
import { saveDirectoryAnalysis } from '@/lib/storage';
import { getPreferences } from '@/lib/preferences';
import { useAuth } from './AuthProvider';
import { useAgentName } from '@/lib/hooks';
import AnalysisOutput from './AnalysisOutput';

async function readDirectoryRecursive(
  dirHandle: FileSystemDirectoryHandle,
  depth = 0,
  maxDepth = 4
): Promise<DirectoryEntry[]> {
  if (depth > maxDepth) return [];

  const entries: DirectoryEntry[] = [];

  // File System Access API lacks full TS definitions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for await (const entry of (dirHandle as any).values()) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;

    if (entry.kind === 'directory') {
      const children =
        depth < maxDepth
          ? await readDirectoryRecursive(entry as FileSystemDirectoryHandle, depth + 1, maxDepth)
          : [];
      entries.push({ name: entry.name, type: 'directory', children });
    } else {
      entries.push({ name: entry.name, type: 'file' });
    }
  }

  return entries.sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'directory' ? -1 : 1;
  });
}

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

export default function DirectoryAnalyser() {
  const { user } = useAuth();
  const agentName = useAgentName();
  const [tree, setTree] = useState<DirectoryEntry[] | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [folderName, setFolderName] = useState<string>('');
  const [preferences, setPreferences] = useState<UserPreferences | undefined>();

  useEffect(() => {
    if (user) {
      getPreferences(user.id).then(setPreferences);
    }
  }, [user]);

  async function handlePickFolder() {
    try {
      if (!('showDirectoryPicker' in window)) {
        setError(
          'Your browser does not support folder access. Please use Chrome or Edge.'
        );
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dirHandle = await (window as unknown as Record<string, () => Promise<FileSystemDirectoryHandle>>).showDirectoryPicker();
      setFolderName(dirHandle.name);
      const entries = await readDirectoryRecursive(dirHandle);
      setTree(entries);
      setAnalysisResult(null);
      setError(null);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      setError('Failed to read folder. Please try again.');
    }
  }

  async function handleAnalyse() {
    if (!tree) return;

    setIsAnalysing(true);
    setError(null);

    try {
      const response = await fetch('/api/directory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tree, preferences }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Directory analysis failed');
      }

      setAnalysisResult(data.result);

      // Save to Supabase
      if (user) {
        await saveDirectoryAnalysis(user.id, `Folder: ${folderName}`, tree, data.result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsAnalysing(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">Directory Analyser</h1>
        <p className="text-stone-500 mt-1">
          Let {agentName} look at your folder structure and suggest improvements.
        </p>
        <p className="text-xs text-stone-400 mt-2">
          Only folder and file names are read. {agentName} never accesses file contents.
        </p>
      </div>

      {/* Folder Picker */}
      <div className="space-y-4">
        <button
          onClick={handlePickFolder}
          className="w-full py-4 px-6 border-2 border-dashed border-stone-300 rounded-xl text-stone-500 hover:border-violet-400 hover:text-violet-600 transition-colors"
        >
          {tree ? `📁 ${folderName} (click to change)` : '📁 Choose a folder to analyse'}
        </button>

        {/* Tree Preview */}
        {tree && (
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 max-h-64 overflow-y-auto font-mono text-sm">
            {renderTree(tree)}
          </div>
        )}

        {/* Analyse Button */}
        {tree && !analysisResult && (
          <button
            onClick={handleAnalyse}
            disabled={isAnalysing}
            className="w-full py-3 px-6 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors disabled:opacity-40"
          >
            {isAnalysing ? 'Analysing...' : 'Analyse This Structure'}
          </button>
        )}
      </div>

      {/* Loading */}
      {isAnalysing && (
        <div className="text-center py-12 space-y-4">
          <div className="inline-flex items-center gap-3 text-stone-500">
            <div className="w-5 h-5 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
            <span>{agentName} is reviewing your folder structure...</span>
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
            <h2 className="text-xl font-semibold text-stone-800">
              Directory Analysis
            </h2>
            <button
              onClick={() => {
                setTree(null);
                setAnalysisResult(null);
                setFolderName('');
              }}
              className="text-sm text-violet-600 hover:text-violet-700 font-medium"
            >
              Analyse Another
            </button>
          </div>
          <AnalysisOutput rawMarkdown={analysisResult} />
        </div>
      )}
    </div>
  );
}
