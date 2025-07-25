// components/file-tree/file-tree-row.tsx

import { useCallback, useEffect } from "react";
import {
  FileTreeEntryProps,
  FileTreeRowProps,
} from "@/types/file-picker.types";
import { FileTreeRowLoading } from "@/components/file-tree/loading/file-tree-row";
import FileTreeItem from "@/components/file-tree/file-tree-item";
import { useFetchAndStoreResources } from "@/hooks/use-fetch-and-store-resources";
import { useFileTreeStore } from "@/store/use-file-tree-store";

export default function FileTreeRow({
  entry,
  isRoot = false,
  level = 0,
  resource,
  parentId,
  items = [],
}: FileTreeRowProps) {
  const { toggleExpandedPath, expandedPaths, getItems } = useFileTreeStore();

  // Use expandedPaths as the single source of truth
  const isOpen = expandedPaths.includes(entry.id);

  // Use the centralized hook to fetch children when directory is open
  const { isLoading } = useFetchAndStoreResources({
    path: entry.path,
    resource,
    parentId: entry.id,
    enabled: isOpen && entry.type === "directory",
  });

  // Get children from store
  const childItems = getItems(entry.id);

  const toggleFolder = useCallback(() => {
    toggleExpandedPath(entry.id, !isOpen);
  }, [entry.id, isOpen, toggleExpandedPath]);

  // Render children recursively
  const renderChildren = isOpen
    ? childItems.map((item) => {
        return (
          <FileTreeRow
            key={item.id}
            entry={item}
            level={level + 1}
            resource={resource}
            parentId={entry.id}
            items={childItems}
          />
        );
      })
    : [];

  if (isRoot) {
    return (
      <>
        {isLoading && <FileTreeRowLoading />}
        {items.map((item) => (
          <FileTreeRow
            key={item.id}
            entry={item}
            level={0}
            resource={resource}
            parentId="/"
            items={items}
          />
        ))}
      </>
    );
  }

  return (
    <>
      <FileTreeItem
        entry={entry}
        isOpen={isOpen}
        toggleFolder={toggleFolder}
        level={level}
        parentId={parentId}
      />

      {isLoading && <FileTreeRowLoading />}
      {renderChildren}
    </>
  );
}
