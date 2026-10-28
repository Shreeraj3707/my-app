import { Sidebar } from '@/components/sidebar';
import { createClient } from '@/lib/supabase/server';
import { redirect } from '@/i18n/navigation';

export default async function DashboardLayout({ 
  children,
  params,
}: { 
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  
  // Check if the user is logged in on the server
  const { data: { user } } = await supabase.auth.getUser();

  // If no user, redirect to login
  if (!user) {
    redirect({ href: '/login', locale });
  }

  return (
    <div className="w-full flex gap-8 mt-8">
      <Sidebar />
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}