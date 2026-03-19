'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#C4B89A] font-mono flex items-center justify-center px-8">
      <div className="max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-px w-12 bg-[#C4B89A]/40" />
          <span className="text-xs tracking-[0.3em] uppercase text-[#C4B89A]/60">Error</span>
        </div>
        <h1 className="text-3xl font-bold text-[#F2EDE4] mb-4"
          style={{ fontFamily: 'Georgia, serif' }}>
          Something went wrong.
        </h1>
        <p className="text-sm text-[#C4B89A]/60 leading-relaxed mb-8">
          An unexpected error occurred. Your saved analyses are safe — this is a temporary problem.
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={reset}
            className="text-xs tracking-widest uppercase bg-[#C4B89A] text-[#0D0D0D] px-6 py-3 font-bold hover:bg-[#F2EDE4] transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="text-xs tracking-widest uppercase border border-[#C4B89A]/30 px-6 py-3 text-[#C4B89A]/60 hover:bg-[#C4B89A]/10 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
