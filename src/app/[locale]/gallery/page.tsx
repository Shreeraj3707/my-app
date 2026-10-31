import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { CommentSection } from '@/components/comment-section';
import { likeMedia } from '@/app/actions/likes';

export default async function GalleryPage() {
  const supabase = await createClient();
  
  const { data: media } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });

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

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4">Public Gallery</h1>
        <p className="text-neutral-500 text-lg">Explore photos and videos shared by our community.</p>
      </div>

      {mediaWithComments.length === 0 ? (
        <div className="text-center py-20 bg-neutral-100 dark:bg-neutral-900 rounded-3xl">
          <p className="text-neutral-500 text-lg mb-4">No media has been uploaded yet.</p>
          <Link href="/dashboard/media" className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl">
            Upload the First Photo
          </Link>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {mediaWithComments.map((item) => (
            <div key={item.id} className="break-inside-avoid bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
              {item.file_type === 'image' ? (
                <div className="relative w-full min-h-[200px]">
                  <Image src={item.file_url} alt={item.title} width={500} height={500} className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <video src={item.file_url} controls className="w-full h-auto bg-black" />
              )}
              
              <div className="p-4">
                <h3 className="font-bold text-neutral-900 dark:text-white truncate">{item.title}</h3>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-neutral-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                  
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-neutral-500 flex items-center gap-1">
                      👁️ {item.views || 0}
                    </span>
                    
                    <form action={async () => {
                      'use server';
                      await likeMedia(item.id, item.user_id);
                    }}>
                      <button type="submit" className="flex items-center gap-1 text-red-500 hover:text-red-600 font-medium transition-transform active:scale-125">
                        ❤️ {item.likes || 0}
                      </button>
                    </form>
                  </div>
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