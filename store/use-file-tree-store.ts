import { create } from "zustand";
import { removeDuplicatedById } from "@/lib/utils";
import { FileTreeEntryProps } from "@/types/file-picker.types";
import { CheckedState } from "@radix-ui/react-checkbox";

interface FilePickerStore {
  allSelected: CheckedState;
  allSelectedDefault: boolean;
  toggleSelected: (id: string, checked: CheckedState) => void;
  selectAll: (ids: string[], checked: CheckedState) => void;
  syncingItems: string[];
  expandedPaths: string[];
  selectedItems: string[];
  setSearch: (search: string) => void;
  search: string;
  setSyncingItems: (ids: string[]) => void;
  toggleExpandedPath: (path: string, expanded: boolean) => void;
  calculateAllSelected: () => void;
}

export const useFileTreeStore = create<FilePickerStore>((set) => ({
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
  toggleSelected: (id: string, checked: CheckedState) =>
    set((state) => {
      const newSelectedItems = checked
        ? [...state.selectedItems, id]
        : state.selectedItems.filter((file) => file !== id);

      return {
        allSelectedDefault: false,
        selectedItems: newSelectedItems,
      };
    }),
  selectAll: (ids: string[], newState: CheckedState) => {
    set((state) => {
      const newSelectedItems = newState
        ? [...new Set([...state.selectedItems, ...ids])] // Merge and deduplicate
        : state.selectedItems.filter((item) => !ids.includes(item)); // Remove specified ids

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
  calculateAllSelected: () =>
    set((state) => {
      // Get only level 1 items for main checkbox calculation
      const allElements = document.querySelectorAll(
        '[data-id][data-level="1"]'
      );
      const allAvailableIds = Array.from(allElements)
        .map((el) => el.getAttribute("data-id"))
        .filter(Boolean) as string[];

      // Check if all level 1 items are selected
      const allSelected =
        allAvailableIds.length > 0 &&
        allAvailableIds.every((id) => state.selectedItems.includes(id));

      return {
        allSelected,
      };
    }),
}));
