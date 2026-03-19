import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service — SysAnalyst',
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

export default function TermsPage() {
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
          Terms of Service
        </h1>
        <p className="text-sm text-[#C4B89A]/40 mb-16">Last updated: 19 March 2026</p>

        <div className="space-y-12 text-[#C4B89A]/70 leading-relaxed text-sm">

          <section>
            <h2 className="text-[#F2EDE4] font-bold tracking-wide mb-4 uppercase text-xs"
              style={{ letterSpacing: '0.2em' }}>
              1. Acceptance of terms
            </h2>
            <p>
              By accessing or using SysAnalyst (&ldquo;the Service&rdquo;) at sysanalyst.dev, you agree
              to be bound by these Terms of Service. If you do not agree, do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-[#F2EDE4] font-bold tracking-wide mb-4 uppercase text-xs"
              style={{ letterSpacing: '0.2em' }}>
              2. What the service is
            </h2>
            <p>
              SysAnalyst is an AI-powered systems analysis tool. It accepts descriptions of ideas,
              projects, and file structures, and returns structured analytical feedback. The output
              is intended to assist your thinking — it is not professional legal, financial, or
              technical advice.
            </p>
          </section>

          <section>
            <h2 className="text-[#F2EDE4] font-bold tracking-wide mb-4 uppercase text-xs"
              style={{ letterSpacing: '0.2em' }}>
              3. Your account
            </h2>
            <p className="mb-4">
              You must provide a valid email address to use the Service. You are responsible for
              maintaining the security of your account. Notify us immediately if you suspect
              unauthorised access at{' '}
              <span className="text-[#C4B89A]">hello@sysanalyst.dev</span>.
            </p>
            <p>
              We reserve the right to suspend or terminate accounts that violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-[#F2EDE4] font-bold tracking-wide mb-4 uppercase text-xs"
              style={{ letterSpacing: '0.2em' }}>
              4. Acceptable use
            </h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="space-y-2 list-none">
              {[
                'Use the Service for any unlawful purpose',
                'Submit content that is harmful, abusive, or infringes third-party rights',
                'Attempt to reverse-engineer, scrape, or abuse the Service',
                'Use the Service to generate content intended to deceive or defraud',
                'Share your account credentials with others',
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
              5. Your content
            </h2>
            <p>
              You retain ownership of any content you submit. By submitting content, you grant us
              a limited licence to process it solely for the purpose of providing the Service.
              We do not use your content to train AI models or share it with third parties beyond
              what is necessary to operate the Service. See our{' '}
              <Link href="/privacy" className="text-[#C4B89A] hover:text-[#F2EDE4] transition-colors">
                Privacy Policy
              </Link>{' '}
              for full details.
            </p>
          </section>

          <section>
            <h2 className="text-[#F2EDE4] font-bold tracking-wide mb-4 uppercase text-xs"
              style={{ letterSpacing: '0.2em' }}>
              6. Service availability
            </h2>
            <p>
              We aim to keep the Service available but do not guarantee uninterrupted access.
              We may suspend the Service for maintenance, updates, or circumstances beyond our
              control. We are not liable for any loss resulting from downtime.
            </p>
          </section>

          <section>
            <h2 className="text-[#F2EDE4] font-bold tracking-wide mb-4 uppercase text-xs"
              style={{ letterSpacing: '0.2em' }}>
              7. Disclaimer of warranties
            </h2>
            <p>
              The Service is provided &ldquo;as is&rdquo; without warranties of any kind, express or implied.
              AI-generated analysis may contain errors or omissions. You are responsible for
              evaluating the output and making your own decisions. We do not warrant that the
              Service will meet your specific requirements.
            </p>
          </section>

          <section>
            <h2 className="text-[#F2EDE4] font-bold tracking-wide mb-4 uppercase text-xs"
              style={{ letterSpacing: '0.2em' }}>
              8. Limitation of liability
            </h2>
            <p>
              To the fullest extent permitted by law, SysAnalyst shall not be liable for any
              indirect, incidental, or consequential damages arising from your use of the Service.
              Our total liability to you for any claim shall not exceed the amount you have paid
              us in the twelve months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-[#F2EDE4] font-bold tracking-wide mb-4 uppercase text-xs"
              style={{ letterSpacing: '0.2em' }}>
              9. Changes to these terms
            </h2>
            <p>
              We may update these terms from time to time. We will notify registered users of
              material changes via email. Continued use of the Service after changes constitutes
              acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-[#F2EDE4] font-bold tracking-wide mb-4 uppercase text-xs"
              style={{ letterSpacing: '0.2em' }}>
              10. Governing law
            </h2>
            <p>
              These terms are governed by the laws of England and Wales. Any disputes shall be
              subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <section>
            <h2 className="text-[#F2EDE4] font-bold tracking-wide mb-4 uppercase text-xs"
              style={{ letterSpacing: '0.2em' }}>
              11. Contact
            </h2>
            <p>
              For any questions about these terms, contact us at{' '}
              <span className="text-[#C4B89A]">hello@sysanalyst.dev</span>.
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#C4B89A]/10 px-8 py-6 flex items-center justify-between">
        <span className="text-xs text-[#C4B89A]/30 tracking-widest uppercase">sysanalyst.dev</span>
        <div className="flex items-center gap-6 text-xs text-[#C4B89A]/30 tracking-wider">
          <Link href="/privacy" className="hover:text-[#C4B89A]/60 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-[#C4B89A]/60">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
