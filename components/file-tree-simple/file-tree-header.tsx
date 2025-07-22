"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileSymlink, RefreshCw } from "lucide-react";
import { usePutKnowledgeBaseSync } from "@/hooks/use-put-knowledge-base-sync";
import { useKnowledgeBaseStore } from "@/store/use-knowledge-base-store";
import { useEffect } from "react";

interface FileTreeHeaderProps {
  forceSync?: boolean;
  isLoading?: boolean;
  onRefetch?: () => void;
  onOpenFilePicker?: () => void;
}

export default function FileTreeHeader({
  onRefetch,
  isLoading,
  forceSync = false,
  onOpenFilePicker,
}: FileTreeHeaderProps) {
  const { knowledgeBase, indexedItems } = useKnowledgeBaseStore();
  const syncKbHandler = usePutKnowledgeBaseSync();

  const handleSync = async () => {
    const indexId = toast.loading(`Re-indexing resources…`, {
      description: "This may take a few seconds.",
    });

    await syncKbHandler.mutateAsync({
      id: knowledgeBase?.id || "",
      orgId: knowledgeBase?.orgId || "",
    });

    toast.dismiss(indexId);
    toast.success("Sync completed!");

    onRefetch();
  };

  useEffect(() => {
    if (forceSync) {
      handleSync();
    }
  }, [forceSync]);

  return (
    <div className="flex items-center justify-between mb-2">
      <div>
        <h2 className="text-xl font-bold">Indexed Resources</h2>
        <p className="text-sm text-muted-foreground">
          Files already indexed into your knowledge base.
        </p>
      </div>

      <div className="flex flex-row gap-2">
        <Button
          variant="outline"
          size="lg"
          onClick={handleSync}
          disabled={
            syncKbHandler.isPending || !indexedItems.length || isLoading
          }
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              syncKbHandler.isPending ? "animate-spin" : ""
            }`}
          />
          Sync
        </Button>

        <Button
          onClick={onOpenFilePicker}
          size="lg"
          disabled={isLoading}
          className="gap-2 lg:w-40 cursor-pointer text-md"
        >
          <FileSymlink className="h-5 w-5" />
          Change Files
        </Button>
      </div>
    </div>
  );
}
