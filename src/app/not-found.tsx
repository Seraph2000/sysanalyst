import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#C4B89A] font-mono flex items-center justify-center px-8">
      <div className="max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-12 bg-[#C4B89A]/40" />
          <span className="text-xs tracking-[0.3em] uppercase text-[#C4B89A]/60">404</span>
        </div>
        <h1 className="text-3xl font-bold text-[#F2EDE4] mb-4"
          style={{ fontFamily: 'Georgia, serif' }}>
          Nothing here.
        </h1>
        <p className="text-sm text-[#C4B89A]/60 leading-relaxed mb-8">
          This page doesn&apos;t exist. It may have moved, or the link may be wrong.
        </p>
        <Link
          href="/"
          className="text-xs tracking-widest uppercase bg-[#C4B89A] text-[#0D0D0D] px-6 py-3 font-bold hover:bg-[#F2EDE4] transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
