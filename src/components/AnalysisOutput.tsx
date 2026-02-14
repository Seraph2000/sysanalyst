'use client';

import AnalysisCard from './AnalysisCard';

interface Section {
  title: string;
  icon: string;
  content: string;
}

interface AnalysisOutputProps {
  rawMarkdown: string;
}

const SECTION_ICONS: Record<string, string> = {
  'High-Level Summary': '🔭',
  'Capability Map': '🧩',
  'Intent Map': '🎯',
  'Simplified Architecture': '🏗️',
  'Risks & Assumptions': '⚠️',
  'Missing Pieces': '🧱',
  'Next Steps': '🚀',
  'Insight': '💡',
  // Directory analysis sections
  'Overview': '🔭',
  'What Works': '✅',
  'Problems Identified': '🔍',
  'Suggested Structure': '🏗️',
  'Quick Wins': '🚀',
};

function parseMarkdownToSections(markdown: string): Section[] {
  const sections: Section[] = [];
  const lines = markdown.split('\n');
  let currentTitle = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^###?\s+(.+)/);
    if (headingMatch) {
      if (currentTitle) {
        sections.push({
          title: currentTitle,
          icon: SECTION_ICONS[currentTitle] || '📋',
          content: currentContent.join('\n').trim(),
        });
      }
      currentTitle = headingMatch[1].trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  if (currentTitle) {
    sections.push({
      title: currentTitle,
      icon: SECTION_ICONS[currentTitle] || '📋',
      content: currentContent.join('\n').trim(),
    });
  }

  return sections;
}

export default function AnalysisOutput({ rawMarkdown }: AnalysisOutputProps) {
  const sections = parseMarkdownToSections(rawMarkdown);

  if (sections.length === 0) {
    return (
      <div className="bg-white border border-stone-200 rounded-xl p-6">
        <div className="text-stone-600 whitespace-pre-wrap">{rawMarkdown}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sections.map((section, index) => (
        <AnalysisCard
          key={index}
          title={section.title}
          icon={section.icon}
          content={section.content}
        />
      ))}
    </div>
  );
}
