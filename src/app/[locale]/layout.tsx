import '@/app/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Navbar } from '@/components/navbar';
import { CommandMenu } from '@/components/command-menu';
import { Providers } from '@/components/providers';
import { MobileNav } from '@/components/mobile-nav';
import { InstallPWA } from '@/components/install-pwa';

export const metadata = {
  title: 'SocialSphere | The Future of Social Media',
  description: 'AI-driven social platform for creators',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SocialSphere',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 antialiased pb-16 md:pb-0"
        suppressHydrationWarning
      >
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            <Navbar />
            <CommandMenu />
            <main>{children}</main>
            <MobileNav />
            <InstallPWA />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}