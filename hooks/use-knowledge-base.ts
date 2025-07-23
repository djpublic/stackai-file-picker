"use client";

import { getKnowledgeBase } from "@/services/getKnowledgeBase";
import {
  FileTreeResourceProps,
  KnowledgeBaseDataProps,
  KnowledgeBaseProps,
  KnowledgeBaseResponse,
} from "@/types/file-picker.types";

import { QueryClient, useQuery } from "@tanstack/react-query";
import { ParamValue } from "next/dist/server/request/params";
import { getConnectionResourceUrl } from "@/lib/utils";
import { getConnectionResource } from "@/services/getConnectionResource";

/**
 * Normalizes knowledge base data to extract only the required fields
 * Maps API response fields to simplified interface for easier consumption
 */
function normalizeKnowledgeBase(
  data: KnowledgeBaseDataProps
): KnowledgeBaseProps {
  return {
    id: data.knowledge_base_id,
    connectionId: data.connection_id,
    indexedItems: data.connection_source_ids,
    name: data.name,
    totalSize: data.total_size,
    description: data.description,
    provider: data.connection_provider_type,
    totalFiles: data.connection_source_ids?.length || 0,
    lastUpdate: data.updated_at,
    orgId: data.org_id, // Added to fix linter error
  };
}

export function useKnowledgeBase(
  id: ParamValue,
  enabled: boolean = false,
  refetchKey = ""
) {
  return useQuery({
    queryKey: ["kb", id.toString(), refetchKey],
    queryFn: () => getKnowledgeBase(id.toString()),
    enabled,
    refetchOnMount: true,
    refetchOnReconnect: true,
    staleTime: 20000, // 20 seconds
    refetchOnWindowFocus: true,
    select: (data: KnowledgeBaseDataProps): KnowledgeBaseResponse => ({
      rawData: data,
      normalized: normalizeKnowledgeBase(data),
    }),
  });
}

export function poolKbSyncPendingResources(queryClient: QueryClient) {
  let tries = 0;
  const maxTries = 3;
  const delay = 2000;

  const invalidate = async () => {
    await queryClient.invalidateQueries({
      predicate: () => true,
      queryKey: ["connection-resources"],
    });

    if (tries < maxTries) {
      tries++;

      setTimeout(invalidate, delay);
    }
  };

  invalidate();
}
