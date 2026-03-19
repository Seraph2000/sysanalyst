'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAgentName } from '@/lib/hooks';

const NAV_ITEMS = [
  { href: '/chat', label: 'New Analysis' },
  { href: '/directory', label: 'Directory Analyser' },
  { href: '/drive', label: 'Google Drive' },
  { href: '/dashboard', label: 'Saved Analyses' },
  { href: '/settings', label: 'Settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const agentName = useAgentName();

  return (
    <aside className="w-64 bg-[#0D0D0D] border-r border-[#C4B89A]/10 min-h-screen p-6 flex flex-col font-mono">
      {/* Logo */}
      <Link href="/" className="mb-10">
        <h1 className="text-sm font-bold text-[#F2EDE4] tracking-widest uppercase">{agentName}</h1>
        <p className="text-xs text-[#C4B89A]/40 mt-1 tracking-wider">Systems Analyst</p>
      </Link>

      {/* Navigation */}
      <nav className="space-y-0.5 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-3 py-2.5 text-xs tracking-wider transition-colors border-l-2 ${
                isActive
                  ? 'text-[#F2EDE4] bg-[#C4B89A]/10 border-[#C4B89A]'
                  : 'text-[#C4B89A]/50 hover:text-[#C4B89A] hover:bg-[#C4B89A]/5 border-transparent'
              }`}
            >
              <span className="uppercase">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="pt-6 border-t border-[#C4B89A]/10">
        <p className="text-xs text-[#C4B89A]/20 tracking-widest uppercase">v0.5.0</p>
        <p className="text-xs text-[#C4B89A]/20 mt-1">Clarity over complexity.</p>
      </div>
    </aside>
  );
}
