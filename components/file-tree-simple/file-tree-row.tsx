import { useCallback, useState } from "react";
import { FileTreeRowProps } from "@/types/file-picker.types";
import { FileTreeRowLoading } from "@/components/file-tree-simple/loading/file-tree-row";
import FileTreeItem from "@/components/file-tree-simple/file-tree-item";
import { useFetchResources } from "@/hooks/use-fetch-resource";
import {
  enhanceItems,
  getConnectionResourceUrl,
  sortFilesAndFolders,
} from "@/lib/utils";
import { useFilePickerStore } from "@/store/use-file-picker-store";

export default function FileTreeRow({
  type,
  entry,
  isRoot = false,
  viewOnly = false,
  expanded = false,
  level = 0,
  resource,
}: FileTreeRowProps) {
  const { toggleExpandedPath, expandedPaths } = useFilePickerStore();
  const isOpen = expandedPaths.includes(entry.path) || expanded;
  const shouldLoadResource = type !== "knowledge-base";

  // Sync status in Knowledge Base
  const { data: kbFolderData, isLoading: isKbLoading } = useFetchResources(
    getConnectionResourceUrl(resource, entry.path, "knowledge-base"),
    isOpen
  );

  const { data: folderData, isLoading } = useFetchResources(
    getConnectionResourceUrl(resource, entry.id, "connection-resource"),
    isOpen && shouldLoadResource
  );

  const toggleFolder = useCallback(() => {
    toggleExpandedPath(entry.path, !isOpen);
  }, [entry.path, isOpen, toggleExpandedPath]);

  const loading = isLoading || isKbLoading;

  const items =
    isOpen && !loading
      ? sortFilesAndFolders(
          enhanceItems(type, kbFolderData?.normalized, folderData?.normalized)
        )
      : [];

  const renderChildren = items.map((item) => {
    return (
      <FileTreeRow
        type={type}
        key={item.id}
        entry={item}
        viewOnly={viewOnly}
        level={level + 1}
        resource={resource}
      />
    );
  });

  if (isRoot) {
    return (
      <>
        {loading && <FileTreeRowLoading />}
        {renderChildren}
      </>
    );
  }

  return (
    <>
      <FileTreeItem
        entry={entry}
        viewOnly={viewOnly}
        isOpen={isOpen}
        toggleFolder={toggleFolder}
        level={level}
      />

      {loading && <FileTreeRowLoading />}
      {renderChildren}
    </>
  );
}
