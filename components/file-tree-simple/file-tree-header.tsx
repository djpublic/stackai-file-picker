"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { usePutKnowledgeBaseSync } from "@/hooks/use-put-knowledge-base-sync";
import { useKnowledgeBaseStore } from "@/store/use-knowledge-base-store";
import { useEffect } from "react";

interface FileTreeHeaderProps {
  forceSync?: boolean;
  isLoading?: boolean;
  onRefetch?: () => void;
}

export default function FileTreeHeader({
  onRefetch,
  isLoading,
  forceSync = false,
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
        <h2 className="text-xl font-bold">Indexed Files</h2>
        <p className="text-sm text-muted-foreground">
          Files already indexed into your knowledge base.
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleSync}
        disabled={syncKbHandler.isPending || !indexedItems.length || isLoading}
        className="flex items-center gap-2"
      >
        <RefreshCw
          className={`h-4 w-4 ${syncKbHandler.isPending ? "animate-spin" : ""}`}
        />
        Sync
      </Button>
    </div>
  );
}
