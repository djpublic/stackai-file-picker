"use client";

import { Skeleton } from "../ui/skeleton";

interface PageHeaderProps {
  title?: string;
  isLoading: boolean;
}

export default function PageHeader({
  title = "Knowledge Base",
  isLoading,
}: PageHeaderProps) {
  return (
    <div className="w-full p-8 bg-white dark:bg-slate-800 rounded-xl shadow flex gap-6 h-full border-b mb-6">
      <div
        className="tracking-tight text-slate-900 dark:text-slate-100 flex flex-row justify-between w-full flex-wrap"
        aria-label={`Update Knowledge Base: ${title}`}
      >
        {isLoading ? (
          <Skeleton className="w-full h-10 rounded" />
        ) : (
          <h1 className="text-2xl lg:text-3xl font-bold">
            Knowledge Bases / <strong>{title}</strong>
          </h1>
        )}
      </div>
    </div>
  );
}
