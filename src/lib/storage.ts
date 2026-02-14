import { Analysis, DirectoryAnalysis } from './types';

const ANALYSES_KEY = 'seraphina_analyses';
const DIRECTORY_KEY = 'seraphina_directory_analyses';

export function saveAnalysis(analysis: Analysis): void {
  const existing = getAnalyses();
  existing.unshift(analysis);
  localStorage.setItem(ANALYSES_KEY, JSON.stringify(existing));
}

export function getAnalyses(): Analysis[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(ANALYSES_KEY);
  return data ? JSON.parse(data) : [];
}

export function getAnalysisById(id: string): Analysis | undefined {
  return getAnalyses().find((a) => a.id === id);
}

export function deleteAnalysis(id: string): void {
  const existing = getAnalyses().filter((a) => a.id !== id);
  localStorage.setItem(ANALYSES_KEY, JSON.stringify(existing));
}

export function saveDirectoryAnalysis(analysis: DirectoryAnalysis): void {
  const existing = getDirectoryAnalyses();
  existing.unshift(analysis);
  localStorage.setItem(DIRECTORY_KEY, JSON.stringify(existing));
}

export function getDirectoryAnalyses(): DirectoryAnalysis[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(DIRECTORY_KEY);
  return data ? JSON.parse(data) : [];
}

export function deleteDirectoryAnalysis(id: string): void {
  const existing = getDirectoryAnalyses().filter((a) => a.id !== id);
  localStorage.setItem(DIRECTORY_KEY, JSON.stringify(existing));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
