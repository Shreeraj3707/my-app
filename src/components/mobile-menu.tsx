'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations('Navbar');

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isOpen]);

  const links = [
    { href: '/blog', label: 'Blog' },
    { href: '/form', label: 'Sign Up' },
    { href: '/dashboard', label: t('dashboard') },
    { href: '/dashboard/settings', label: t('settings') },
  ];

  return (
    <>
      {/* Hamburger Button (Visible only on mobile) */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden flex flex-col gap-1.5 p-2 z-50"
        aria-label="Open menu"
      >
        <span className="w-6 h-0.5 bg-neutral-900 dark:bg-white rounded-full"></span>
        <span className="w-6 h-0.5 bg-neutral-900 dark:bg-white rounded-full"></span>
        <span className="w-6 h-0.5 bg-neutral-900 dark:bg-white rounded-full"></span>
      </button>

      {/* Slide-out Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-64 bg-white dark:bg-neutral-950 z-50 p-6 shadow-2xl md:hidden flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="font-bold text-xl bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
                  MyApp
                </span>
                <button onClick={() => setIsOpen(false)} className="text-2xl text-neutral-500 hover:text-black dark:hover:text-white">
                  ✕
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                {links.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className="text-lg font-medium text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}