'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function SettingsPage() {
  const t = useTranslations('Settings');
  const [emailNotif, setEmailNotif] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem('user_name') || 'Admin User';
    const savedEmail = localStorage.getItem('user_email') || 'admin@myapp.com';
    setName(savedName);
    setEmail(savedEmail);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    localStorage.setItem('user_name', name);
    
    // Dispatch a custom event to notify the Navbar to update immediately
    window.dispatchEvent(new Event('profileUpdated'));
    
    toast.success(t('updated'));
  };

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        enabled ? 'bg-indigo-500' : 'bg-neutral-300 dark:bg-neutral-700'
      }`}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full max-w-2xl space-y-10 pb-12"
    >
      <div>
        <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-white">{t('title')}</h1>
        <p className="text-neutral-600 dark:text-neutral-400">{t('subtitle')}</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <section className="bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">{t('profile')}</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                {t('name')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Email Address (Read Only)
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full px-4 py-3 bg-neutral-200 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                {t('bio')}
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-neutral-900 dark:text-white resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </section>

        <section className="bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">{t('preferences')}</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">{t('emailNotif')}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('emailNotifDesc')}</p>
              </div>
              <Toggle enabled={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900 dark:text-white">{t('marketing')}</p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('marketingDesc')}</p>
              </div>
              <Toggle enabled={marketing} onChange={() => setMarketing(!marketing)} />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl shadow-lg dark:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all"
          >
            {t('save')}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}