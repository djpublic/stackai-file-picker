"use client";

import { toast } from "sonner";
import type { QueryClient } from "@tanstack/react-query";
import { poolKbSyncPendingResources } from "../use-knowledge-base";

interface ProcessSyncParams {
  knowledgeBaseId: string;
  orgId: string;
  knowledgeBaseRawData: any;
  selectedItems: string[];
  putResourceIdsIntoKnowledgeBase: {
    mutateAsync: (params: { id: string; data: any }) => Promise<any>;
  };
  callSyncInKnowledgeBase: {
    mutateAsync: (params: { id: string; orgId: string }) => Promise<any>;
  };
  setSyncingItems: (items: string[]) => void;
  queryClient: QueryClient;
}

/**
 * Hook to process the full synchronization of the knowledge base.
 * Extracts all sync logic into a reusable function.
 *
 * @returns The processSync function, which can be called with await.
 */
export function useProcessSync() {
  const processSync = async (params: ProcessSyncParams): Promise<void> => {
    const {
      knowledgeBaseId,
      orgId,
      knowledgeBaseRawData,
      selectedItems,
      putResourceIdsIntoKnowledgeBase,
      callSyncInKnowledgeBase,
      setSyncingItems,
      queryClient,
    } = params;

    try {
      // Send toast
      toast.info("Preparing sync…");

      // Do optimistic update for the indexing status
      setSyncingItems(selectedItems);

      // PUT /knowledge-base/{id} with the resource ids
      const kbUpdateId = toast.loading(`Adding files to knowledge base…`);

      await putResourceIdsIntoKnowledgeBase.mutateAsync({
        id: knowledgeBaseId,
        data: {
          ...knowledgeBaseRawData,
          connection_source_ids: selectedItems,
        },
      });

      toast.dismiss(kbUpdateId);
      toast.success("Knowledge base updated");

      // GET knowledge_bases/sync/trigger/{id}
      const syncId = toast.loading(`Syncing the knowledge base…`, {
        description: "This may take a few seconds.",
      });

      await callSyncInKnowledgeBase.mutateAsync({
        id: knowledgeBaseId,
        orgId: orgId,
      });

      toast.dismiss(syncId);

      poolKbSyncPendingResources(queryClient);

      setSyncingItems([]);
    } catch (error: unknown) {
      toast.error(`Could not perform the sync operation: ${error}`);
      throw error; // Re-throw to allow caller to handle if needed
    }
  };

  return processSync;
}
