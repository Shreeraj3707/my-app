export default function DashboardLoading() {
  return (
    <div className="w-full space-y-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4"></div>
        <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 space-y-4">
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2"></div>
            <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4"></div>
            <div className="h-1 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
          </div>
        ))}
      </div>

      <div className="h-96 bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8">
         <div className="h-6 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4 mb-4"></div>
         <div className="h-full bg-neutral-200 dark:bg-neutral-800 rounded-xl opacity-50"></div>
      </div>
    </div>
  );
}