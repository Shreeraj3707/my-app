'use server';

import { createClient } from '@/lib/supabase/server';

export async function searchEverything(query: string) {
  if (!query || query.trim() === '') return { users: [], media: [] };

  const supabase = await createClient();
  const searchTerm = `%${query}%`;

  // 1. Search for users (profiles)
  const { data: users } = await supabase
    .from('profiles')
    .select('id, full_name, email, avatar_url')
    .ilike('full_name', searchTerm)
    .limit(3);

  // 2. Search for media (photos/videos)
  const { data: media } = await supabase
    .from('media')
    .select('id, title, file_url, file_type')
    .ilike('title', searchTerm)
    .limit(5);

  return {
    users: users || [],
    media: media || [],
  };
}