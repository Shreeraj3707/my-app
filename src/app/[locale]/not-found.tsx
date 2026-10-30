'use client';

import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-cyan-500">
          404
        </h1>
        <h2 className="text-2xl font-bold mt-4 mb-2">Page Not Found</h2>
        <p className="text-neutral-500 mb-8 max-w-md">The page you are looking for doesn't exist or has been moved.</p>
        <Link href="/" className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl shadow-lg hover:scale-105 transition-transform">
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}