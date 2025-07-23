"use client";

import { useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import PageHeader from "@/components/home/page-header";
import { useKnowledgeBase } from "@/hooks/use-knowledge-base";
import FileTreeHeader from "@/components/file-tree-simple/file-tree-header";
import { useKnowledgeBaseStore } from "@/store/use-knowledge-base-store";
import FileTreeFooter from "@/components/file-tree-simple/file-tree-footer";
import FileTreeContainer from "@/components/file-picker/file-tree-container";
import { usePutKnowledgeBase } from "@/hooks/use-put-knowledge-base";
import { usePutKnowledgeBaseSync } from "@/hooks/use-put-knowledge-base-sync";
import { useFilePickerStore } from "@/store/use-file-picker-store";
import { poolKbSyncPendingResources } from "@/hooks/use-knowledge-base";

export default function KnowledgeBase() {
  const params = useParams();
  const { id } = params;
  const { data, isLoading } = useKnowledgeBase(id, !!id);

  const { setKnowledgeBase, knowledgeBase, knowledgeBaseRawData } =
    useKnowledgeBaseStore();
  const { selectedItems, setSyncingItems, closeAllExpandedPaths } =
    useFilePickerStore();

  // Use the new mutation hooks
  const putResourceIdsIntoKnowledgeBase = usePutKnowledgeBase();
  const callSyncInKnowledgeBase = usePutKnowledgeBaseSync();
  const handleKbUpdate = useCallback(async () => {
    const indexId = toast.loading(`Adding files to knowledge base…`);

    await putResourceIdsIntoKnowledgeBase.mutateAsync({
      id: knowledgeBase?.id || "",
      data: {
        ...knowledgeBaseRawData,
        connection_source_ids: selectedItems,
      },
    });

    toast.dismiss(indexId);
    toast.success("Knowledge base updated");
  }, [
    putResourceIdsIntoKnowledgeBase,
    knowledgeBase,
    knowledgeBaseRawData,
    selectedItems,
  ]);

  const handleSync = useCallback(async () => {
    const indexId = toast.loading(`Syncing the knowledge base…`, {
      description: "This may take a few seconds.",
    });

    await callSyncInKnowledgeBase.mutateAsync({
      id: knowledgeBase?.id || "",
      orgId: knowledgeBase?.orgId || "",
    });

    toast.dismiss(indexId);

    // Poll for indexing completion
    try {
      await poolKbSyncPendingResources(knowledgeBase?.id, "/", toast);
      toast.success("All resources have been indexed successfully", {
        duration: 30000,
        closeButton: true,
      });

      setSyncingItems([]);
    } catch (error) {
      toast.error(
        `Indexing failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }, [callSyncInKnowledgeBase, knowledgeBase, poolKbSyncPendingResources]);

  // Orchestrate the sync operation
  const processSync = useCallback(async () => {
    try {
      toast.info("Preparing sync…");
      setSyncingItems(selectedItems);
      closeAllExpandedPaths();

      await handleKbUpdate();
      await handleSync();
    } catch (error: unknown) {
      toast.error(`Could not perform the sync operation: ${error}`);
    }
  }, [
    handleKbUpdate,
    handleSync,
    selectedItems,
    setSyncingItems,
    closeAllExpandedPaths,
  ]);

  useEffect(() => {
    if (data?.normalized && data?.rawData) {
      setKnowledgeBase(data);
    }
  }, [data, setKnowledgeBase]);

  return (
    <>
      <PageHeader title={data?.normalized?.name} isLoading={isLoading} />

      <div className="lg:col-span-2 rounded-xl shadow flex flex-col gap-4 w-max-content p-4 w-full bg-white dark:bg-slate-800">
        <FileTreeHeader
          isLoading={isLoading}
          onRefetch={() => {}}
          onUpdate={processSync}
        />

        <div className="flex flex-col">
          <FileTreeContainer onSyncHandler={() => {}} loading={isLoading} />
        </div>

        <FileTreeFooter isLoading={isLoading} />
      </div>
    </>
  );
}
