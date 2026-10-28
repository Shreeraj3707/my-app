'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const t = useTranslations('Dashboard');

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
        <p className="text-neutral-600 dark:text-neutral-400">{t('welcome')}</p>
      </motion.div>

      <div>
        <h2 className="text-xl font-semibold mb-4">{t('stats')}</h2>
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <motion.div variants={item} className="bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">{t('users')}</p>
            <p className="text-4xl font-bold text-neutral-900 dark:text-white">12,450</p>
            <div className="mt-4 h-1 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-3/4 rounded-full"></div>
            </div>
          </motion.div>

          <motion.div variants={item} className="bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">{t('revenue')}</p>
            <p className="text-4xl font-bold text-neutral-900 dark:text-white">$45,231</p>
            <div className="mt-4 h-1 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-1/2 rounded-full"></div>
            </div>
          </motion.div>

          <motion.div variants={item} className="bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">{t('active')}</p>
            <p className="text-4xl font-bold text-neutral-900 dark:text-white">573</p>
            <div className="mt-4 h-1 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 w-5/6 rounded-full"></div>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}