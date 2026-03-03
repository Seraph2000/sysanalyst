import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  // Use NEXT_PUBLIC_SITE_URL if set (production), otherwise derive from request (local dev)
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const redirectTo = `${origin}/auth/callback`;

  // Admin client — generates the magic link without Supabase sending the email
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: { redirectTo },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const magicLink = data.properties.action_link;

  const { error: emailError } = await resend.emails.send({
    from: 'Seraphina <noreply@sysanalyst.dev>',
    to: email,
    subject: 'Your sign-in link for Seraphina',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1c1917; margin-bottom: 8px;">Sign in to Seraphina</h2>
        <p style="color: #57534e; margin-bottom: 24px;">Click the button below to sign in. This link expires in 1 hour.</p>
        <a href="${magicLink}" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">Sign in</a>
        <p style="color: #a8a29e; font-size: 12px; margin-top: 24px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });

  if (emailError) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
