'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Command } from 'cmdk';
import { useTranslations } from 'next-intl';
import { searchEverything } from '@/app/actions/search';
import Image from 'next/image';

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ users: any[], media: any[] }>({ users: [], media: [] });
  const [isSearching, setIsSearching] = useState(false);
  
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const t = useTranslations('Command');

  // Toggle the menu
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

  // Debounced Search Logic
  useEffect(() => {
    if (query.length > 1) {
      setIsSearching(true);
      const timer = setTimeout(async () => {
        const data = await searchEverything(query);
        setResults(data);
        setIsSearching(false);
      }, 300); // 300ms debounce
      return () => clearTimeout(timer);
    } else {
      setResults({ users: [], media: [] });
    }
  }, [query]);

  const runCommand = (command: () => void) => {
    setOpen(false);
    setQuery('');
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
          <Command loop shouldFilter={false}>
            <div className="flex items-center border-b border-neutral-200 dark:border-neutral-800 px-4">
              <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Command.Input 
                autoFocus
                value={query}
                onValueChange={setQuery}
                placeholder="Search users, media, or commands..."
                className="flex-1 bg-transparent px-4 py-4 text-sm text-neutral-900 dark:text-white outline-none placeholder:text-neutral-500"
              />
              {isSearching && <span className="text-xs text-neutral-500 animate-pulse">Searching...</span>}
            </div>

            <Command.List className="max-h-[350px] overflow-y-auto p-2">
              <Command.Empty className="py-6 text-center text-sm text-neutral-500">
                No results found for "{query}"
              </Command.Empty>

              {/* Search Results: Users */}
              {results.users.length > 0 && (
                <Command.Group heading="Users" className="text-xs font-medium text-neutral-500 px-2 py-1">
                  {results.users.map((user) => (
                    <Command.Item 
                      key={user.id}
                      onSelect={() => runCommand(() => router.push(`/profile/${user.id}`))}
                      className="flex items-center gap-3 px-3 py-2 mt-1 text-sm rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 aria-selected:bg-neutral-100 dark:aria-selected:bg-neutral-800"
                    >
                      <div className="w-6 h-6 rounded-full bg-indigo-500 overflow-hidden relative">
                         {user.avatar_url ? <Image src={user.avatar_url} alt="avatar" fill className="object-cover" sizes="24px" /> : null}
                      </div>
                      <span>{user.full_name}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {/* Search Results: Media */}
              {results.media.length > 0 && (
                <Command.Group heading="Media" className="text-xs font-medium text-neutral-500 px-2 py-1 mt-2">
                  {results.media.map((item) => (
                    <Command.Item 
                      key={item.id}
                      onSelect={() => runCommand(() => router.push('/gallery'))}
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 aria-selected:bg-neutral-100 dark:aria-selected:bg-neutral-800"
                    >
                      <div className="w-8 h-8 rounded bg-neutral-200 dark:bg-neutral-800 overflow-hidden relative">
                        {item.file_type === 'image' ? (
                          <Image src={item.file_url} alt="media" fill className="object-cover" sizes="32px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs">🎥</div>
                        )}
                      </div>
                      <span>{item.title}</span>
                    </Command.Item>
                  ))}
                </Command.Group>
              )}

              {/* Default Navigation Links (Only show if no search query) */}
              {query.length < 2 && (
                <>
                  <Command.Group heading="Navigation" className="text-xs font-medium text-neutral-500 px-2 py-1 mt-2">
                    <Command.Item 
                      onSelect={() => runCommand(() => router.push('/feed'))}
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      📱 Your Feed
                    </Command.Item>
                    <Command.Item 
                      onSelect={() => runCommand(() => router.push('/dashboard'))}
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      📊 Dashboard
                    </Command.Item>
                    <Command.Item 
                      onSelect={() => runCommand(() => router.push('/gallery'))}
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      🖼️ Public Gallery
                    </Command.Item>
                  </Command.Group>

                  <Command.Group heading="Settings" className="text-xs font-medium text-neutral-500 px-2 py-1 mt-2 border-t border-neutral-100 dark:border-neutral-800 pt-2">
                    <Command.Item 
                      onSelect={() => runCommand(() => setTheme(theme === 'dark' ? 'light' : 'dark'))}
                      className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      🌓 Toggle Theme
                    </Command.Item>
                  </Command.Group>
                </>
              )}
            </Command.List>
          </Command>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}