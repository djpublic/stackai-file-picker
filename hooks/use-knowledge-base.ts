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

export async function poolKbSyncPendingResources(
  knowledgeBaseId: string,
  path: string = "/",
  notifier: any = null
) {
  let tries = 1;
  const maxTries = 10;
  const delay = 2000;

  const getData = async (reject: any) => {
    if (tries > maxTries) {
      reject(new Error("Max tries reached. Please refresh the page."));
      return;
    }

    try {
      const queryClient = new QueryClient();
      const url = getConnectionResourceUrl(
        {
          knowledgeBaseId: knowledgeBaseId,
        } as FileTreeResourceProps,
        path,
        "knowledge-base"
      );

      return await queryClient.fetchQuery({
        queryKey: ["connection-resources", url],
        queryFn: () => getConnectionResource(url),
      });
    } catch (error) {
      console.log("error", error);
      notifier.error("Error fetching data. Please refresh the page.");
    }
  };

  const fetchData = async (resolve: any, reject: any) => {
    const { data } = await getData(reject);

    console.log("invalidate data", data);

    const hasPendingResources = data.some((item: any) =>
      ["indexing", "pending"].includes(item.status)
    );

    console.log("hasPendingResources", hasPendingResources);

    if (!hasPendingResources) {
      console.log("No more pending resources");
      return resolve(true);
    }

    notifier.info(
      `Waiting for resources to be indexed (${tries}/${maxTries})`,
      {
        description: "We will notify you when it's done.",
        duration: 5000,
      }
    );

    tries++;

    setTimeout(() => fetchData(resolve, reject), delay);
  };

  return new Promise(fetchData);
}
