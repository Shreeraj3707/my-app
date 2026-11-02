'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { UserStoryGroup } from '@/app/actions/stories';

export function StoryViewer({
  storyGroup,
  onClose,
}: {
  storyGroup: UserStoryGroup;
  onClose: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentStory = storyGroup.stories[currentIndex];

  // Auto-advance to next story after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < storyGroup.stories.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onClose();
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, storyGroup.stories.length, onClose]);

  // Handle tap left / right navigation
  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isRightSide = x > rect.width / 2;

    if (isRightSide) {
      if (currentIndex < storyGroup.stories.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onClose();
      }
    } else {
      if (currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-50 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          ✕
        </button>

        {/* Story Phone Frame */}
        <div 
          onClick={handleTap}
          className="relative w-full max-w-sm h-[82vh] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 cursor-pointer select-none"
        >
          {/* Top Progress Segment Bars */}
          <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
            {storyGroup.stories.map((story, idx) => (
              <div key={story.id} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                {idx < currentIndex && <div className="h-full bg-white w-full" />}
                {idx === currentIndex && (
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                    className="h-full bg-white"
                  />
                )}
              </div>
            ))}
          </div>

          {/* User Header */}
          <div className="absolute top-6 left-4 right-4 z-30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-pink-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
              {storyGroup.userEmail[0].toUpperCase()}
            </div>
            <div>
              <p className="text-white text-xs font-bold drop-shadow">
                {storyGroup.userEmail}
              </p>
              <p className="text-[10px] text-white/70 drop-shadow">
                {new Date(currentStory.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          {/* Story Image / Video Media */}
          <div className="relative w-full h-full">
            <Image
              src={currentStory.media_url}
              alt="Story"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Caption (if any) */}
          {currentStory.caption && (
            <div className="absolute bottom-6 left-4 right-4 z-30 text-center">
              <span className="inline-block px-4 py-2 bg-black/60 backdrop-blur-md rounded-2xl text-white text-xs font-medium">
                {currentStory.caption}
              </span>
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}