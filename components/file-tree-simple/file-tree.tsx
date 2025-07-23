"use client";

import React, { useEffect, useRef } from "react";
import FileTreeRow from "@/components/file-tree-simple/file-tree-row";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileTreeProps } from "@/types/file-picker.types";
import { useFilePickerStore } from "@/store/use-file-picker-store";
import { cn, rootEntry } from "@/lib/utils";
import { FileTreeRowLoading } from "./loading/file-tree-row";
import { CheckedState } from "@radix-ui/react-checkbox";

export default function FileTree({
  viewOnly = false,
  resource,
  type,
  disabled = false,
}: FileTreeProps) {
  const { allSelected, selectAll } = useFilePickerStore();
  const tableRef = useRef<HTMLTableSectionElement>(null);
  const handleSelectAll = (newState: CheckedState) => {
    const allItems = tableRef.current?.querySelectorAll(
      "[data-id][data-level='1']"
    );
    const ids = Array.from(allItems).map((item) =>
      item.getAttribute("data-id")
    );

    selectAll(ids, newState);
  };

  return (
    <ScrollArea className="h-full max-h-[92%] w-full">
      <div className={cn("border rounded-xs", disabled && "opacity-50")}>
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/70 text-sm">
              {!viewOnly && (
                <th className="w-10 p-3 text-left">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                </th>
              )}
              <th className="p-3 text-left text-sm pl-6 max-w-80">Name</th>
              <th className="p-3 text-right text-sm">Status</th>
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
                viewOnly={viewOnly === true || viewOnly === undefined}
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
