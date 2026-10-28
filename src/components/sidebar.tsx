'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { motion } from 'framer-motion';

export function Sidebar() {
  const t = useTranslations('Dashboard');
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: t('overview'), icon: '📊' },
    { href: '/dashboard/kanban', label: t('kanban'), icon: '📋' },
    { href: '/dashboard/admin', label: t('admin'), icon: '👥' },
    { href: '/dashboard/new-post', label: 'New Post', icon: '✍️' },
    { href: '/dashboard/settings', label: t('settings'), icon: '⚙️' },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:block">
      <nav className="space-y-2 sticky top-28">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link key={link.href} href={link.href}>
              <div
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'text-black dark:text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 rounded-xl"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10 text-xl">{link.icon}</span>
                <span className="relative z-10 font-medium">{link.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}