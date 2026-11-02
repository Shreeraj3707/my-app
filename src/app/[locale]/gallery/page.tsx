import { createClient } from '@/lib/supabase/server';
import { Link } from '@/i18n/navigation';
import { GalleryGrid } from '@/components/gallery-grid';

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
        <GalleryGrid mediaWithComments={mediaWithComments} />
      )}
    </div>
  );
}