'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addComment(mediaId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('You must be logged in to comment.');

  const userName = user.user_metadata.full_name || 'Anonymous';

  const { error } = await supabase.from('comments').insert({
    media_id: mediaId,
    user_id: user.id,
    user_name: userName,
    content: content,
  });

  if (error) throw new Error(error.message);

  revalidatePath('/[locale]/gallery', 'page');
  revalidatePath('/[locale]/dashboard/media', 'page');
  return true;
}

export async function getComments(mediaId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('comments')
    .select('*')
    .eq('media_id', mediaId)
    .order('created_at', { ascending: true });
  return data || [];
}