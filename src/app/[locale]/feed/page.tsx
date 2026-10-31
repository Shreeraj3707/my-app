import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { CommentSection } from '@/components/comment-section';
import { likeMedia } from '@/app/actions/likes';

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let media: any[] = [];

  if (user) {
    const { data: follows } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id);

    const followingIds = follows?.map(f => f.following_id) || [];

    const { data: feedMedia } = await supabase
      .from('media')
      .select('*')
      .in('user_id', [...followingIds, user.id])
      .order('created_at', { ascending: false });

    media = feedMedia || [];
  }

  const isDiscoverMode = media.length === 0;
  
  if (isDiscoverMode) {
    const { data: discoverMedia } = await supabase
      .from('media')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    media = discoverMedia || [];
  }

  const mediaWithComments = await Promise.all(
    media.map(async (item) => {
      const { data: comments } = await supabase
        .from('comments')
        .select('*')
        .eq('media_id', item.id)
        .order('created_at', { ascending: true });
      return { ...item, comments: comments || [] };
    })
  );

  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4">{isDiscoverMode ? 'Discover' : 'Your Feed'}</h1>
        <p className="text-neutral-500 text-lg">
          {isDiscoverMode 
            ? "You aren't following anyone yet. Here are the latest uploads."
            : "The latest photos and videos from people you follow."}
        </p>
      </div>

      {mediaWithComments.length === 0 ? (
        <div className="text-center py-20 bg-neutral-100 dark:bg-neutral-900 rounded-3xl">
          <p className="text-neutral-500 text-lg mb-4">No media found.</p>
          <Link href="/dashboard/media" className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl">
            Upload the First Photo
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {mediaWithComments.map((item) => (
            <div 
              key={item.id} 
              className="bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm"
            >
              <div className="p-4 flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold overflow-hidden">
                   {item.user_id ? (
                     <Link href={`/profile/${item.user_id}`} className="w-full h-full flex items-center justify-center">
                        U
                     </Link>
                   ) : 'U'}
                </div>
                <div>
                  <p className="font-bold text-sm text-neutral-900 dark:text-white">User {item.user_id?.slice(0, 5)}</p>
                  <p className="text-xs text-neutral-500">{new Date(item.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {item.file_type === 'image' ? (
                <div className="relative w-full">
                  <Image src={item.file_url} alt={item.title} width={800} height={800} className="w-full h-auto object-cover" />
                </div>
              ) : (
                <video src={item.file_url} controls className="w-full bg-black" />
              )}

              <div className="p-4">
                <h3 className="font-bold text-lg text-neutral-900 dark:text-white mb-1">{item.title}</h3>
                
                <div className="flex items-center gap-4 text-sm mb-2">
                  {/* LIKE BUTTON FOR FEED */}
                  <form action={async () => {
                    'use server';
                    await likeMedia(item.id, item.user_id);
                  }}>
                    <button type="submit" className="flex items-center gap-1 text-red-500 hover:text-red-600 font-medium transition-transform active:scale-125">
                      ❤️ {item.likes || 0} Likes
                    </button>
                  </form>

                  <span className="text-neutral-500 flex items-center gap-1">👁️ {item.views || 0} Views</span>
                </div>
                
                <CommentSection mediaId={item.id} initialComments={item.comments} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}