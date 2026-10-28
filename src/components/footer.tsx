export function Footer() {
  return (
    <footer className="w-full py-8 mt-12 border-t border-neutral-200 dark:border-neutral-800 text-center text-neutral-500 text-sm transition-colors">
      © {new Date().getFullYear()} MyApp. Built with Next.js 16 & Framer Motion.
    </footer>
  );
}