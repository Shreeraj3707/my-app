'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { saveMediaToDatabase } from '@/app/actions/media';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export function MediaUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const supabase = createClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return toast.error('Please provide a title and a file.');

    setIsUploading(true);
    setProgress(10);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const fileType = file.type.startsWith('video') ? 'video' : 'image';

      // 1. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      setProgress(60);

      // 2. Get Public URL
      const { data } = supabase.storage.from('media').getPublicUrl(filePath);
      
      // 3. Save to Database
      await saveMediaToDatabase(title, data.publicUrl, fileType);
      setProgress(100);

      toast.success('Media uploaded successfully!');
      setFile(null);
      setTitle('');
      
      // Reset the file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (error: any) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="w-full max-w-md bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold mb-4 text-neutral-900 dark:text-white">Upload Media</h2>
      
      <form onSubmit={handleUpload} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., My Vacation Photo"
            className="w-full px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none text-neutral-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">File (Image or Video)</label>
          <input
            id="file-upload"
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            className="w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            required
          />
        </div>

        {isUploading && (
          <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2.5 mt-4">
            <motion.div 
              className="bg-indigo-600 h-2.5 rounded-full" 
              initial={{ width: 0 }} 
              animate={{ width: `${progress}%` }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isUploading}
          className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {isUploading ? 'Uploading...' : 'Upload Media'}
        </button>
      </form>
    </div>
  );
}