'use client';

import { AnalysisMode } from '@/lib/types';
import { ANALYSIS_MODES } from '@/config/modes';

interface ModeSelectorProps {
  selected: AnalysisMode;
  onSelect: (mode: AnalysisMode) => void;
}

export default function ModeSelector({ selected, onSelect }: ModeSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {ANALYSIS_MODES.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onSelect(mode.id)}
          className={`text-left p-4 rounded-xl border-2 transition-all ${
            selected === mode.id
              ? 'border-violet-500 bg-violet-50 shadow-sm'
              : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm'
          }`}
        >
          <div className="font-medium text-stone-800">{mode.label}</div>
          <div className="text-sm text-stone-500 mt-1">{mode.description}</div>
        </button>
      ))}
    </div>
  );
}
