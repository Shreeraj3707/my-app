import '../globals.css';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Providers } from '@/components/providers';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MyApp | The Future of Web',
  description: 'A premium, multi-language SaaS platform built with Next.js 16, Supabase, and Framer Motion.',
  openGraph: {
    title: 'MyApp | The Future of Web',
    description: 'A premium, multi-language SaaS platform.',
    url: 'https://myapp.com',
    siteName: 'MyApp',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyApp | The Future of Web',
    description: 'A premium, multi-language SaaS platform.',
  },
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body 
        suppressHydrationWarning 
        className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white antialiased selection:bg-indigo-500/30 flex flex-col transition-colors duration-300"
      >
        <NextIntlClientProvider>
          <Providers>
            <Navbar />
            <div className="w-full max-w-5xl mx-auto px-6 pt-32 flex-1 flex flex-col items-center">
              {children}
            </div>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}