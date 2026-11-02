'use server';

import { createClient } from '@/lib/supabase/server';
import { createEmbedding } from '@/lib/embeddings';

export async function searchMediaByMeaning(query: string = '') {
  const supabase = await createClient();
  const trimmed = query.trim();

  try {
    // 1. If search term is empty, return the 6 most recent photos immediately
    if (!trimmed) {
      const { data: recent } = await supabase
        .from('media')
        .select('id, title, file_url, file_type, likes, created_at')
        .order('created_at', { ascending: false })
        .limit(6);

      return (recent || []).map((item) => ({ ...item, similarity: 1.0 }));
    }

    // 2. Try fast vector search with 1.5s timeout guard
    const embeddingPromise = createEmbedding(trimmed);
    const timeoutPromise = new Promise<number[]>((resolve) => setTimeout(() => resolve([]), 1500));
    const queryEmbedding = await Promise.race([embeddingPromise, timeoutPromise]);

    if (queryEmbedding && queryEmbedding.length > 0) {
      const { data: vectorData, error } = await supabase.rpc('match_media', {
        query_embedding: queryEmbedding,
        match_threshold: 0.1,
        match_count: 8,
      });

      if (!error && vectorData && vectorData.length > 0) {
        return vectorData;
      }
    }

    // 3. Fallback: Instant database title search (supports Marathi / Hindi / English characters)
    const { data: fallbackData } = await supabase
      .from('media')
      .select('id, title, file_url, file_type, likes, created_at')
      .ilike('title', `%${trimmed}%`)
      .limit(8);

    if (fallbackData && fallbackData.length > 0) {
      return fallbackData.map((item) => ({ ...item, similarity: 0.95 }));
    }

    // 4. If nothing matches the exact term, return latest photos so user always sees content
    const { data: fallbackAll } = await supabase
      .from('media')
      .select('id, title, file_url, file_type, likes, created_at')
      .order('created_at', { ascending: false })
      .limit(4);

    return (fallbackAll || []).map((item) => ({ ...item, similarity: 0.5 }));
  } catch (err) {
    console.error('Search action caught error:', err);
    return [];
  }
}

export async function searchEverything(query: string) {
  return searchMediaByMeaning(query);
}

export async function updateMediaEmbedding(mediaId: string, title: string) {
  try {
    const supabase = await createClient();
    const embedding = await createEmbedding(title);

    if (embedding.length > 0) {
      await supabase.from('media').update({ embedding }).eq('id', mediaId);
    }
  } catch (error) {
    console.warn('Embedding update skipped:', error);
  }
}