"use client";

import { getKnowledgeBase } from "@/services/getKnowledgeBase";
import {
  KnowledgeBaseDataProps,
  KnowledgeBaseProps,
  KnowledgeBaseResponse,
} from "@/types/file-picker.types";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { putKnowledgeBase } from "@/services/putKnowledgeBase";
import { putKnowledgeBaseSync } from "@/services/putKnowledgeBaseSync";
import { ParamValue } from "next/dist/server/request/params";

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
