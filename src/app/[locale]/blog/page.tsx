'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import staticPosts from '@/data/posts.json';

export default function BlogPage() {
  const locale = useLocale();
  const t = useTranslations('Blog');
  const [allPosts, setAllPosts] = useState(staticPosts);

  useEffect(() => {
    const customPosts = JSON.parse(localStorage.getItem('custom_posts') || '[]');
    setAllPosts([...customPosts, ...staticPosts]);
  }, []);

  return (
    <div className="w-full max-w-3xl space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold mb-2">{t('title')}</h1>
        <p className="text-neutral-600 dark:text-neutral-400">{t('subtitle')}</p>
      </motion.div>

      <div className="space-y-6">
        {allPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/blog/${post.id}`}>
              <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors shadow-sm hover:shadow-md cursor-pointer group">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                  {post.title[locale as 'en' | 'zh']}
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                  {post.content[locale as 'en' | 'zh']}
                </p>
                <div className="flex justify-between items-center text-sm text-neutral-500">
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}