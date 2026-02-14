import { createClient } from './supabase';
import { Analysis, DirectoryAnalysis, DirectoryEntry, AnalysisMode } from './types';

export async function saveAnalysis(
  userId: string,
  title: string,
  mode: AnalysisMode,
  rawMarkdown: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('analyses').insert({
    user_id: userId,
    title,
    mode,
    raw_markdown: rawMarkdown,
  });
  if (error) throw error;
}

export async function getAnalyses(userId: string): Promise<Analysis[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function deleteAnalysis(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('analyses').delete().eq('id', id);
  if (error) throw error;
}

export async function saveDirectoryAnalysis(
  userId: string,
  title: string,
  tree: DirectoryEntry[],
  rawMarkdown: string
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('directory_analyses').insert({
    user_id: userId,
    title,
    tree,
    raw_markdown: rawMarkdown,
  });
  if (error) throw error;
}

export async function getDirectoryAnalyses(userId: string): Promise<DirectoryAnalysis[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('directory_analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function deleteDirectoryAnalysis(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('directory_analyses').delete().eq('id', id);
  if (error) throw error;
}
