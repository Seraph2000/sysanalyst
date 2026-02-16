import { createClient } from './supabase';
import { UserPreferences, DEFAULT_PREFERENCES } from './types';

export async function getPreferences(userId: string): Promise<UserPreferences> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('user_preferences')
    .select('tone, depth, risk_tolerance, architecture_style')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return DEFAULT_PREFERENCES;
  }

  return {
    tone: data.tone,
    depth: data.depth,
    risk_tolerance: data.risk_tolerance,
    architecture_style: data.architecture_style,
  };
}

export async function savePreferences(userId: string, prefs: UserPreferences): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('user_preferences')
    .upsert(
      {
        user_id: userId,
        tone: prefs.tone,
        depth: prefs.depth,
        risk_tolerance: prefs.risk_tolerance,
        architecture_style: prefs.architecture_style,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

  if (error) throw error;
}
