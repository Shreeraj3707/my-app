'use client';

import Image from 'next/image';
import { CommentSection } from '@/components/comment-section';
import { likeMedia } from '@/app/actions/likes';
import { toast } from 'sonner';

export function GalleryGrid({ mediaWithComments = [] }: { mediaWithComments: any[] }) {
  
  const handleLike = async (mediaId: string, ownerId: string) => {
    try {
      await likeMedia(mediaId, ownerId);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!mediaWithComments || mediaWithComments.length === 0) {
    return (
      <div className="text-center py-20 bg-neutral-100 dark:bg-neutral-900 rounded-3xl">
        <p className="text-neutral-500 text-lg">No media has been uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
      {mediaWithComments.map((item) => (
        <div 
          key={item.id} 
          className="break-inside-avoid bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
        >
          {item.file_type === 'image' ? (
            <div className="relative w-full min-h-[200px]">
              <Image 
                src={item.file_url} 
                alt={item.title} 
                width={500} 
                height={500} 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
          ) : (
            <video src={item.file_url} controls className="w-full h-auto bg-black" />
          )}
          
          <div className="p-4">
            <h3 className="font-bold text-neutral-900 dark:text-white truncate">{item.title}</h3>
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-neutral-500" suppressHydrationWarning>
                {new Date(item.created_at).toLocaleDateString()}
              </span>
              
              <div className="flex items-center gap-3 text-xs">
                <span className="text-neutral-500 flex items-center gap-1">
                  👁️ {item.views || 0}
                </span>
                
                <button 
                  onClick={() => handleLike(item.id, item.user_id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600 font-medium transition-transform active:scale-125"
                >
                  ❤️ {item.likes || 0}
                </button>
              </div>
            </div>
            
            <CommentSection mediaId={item.id} initialComments={item.comments} />
          </div>
        </div>
      ))}
    </div>
  );
}