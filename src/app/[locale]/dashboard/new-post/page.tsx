'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export default function NewPostPage() {
  const t = useTranslations('NewPost');
  const router = useRouter();
  const supabase = createClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error(t('error'));
      return;
    }

    setIsLoading(true);

    // 1. Get current user from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to post.");
      setIsLoading(false);
      return;
    }

    // 2. Insert into Supabase
    const { error } = await supabase.from('posts').insert({
      author_id: user.id,
      title: title,
      content: content,
    });

    if (error) {
      console.error("Supabase Error:", error);
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    toast.success(t('success'));
    router.push('/blog');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full max-w-3xl space-y-8 pb-12"
    >
      <div>
        <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-white">{t('title')}</h1>
        <p className="text-neutral-600 dark:text-neutral-400">{t('subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 rounded-3xl shadow-xl">
        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            {t('postTitle')}
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-neutral-900 dark:text-white"
            placeholder="e.g., The Future of AI"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            {t('content')}
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-neutral-900 dark:text-white resize-none"
            placeholder="Write your article here..."
            required
          />
        </div>

        <div className="flex justify-end pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl shadow-lg disabled:opacity-50 transition-all"
          >
            {isLoading ? t('publishing') : t('publish')}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}