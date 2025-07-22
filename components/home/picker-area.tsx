"use client";

import { KnowledgeBaseProps } from "@/types/file-picker.types";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";

interface PickerAreaProps {
  data: KnowledgeBaseProps;
  isLoading: boolean;
}

export default function PickerArea({ data, isLoading }: PickerAreaProps) {
  return (
    <div className="w-full p-8 bg-white dark:bg-slate-800 rounded-xl shadow flex gap-6 h-full border-b mb-6">
      <h1
        className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex flex-row justify-between w-full flex-wrap"
        aria-label={`Update Knowledge Base: ${data?.name}`}
      >
        {isLoading ? (
          <Skeleton className="w-full h-10 rounded" />
        ) : (
          <>
            <div>
              Knowledge Bases / <strong>{data?.name}</strong>
            </div>

            <div className="flex items-center gap-3 self-end">
              <Image
                src="https://stack-us-east-1.onrender.com/integrations/gdrive/icon/icon.svg"
                alt="" // Ignores from screen readers
                className="h-8 w-8 lg:h-10 lg:w-10"
                width={30}
                height={30}
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Google Drive connection
              </span>
            </div>
          </>
        )}
      </h1>
    </div>
  );
}
