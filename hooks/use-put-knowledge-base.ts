import { putKnowledgeBase } from "@/services/putKnowledgeBase";
import { KnowledgeBaseDataProps } from "@/types/file-picker.types";
import { useMutation } from "@tanstack/react-query";

/**
 * Mutation hook to update a knowledge base.
 * Call this with the id and data from the UI.
 */
export function usePutKnowledgeBase() {
  return useMutation<
    KnowledgeBaseDataProps,
    Error,
    { id: string; data: KnowledgeBaseDataProps }
  >({
    mutationFn: ({ id, data }: { id: string; data: KnowledgeBaseDataProps }) =>
      putKnowledgeBase(id, data),
  });
}
