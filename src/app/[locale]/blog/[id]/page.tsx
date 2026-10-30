'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import staticPosts from '@/data/posts.json';
import { generateSummary } from '@/actions/ai';

export default function PostPage() {
  const { id } = useParams();
  const locale = useLocale();
  const supabase = createClient();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setPost({
          id: data.id,
          title: { en: data.title, zh: data.title },
          content: { en: data.content, zh: data.content },
          date: new Date(data.created_at).toISOString().split('T')[0],
          author: 'Admin',
        });
      } else {
        const foundStatic = staticPosts.find((p) => p.id === id);
        if (foundStatic) setPost(foundStatic);
      }
      setLoading(false);
    };

    fetchPost();
  }, [id, supabase]);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    const textContent = post.content[locale as 'en' | 'zh'];
    const result = await generateSummary(textContent);
    setSummary(result);
    setIsGenerating(false);
  };

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
      className="w-full max-w-3xl space-y-8 pb-12"
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

      {/* AI Summary Block */}
      <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-6 my-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <h3 className="font-bold text-indigo-900 dark:text-indigo-300">AI Summary</h3>
          </div>
          {!summary && (
            <button
              type="button" // <-- THIS PREVENTS THE PAGE REFRESH
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isGenerating ? 'Thinking...' : 'Generate Summary'}
            </button>
          )}
        </div>
        {summary ? (
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
            className="text-indigo-800 dark:text-indigo-200 italic"
          >
            "{summary}"
          </motion.p>
        ) : (
          <p className="text-sm text-indigo-600/70 dark:text-indigo-400/70">
            Click the button to let AI summarize this article for you.
          </p>
        )}
      </div>

      <div className="prose dark:prose-invert max-w-none text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
        <p>{post.content[locale as 'en' | 'zh']}</p>
      </div>
    </motion.article>
  );
}