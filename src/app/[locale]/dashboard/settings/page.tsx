'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

export default function SettingsPage() {
  const t = useTranslations('Settings');
  const supabase = createClient();
  
  const [emailNotif, setEmailNotif] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || '');
        const { data } = await supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single();
        if (data) {
          setName(data.full_name || '');
          setAvatarUrl(data.avatar_url || null);
        }
      }
    };
    getProfile();
  }, [supabase]);

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setAvatarUrl(data.publicUrl);
      
      toast.success('Image uploaded! Click Save to update.');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase.from('profiles').update({ 
        full_name: name, 
        avatar_url: avatarUrl 
      }).eq('id', user.id);

      if (error) toast.error(error.message);
      else {
        toast.success(t('updated'));
        window.dispatchEvent(new Event('profileUpdated')); // Tells Navbar to update
      }
    }
  };

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button type="button" onClick={onChange} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-indigo-500' : 'bg-neutral-300 dark:bg-neutral-700'}`}>
      <motion.span layout className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl space-y-10 pb-12">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-white">{t('title')}</h1>
        <p className="text-neutral-600 dark:text-neutral-400">{t('subtitle')}</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <section className="bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">{t('profile')}</h2>
          
          {/* Avatar Upload */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden relative">
              {avatarUrl ? (
                <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-neutral-400">
                  {name.charAt(0).toUpperCase() || '?'}
                </div>
              )}
            </div>
            <div>
              <label className="cursor-pointer bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                {uploading ? 'Uploading...' : 'Change Avatar'}
                <input type="file" accept="image/*" onChange={uploadAvatar} className="hidden" disabled={uploading} />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">{t('name')}</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:ring-2 focus:ring-indigo-500/50 text-neutral-900 dark:text-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Email (Read Only)</label>
              <input type="email" value={email} disabled className="w-full px-4 py-3 bg-neutral-200 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-500 cursor-not-allowed" />
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
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl shadow-lg transition-all">
            {t('save')}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}