'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { toast } from 'sonner';

export default function FormPage() {
  const t = useTranslations('FormPage');
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({ name: '', email: '' });
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    let isValid = true;
    const newErrors = { name: '', email: '' };

    if (formData.name.length < 2) {
      newErrors.name = t('errors.name');
      isValid = false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('errors.email');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      toast.success(t('success')); // Toast notification triggered here
      setIsSuccess(true);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 p-8 rounded-3xl shadow-2xl"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">{t('title')}</h2>
              <p className="text-neutral-600 dark:text-neutral-400">{t('subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  {t('name')}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800/50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-neutral-900 dark:text-white ${
                    errors.name ? 'border-red-500 focus:ring-red-500/50' : 'border-neutral-300 dark:border-neutral-700 focus:ring-indigo-500/50'
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-red-400 text-sm mt-2">{errors.name}</p>}
              </div>

              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  {t('email')}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800/50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-neutral-900 dark:text-white ${
                    errors.email ? 'border-red-500 focus:ring-red-500/50' : 'border-neutral-300 dark:border-neutral-700 focus:ring-indigo-500/50'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email}</p>}
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-xl dark:hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all"
              >
                {t('submit')}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          /* Success State */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 p-12 rounded-3xl shadow-2xl text-center"
          >
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="text-6xl mb-6"
            >
              ✅
            </motion.div>
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">{t('success')}</h2>
            <Link 
              href="/"
              className="inline-block mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors"
            >
              {t('back')} →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}