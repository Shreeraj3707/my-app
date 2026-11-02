'use client';

import { Link, usePathname } from '@/i18n/navigation';

export function MobileNav() {
  const pathname = usePathname();

  const tabs = [
    { href: '/feed', label: 'Feed', icon: '🏠' },
    { href: '/gallery', label: 'Gallery', icon: '🖼️' },
    { href: '/dashboard/media', label: 'Post', icon: '➕' },
    { href: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-neutral-950/90 backdrop-blur-lg border-t border-neutral-800 px-6 py-2.5 pb-safe">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive
                  ? 'text-white scale-110 font-bold'
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}