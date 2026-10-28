'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const t = useTranslations('Login');
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    toast.success('Logged in successfully!');
    router.push('/dashboard');
    router.refresh(); 
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 p-8 rounded-3xl shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">{t('title')}</h2>
          <p className="text-neutral-600 dark:text-neutral-400">{t('subtitle')}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              {t('email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-neutral-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              {t('password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-neutral-900 dark:text-white"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl shadow-lg disabled:opacity-50 transition-all"
          >
            {isLoading ? t('loggingIn') : t('submit')}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm text-neutral-500">
          Don't have an account?{' '}
          <Link href="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}