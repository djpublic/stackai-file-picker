"use client";

import { Button } from "@/components/ui/button";
import { FileSymlink } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
  const headerRef = useRef<HTMLDivElement>(null);
  const [showStickyButton, setShowStickyButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const rect = headerRef.current.getBoundingClientRect();
        // Show sticky button when original header is scrolled past (bottom edge above viewport)
        setShowStickyButton(rect.bottom < 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const buttonContent = (
    <>
      <FileSymlink className="h-5 w-5" />
      Replace with {selectedItems.length} selected file
      {selectedItems.length === 1 ? "" : "s"}
    </>
  );

  return (
    <>
      <div
        ref={headerRef}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2"
      >
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
            {buttonContent}
          </Button>
        </div>
      </div>

      {/* Sticky bottom button - appears when scrolled past original */}
      {showStickyButton && selectedItems.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Button
            onClick={onUpdate}
            size="lg"
            disabled={isLoading}
            className="gap-2 cursor-pointer text-md shadow-lg border border-border h-15 px-4"
          >
            {buttonContent}
          </Button>
        </div>
      )}
    </>
  );
}
