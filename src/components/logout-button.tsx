'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/navigation';

export function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
    >
      Log Out
    </button>
  );
}