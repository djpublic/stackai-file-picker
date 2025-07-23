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
import { useProcessSync } from "@/hooks/sync/use-process-sync";

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

  // Use the extracted sync hook
  const processSync = useProcessSync();

  // Steps to orchestrate the sync operation:
  // 1. Show a toast notification to inform the user that sync is starting.
  // 2. Optimistically update the UI to reflect that selected items are being indexed.
  // 3. Collapse all expanded file paths to reload the root directory (like Stack AI app behavior).
  // 4. Send a PUT request to /knowledge-base/{id} to update the knowledge base with the selected resource IDs.
  // 5. Trigger the sync process by calling GET /knowledge_bases/sync/trigger/{id}.
  // 6. Start polling to check if there are any resources in the root directory still pending or indexing.
  //    Continue polling until all resources are indexed or a timeout occurs.
  const handleProcessSync = useCallback(async () => {
    if (!knowledgeBase?.id || !knowledgeBase?.orgId) {
      toast.error("Knowledge base information is missing");
      return;
    }

    await processSync({
      knowledgeBaseId: knowledgeBase.id,
      orgId: knowledgeBase.orgId,
      knowledgeBaseRawData,
      selectedItems,
      putResourceIdsIntoKnowledgeBase,
      callSyncInKnowledgeBase,
      setSyncingItems,
      closeAllExpandedPaths,
    });
  }, [
    knowledgeBase,
    knowledgeBaseRawData,
    selectedItems,
    putResourceIdsIntoKnowledgeBase,
    callSyncInKnowledgeBase,
    setSyncingItems,
    closeAllExpandedPaths,
    processSync,
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
          onUpdate={handleProcessSync}
        />

        <div className="flex flex-col">
          <FileTreeContainer onSyncHandler={() => {}} loading={isLoading} />
        </div>

        <FileTreeFooter isLoading={isLoading} />
      </div>
    </>
  );
}
