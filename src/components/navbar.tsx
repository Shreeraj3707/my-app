'use client';

import { motion } from 'framer-motion';
import { LanguageSwitcher } from './language-switcher';
import { ThemeToggle } from './theme-toggle';
import { ProfileMenu } from './profile-menu';
import { MobileMenu } from './mobile-menu';
import { Link } from '@/i18n/navigation';

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 md:px-8 py-4 bg-white/60 dark:bg-neutral-950/60 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800/50 transition-colors duration-300"
    >
      {/* Left Side: Logo & Desktop Links */}
      <div className="flex items-center gap-8">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-cyan-500 bg-clip-text text-transparent">
          MyApp
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link href="/blog" className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors">
            Blog
          </Link>
          <Link href="/form" className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors">
            Sign Up
          </Link>
        </div>
      </div>
      
      {/* Right Side: Tools, Profile & Mobile Menu */}
      <div className="flex items-center gap-3 md:gap-4">
        <ThemeToggle />
        
        {/* Hide language switcher on very small screens to save space */}
        <div className="hidden sm:block">
          <LanguageSwitcher />
        </div>
        
        <div className="hidden md:block w-px h-6 bg-neutral-300 dark:bg-neutral-700 mx-2"></div>
        
        <div className="hidden md:block">
          <ProfileMenu />
        </div>

        {/* Mobile Menu (Hamburger) */}
        <MobileMenu />
      </div>
    </motion.nav>
  );
}