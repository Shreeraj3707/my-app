import { getActiveStories } from '@/app/actions/stories';
import { StoriesTray } from '@/components/stories-tray';

export default async function FeedPage() {
  const activeStories = await getActiveStories();

  return (
    <div className="w-full max-w-xl mx-auto py-8 px-4">
      {/* 📸 24-Hour Stories Bar */}
      <StoriesTray initialGroups={activeStories} />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white">Your Feed</h1>
        <p className="text-neutral-500 text-sm mt-1">The latest photos and videos from people you follow.</p>
      </div>

      {/* Your existing feed posts list remains below here... */}
    </div>
  );
}