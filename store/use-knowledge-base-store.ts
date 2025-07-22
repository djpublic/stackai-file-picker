import { create } from "zustand";

import {
  FileTreeEntryProps,
  KnowledgeBaseResponse,
} from "@/types/file-picker.types";

interface KnowledgeBaseStore {
  indexedItems: string[];
  files: FileTreeEntryProps[];
  setFiles: (files: FileTreeEntryProps[]) => void;
  knowledgeBase: KnowledgeBaseResponse["normalized"];
  knowledgeBaseRawData: KnowledgeBaseResponse["rawData"];
  setKnowledgeBase: (response: KnowledgeBaseResponse) => void;
}

export const useKnowledgeBaseStore = create<KnowledgeBaseStore>((set) => ({
  indexedItems: [],
  files: [],
  setFiles: (files: FileTreeEntryProps[]) => set({ files }),
  knowledgeBase: null,
  knowledgeBaseRawData: null,
  setKnowledgeBase: (response: KnowledgeBaseResponse) =>
    set({
      knowledgeBase: response.normalized,
      knowledgeBaseRawData: response.rawData,
      indexedItems: [...response.normalized.indexedItems],
    }),
}));
