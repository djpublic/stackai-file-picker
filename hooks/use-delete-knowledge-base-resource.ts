import { deleteKnowledgeBaseResource } from "@/services/deleteKnowledgeBaseResource";
import {
  DeleteKnowledgeBaseResourceProps,
  KnowledgeBaseDataProps,
} from "@/types/file-picker.types";
import { useMutation } from "@tanstack/react-query";

/**
 * Mutation hook to delete a knowledge base resource.
 * Call this with the id and data from the UI.
 */
export function useDeleteKnowledgeBaseResource() {
  return useMutation<
    KnowledgeBaseDataProps,
    Error,
    DeleteKnowledgeBaseResourceProps
  >({
    mutationFn: ({ knowledgeBaseId, path }: DeleteKnowledgeBaseResourceProps) =>
      deleteKnowledgeBaseResource(knowledgeBaseId, path),
  });
}
