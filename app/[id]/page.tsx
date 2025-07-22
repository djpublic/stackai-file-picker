"use client";

import { useCallback, useEffect, useState } from "react";
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

export default function KnowledgeBase() {
  const [refetchKey, setRefetchKey] = useState("");
  const params = useParams();
  const { id } = params;
  const { data, isLoading } = useKnowledgeBase(id, !!id, refetchKey);

  const { setKnowledgeBase, knowledgeBase, knowledgeBaseRawData } =
    useKnowledgeBaseStore();
  const { selectedItems, setSyncingItems, closeAllExpandedPaths } =
    useFilePickerStore();

  // Use the new mutation hooks
  const updateKbHandler = usePutKnowledgeBase();
  const syncKbHandler = usePutKnowledgeBaseSync();

  const handleKbUpdate = useCallback(async () => {
    const indexId = toast.loading(`Updating knowledge base…`);

    await updateKbHandler.mutateAsync({
      id: knowledgeBase?.id || "",
      data: {
        ...knowledgeBaseRawData,
        connection_source_ids: selectedItems,
      },
    });

    toast.dismiss(indexId);
    toast.success("Knowledge base updated");
  }, [updateKbHandler, knowledgeBase, knowledgeBaseRawData, selectedItems]);

  const handleSync = useCallback(async () => {
    const indexId = toast.loading(`Indexing ${selectedItems.length} files…`, {
      description: "This may take a few seconds.",
    });

    await syncKbHandler.mutateAsync({
      id: knowledgeBase?.id || "",
      orgId: knowledgeBase?.orgId || "",
    });

    toast.dismiss(indexId);
    toast.success("Sync completed!");
  }, [syncKbHandler, knowledgeBase]);

  // Orchestrate the sync operation
  const handleIndexFiles = useCallback(async () => {
    toast.info("Preparing sync…");

    setSyncingItems(selectedItems);
    closeAllExpandedPaths();

    try {
      await handleKbUpdate();
      await handleSync();
    } catch (error: unknown) {
      toast.error(`Could not perform the sync operation: ${error}`);
    }
  }, [handleKbUpdate, handleSync]);

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
          onUpdate={handleIndexFiles}
        />

        <div className="flex flex-col">
          <FileTreeContainer onSyncHandler={() => {}} loading={isLoading} />
        </div>

        <FileTreeFooter isLoading={isLoading} />
      </div>
    </>
  );
}
