'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function followUser(targetId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase.from('follows').insert({
    follower_id: user.id,
    following_id: targetId,
  });

  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/profile/[id]', 'page');
  return true;
}

export async function unfollowUser(targetId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase.from('follows')
    .delete()
    .eq('follower_id', user.id)
    .eq('following_id', targetId);

  if (error) throw new Error(error.message);
  revalidatePath('/[locale]/profile/[id]', 'page');
  return true;
}

export async function isFollowing(targetId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from('follows')
    .select('id')
    .eq('follower_id', user.id)
    .eq('following_id', targetId)
    .single();

  return !!data;
}