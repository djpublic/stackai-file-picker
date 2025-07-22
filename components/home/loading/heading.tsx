import { Skeleton } from "@/components/ui/skeleton";

function HeadingLoading() {
  return (
    <div className="max-w-md w-full p-8 bg-white dark:bg-slate-800 rounded-xl shadow flex flex-col gap-6 h-full">
      {/* Title skeleton */}
      <Skeleton className="w-30 h-10 rounded" />
      <Skeleton className="w-full h-30 rounded" />
      {/* Subtitle skeleton */}
      <Skeleton className="w-2/3 h-6 rounded" />
      {/* Description skeleton */}
      {/* File info skeleton */}
      <div className="flex flex-col gap-2 mt-3">
        <Skeleton className="w-1/3 h-4 rounded" />
        <Skeleton className="w-2/3 h-4 rounded" />
        <Skeleton className="w-2/3 h-4 rounded" />
      </div>
      {/* Button skeleton */}
      <div className="flex justify-start mt-2">
        <Skeleton className="w-35 h-11 rounded-md" />
      </div>
    </div>
  );
}

export { HeadingLoading };
