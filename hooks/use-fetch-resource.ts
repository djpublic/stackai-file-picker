"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  ConnectionResource,
  ConnectionResourceListResponse,
  FileTreeEntryProps,
} from "@/types/file-picker.types";

import { getConnectionResource } from "@/services/getConnectionResource";

function normalizeConnectionResource(
  resources: ConnectionResource[],
  resourceType: "knowledge-base" | "connection-resource"
): FileTreeEntryProps[] {
  return resources.map((resource) => {
    const path = resource.inode_path.path;

    return {
      id: resourceType === "knowledge-base" ? path : resource.resource_id,
      name: path.split("/").pop() || "",
      path,
      type: resource.inode_type === "directory" ? "directory" : "file",
      expanded: false,
      status: resource.status,
      size: resource.size,
    };
  });
}

export function useFetchResources(
  url: string,
  enabled: boolean = true,
  queryKey: any = null
) {
  return useQuery({
    queryKey: queryKey ?? ["connection-resources", url],
    queryFn: () => getConnectionResource(url),
    refetchOnWindowFocus: process.env.NODE_ENV === "production",
    enabled,
    select: (data: ConnectionResourceListResponse) => ({
      rawData: data,
      normalized: normalizeConnectionResource(
        data.data,
        url.includes("knowledge-bases")
          ? "knowledge-base"
          : "connection-resource"
      ),
    }),
  });
}
