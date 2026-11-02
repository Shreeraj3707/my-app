'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { saveMediaToDatabase } from '@/app/actions/media';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export function MediaUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select an image or video to upload.');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // 1. Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      const fileType = file.type.startsWith('video') ? 'video' : 'image';

      // 3. Save to database using our Server Action
      await saveMediaToDatabase({
        title: title || file.name,
        file_url: urlData.publicUrl,
        file_type: fileType,
      });

      toast.success('Media uploaded successfully!');
      setFile(null);
      setTitle('');
      setPreview(null);
    } catch (err: any) {
      console.error('Upload failed:', err);
      toast.error(err.message || 'Failed to upload media.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-neutral-900 dark:text-white">
        Upload New Media
      </h2>

      <form onSubmit={handleUpload} className="space-y-4">
        {/* Title Input with suppressHydrationWarning to stop autofill extension errors */}
        <div>
          <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">
            Media Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., My Vacation Photo"
            className="w-full px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            suppressHydrationWarning
          />
        </div>

        {/* File Drop Area */}
        <div>
          <label className="block text-xs font-semibold uppercase text-neutral-500 mb-1">
            File (Photo or Video)
          </label>
          <div className="relative border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-4 text-center hover:border-indigo-500 transition-colors">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              suppressHydrationWarning
            />
            {preview ? (
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-black">
                {file?.type.startsWith('video') ? (
                  <video src={preview} controls className="w-full h-full object-cover" />
                ) : (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                )}
              </div>
            ) : (
              <div className="py-6 text-neutral-500">
                <p className="text-sm font-medium">Click or drag file here to upload</p>
                <p className="text-xs text-neutral-400 mt-1">PNG, JPG, MP4 up to 50MB</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={uploading}
          suppressHydrationWarning
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading...
            </>
          ) : (
            'Upload Media'
          )}
        </button>
      </form>
    </div>
  );
}