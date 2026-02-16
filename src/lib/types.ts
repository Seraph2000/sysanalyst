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

export type Tone = 'gentle' | 'crisp' | 'blunt' | 'playful';
export type Depth = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type RiskTolerance = 'conservative' | 'balanced' | 'aggressive';
export type ArchitectureStyle = 'api-first' | 'agent-first' | 'modular' | 'monolith';

export interface UserPreferences {
  tone: Tone;
  depth: Depth;
  risk_tolerance: RiskTolerance;
  architecture_style: ArchitectureStyle;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  tone: 'gentle',
  depth: 'intermediate',
  risk_tolerance: 'balanced',
  architecture_style: 'modular',
};

export interface AnalyseRequest {
  mode: AnalysisMode;
  answers: Record<string, string>;
  preferences?: UserPreferences;
}

export interface DirectoryAnalyseRequest {
  tree: DirectoryEntry[];
  preferences?: UserPreferences;
}
