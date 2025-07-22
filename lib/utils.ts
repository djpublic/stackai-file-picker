import {
  FileTreeEntryProps,
  FileTreeResourceProps,
  ResourceType,
} from "@/types/file-picker.types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// create a bytes to human readable function
export function bytesToHumanReadable(bytes: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, index)).toFixed(2) + " " + units[index];
}

export const getConnectionResourceUrl = (
  resource: FileTreeResourceProps,
  path: string,
  type: "knowledge-base" | "connection-resource"
) => {
  if (type === "knowledge-base") {
    return `/api/knowledge-bases/${resource.knowledgeBaseId}/resources?resource_path=${path}`;
  }

  return `/api/connections/${resource.connectionId}?resource_id=${path}`;
};

export const sortFilesAndFolders = (items: FileTreeEntryProps[]) => {
  const sortedItems = items.sort((a, b) => {
    if (a.type === "directory" && b.type !== "directory") return -1;
    if (a.type !== "directory" && b.type === "directory") return 1;
    return a.name.localeCompare(b.name);
  });

  return sortedItems;
};

export const removeDuplicated = (array: string[]) => {
  return array.filter((item, index, self) => self.indexOf(item) === index);
};
export const removeDuplicatedById = (array: FileTreeEntryProps[]) => {
  return array.filter(
    (item, index, self) => self.findIndex((t) => t.id === item.id) === index
  );
};

export const combineIndexedAndSelected = (
  indexedItems: string[],
  selectedItems: string[]
) => {
  return [...indexedItems, ...selectedItems];
};

export const mergeItems = (itemsA: string[], itemsB: string[]) =>
  removeDuplicated(combineIndexedAndSelected(itemsA, itemsB));

export const rootEntry = {
  id: "/",
  name: "Root",
  path: "/",
  type: "directory",
} as FileTreeEntryProps;

// The date received is 2025-07-22T14:17:37.878313Z, we need to format it to 2025-07-22 14:17:37
export const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// This method combines the knowledge base folder information for indexing and the connection folder
export const enhanceItems = (
  type: ResourceType,
  kbFolderData: FileTreeEntryProps[] = [],
  connectionFolderData?: FileTreeEntryProps[]
): FileTreeEntryProps[] => {
  if (type === "knowledge-base") {
    return kbFolderData;
  }

  return connectionFolderData?.map((item) => {
    const syncItem = kbFolderData.find(
      (syncItem) => syncItem.path === item.path
    );

    return { ...item, status: syncItem?.status };
  });
};
