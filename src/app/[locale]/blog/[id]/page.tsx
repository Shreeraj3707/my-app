'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import staticPosts from '@/data/posts.json';

export default function PostPage() {
  const { id } = useParams();
  const locale = useLocale();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundStatic = staticPosts.find((p) => p.id === id);
    if (foundStatic) {
      setPost(foundStatic);
      setLoading(false);
      return;
    }

    const customPosts = JSON.parse(localStorage.getItem('custom_posts') || '[]');
    const foundCustom = customPosts.find((p: any) => p.id === id);
    if (foundCustom) {
      setPost(foundCustom);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="text-center mt-20 animate-pulse text-neutral-500">Loading...</div>;
  }

  if (!post) {
    return (
      <div className="text-center mt-20">
        <h1 className="text-2xl font-bold text-red-500">Post not found</h1>
        <Link href="/blog" className="text-indigo-500 hover:underline mt-4 block">Back to Blog</Link>
      </div>
    );
  }

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl space-y-8"
    >
      <Link href="/blog" className="text-sm font-medium text-indigo-500 hover:text-indigo-400 transition-colors">
        ← Back to Blog
      </Link>
      
      <header className="space-y-4 border-b border-neutral-200 dark:border-neutral-800 pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          {post.title[locale as 'en' | 'zh']}
        </h1>
        <div className="flex items-center gap-4 text-sm text-neutral-500">
          <span className="font-medium text-neutral-800 dark:text-neutral-200">{post.author}</span>
          <span>•</span>
          <span>{post.date}</span>
        </div>
      </header>

      <div className="prose dark:prose-invert max-w-none text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
        <p>{post.content[locale as 'en' | 'zh']}</p>
      </div>
    </motion.article>
  );
}