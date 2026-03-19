'use client';

import ReactMarkdown from 'react-markdown';

interface AnalysisCardProps {
  title: string;
  index: number;
  content: string;
}

export default function AnalysisCard({ title, index, content }: AnalysisCardProps) {
  const num = String(index + 1).padStart(2, '0');
  return (
    <div className="bg-[#0D0D0D] border border-[#C4B89A]/15 p-6 flex flex-col gap-4">
      <div>
        <div className="text-xs tracking-[0.3em] text-[#C4B89A]/30 mb-2 font-mono">{num}</div>
        <h3 className="font-bold text-[#F2EDE4] tracking-wide"
          style={{ fontFamily: 'Georgia, serif' }}>
          {title}
        </h3>
      </div>
      <div className="text-sm text-[#C4B89A]/70 leading-relaxed prose prose-sm max-w-none font-mono
        prose-p:text-[#C4B89A]/70 prose-li:text-[#C4B89A]/70 prose-strong:text-[#F2EDE4]
        prose-headings:text-[#F2EDE4] prose-code:text-[#C4B89A] prose-ul:text-[#C4B89A]/70">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
