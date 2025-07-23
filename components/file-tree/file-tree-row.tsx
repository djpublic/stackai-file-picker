import { useCallback } from "react";
import { FileTreeRowProps } from "@/types/file-picker.types";
import { FileTreeRowLoading } from "@/components/file-tree/loading/file-tree-row";
import FileTreeItem from "@/components/file-tree/file-tree-item";
import { useFetchResources } from "@/hooks/use-fetch-resource";
import {
  enhanceItems,
  getConnectionResourceUrl,
  sortFilesAndFolders,
} from "@/lib/utils";
import { useFileTreeStore } from "@/store/use-file-tree-store";

export default function FileTreeRow({
  type,
  entry,
  isRoot = false,
  expanded = false,
  level = 0,
  resource,
  parentId,
}: FileTreeRowProps) {
  const { search } = useFileTreeStore();
  const { toggleExpandedPath, expandedPaths } = useFileTreeStore();
  const isOpen = expandedPaths.includes(entry.path) || expanded;

  // Sync status in Knowledge Base
  const kbUrl = getConnectionResourceUrl(
    resource,
    entry.path,
    "knowledge-base"
  );
  const { data: kbFolderData, isLoading: isKbLoading } = useFetchResources(
    kbUrl,
    isOpen
  );

  const { data: folderData, isLoading } = useFetchResources(
    getConnectionResourceUrl(resource, entry.id, "connection-resource", search),
    isOpen
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
        level={level + 1}
        resource={resource}
        parentId={entry.id}
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
        isOpen={isOpen}
        toggleFolder={toggleFolder}
        level={level}
        parentId={parentId}
      />

      {loading && <FileTreeRowLoading />}
      {renderChildren}
    </>
  );
}
