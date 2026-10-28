'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/client';

export function ProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Navbar');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserData({
          name: user.user_metadata.full_name || 'User',
          email: user.email || '',
        });
      } else {
        setUserData(null);
      }
    };

    getUser();

    // Listen to Supabase auth state changes (like logging out)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserData({
          name: session.user.user_metadata.full_name || 'User',
          email: session.user.email || '',
        });
      } else {
        setUserData(null);
      }
    });

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      authListener.subscription.unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    router.push('/login');
    router.refresh();
  };

  if (!userData) {
    return (
      <Link href="/login" className="hidden md:block px-4 py-2 text-sm font-medium bg-black dark:bg-white text-white dark:text-black rounded-full hover:opacity-90 transition-opacity">
        Log In
      </Link>
    );
  }

  const initial = userData.name.charAt(0).toUpperCase();

  return (
    <div className="relative hidden md:block" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-white font-bold shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
      >
        {initial}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 mb-2">
              <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">{userData.name}</p>
              <p className="text-xs text-neutral-500 truncate">{userData.email}</p>
            </div>

            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
              <div className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                {t('dashboard')}
              </div>
            </Link>

            <Link href="/dashboard/settings" onClick={() => setIsOpen(false)}>
              <div className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                {t('settings')}
              </div>
            </Link>

            <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-2"></div>

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              {t('logout')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}