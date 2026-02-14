'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAnalyses, deleteAnalysis, getDirectoryAnalyses, deleteDirectoryAnalysis } from '@/lib/storage';
import { Analysis, DirectoryAnalysis } from '@/lib/types';
import { ANALYSIS_MODES } from '@/config/modes';
import { useAuth } from '@/components/AuthProvider';
import AnalysisOutput from '@/components/AnalysisOutput';

type SavedItem = {
  id: string;
  title: string;
  type: 'analysis' | 'directory';
  label: string;
  rawMarkdown: string;
  createdAt: string;
};

function getModeLabel(modeId: string): string {
  const mode = ANALYSIS_MODES.find((m) => m.id === modeId);
  return mode?.label || modeId;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<SavedItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAllItems = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      const [analyses, directories] = await Promise.all([
        getAnalyses(user.id),
        getDirectoryAnalyses(user.id),
      ]);

      const analysisItems: SavedItem[] = analyses.map((a: Analysis) => ({
        id: a.id,
        title: a.title,
        type: 'analysis' as const,
        label: getModeLabel(a.mode),
        rawMarkdown: a.raw_markdown,
        createdAt: a.created_at,
      }));

      const directoryItems: SavedItem[] = directories.map((d: DirectoryAnalysis) => ({
        id: d.id,
        title: d.title,
        type: 'directory' as const,
        label: 'Directory Analysis',
        rawMarkdown: d.raw_markdown,
        createdAt: d.created_at,
      }));

      setItems(
        [...analysisItems, ...directoryItems].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } catch (err) {
      console.error('Failed to load analyses:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadAllItems();
  }, [loadAllItems]);

  async function handleDelete(item: SavedItem) {
    try {
      if (item.type === 'analysis') {
        await deleteAnalysis(item.id);
      } else {
        await deleteDirectoryAnalysis(item.id);
      }
      if (selectedId === item.id) setSelectedId(null);
      await loadAllItems();
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  }

  const selected = items.find((a) => a.id === selectedId);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800">Saved Analyses</h1>
        <p className="text-stone-500 mt-1">
          Your previous analyses, ready to revisit.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center gap-3 text-stone-500">
            <div className="w-5 h-5 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
            <span>Loading your analyses...</span>
          </div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-stone-400 text-lg">No saved analyses yet.</p>
          <p className="text-stone-400 text-sm mt-2">
            Run an analysis from the chat or directory page and it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {!selectedId && (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-stone-200 rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition-shadow"
                >
                  <button
                    onClick={() => setSelectedId(item.id)}
                    className="flex-1 text-left"
                  >
                    <div className="font-medium text-stone-800">
                      {item.title}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.type === 'directory'
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-violet-100 text-violet-600'
                      }`}>
                        {item.label}
                      </span>
                      <span className="text-xs text-stone-400">
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="text-stone-400 hover:text-red-500 transition-colors p-2"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {selected && (
            <div className="space-y-4">
              <button
                onClick={() => setSelectedId(null)}
                className="text-sm text-violet-600 hover:text-violet-700 font-medium"
              >
                &larr; Back to list
              </button>
              <div className="mb-2">
                <h2 className="text-xl font-semibold text-stone-800">
                  {selected.title}
                </h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selected.type === 'directory'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-violet-100 text-violet-600'
                  }`}>
                    {selected.label}
                  </span>
                  <span className="text-xs text-stone-400">
                    {formatDate(selected.createdAt)}
                  </span>
                </div>
              </div>
              <AnalysisOutput rawMarkdown={selected.rawMarkdown} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
