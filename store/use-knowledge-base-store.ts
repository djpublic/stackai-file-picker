import { create } from "zustand";
import { KnowledgeBaseResponse } from "@/types/file-picker.types";

interface KnowledgeBaseStore {
  indexedItems: string[];
  knowledgeBase: KnowledgeBaseResponse["normalized"];
  knowledgeBaseRawData: KnowledgeBaseResponse["rawData"];
  setKnowledgeBase: (response: KnowledgeBaseResponse) => void;
}

export const useKnowledgeBaseStore = create<KnowledgeBaseStore>((set) => ({
  indexedItems: [],
  knowledgeBase: null,
  knowledgeBaseRawData: null,
  setKnowledgeBase: (response: KnowledgeBaseResponse) =>
    set({
      knowledgeBase: response.normalized,
      knowledgeBaseRawData: response.rawData,
      indexedItems: [...response.normalized.indexedItems],
    }),
}));
