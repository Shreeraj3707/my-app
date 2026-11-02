'use client';

import { Link, usePathname } from '@/i18n/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: '📊' },
    { href: '/dashboard/users', label: 'Users', icon: '👥' },
    { href: '/dashboard/media', label: 'Media Library', icon: '📷' },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      {/* 🖥️ Left Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-900/50 p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2">
            <span className="text-xl">⚡</span>
            <span className="font-extrabold text-base tracking-tight text-white">
              Admin Console
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Back Link */}
        <Link
          href="/feed"
          className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          <span>←</span> Back to Feed
        </Link>
      </aside>

      {/* 📄 Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}