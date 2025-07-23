import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { FileTreeEntryProps } from "@/types/file-picker.types";
import { useDeleteKnowledgeBaseResource } from "@/hooks/use-delete-knowledge-base-resource";
import { useKnowledgeBaseStore } from "@/store/use-knowledge-base-store";
import { poolKbSyncPendingResources } from "@/hooks/use-knowledge-base";
import { useQueryClient } from "@tanstack/react-query";

export function FileTreeItemDelete({ entry }: { entry: FileTreeEntryProps }) {
  const { knowledgeBase } = useKnowledgeBaseStore();
  const { mutateAsync, isPending } = useDeleteKnowledgeBaseResource();
  const queryClient = useQueryClient();

  const unsyncFile = async () => {
    try {
      await mutateAsync({
        knowledgeBaseId: knowledgeBase.id,
        path: entry.path,
      });

      poolKbSyncPendingResources(queryClient);
    } catch {
      toast.error("Failed to de-index file. Try again.");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          disabled={isPending}
        >
          <Trash2 className="w-2 h-2" />
          <span className="sr-only">Remove from knowledge base</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Mind that this does NOT delete the
            <strong> {entry.name}</strong> from <strong>Google Drive</strong>,
            but instead de-indexes the file from the knowledge base.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            type="button"
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:text-destructive-foreground/90 text-white"
            onClick={(e) => {
              e.stopPropagation();
              unsyncFile();
            }}
          >
            De-index file
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
