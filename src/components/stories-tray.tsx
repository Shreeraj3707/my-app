'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UserStoryGroup, postStory } from '@/app/actions/stories';
import { StoryViewer } from '@/components/story-viewer';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function StoriesTray({ initialGroups }: { initialGroups: UserStoryGroup[] }) {
  const [selectedGroup, setSelectedGroup] = useState<UserStoryGroup | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleCreateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a photo for your story');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `story-${Date.now()}.${fileExt}`;
      const filePath = `stories/${fileName}`;

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data } = supabase.storage.from('media').getPublicUrl(filePath);

      // 3. Post story to database
      await postStory(data.publicUrl, caption);

      toast.success('Your story is live for 24 hours! 🎉');
      setIsAddOpen(false);
      setFile(null);
      setPreview(null);
      setCaption('');
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to publish story');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full mb-8">
      {/* Horizontal Tray */}
      <div className="flex items-center gap-5 overflow-x-auto pb-3 pt-1 scrollbar-none">
        
        {/* (+) Add Story Button */}
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none"
        >
          <div className="relative w-16 h-16 rounded-full p-[2px] border-2 border-dashed border-neutral-400 dark:border-neutral-700 flex items-center justify-center group-hover:border-indigo-500 transition-colors">
            <div className="w-full h-full rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xl text-neutral-600 dark:text-neutral-300 group-hover:scale-105 transition-transform">
              +
            </div>
          </div>
          <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 truncate max-w-[64px]">
            Your Story
          </span>
        </button>

        {/* Existing Story Rings */}
        {initialGroups.map((group) => (
          <button
            key={group.userId}
            type="button"
            onClick={() => setSelectedGroup(group)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0 group focus:outline-none"
          >
            <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 group-hover:scale-105 transition-transform shadow-sm">
              <div className="w-full h-full rounded-full bg-white dark:bg-neutral-950 p-[2px]">
                <div className="w-full h-full rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold text-sm">
                  {group.userEmail[0].toUpperCase()}
                </div>
              </div>
            </div>
            <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200 truncate max-w-[64px]">
              {group.userEmail}
            </span>
          </button>
        ))}
      </div>

      {/* Story Viewer Modal */}
      {selectedGroup && (
        <StoryViewer
          storyGroup={selectedGroup}
          onClose={() => setSelectedGroup(null)}
        />
      )}

      {/* Add Story Pop-up Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Add to Your Story</h3>

            <form onSubmit={handleCreateStory} className="space-y-4">
              <div className="relative border-2 border-dashed border-neutral-700 rounded-2xl h-52 flex items-center justify-center overflow-hidden hover:border-indigo-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {preview ? (
                  <Image src={preview} alt="Story Preview" fill className="object-cover" />
                ) : (
                  <div className="text-center text-neutral-500 p-4">
                    <p className="text-2xl mb-1">📸</p>
                    <p className="text-xs font-semibold">Tap to choose a photo</p>
                  </div>
                )}
              </div>

              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption... (optional)"
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />

              <button
                type="submit"
                disabled={uploading || !file}
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-white text-xs font-bold rounded-xl shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  'Share to Story'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}