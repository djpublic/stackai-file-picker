import { putKnowledgeBaseSync } from "@/services/putKnowledgeBaseSync";
import { KnowledgeBaseDataProps } from "@/types/file-picker.types";
import { useMutation } from "@tanstack/react-query";

/**
 * Mutation hook to sync a knowledge base.
 * Call this with the id and orgId from the UI.
 */
export function usePutKnowledgeBaseSync() {
  return useMutation<
    KnowledgeBaseDataProps,
    Error,
    { id: string; orgId: string }
  >({
    mutationFn: ({ id, orgId }: { id: string; orgId: string }) =>
      putKnowledgeBaseSync(id, orgId),
  });
}
