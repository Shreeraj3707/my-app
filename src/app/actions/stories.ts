'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface StoryItem {
  id: string;
  user_id: string;
  media_url: string;
  caption?: string;
  created_at: string;
}

export interface UserStoryGroup {
  userId: string;
  userEmail: string;
  stories: StoryItem[];
}

// 1. Fetch all active stories grouped by user
export async function getActiveStories(): Promise<UserStoryGroup[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: true });

  if (error || !data) return [];

  // Group stories by user
  const grouped: { [key: string]: StoryItem[] } = {};
  data.forEach((story) => {
    if (!grouped[story.user_id]) grouped[story.user_id] = [];
    grouped[story.user_id].push(story);
  });

  return Object.keys(grouped).map((userId) => ({
    userId,
    userEmail: `User ${userId.slice(0, 5)}`,
    stories: grouped[userId],
  }));
}

// 2. Post a new 24h story
export async function postStory(mediaUrl: string, caption?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Must be logged in to post stories');

  const { error } = await supabase.from('stories').insert({
    user_id: user.id,
    media_url: mediaUrl,
    caption: caption || null,
  });

  if (error) throw new Error(error.message);

  revalidatePath('/[locale]/feed', 'page');
  return true;
}