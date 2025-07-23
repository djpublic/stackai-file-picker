"use client";

import React, { useRef } from "react";
import FileTreeRow from "@/components/file-tree/file-tree-row";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileTreeProps } from "@/types/file-picker.types";
import { useFileTreeStore } from "@/store/use-file-tree-store";
import { cn, rootEntry } from "@/lib/utils";
import { FileTreeRowLoading } from "./loading/file-tree-row";
import { CheckedState } from "@radix-ui/react-checkbox";

export default function FileTree({
  resource,
  type,
  disabled = false,
}: FileTreeProps) {
  const { allSelected, selectAll } = useFileTreeStore();
  const tableRef = useRef<HTMLTableSectionElement>(null);
  const handleSelectAll = (newState: CheckedState) => {
    // Get ONLY level 1 items for main selector
    const level1Items = tableRef.current?.querySelectorAll("[data-id]");

    // Convert to SelectedItem objects with parentId information
    const items = Array.from(level1Items)
      .map((item) => {
        const id = item.getAttribute("data-id");
        const parentId = item.getAttribute("data-parent-id") || undefined;
        return id ? { id, parentId } : null;
      })
      .filter(Boolean) as { id: string; parentId: string | undefined }[];

    // Only select/unselect level 1 items when using main selector
    selectAll(items, newState, true);
  };

  return (
    <ScrollArea className="h-full max-h-[92%] w-full">
      <div className={cn("border rounded-xs", disabled && "opacity-50")}>
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/70 text-sm">
              <th className="w-10 p-3 text-left">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
              </th>
              <th className="p-3 text-left text-sm pl-6 max-w-80">Name</th>
              <th className="p-3 text-right text-sm">Actions</th>
            </tr>
          </thead>
          <tbody ref={tableRef}>
            {!resource.knowledgeBaseId ? (
              <FileTreeRowLoading />
            ) : (
              <FileTreeRow
                type={type}
                resource={resource}
                isRoot
                expanded={true}
                entry={rootEntry}
              />
            )}
          </tbody>
        </table>
      </div>
    </ScrollArea>
  );
}
