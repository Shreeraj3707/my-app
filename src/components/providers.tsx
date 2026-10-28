'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

// Filter the false-positive React 19 script warning from next-themes
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const origError = console.error;
  console.error = (...args: any[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag')) {
      return;
    }
    origError.apply(console, args);
  };
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Toaster position="top-center" richColors />
      {children}
    </ThemeProvider>
  );
}