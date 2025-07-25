"use client";

import { useCallback, useEffect } from "react";
import { useFileTreeStore } from "@/store/use-file-tree-store";
import { useFetchResources } from "@/hooks/use-fetch-resource";
import {
  enhanceItems,
  getConnectionResourceUrl,
  sortFilesAndFolders,
} from "@/lib/utils";
import type { UseFetchAndStoreResourcesProps } from "@/types/file-picker.types";

export function useFetchAndStoreResources({
  path,
  resource,
  parentId,
  enabled = true,
}: UseFetchAndStoreResourcesProps) {
  const { setItems, search } = useFileTreeStore();

  // Create URLs for both queries
  const kbUrl = getConnectionResourceUrl(resource, path, "knowledge-base");
  const connectionUrl = getConnectionResourceUrl(
    resource,
    parentId,
    "connection-resource",
    search
  );

  // Use the existing hooks for data fetching
  const {
    data: kbFolderData,
    isLoading: isKbLoading,
    refetch: refetchKb,
  } = useFetchResources(`${kbUrl}&tsId=${parentId}`, enabled);

  const {
    data: folderData,
    isLoading: isFolderLoading,
    refetch: refetchFolder,
  } = useFetchResources(`${connectionUrl}&tsId=${parentId}`, enabled);

  const isLoading = isKbLoading || isFolderLoading;

  // Process and store data when both queries resolve
  useEffect(() => {
    if (
      !enabled ||
      isLoading ||
      !kbFolderData?.normalized ||
      !folderData?.normalized
    ) {
      return;
    }

    const items = sortFilesAndFolders(
      enhanceItems({
        kbFolderData: kbFolderData.normalized,
        connectionFolderData: folderData.normalized,
        syncingItems: [],
      })
    );

    // Store the items in the store with the parent ID
    setItems(parentId, items);
  }, [enabled, isLoading, kbFolderData, folderData, parentId, setItems]);

  const refetch = useCallback(() => {
    refetchKb();
    refetchFolder();
  }, [refetchKb, refetchFolder]);

  return {
    isLoading,
    refetch,
  };
}
