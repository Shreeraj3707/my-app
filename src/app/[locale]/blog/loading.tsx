export default function BlogLoading() {
  return (
    <div className="w-full max-w-3xl space-y-8 animate-pulse">
      {/* Title Skeleton */}
      <div className="space-y-4">
        <div className="h-10 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-1/3"></div>
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-lg w-2/3"></div>
      </div>

      {/* List Skeletons */}
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl space-y-4"
          >
            <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-5/6"></div>
            
            <div className="flex justify-between pt-4">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-20"></div>
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}