'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { motion } from 'framer-motion';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex gap-1 p-1 bg-neutral-200 dark:bg-neutral-800/80 rounded-full w-fit transition-colors">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => router.replace(pathname, { locale: lang.code })}
          className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            locale === lang.code 
              ? 'text-white dark:text-black' 
              : 'text-neutral-500 hover:text-black dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          {locale === lang.code && (
            <motion.div
              layoutId="lang-pill"
              className="absolute inset-0 bg-black dark:bg-white rounded-full"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{lang.label}</span>
        </button>
      ))}
    </div>
  );
}