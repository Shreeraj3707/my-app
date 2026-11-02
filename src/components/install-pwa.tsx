'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show if the user hasn't already installed the app
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-50 p-4 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-lg font-black shadow-md">
              ⚡
            </div>
            <div>
              <p className="text-sm font-bold text-white">Install SocialSphere</p>
              <p className="text-xs text-neutral-400">Add to home screen for full app speed</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrompt(false)}
              className="text-neutral-500 hover:text-white text-xs px-2 py-1"
            >
              ✕
            </button>
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-lg shadow-md transition-colors"
            >
              Install
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}