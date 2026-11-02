'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { searchMediaByMeaning } from '@/app/actions/search';

interface SearchResult {
  id: string;
  title: string;
  file_url: string;
  file_type: string;
  likes: number;
  similarity: number;
}

export function SemanticSearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch results (or recent items when opened)
  const executeSearch = useCallback(async (searchTerm: string) => {
    setIsSearching(true);
    try {
      const res = await searchMediaByMeaning(searchTerm);
      setResults(res || []);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // When modal opens, load initial media immediately
  useEffect(() => {
    if (isOpen) {
      executeSearch(query);
    }
  }, [isOpen, executeSearch]);

  // Debounce when user types
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      executeSearch(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, isOpen, executeSearch]);

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-400 bg-neutral-900 hover:bg-neutral-800 rounded-lg border border-neutral-800 transition-colors"
      >
        <span>🔍 AI Search...</span>
        <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-neutral-950 border border-neutral-800 rounded text-neutral-400">
          Ctrl K
        </kbd>
      </button>

      {/* Spotlight Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Search Form - e.preventDefault() prevents browser page reloads */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  executeSearch(query);
                }}
                className="flex items-center px-4 border-b border-neutral-800"
              >
                <span className="text-xl mr-3 text-indigo-400">✨</span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      executeSearch(query);
                    }
                  }}
                  placeholder="Search photos, vibes, titles (e.g. 'Raja', 'beach', 'art')..."
                  className="w-full py-4 bg-transparent outline-none text-white placeholder-neutral-500 text-sm"
                  autoFocus
                />
                {isSearching && (
                  <span className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                )}
              </form>

              {/* Results Container */}
              <div className="max-h-96 overflow-y-auto p-4 space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 px-2 mb-2">
                  {query.trim() ? 'Search Results' : 'Recent Uploads'}
                </div>

                {results.length === 0 && !isSearching && (
                  <div className="text-center py-10 text-neutral-500 text-sm">
                    No media found matching &quot;{query}&quot;.
                  </div>
                )}

                {results.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 p-2.5 hover:bg-neutral-800/80 rounded-xl transition-colors cursor-pointer group"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-800 flex-shrink-0">
                      {item.file_type === 'image' ? (
                        <Image
                          src={item.file_url}
                          alt={item.title || 'media'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs">🎥</div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {item.title || 'Untitled'}
                      </p>
                      <p className="text-xs text-neutral-400">❤️ {item.likes || 0} likes</p>
                    </div>

                    <div className="px-2 py-1 text-[11px] font-bold rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800">
                      {Math.round((item.similarity || 1) * 100)}% Match
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}