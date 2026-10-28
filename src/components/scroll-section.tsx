'use client';

import { motion } from 'framer-motion';

export function ScrollSection({ title, desc }: { title: string, desc: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="w-full mt-32 py-24 bg-gradient-to-b from-neutral-100 to-white dark:from-neutral-900 dark:to-neutral-950 rounded-[3rem] border border-neutral-200 dark:border-neutral-800 text-center px-6 transition-colors"
    >
      <h2 className="text-4xl font-bold mb-6 text-neutral-900 dark:text-white">{title}</h2>
      <p className="text-neutral-600 dark:text-neutral-400 text-xl max-w-2xl mx-auto">{desc}</p>
    </motion.section>
  );
}