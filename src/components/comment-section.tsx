'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addComment } from '@/app/actions/comments';
import { toast } from 'sonner';
import { Link } from '@/i18n/navigation';

type Comment = {
  id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
};

export function CommentSection({ mediaId, initialComments }: { mediaId: string, initialComments: Comment[] }) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      await addComment(mediaId, content);
      setComments([...comments, {
        id: Date.now().toString(),
        user_id: 'temp',
        user_name: 'You',
        content: content,
        created_at: new Date().toISOString()
      }]);
      setContent('');
      toast.success('Comment added!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 border-t border-neutral-100 dark:border-neutral-800 pt-3">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline mb-2"
      >
        💬 {comments.length} Comments
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
              {comments.map((comment) => (
                <div key={comment.id} className="text-sm">
                  <Link href={`/profile/${comment.user_id}`} className="font-bold text-neutral-900 dark:text-white hover:underline">
                    {comment.user_name}
                  </Link>
                  <span className="text-neutral-600 dark:text-neutral-400">: {comment.content}</span>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-sm text-neutral-500 italic">No comments yet. Be the first!</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-1.5 text-sm bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:outline-none text-neutral-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-3 py-1.5 text-sm bg-black dark:bg-white text-white dark:text-black font-bold rounded-lg disabled:opacity-50"
              >
                Post
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}