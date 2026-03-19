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
    <div className="max-w-4xl mx-auto font-mono">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-12 bg-[#C4B89A]/40" />
          <span className="text-xs tracking-[0.3em] uppercase text-[#C4B89A]/60">Archive</span>
        </div>
        <h1 className="text-3xl font-bold text-[#F2EDE4]"
          style={{ fontFamily: 'Georgia, serif' }}>
          Saved Analyses
        </h1>
        <p className="text-sm text-[#C4B89A]/50 mt-2">Your previous analyses, ready to revisit.</p>
      </div>

      {loading ? (
        <div className="py-16 flex items-center gap-3 text-[#C4B89A]/40">
          <div className="w-4 h-4 border border-[#C4B89A]/30 border-t-[#C4B89A] rounded-full animate-spin" />
          <span className="text-xs tracking-widest uppercase">Loading...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="border border-[#C4B89A]/10 p-12 text-center">
          <p className="text-[#C4B89A]/40 text-sm">No saved analyses yet.</p>
          <p className="text-[#C4B89A]/30 text-xs mt-2">
            Run an analysis and it will appear here.
          </p>
        </div>
      ) : (
        <div>
          {!selectedId && (
            <div className="grid grid-cols-1 gap-px bg-[#C4B89A]/10">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#0D0D0D] border border-[#C4B89A]/10 p-4 flex items-center justify-between hover:bg-[#C4B89A]/5 transition-colors"
                >
                  <button onClick={() => setSelectedId(item.id)} className="flex-1 text-left">
                    <div className="text-sm text-[#F2EDE4] mb-1">{item.title}</div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs tracking-widest uppercase text-[#C4B89A]/40">
                        {item.label}
                      </span>
                      <span className="text-xs text-[#C4B89A]/30">{formatDate(item.createdAt)}</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="text-[#C4B89A]/20 hover:text-[#C4B89A]/60 transition-colors px-3 py-1 text-xs tracking-widest"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {selected && (
            <div className="space-y-6">
              <button
                onClick={() => setSelectedId(null)}
                className="text-xs tracking-widest uppercase text-[#C4B89A]/40 hover:text-[#C4B89A] transition-colors"
              >
                &larr; Back to list
              </button>
              <div>
                <h2 className="text-xl font-bold text-[#F2EDE4]"
                  style={{ fontFamily: 'Georgia, serif' }}>
                  {selected.title}
                </h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs tracking-widest uppercase text-[#C4B89A]/40">{selected.label}</span>
                  <span className="text-xs text-[#C4B89A]/30">{formatDate(selected.createdAt)}</span>
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
