'use client';

import { motion } from 'framer-motion';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-6xl font-extrabold text-red-500 mb-4">Oops!</h1>
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-neutral-500 mb-8 max-w-md">We encountered an unexpected error. Please try again.</p>
        <button onClick={() => reset()} className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl shadow-lg hover:scale-105 transition-transform">
          Try Again
        </button>
      </motion.div>
    </div>
  );
}