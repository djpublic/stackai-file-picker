"use client";

import { Button } from "@/components/ui/button";
import { FileSymlink } from "lucide-react";

import { useFileTreeStore } from "@/store/use-file-tree-store";
import Image from "next/image";

interface FileTreeHeaderProps {
  onUpdate?: () => void;
  isLoading?: boolean;
}

export default function FileTreeHeader({
  onUpdate,
  isLoading,
}: FileTreeHeaderProps) {
  const selectedItems = useFileTreeStore((state) => state.selectedItems);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
      <div>
        <div className="flex items-center gap-3">
          <Image
            src="https://stack-us-east-1.onrender.com/integrations/gdrive/icon/icon.svg"
            alt="" // Ignores from screen readers
            className="h-6 w-6"
            width={20}
            height={20}
          />
          <span className="text-sm text-slate-600 dark:text-slate-400 font-bold">
            Google Drive connection
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Select the files you want to index from your Gdrive.
        </p>
      </div>

      <div className="gap-2">
        <Button
          onClick={onUpdate}
          size="lg"
          disabled={isLoading || !selectedItems.length}
          className="gap-2 cursor-pointer text-md"
        >
          <FileSymlink className="h-5 w-5" />
          Replace with {selectedItems.length} selected file
          {selectedItems.length === 1 ? "" : "s"}
        </Button>
      </div>
    </div>
  );
}
