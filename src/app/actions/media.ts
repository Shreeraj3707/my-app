'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import sharp from 'sharp';

const PAGE_SIZE = 9;

// 1. Save media to database (used by media-uploader.tsx)
export async function saveMediaToDatabase(
  arg1: any,
  arg2?: string,
  arg3?: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Must be logged in to save media');

  let title = 'Untitled';
  let file_url = '';
  let file_type = 'image';

  // Handles both object payload { title, file_url, file_type } and positional args (title, url, type)
  if (typeof arg1 === 'object' && arg1 !== null) {
    title = arg1.title || 'Untitled';
    file_url = arg1.file_url || arg1.url || '';
    file_type = arg1.file_type || arg1.type || (file_url.endsWith('.mp4') ? 'video' : 'image');
  } else {
    title = arg1 || 'Untitled';
    file_url = arg2 || '';
    file_type = arg3 || (file_url.endsWith('.mp4') ? 'video' : 'image');
  }

  const { data, error } = await supabase
    .from('media')
    .insert({
      user_id: user.id,
      title,
      file_url,
      file_type,
      likes: 0,
      views: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving media to database:', error.message);
    throw new Error(error.message);
  }

  revalidatePath('/[locale]/gallery', 'page');
  revalidatePath('/[locale]/feed', 'page');
  revalidatePath('/[locale]/dashboard/media', 'page');

  return { success: true, data };
}

// 2. Paginated media fetcher (used by gallery)
export async function fetchPaginatedMedia(page: number = 0) {
  const supabase = await createClient();
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: media, error, count } = await supabase
    .from('media')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching media:', error.message);
    return { items: [], hasMore: false, totalCount: 0 };
  }

  const mediaWithComments = await Promise.all(
    (media || []).map(async (item) => {
      const { data: comments } = await supabase
        .from('comments')
        .select('*')
        .eq('media_id', item.id)
        .order('created_at', { ascending: true });
      return { ...item, comments: comments || [] };
    })
  );

  const hasMore = (count ?? 0) > to + 1;
  return { items: mediaWithComments, hasMore, totalCount: count ?? 0 };
}

// 3. likeMedia action (used by media page & gallery)
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

  // Send real-time notification
  if (ownerId && ownerId !== user.id) {
    const { error: notifError } = await supabase.from('notifications').insert({
      user_id: ownerId,
      title: `Someone liked your photo`,
      type: 'like',
      link: `/gallery`,
      is_read: false,
    });
    if (notifError) {
      console.error('NOTIFICATION ERROR:', notifError.message);
    }
  }

  revalidatePath('/[locale]/gallery', 'page');
  revalidatePath('/[locale]/feed', 'page');
  return true;
}

// 4. Generate tiny blur placeholder
export async function generateBlurDataUrl(fileBuffer: Buffer): Promise<string> {
  try {
    const resizedBuffer = await sharp(fileBuffer)
      .resize(10, 10, { fit: 'inside' })
      .toFormat('webp', { quality: 20 })
      .toBuffer();
    return `data:image/webp;base64,${resizedBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Failed to generate blur placeholder:', error);
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/+F9PQAI8wNPvd7POQAAAABJRU5ErkJggg==';
  }
}