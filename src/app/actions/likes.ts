'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function likeMedia(mediaId: string, ownerId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('You must be logged in to like media.');

  const { data: media } = await supabase
    .from('media')
    .select('likes')
    .eq('id', mediaId)
    .single();

  const newLikes = (media?.likes || 0) + 1;

  await supabase.from('media').update({ likes: newLikes }).eq('id', mediaId);

  if (ownerId !== user.id) {
    const { error: notifError } = await supabase.from('notifications').insert({
      user_id: ownerId,
      title: `Someone liked your photo`,
      type: 'like',
      link: `/gallery`,
      is_read: false,
    });

    if (notifError) {
      console.error("NOTIFICATION ERROR:", notifError.message);
    }
  }

  revalidatePath('/[locale]/gallery', 'page');
  revalidatePath('/[locale]/feed', 'page');
  return true;
}