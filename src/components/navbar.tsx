'use client';

import { useState, useEffect } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { NotificationBell } from '@/components/notification-bell';
import { SemanticSearchModal } from '@/components/semantic-search-modal';
import { createClient } from '@/lib/supabase/client';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const toggleLocale = () => {
    const nextLocale = locale === 'en' ? 'zh' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  const navLinks = [
    { href: '/feed', label: 'Feed' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/dashboard/media', label: 'Upload' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo & Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-indigo-500/20">
              ⚡
            </div>
            <span className="font-extrabold text-lg tracking-tight text-neutral-900 dark:text-white">
              Social<span className="text-indigo-600 dark:text-indigo-400">Sphere</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    isActive
                      ? 'px-3.5 py-1.5 rounded-lg text-sm font-medium text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800'
                      : 'px-3.5 py-1.5 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions Cluster */}
        <div className="flex items-center gap-3">
          {/* AI Semantic Search Modal */}
          <SemanticSearchModal />

          {/* Real-Time Notification Bell */}
          <NotificationBell />

          {/* Language Switcher */}
          <button
            onClick={toggleLocale}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            🌐 {locale.toUpperCase()}
          </button>

          {/* User Auth Profile */}
          {user ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 pl-2 text-sm font-medium text-neutral-900 dark:text-white hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-indigo-500/30">
                {user.email?.[0].toUpperCase()}
              </div>
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 px-4 py-3 space-y-2 bg-white dark:bg-neutral-950">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={toggleLocale}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            🌐 Switch Language ({locale === 'en' ? '中文' : 'English'})
          </button>
        </div>
      )}
    </header>
  );
}