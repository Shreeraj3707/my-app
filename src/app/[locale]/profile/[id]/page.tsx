import { createClient } from '@/lib/supabase/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { followUser, unfollowUser, isFollowing } from '@/app/actions/follows';
import { revalidatePath } from 'next/cache';

export default async function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user: currentUser } } = await supabase.auth.getUser();
  const isOwnProfile = currentUser?.id === id;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !profile) {
    return notFound();
  }

  const { data: media } = await supabase
    .from('media')
    .select('*')
    .eq('user_id', id)
    .order('created_at', { ascending: false });

  const { count: followerCount } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('following_id', id);
  const { count: followingCount } = await supabase.from('follows').select('*', { count: 'exact', head: true }).eq('follower_id', id);
  
  const alreadyFollowing = !isOwnProfile && await isFollowing(id);

  async function toggleFollow() {
    'use server';
    if (alreadyFollowing) {
      await unfollowUser(id);
    } else {
      await followUser(id);
    }
    revalidatePath(`/[locale]/profile/${id}`, 'page');
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-6">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-12 bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-8 rounded-3xl shadow-sm">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500 shrink-0">
          {profile.avatar_url ? (
            <Image src={profile.avatar_url} alt={profile.full_name} width={128} height={128} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-4xl font-bold text-indigo-500">
              {profile.full_name?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
        </div>
        
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white mb-2">
            {profile.full_name || 'Anonymous User'}
          </h1>
          <p className="text-neutral-500 mb-3">{profile.email}</p>
          
          <div className="flex items-center justify-center md:justify-start gap-6 mb-4 text-sm">
            <span className="text-neutral-700 dark:text-neutral-300"><strong className="text-neutral-900 dark:text-white">{followerCount || 0}</strong> Followers</span>
            <span className="text-neutral-700 dark:text-neutral-300"><strong className="text-neutral-900 dark:text-white">{followingCount || 0}</strong> Following</span>
          </div>

          <p className="text-neutral-600 dark:text-neutral-400 max-w-lg mb-4">
            {profile.bio || "This user hasn't added a bio yet."}
          </p>

          {!isOwnProfile && (
            <div className="flex items-center justify-center md:justify-start gap-3">
              <form action={toggleFollow}>
                <button className={`px-6 py-2 rounded-xl font-bold transition-colors ${
                  alreadyFollowing 
                    ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}>
                  {alreadyFollowing ? 'Unfollow' : 'Follow'}
                </button>
              </form>
              
              <Link 
                href={`/chat/${id}`}
                className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                Message
              </Link>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-neutral-900 dark:text-white">
        Gallery ({media?.length || 0})
      </h2>

      {media?.length === 0 ? (
        <p className="text-neutral-500">No media uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media?.map((item) => (
            <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden group bg-neutral-200 dark:bg-neutral-800">
              {item.file_type === 'image' ? (
                <Image src={item.file_url} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 50vw, 25vw" />
              ) : (
                <video src={item.file_url} className="w-full h-full object-cover" controls />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="text-white text-sm font-medium truncate">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}