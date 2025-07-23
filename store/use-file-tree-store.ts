import { create } from "zustand";
import { removeDuplicatedById } from "@/lib/utils";
import {
  FileTreeEntryProps,
  SelectedItemProps,
} from "@/types/file-picker.types";
import { CheckedState } from "@radix-ui/react-checkbox";

interface FilePickerStore {
  allSelected: CheckedState;
  allSelectedDefault: boolean;
  toggleSelected: (
    id: string,
    parentId: string | undefined,
    checked: CheckedState
  ) => void;
  selectAll: (
    items: SelectedItemProps[],
    checked: CheckedState,
    forceCleanup?: boolean
  ) => void;
  syncingItems: string[];
  expandedPaths: string[];
  selectedItems: SelectedItemProps[];
  setSearch: (search: string) => void;
  search: string;
  setSyncingItems: (ids: string[]) => void;
  toggleExpandedPath: (path: string, expanded: boolean) => void;
  isSelected: (id: string) => boolean;
}

export const useFileTreeStore = create<FilePickerStore>((set, get) => ({
  selectedItems: [],
  allSelected: false,
  allSelectedDefault: true,
  syncingItems: [],
  expandedPaths: [],
  search: "",
  setSearch: (search: string) => set({ search }),
  setSyncingItems: (ids: string[]) =>
    set({
      syncingItems: ids,
    }),
  isSelected: (id: string) => {
    const state = get();
    return state.selectedItems.some(
      (item) => item.id.toString() === id.toString()
    );
  },
  toggleSelected: (
    id: string,
    parentId: string | undefined,
    checked: CheckedState
  ) =>
    set((state) => {
      const newSelectedItems = checked
        ? [...state.selectedItems, { id, parentId }]
        : state.selectedItems.filter((item) => item.id !== id);

      return {
        allSelectedDefault: false,
        selectedItems: newSelectedItems,
      };
    }),
  selectAll: (
    items: SelectedItemProps[],
    newState: CheckedState,
    forceCleanup: boolean = false
  ) => {
    set((state) => {
      if (forceCleanup) {
        return {
          allSelected: newState,
          selectedItems: newState ? items : [],
          allSelectedDefault: false,
        };
      }

      const newSelectedItems = newState
        ? [
            ...state.selectedItems,
            ...items.filter(
              (newItem) =>
                !state.selectedItems.some(
                  (existing) => existing.id === newItem.id
                )
            ),
          ] // Merge and deduplicate
        : state.selectedItems.filter(
            (item) => !items.some((newItem) => newItem.id === item.id)
          ); // Remove specified items

      return {
        selectedItems: newSelectedItems,
        allSelectedDefault: false,
      };
    });
  },
  toggleExpandedPath: (path: string, expanded: boolean) =>
    set((state) => ({
      expandedPaths: expanded
        ? [...state.expandedPaths, path]
        : state.expandedPaths.filter((p) => p !== path),
    })),
}));
