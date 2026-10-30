'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Command } from 'cmdk';
import { useTranslations } from 'next-intl';

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const t = useTranslations('Command');

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-xl overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-200 dark:border-neutral-800"
          onClick={(e) => e.stopPropagation()}
        >
          <Command loop>
            <div className="flex items-center border-b border-neutral-200 dark:border-neutral-800 px-4">
              <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Command.Input 
                autoFocus
                placeholder={t('placeholder')}
                className="flex-1 bg-transparent px-4 py-4 text-sm text-neutral-900 dark:text-white outline-none placeholder:text-neutral-500"
              />
              <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-medium text-neutral-500 bg-neutral-100 dark:bg-neutral-800 rounded">
                ESC
              </kbd>
            </div>

            <Command.List className="max-h-[300px] overflow-y-auto p-2">
              <Command.Empty className="py-6 text-center text-sm text-neutral-500">
                {t('noResults')}
              </Command.Empty>

              <Command.Group heading={t('navigation')} className="text-xs font-medium text-neutral-500 px-2 py-1">
                <Command.Item 
                  onSelect={() => runCommand(() => router.push('/dashboard'))}
                  className="flex items-center gap-3 px-3 py-2 mt-1 text-sm rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 aria-selected:bg-neutral-100 dark:aria-selected:bg-neutral-800"
                >
                  📊 {t('dashboard')}
                </Command.Item>
                <Command.Item 
                  onSelect={() => runCommand(() => router.push('/dashboard/kanban'))}
                  className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 aria-selected:bg-neutral-100 dark:aria-selected:bg-neutral-800"
                >
                  📋 {t('kanban')}
                </Command.Item>
                <Command.Item 
                  onSelect={() => runCommand(() => router.push('/dashboard/new-post'))}
                  className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 aria-selected:bg-neutral-100 dark:aria-selected:bg-neutral-800"
                >
                  ✍️ {t('newPost')}
                </Command.Item>
                <Command.Item 
                  onSelect={() => runCommand(() => router.push('/dashboard/admin'))}
                  className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 aria-selected:bg-neutral-100 dark:aria-selected:bg-neutral-800"
                >
                  👥 {t('users')}
                </Command.Item>
              </Command.Group>

              <Command.Group heading={t('settings')} className="text-xs font-medium text-neutral-500 px-2 py-1 mt-2 border-t border-neutral-100 dark:border-neutral-800 pt-2">
                <Command.Item 
                  onSelect={() => runCommand(() => setTheme(theme === 'dark' ? 'light' : 'dark'))}
                  className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 aria-selected:bg-neutral-100 dark:aria-selected:bg-neutral-800"
                >
                  🌓 {t('toggleTheme')}
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}