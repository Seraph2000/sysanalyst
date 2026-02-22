import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { fetchDriveTree, refreshGoogleToken } from '@/lib/google-drive';

export async function GET() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { data: tokenRow, error: tokenError } = await supabase
    .from('google_drive_tokens')
    .select('access_token, refresh_token, expires_at')
    .eq('user_id', user.id)
    .single();

  if (tokenError || !tokenRow) {
    return NextResponse.json({ error: 'Google Drive not connected' }, { status: 400 });
  }

  let { access_token, refresh_token, expires_at } = tokenRow;

  // Refresh if expired (with 5-minute buffer)
  const isExpired = new Date(expires_at).getTime() - Date.now() < 5 * 60 * 1000;
  if (isExpired && refresh_token) {
    try {
      const refreshed = await refreshGoogleToken(refresh_token);
      access_token = refreshed.access_token;
      const newExpiresAt = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();

      await supabase
        .from('google_drive_tokens')
        .update({ access_token, expires_at: newExpiresAt, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);
    } catch {
      return NextResponse.json(
        { error: 'Your Google Drive session has expired. Please reconnect in Settings.' },
        { status: 401 }
      );
    }
  }

  try {
    const tree = await fetchDriveTree(access_token);
    return NextResponse.json({ tree });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch Drive structure';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
