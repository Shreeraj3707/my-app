import '../globals.css';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Providers } from '@/components/providers';
import { CommandMenu } from '@/components/command-menu';
import { AIChat } from '@/components/ai-chat';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SocialSphere | The Future of Social Media',
  description: 'AI-driven social platform for creators',
  openGraph: {
    title: 'SocialSphere | The Future of Social Media',
    description: 'AI-driven social platform for creators',
    url: 'https://my-app-two-nu-45.vercel.app',
    siteName: 'SocialSphere',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SocialSphere',
    description: 'AI-driven social platform for creators',
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
            <CommandMenu />
            <AIChat />
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