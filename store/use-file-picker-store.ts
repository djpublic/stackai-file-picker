import { create } from "zustand";
import { mergeItems, removeDuplicatedById } from "@/lib/utils";
import { FileTreeEntryProps } from "@/types/file-picker.types";
import { CheckedState } from "@radix-ui/react-checkbox";

interface FilePickerStore {
  connectionFiles: FileTreeEntryProps[];
  updateConnectionFiles: (files: FileTreeEntryProps[]) => void;
  allSelected: CheckedState;
  allSelectedDefault: boolean;
  toggleSelected: (id: string, checked: CheckedState) => void;
  selectAll: (ids: string[], checked: CheckedState) => void;
  syncingItems: string[];
  expandedPaths: string[];
  selectedItems: string[];
  setSyncingItems: (ids: string[]) => void;
  toggleExpandedPath: (path: string, expanded: boolean) => void;
  closeAllExpandedPaths: () => void;
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
  allSelectedDefault: true,
  syncingItems: [],
  expandedPaths: [],
  setSyncingItems: (ids: string[]) =>
    set({
      syncingItems: ids,
    }),
  toggleSelected: (id: string, checked: CheckedState) =>
    set((state) => ({
      allSelected: checked ? state.allSelected : false,
      allSelectedDefault: false,
      selectedItems: checked
        ? [...state.selectedItems, id]
        : state.selectedItems.filter((file) => file !== id),
    })),
  selectAll: (ids: string[], newState: CheckedState) => {
    set((state) => {
      const previousState = !!state.allSelected;

      return {
        allSelected: newState,
        selectedItems: !newState && previousState === true ? [] : [...ids],
        allSelectedDefault: false,
      };
    });
  },
  closeAllExpandedPaths: () =>
    set({
      expandedPaths: [],
    }),
  toggleExpandedPath: (path: string, expanded: boolean) =>
    set((state) => ({
      expandedPaths: expanded
        ? [...state.expandedPaths, path]
        : state.expandedPaths.filter((p) => p !== path),
    })),
}));
