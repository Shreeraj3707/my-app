import { MediaUploader } from '@/components/media-uploader';
import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import { likeMedia } from '@/app/actions/media';

export default async function MediaPage() {
  const supabase = await createClient();
  
  const { data: media } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="w-full space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-white">Media Library</h1>
        <p className="text-neutral-600 dark:text-neutral-400">Upload and manage your photos and videos.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3">
          <MediaUploader />
        </div>

        <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {media?.length === 0 && (
            <p className="text-neutral-500 col-span-full">No media uploaded yet.</p>
          )}
          
          {media?.map((item) => (
            <div key={item.id} className="bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
              {item.file_type === 'image' ? (
                <div className="relative w-full h-48">
                   <Image src={item.file_url} alt={item.title} fill className="object-cover" />
                </div>
              ) : (
                <video src={item.file_url} controls className="w-full h-48 object-cover bg-black" />
              )}
              
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-white truncate">{item.title}</h3>
                  <p className="text-xs text-neutral-500 mt-1">{new Date(item.created_at).toLocaleDateString()}</p>
                </div>
                
                <div className="flex items-center justify-between mt-4 border-t border-neutral-100 dark:border-neutral-800 pt-3">
                  <span className="text-xs text-neutral-500 flex items-center gap-1">
                    👁️ {item.views || 0} views
                  </span>
                  
                  <form action={async () => {
                    'use server';
                    await likeMedia(item.id, item.likes || 0);
                  }}>
                    <button className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600 transition-colors">
                      ❤️ {item.likes || 0}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}