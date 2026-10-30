import { requireAdmin } from '@/lib/auth-utils';
import AdminClient from './admin-client';

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  // This blocks non-admins at the server level
  await requireAdmin(locale);

  return <AdminClient />;
}