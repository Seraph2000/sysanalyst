import Link from 'next/link';

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

function GrainOverlay() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
      }}
    />
  );
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SysAnalyst",
  url: "https://sysanalyst.dev",
  description: "A specialised systems analyst agent that brings structural clarity to messy MVPs and early-stage ideas.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "GBP",
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#C4B89A] font-mono relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GrainOverlay />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-[#C4B89A]/10">
        <div className="flex items-center gap-3">
          <Arrow />
          <span className="text-[#F2EDE4] font-bold tracking-widest uppercase text-sm">SysAnalyst</span>
        </div>
        <Link
          href="/chat"
          className="text-xs tracking-widest uppercase border border-[#C4B89A]/40 px-4 py-2 hover:bg-[#C4B89A]/10 transition-colors"
        >
          Sign In
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-8 pt-24 pb-20 max-w-5xl mx-auto">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px w-12 bg-[#C4B89A]/40" />
          <span className="text-xs tracking-[0.3em] uppercase text-[#C4B89A]/60">Systems Analysis</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-bold text-[#F2EDE4] leading-[1.05] tracking-tight mb-8"
          style={{ fontFamily: 'Georgia, serif' }}>
          It&apos;s not chaos.<br />
          <span className="text-[#C4B89A]">It&apos;s an architecture</span><br />
          waiting to be read.
        </h1>

        <p className="text-lg text-[#C4B89A]/70 max-w-xl leading-relaxed mb-12 font-mono">
          SysAnalyst is a systems analyst agent. Describe your idea, connect your project
          files, or share your Google Drive — and get structured feedback on what you&apos;re
          actually building, what&apos;s missing, what&apos;s at risk, and exactly what to do next.
        </p>

        <div className="flex items-center gap-6">
          <Link
            href="/chat"
            className="group flex items-center gap-4 bg-[#C4B89A] text-[#0D0D0D] px-8 py-4 font-bold tracking-widest uppercase text-sm hover:bg-[#F2EDE4] transition-colors"
          >
            Start Analysis
            <Arrow />
          </Link>
          <span className="text-xs text-[#C4B89A]/40 tracking-wider">No credit card. No fluff.</span>
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 border-t border-[#C4B89A]/10 mx-8" />

      {/* What it does */}
      <section className="relative z-10 px-8 py-20 max-w-5xl mx-auto">
        <div className="mb-12 flex items-center gap-3">
          <div className="h-px w-12 bg-[#C4B89A]/40" />
          <span className="text-xs tracking-[0.3em] uppercase text-[#C4B89A]/60">What it does</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-[#C4B89A]/10">
          {[
            {
              number: '01',
              title: 'Reveals your real intent',
              body: 'What are you actually building? Not what you say — what the structure implies. SysAnalyst reads between the lines.',
            },
            {
              number: '02',
              title: 'Maps the gaps',
              body: 'Technical gaps. Logic gaps. Gaps in the idea itself. Everything that\'s needed but not yet there.',
            },
            {
              number: '03',
              title: 'Assesses your architecture',
              body: 'One codebase or five interconnected services — identifies what\'s over-engineered, what\'s fragile, and what the simplest coherent version looks like.',
            },
            {
              number: '04',
              title: 'Sequences your next move',
              body: 'Not a roadmap. Not a brainstorm. Three to five concrete actions, in order — specific enough to start today.',
            },
            {
              number: '05',
              title: 'Saves your thinking',
              body: 'Every analysis is stored in your dashboard. Come back to it, build on it, watch your thinking evolve.',
            },
          ].map((item) => (
            <div key={item.number} className="bg-[#0D0D0D] p-8 border border-[#C4B89A]/10">
              <div className="text-xs tracking-[0.3em] text-[#C4B89A]/30 mb-4">{item.number}</div>
              <h3 className="text-[#F2EDE4] font-bold mb-3 tracking-wide"
                style={{ fontFamily: 'Georgia, serif' }}>
                {item.title}
              </h3>
              <p className="text-sm text-[#C4B89A]/60 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 border-t border-[#C4B89A]/10 mx-8" />

      {/* How you feed it */}
      <section className="relative z-10 px-8 py-20 max-w-5xl mx-auto">
        <div className="mb-12 flex items-center gap-3">
          <div className="h-px w-12 bg-[#C4B89A]/40" />
          <span className="text-xs tracking-[0.3em] uppercase text-[#C4B89A]/60">How you feed it</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#C4B89A]/10">
          {[
            {
              number: '—',
              title: 'Describe it',
              body: 'Walk through a guided conversation. Tell SysAnalyst what you\'re building, who it\'s for, and where you\'re stuck.',
            },
            {
              number: '—',
              title: 'Connect your files',
              body: 'Open your local project folder. SysAnalyst reads the structure — folder and file names only, never contents.',
            },
            {
              number: '—',
              title: 'Share your Drive',
              body: 'Connect Google Drive via OAuth. SysAnalyst maps your folder structure and analyses how your work is organised.',
            },
          ].map((item) => (
            <div key={item.title} className="bg-[#0D0D0D] p-8 border border-[#C4B89A]/10">
              <div className="text-xs tracking-[0.3em] text-[#C4B89A]/30 mb-4">{item.number}</div>
              <h3 className="text-[#F2EDE4] font-bold mb-3 tracking-wide"
                style={{ fontFamily: 'Georgia, serif' }}>
                {item.title}
              </h3>
              <p className="text-sm text-[#C4B89A]/60 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="relative z-10 border-t border-[#C4B89A]/10 mx-8" />

      {/* The pitch */}
      <section className="relative z-10 px-8 py-20 max-w-5xl mx-auto">
        <div className="max-w-2xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-12 bg-[#C4B89A]/40" />
            <span className="text-xs tracking-[0.3em] uppercase text-[#C4B89A]/60">Who it&apos;s for</span>
          </div>
          <p className="text-2xl text-[#F2EDE4] leading-relaxed mb-6"
            style={{ fontFamily: 'Georgia, serif' }}>
            &ldquo;Not a chatbot. Not a co-pilot. Not another AI wrapper with a gradient hero.
            A systems analyst — the kind that reads between the lines, challenges your assumptions,
            and tells you what you&apos;re actually building.&rdquo;
          </p>
          <div className="flex items-center gap-3 text-[#C4B89A]/40 text-xs tracking-widest uppercase">
            <Arrow />
            <span>For anyone with a system in their head that hasn&apos;t made it to paper yet</span>
          </div>
        </div>
      </section>

{/* CTA */}
      <section className="relative z-10 border-t border-[#C4B89A]/10 mx-8 py-20">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-bold text-[#F2EDE4] mb-2"
              style={{ fontFamily: 'Georgia, serif' }}>
              Ready to see clearly?
            </h2>
            <p className="text-[#C4B89A]/60 text-sm">Free to start. No noise.</p>
          </div>
          <Link
            href="/chat"
            className="flex items-center gap-4 bg-[#C4B89A] text-[#0D0D0D] px-8 py-4 font-bold tracking-widest uppercase text-sm hover:bg-[#F2EDE4] transition-colors whitespace-nowrap"
          >
            Begin Analysis
            <Arrow />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#C4B89A]/10 px-8 py-6 flex items-center justify-between">
        <span className="text-xs text-[#C4B89A]/30 tracking-widest uppercase">sysanalyst.dev</span>
        <div className="flex items-center gap-6 text-xs text-[#C4B89A]/30 tracking-wider">
          <Link href="/privacy" className="hover:text-[#C4B89A]/60 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-[#C4B89A]/60 transition-colors">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
