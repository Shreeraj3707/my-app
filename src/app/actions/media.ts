'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function saveMediaToDatabase(title: string, url: string, type: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { error } = await supabase.from('media').insert({
    user_id: user.id,
    title: title,
    file_url: url,
    file_type: type,
  });

  if (error) throw new Error(error.message);

  revalidatePath('/[locale]/gallery', 'page');
  revalidatePath('/[locale]/dashboard/media', 'page');
  return true;
}

export async function likeMedia(mediaId: string, currentLikes: number) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('media')
    .update({ likes: currentLikes + 1 })
    .eq('id', mediaId);

  if (error) throw new Error(error.message);

  revalidatePath('/[locale]/gallery', 'page');
  revalidatePath('/[locale]/dashboard/media', 'page');
  return true;
}