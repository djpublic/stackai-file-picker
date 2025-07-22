"use client";

import { Button } from "@/components/ui/button";
import { KnowledgeBaseProps } from "@/types/file-picker.types";
import { bytesToHumanReadable, formatDateTime } from "@/lib/utils";
import { FileSymlink } from "lucide-react";
import { HeadingLoading } from "./loading/heading";
import Image from "next/image";

interface PickerAreaProps {
  onOpenFilePicker: () => void;
  data: KnowledgeBaseProps;
  isLoading: boolean;
}

export default function PickerArea({
  onOpenFilePicker,
  data,
  isLoading,
}: PickerAreaProps) {
  if (isLoading) {
    return <HeadingLoading />;
  }

  return (
    <div className="w-full p-8 bg-white dark:bg-slate-800 rounded-xl shadow flex flex-col gap-6 h-full border-b">
      <div className="text-center lg:text-left">
        <h1
          className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex flex-col"
          aria-label={`Update Knowledge Base: ${data?.name}`}
        >
          <div className="flex items-center gap-3 mb-5">
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
          Update <strong>{data?.name}</strong>
        </h1>

        <p className="text-base lg:text-lg text-slate-600 dark:text-slate-400 pt-4 mb-6 lg:mb-8">
          {data?.description}
        </p>

        <div className="text-sm text-slate-600 dark:text-slate-400 mb-6 lg:mb-8">
          <strong>{data?.totalFiles}</strong> resources with{" "}
          {bytesToHumanReadable(data?.totalSize)}.
          <br />
          <strong>ID:</strong> <span className="text-xs">{data?.id}</span>
          <br />
          <strong>Last update:</strong>{" "}
          <span className="text-xs">{formatDateTime(data?.lastUpdate)}</span>
        </div>

        <Button
          onClick={onOpenFilePicker}
          size="lg"
          disabled={isLoading}
          className="gap-2 lg:w-40 cursor-pointer text-md"
        >
          <FileSymlink className="h-5 w-5" />
          Change Files
        </Button>
      </div>
    </div>
  );
}
