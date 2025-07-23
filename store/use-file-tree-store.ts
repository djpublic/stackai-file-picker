import { create } from "zustand";
import { removeDuplicatedById } from "@/lib/utils";
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
  hiddenItems: string[];
  expandedPaths: string[];
  selectedItems: string[];
  setSyncingItems: (ids: string[]) => void;
  toggleExpandedPath: (path: string, expanded: boolean) => void;
  closeAllExpandedPaths: () => void;
  toggleHidden: (id: string) => void;
}

export const useFileTreeStore = create<FilePickerStore>((set) => ({
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
  hiddenItems: [],
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
  toggleHidden: (id: string) =>
    set((state) => ({
      selectedItems: state.selectedItems.filter((item) => item !== id),
      syncingItems: state.syncingItems.filter((item) => item !== id),
      allSelectedDefault: false,
      hiddenItems: state.hiddenItems.includes(id)
        ? state.hiddenItems.filter((item) => item !== id)
        : [...state.hiddenItems, id],
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
