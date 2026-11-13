import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — SysAnalyst',
};

function Arrow() {
  return (
    <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-8 opacity-80">
      <path
        d="M0 20 L90 20 M75 5 L105 20 L75 35"
        stroke="#C4B89A"
        strokeWidth="3"
        strokeLinecap="square"
        strokeLinejoin="miter"
        strokeDasharray="2 1"
      />
    </svg>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#C4B89A] font-mono relative">

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-[#C4B89A]/10">
        <Link href="/" className="flex items-center gap-3">
          <Arrow />
          <span className="text-[#F2EDE4] font-bold tracking-widest uppercase text-sm">SysAnalyst</span>
        </Link>
        <Link
          href="/chat"
          className="text-xs tracking-widest uppercase border border-[#C4B89A]/40 px-4 py-2 hover:bg-[#C4B89A]/10 transition-colors"
        >
          Sign In
        </Link>
      </nav>

      {/* Content */}
      <main className="relative z-10 px-8 py-20 max-w-3xl mx-auto">

        <div className="mb-4 flex items-center gap-3">
          <div className="h-px w-12 bg-[#C4B89A]/40" />
          <span className="text-xs tracking-[0.3em] uppercase text-[#C4B89A]/60">Legal</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-[#F2EDE4] leading-tight mb-4"
          style={{ fontFamily: 'Georgia, serif' }}>
          Privacy Policy
        </h1>
        <p className="text-sm text-[#C4B89A]/40 mb-16">Last updated: 13 November 2026</p>

        <div className="space-y-12 text-[#C4B89A]/70 leading-relaxed text-sm">

          <section>
            <h2 className="text-[#F2EDE4] font-bold tracking-wide mb-4 uppercase text-xs"
              style={{ letterSpacing: '0.2em' }}>
              1. Who we are
            </h2>
            <p>
              SysAnalyst (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is a systems analysis tool
              operated as an independent product, accessible at{' '}
              <span className="text-[#C4B89A]">sysanalyst.dev</span>. We are the data controller
              for the personal data described in this policy. For any privacy-related queries,
              contact us at{' '}
              <span className="text-[#C4B89A]">hello@sysanalyst.dev</span>.
            </p>
          </section>

          <section>
            <h2 className="text-[#F2EDE4] font-bold tracking-wide mb-4 uppercase text-xs"
              style={{ letterSpacing: '0.2em' }}>
              2. What data we collect
            </h2>
            <div className="space-y-4">
              <div className="border-l-2 border-[#C4B89A]/20 pl-4">
                <p className="text-[#F2EDE4] mb-1">Email address</p>
                <p>Collected when you sign in via magic link. Used solely for authentication. We do not use it for marketing without your explicit consent.</p>
              </div>
              <div className="border-l-2 border-[#C4B89A]/20 pl-4">
                <p className="text-[#F2EDE4] mb-1">Analysis content</p>
                <p>The text you submit for analysis (idea descriptions, MVP notes, etc.) and the structured output generated in response. Stored so you can access your analyses across sessions.</p>
              </div>
              <div className="border-l-2 border-[#C4B89A]/20 pl-4">
                <p className="text-[#F2EDE4] mb-1">Folder and file names</p>
                <p>If you use the Directory Analyser or Google Drive integration, we receive folder and file names only — never file contents. Names that look like they hold credentials (for example <code>.env</code> files, private keys, or files named &ldquo;passwords&rdquo;) are replaced with a placeholder before anything is shown, sent or saved. The remaining structure is sent to our AI provider to generate the analysis, and is saved with that analysis in your account so you can revisit it. You can delete it at any time from Saved Analyses.</p>
              </div>
              <div className="border-l-2 border-[#C4B89A]/20 pl-4">
                <p className="text-[#F2EDE4] mb-1">Google OAuth tokens</p>
                <p>If you connect Google Drive, we store an encrypted OAuth access token to retrieve your folder structure on request. We request read-only access. You can disconnect at any time via Settings.</p>
              </div>
              <div className="border-l-2 border-[#C4B89A]/20 pl-4">
                <p className="text-[#F2EDE4] mb-1">User preferences</p>
                <p>Your chosen tone, depth, risk stance, architecture preference, and agent name. Stored to personalise your experience.</p>
              </div>
              <div className="border-l-2 border-[#C4B89A]/20 pl-4">
                <p className="text-[#F2EDE4] mb-1">Authentication cookies</p>
                <p>Session cookies are set by our authentication provider to keep you logged in. These are strictly necessary and cannot be disabled without preventing login.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-[#F2EDE4] font-bold tracking-wide mb-4 uppercase text-xs"
              style={{ letterSpacing: '0.2em' }}>
              3. How we use your data
            </h2>
            <ul className="space-y-2 list-none">
              {[
                'To provide the analysis service and store your results',
                'To authenticate you securely via magic link',
                'To personalise your experience based on your preferences',
                'To retrieve your Google Drive folder structure when you request an analysis',
                'We do not sell your data to third parties',
                'We do not use your content to train AI models',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[#C4B89A]/30 mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-[#F2EDE4] font-bold tracking-wide mb-4 uppercase text-xs"
              style={{ letterSpacing: '0.2em' }}>
              4. Third parties
            </h2>
            <div className="space-y-3">
              {[
                { name: 'Supabase', purpose: 'Database and authentication infrastructure. Data stored in EU region.' },
                { name: 'Resend', purpose: 'Transactional email delivery (magic link emails only).' },
                { name: 'Google', purpose: 'OAuth authentication for Google Drive integration. Governed by Google\'s Privacy Policy.' },
                { name: 'DigitalOcean', purpose: 'Cloud hosting. Our server is located in London (lon1).' },
                { name: 'Google Gemini API', purpose: 'AI analysis engine. Your inputs are processed by Google\'s Gemini API. Governed by Google\'s API Terms.' },
              ].map((item) => (
                <div key={item.name} className="flex gap-4">
                  <span className="text-[#F2EDE4] min-w-[140px]">{item.name}</span>
                  <span>{item.purpose}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[#F2EDE4] font-bold tracking-wide mb-4 uppercase text-xs"
              style={{ letterSpacing: '0.2em' }}>
              5. Data retention
            </h2>
            <p>
              Your account data and saved analyses are retained for as long as your account is active.
              You may delete individual analyses from your dashboard at any time. To request full
              account deletion, contact us at{' '}
              <span className="text-[#C4B89A]">hello@sysanalyst.dev</span>.
            </p>
          </section>

          <section>
            <h2 className="text-[#F2EDE4] font-bold tracking-wide mb-4 uppercase text-xs"
              style={{ letterSpacing: '0.2em' }}>
              6. Your rights (GDPR)
            </h2>
            <p className="mb-4">Under UK and EU GDPR, you have the right to:</p>
            <ul className="space-y-2 list-none">
              {[
                'Access the personal data we hold about you',
                'Request correction of inaccurate data',
                'Request deletion of your data',
                'Object to or restrict processing',
                'Request a portable copy of your data',
                'Withdraw consent at any time (where processing is based on consent)',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[#C4B89A]/30 mt-0.5">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4">
              To exercise any of these rights, contact{' '}
              <span className="text-[#C4B89A]">hello@sysanalyst.dev</span>.
            </p>
          </section>

          <section>
            <h2 className="text-[#F2EDE4] font-bold tracking-wide mb-4 uppercase text-xs"
              style={{ letterSpacing: '0.2em' }}>
              7. Cookies
            </h2>
            <p>
              We use strictly necessary session cookies for authentication. We do not use tracking,
              analytics, or advertising cookies. A cookie notice is displayed on your first visit.
            </p>
          </section>

          <section>
            <h2 className="text-[#F2EDE4] font-bold tracking-wide mb-4 uppercase text-xs"
              style={{ letterSpacing: '0.2em' }}>
              8. Changes to this policy
            </h2>
            <p>
              We may update this policy from time to time. We will notify registered users of
              material changes via email. Continued use of the service after changes constitutes
              acceptance.
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#C4B89A]/10 px-8 py-6 flex items-center justify-between">
        <span className="text-xs text-[#C4B89A]/30 tracking-widest uppercase">sysanalyst.dev</span>
        <div className="flex items-center gap-6 text-xs text-[#C4B89A]/30 tracking-wider">
          <Link href="/privacy" className="text-[#C4B89A]/60">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#C4B89A]/60 transition-colors">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
