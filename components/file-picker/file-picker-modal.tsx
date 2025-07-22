"use client";

import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import FileTree from "../file-tree-simple/file-tree";
import { Button } from "../ui/button";
import { RefreshCcw } from "lucide-react";
import { FileTreeResourceProps } from "@/types/file-picker.types";
import { useFilePickerStore } from "@/store/use-file-picker-store";
import { Skeleton } from "../ui/skeleton";
import { usePutKnowledgeBase } from "@/hooks/use-put-knowledge-base";
import { usePutKnowledgeBaseSync } from "@/hooks/use-put-knowledge-base-sync";
import Image from "next/image";
import { useKnowledgeBaseStore } from "@/store/use-knowledge-base-store";

interface FilePickerModalProps {
  open: boolean;
  onClose: () => void;
  onSyncHandler: () => void;
}

export default function FilePickerModal({
  open,
  onClose,
  onSyncHandler,
}: FilePickerModalProps) {
  const { selectedItems } = useFilePickerStore();
  const { knowledgeBase, knowledgeBaseRawData } = useKnowledgeBaseStore();

  const itemPlural = selectedItems.length === 1 ? "item" : "items";

  const resource: FileTreeResourceProps = {
    knowledgeBaseId: knowledgeBase?.id,
    orgId: knowledgeBase?.orgId,
    connectionId: knowledgeBase?.connectionId,
  };

  // Use the new mutation hooks
  const updateKbHandler = usePutKnowledgeBase();
  const syncKbHandler = usePutKnowledgeBaseSync();

  const handleKbUpdate = async () => {
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
  };

  const handleSync = async () => {
    const indexId = toast.loading(`Indexing ${selectedItems.length} files…`);

    await syncKbHandler.mutateAsync({
      id: knowledgeBase?.id || "",
      orgId: knowledgeBase?.orgId || "",
    });

    toast.dismiss(indexId);
    toast.success("Sync completed!");

    onSyncHandler();
  };

  // Orchestrate the sync operation
  const handleIndexFiles = async () => {
    onClose();

    const syncId = toast.loading("Preparing sync…");

    try {
      await handleKbUpdate();
      toast.dismiss(syncId);
      await handleSync();
    } catch (error: unknown) {
      toast.error(`Could not perform the sync operation: ${error}`);
    }
  };

  const loading = updateKbHandler.isPending || syncKbHandler.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-full sm:max-h-[90vh] md:max-h-[80vh] lg:max-h-[60vh] flex flex-col">
        {/* Header */}
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Image
              src="https://stack-us-east-1.onrender.com/integrations/gdrive/icon/icon.svg"
              alt="" // Ignores from screen readers
              className="h-5 w-5 inline-block"
              width={20}
              height={20}
            />
            Google Drive connection
          </DialogTitle>

          <DialogDescription>
            Index selected files into your Knowledge Base.
          </DialogDescription>
        </DialogHeader>

        {/* Main content area */}
        <div className="flex-1 min-h-0 flex-col gap-2">
          <FileTree resource={resource} type="connection-resource" />
        </div>

        <div className="pt-6 pb-0">
          <div className="flex justify-end items-center">
            <div className="text-sm text-muted-foreground mr-4">
              {loading ? (
                <Skeleton className="w-16 h-4" />
              ) : (
                `${selectedItems.length} ${itemPlural} selected`
              )}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleIndexFiles} disabled={loading}>
                Modify selected files
                <RefreshCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
