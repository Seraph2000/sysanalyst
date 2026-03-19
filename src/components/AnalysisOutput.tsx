'use client';

import AnalysisCard from './AnalysisCard';

interface Section {
  title: string;
  content: string;
}

interface AnalysisOutputProps {
  rawMarkdown: string;
}

function parseMarkdownToSections(markdown: string): Section[] {
  const sections: Section[] = [];
  const lines = markdown.split('\n');
  let currentTitle = '';
  let currentContent: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^###?\s+(.+)/);
    if (headingMatch) {
      if (currentTitle) {
        sections.push({ title: currentTitle, content: currentContent.join('\n').trim() });
      }
      currentTitle = headingMatch[1].trim();
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  }

  if (currentTitle) {
    sections.push({ title: currentTitle, content: currentContent.join('\n').trim() });
  }

  return sections;
}

export default function AnalysisOutput({ rawMarkdown }: AnalysisOutputProps) {
  const sections = parseMarkdownToSections(rawMarkdown);

  if (sections.length === 0) {
    return (
      <div className="border border-[#C4B89A]/15 p-6">
        <div className="text-[#C4B89A]/70 whitespace-pre-wrap font-mono text-sm">{rawMarkdown}</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#C4B89A]/10">
      {sections.map((section, index) => (
        <AnalysisCard
          key={index}
          index={index}
          title={section.title}
          content={section.content}
        />
      ))}
    </div>
  );
}
