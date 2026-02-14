export interface AnalysisSection {
  title: string;
  icon: string;
  content: string;
}

export interface Analysis {
  id: string;
  user_id?: string;
  title: string;
  mode: AnalysisMode;
  raw_markdown: string;
  created_at: string;
}

export interface DirectoryEntry {
  name: string;
  type: 'file' | 'directory';
  children?: DirectoryEntry[];
}

export interface DirectoryAnalysis {
  id: string;
  user_id?: string;
  title: string;
  tree: DirectoryEntry[];
  raw_markdown: string;
  created_at: string;
}

export type AnalysisMode =
  | 'analyse-mvp'
  | 'clarify-idea'
  | 'what-to-build'
  | 'review-architecture';

export interface ConversationStep {
  id: string;
  question: string;
  placeholder: string;
  answer?: string;
}

export interface AnalyseRequest {
  mode: AnalysisMode;
  answers: Record<string, string>;
}

export interface DirectoryAnalyseRequest {
  tree: DirectoryEntry[];
}
