import { mergeItems, removeDuplicatedById } from "@/lib/utils";
import {
  FileTreeEntryProps,
  KnowledgeBaseResponse,
} from "@/types/file-picker.types";
import { CheckedState } from "@radix-ui/react-checkbox";
import { create } from "zustand";

interface FilePickerStore {
  connectionFiles: FileTreeEntryProps[];
  updateConnectionFiles: (files: FileTreeEntryProps[]) => void;
  selectedItems: string[];
  allSelected: boolean;
  toggleSelected: (id: string, checked: CheckedState) => void;
  selectAll: (ids: string[], checked: CheckedState) => void;
}

export const useFilePickerStore = create<FilePickerStore>((set) => ({
  connectionFiles: [],
  updateConnectionFiles: (files: FileTreeEntryProps[]) =>
    set((state) => {
      const connectionFiles = state.connectionFiles;
      const newFiles = removeDuplicatedById([...connectionFiles, ...files]);
      return {
        connectionFiles: newFiles,
      };
    }),
  selectedItems: [],
  allSelected: false,
  toggleSelected: (id: string, checked: CheckedState) =>
    set((state) => ({
      selectedItems: checked
        ? [...state.selectedItems, id]
        : state.selectedItems.filter((file) => file !== id),
    })),
  selectItems: (ids: string[]) =>
    set((state) => ({
      selectedItems: mergeItems(state.selectedItems, ids),
    })),
  selectAll: (ids: string[], newState: CheckedState) => {
    const nextState = newState === true ? true : false; // it can be indeterminate, so we ensure is false

    set((state) => ({
      selectedItems: !nextState ? [] : [...ids],
      allSelected: nextState,
    }));
  },
}));
