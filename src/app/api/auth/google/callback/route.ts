import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const settingsUrl = new URL('/settings', request.url);

  if (error) {
    settingsUrl.searchParams.set('error', 'google_denied');
    return NextResponse.redirect(settingsUrl);
  }

  // Verify CSRF state
  const cookieStore = cookies();
  const savedState = cookieStore.get('google_oauth_state')?.value;

  if (!state || state !== savedState) {
    settingsUrl.searchParams.set('error', 'invalid_state');
    return NextResponse.redirect(settingsUrl);
  }

  if (!code) {
    settingsUrl.searchParams.set('error', 'missing_code');
    return NextResponse.redirect(settingsUrl);
  }

  // Exchange authorisation code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenRes.ok) {
    settingsUrl.searchParams.set('error', 'token_exchange_failed');
    return NextResponse.redirect(settingsUrl);
  }

  const { access_token, refresh_token, expires_in } = await tokenRes.json();
  const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

  // Get the authenticated user from the Supabase session
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

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    settingsUrl.searchParams.set('error', 'not_authenticated');
    return NextResponse.redirect(settingsUrl);
  }

  // Store tokens
  const { error: dbError } = await supabase
    .from('google_drive_tokens')
    .upsert(
      {
        user_id: user.id,
        access_token,
        refresh_token,
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );

  if (dbError) {
    settingsUrl.searchParams.set('error', 'storage_failed');
    return NextResponse.redirect(settingsUrl);
  }

  // Clear the CSRF state cookie and redirect to settings
  const response = NextResponse.redirect(
    new URL('/settings?connected=google', request.url)
  );
  response.cookies.delete('google_oauth_state');
  return response;
}
