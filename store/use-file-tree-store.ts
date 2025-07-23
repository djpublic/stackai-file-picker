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
  hiddenItems: string[];
  expandedPaths: string[];
  selectedItems: string[];
  setSearch: (search: string) => void;
  search: string;
  setSyncingItems: (ids: string[]) => void;
  toggleExpandedPath: (path: string, expanded: boolean) => void;
  toggleHidden: (id: string) => void;
  calculateAllSelected: () => void;
}

export const useFileTreeStore = create<FilePickerStore>((set) => ({
  selectedItems: [],
  allSelected: false,
  allSelectedDefault: true,
  syncingItems: [],
  expandedPaths: [],
  hiddenItems: [],
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
      // Get all available items from DOM
      const allElements = document.querySelectorAll(
        '[data-id][data-level="1"]'
      );
      const allAvailableIds = Array.from(allElements)
        .map((el) => el.getAttribute("data-id"))
        .filter(Boolean) as string[];

      // Check if all available items are selected
      const allSelected =
        allAvailableIds.length > 0 &&
        allAvailableIds.every((id) => state.selectedItems.includes(id));

      return {
        allSelected,
      };
    }),
}));
