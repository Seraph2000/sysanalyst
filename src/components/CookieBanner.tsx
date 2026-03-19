'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('cookie-notice-dismissed');
    if (!dismissed) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem('cookie-notice-dismissed', '1');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#C4B89A]/20 bg-[#0D0D0D]/95 backdrop-blur-sm px-6 py-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-xs text-[#C4B89A]/60 leading-relaxed max-w-2xl">
          This site uses strictly necessary cookies to keep you signed in. No tracking, no advertising.{' '}
          <Link href="/privacy" className="text-[#C4B89A]/80 hover:text-[#C4B89A] transition-colors underline underline-offset-2">
            Privacy Policy
          </Link>
        </p>
        <button
          onClick={dismiss}
          className="text-xs tracking-widest uppercase border border-[#C4B89A]/30 px-4 py-2 text-[#C4B89A]/60 hover:bg-[#C4B89A]/10 hover:text-[#C4B89A] transition-colors whitespace-nowrap"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
