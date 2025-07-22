import { useEffect, useState } from "react";
import { FileTreeRowProps } from "@/types/file-picker.types";
import { FileTreeRowLoading } from "@/components/file-tree-simple/loading/file-tree-row";
import FileTreeItem from "@/components/file-tree-simple/file-tree-item";
import { useFetchResources } from "@/hooks/use-fetch-resource";
import {
  enhanceItems,
  getConnectionResourceUrl,
  sortFilesAndFolders,
} from "@/lib/utils";

const REFRESH_PENDING_INTERVAL = 2000;

export default function FileTreeRow({
  type,
  entry,
  isRoot = false,
  viewOnly = false,
  expanded = false,
  level = 0,
  resource,
}: FileTreeRowProps) {
  const [refresh, setRefresh] = useState("");
  const [isOpen, setIsOpen] = useState(expanded);
  // Sync status in Knowledge Base
  const { data: kbFolderData, isLoading: isKbLoading } = useFetchResources(
    getConnectionResourceUrl(resource, entry.path, "knowledge-base"),
    isOpen,
    refresh
  );

  const shouldLoadResource = type !== "knowledge-base";
  const { data: folderData, isLoading } = useFetchResources(
    getConnectionResourceUrl(resource, entry.id, "connection-resource"),
    isOpen && shouldLoadResource,
    refresh
  );

  const toggleFolder = () => {
    setIsOpen(!isOpen);
  };

  const loading = isLoading || isKbLoading;

  const items =
    isOpen && !loading
      ? sortFilesAndFolders(
          enhanceItems(type, kbFolderData?.normalized, folderData?.normalized)
        )
      : [];

  const hasPendingItems = items.some((item) =>
    ["pending", "indexing"].includes(item.status)
  );

  const showLoaders = loading && !hasPendingItems;

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

  // If this row has pending items, schedule a refresh every 2 seconds
  useEffect(() => {
    if (!hasPendingItems) return;

    const interval = setInterval(() => {
      setRefresh(Date.now().toString());
    }, REFRESH_PENDING_INTERVAL);

    return () => clearInterval(interval);
  }, [items]);

  if (isRoot) {
    return (
      <>
        {showLoaders && <FileTreeRowLoading />}
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

      {showLoaders && <FileTreeRowLoading />}
      {renderChildren}
    </>
  );
}
