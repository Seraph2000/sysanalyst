'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAgentName } from '@/lib/hooks';

const NAV_ITEMS = [
  { href: '/chat', label: 'New Analysis', icon: '💬' },
  { href: '/directory', label: 'Directory Analyser', icon: '📁' },
  { href: '/drive', label: 'Google Drive', icon: '☁️' },
  { href: '/dashboard', label: 'Saved Analyses', icon: '📋' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const agentName = useAgentName();

  return (
    <aside className="w-64 bg-stone-50 border-r border-stone-200 min-h-screen p-6 flex flex-col">
      {/* Logo */}
      <Link href="/" className="mb-8">
        <h1 className="text-xl font-bold text-stone-800">{agentName}</h1>
        <p className="text-xs text-stone-400 mt-0.5">Systems Analyst</p>
      </Link>

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-violet-100 text-violet-700 font-medium'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="pt-6 border-t border-stone-200">
        <p className="text-xs text-stone-400">
          v0.4
        </p>
        <p className="text-xs text-stone-400 mt-1">
          Clarity over complexity.
        </p>
      </div>
    </aside>
  );
}
