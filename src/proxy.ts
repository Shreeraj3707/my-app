import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

const handleI18nRouting = createIntlMiddleware(routing);

export async function proxy(request: Request) {
  return handleI18nRouting(request as any);
}

export const config = {
  matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};