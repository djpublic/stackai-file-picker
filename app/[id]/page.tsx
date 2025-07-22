"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FilePickerModal from "@/components/file-picker/file-picker-modal";
import PickerArea from "@/components/home/picker-area";
import FileTree from "@/components/file-tree-simple/file-tree";
import { useKnowledgeBase } from "@/hooks/use-knowledge-base";
import FileTreeHeader from "@/components/file-tree-simple/file-tree-header";
import { useKnowledgeBaseStore } from "@/store/use-knowledge-base-store";
import { FileTreeResourceProps } from "@/types/file-picker.types";
import { toast } from "sonner";
import FileTreeFooter from "@/components/file-tree-simple/file-tree-footer";

export default function KnowledgeBase() {
  const [refetchKey, setRefetchKey] = useState("");
  const params = useParams();
  const { id } = params;
  const { data, isLoading } = useKnowledgeBase(id, !!id, refetchKey);

  const [isFilePickerOpen, setIsFilePickerOpen] = useState(false);
  const { setKnowledgeBase } = useKnowledgeBaseStore();
  const resource: FileTreeResourceProps = {
    knowledgeBaseId: data?.normalized?.id,
    orgId: data?.normalized?.orgId,
    connectionId: data?.normalized?.connectionId,
  };

  const refreshKnowledgeBase = () => {
    toast.info("Refreshing knowledge base");

    setRefetchKey(Date.now().toString());
  };

  useEffect(() => {
    if (data?.normalized && data?.rawData) {
      setKnowledgeBase(data);
    }
  }, [data]);

  return (
    <>
      <PickerArea data={data?.normalized} isLoading={isLoading} />

      <div className="lg:col-span-2 rounded-xl shadow flex flex-col gap-4 w-max-content p-4 w-full bg-white dark:bg-slate-800">
        <FileTreeHeader
          isLoading={isLoading}
          onRefetch={refreshKnowledgeBase}
          onOpenFilePicker={() => setIsFilePickerOpen(!isFilePickerOpen)}
        />

        <div className="flex flex-col">
          <FileTree
            viewOnly
            resource={resource}
            type="knowledge-base"
            key="knowledge-base"
          />
        </div>

        <FileTreeFooter isLoading={isLoading} />
      </div>

      <FilePickerModal
        open={isFilePickerOpen}
        onClose={() => setIsFilePickerOpen(false)}
        onSyncHandler={refreshKnowledgeBase}
      />
    </>
  );
}
