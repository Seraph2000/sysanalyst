'use client';

interface AnalysisCardProps {
  title: string;
  icon: string;
  content: string;
}

export default function AnalysisCard({ title, icon, content }: AnalysisCardProps) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <h3 className="font-semibold text-stone-800 text-lg">{title}</h3>
      </div>
      <div className="text-stone-600 leading-relaxed whitespace-pre-wrap text-sm">
        {content}
      </div>
    </div>
  );
}
