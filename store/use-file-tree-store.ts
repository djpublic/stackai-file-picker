import { create } from "zustand";
import {
  FileTreeEntryProps,
  FileTreeEntryStatusProps,
  SelectedItemProps,
  SyncingItemProps,
} from "@/types/file-picker.types";
import { CheckedState } from "@radix-ui/react-checkbox";

interface FileTreeItemsGroup {
  id: string; // parent id
  items: FileTreeEntryProps[];
}

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
  syncingItems: SyncingItemProps[];
  expandedPaths: string[];
  selectedItems: SelectedItemProps[];
  setSearch: (search: string) => void;
  search: string;
  setSyncingItems: (ids: SyncingItemProps[]) => void;
  toggleExpandedPath: (path: string, expanded: boolean) => void;
  isSelected: (id: string) => boolean;
  itemsGroups: FileTreeItemsGroup[];
  setItems: (parentId: string, items: FileTreeEntryProps[]) => void;
  getItems: (parentId: string) => FileTreeEntryProps[];
  getItem: (id: string) => FileTreeEntryProps | undefined;
  updateItem: (id: string, data: Partial<FileTreeEntryProps>) => void;
}

export const useFileTreeStore = create<FilePickerStore>((set, get) => ({
  selectedItems: [],
  allSelected: false,
  allSelectedDefault: true,
  syncingItems: [],
  expandedPaths: [],
  itemsGroups: [],
  search: "",
  setSearch: (search: string) => set({ search }),
  setSyncingItems: (ids: SyncingItemProps[]) =>
    set((state) => {
      // Update itemsGroups to reflect the syncing status
      const updatedItemsGroups = state.itemsGroups.map((group) => ({
        ...group,
        items: group.items.map((item) => {
          // Find if this item is in the syncing list
          const syncingItem = ids.find((syncItem) => syncItem.id === item.id);
          if (syncingItem) {
            // Update the item's status to the syncing status
            return { ...item, status: syncingItem.status };
          }
          return item;
        }),
      }));

      return {
        syncingItems: ids,
        itemsGroups: updatedItemsGroups,
      };
    }),
  getItem: (id: string) => {
    const state = get();
    // Search through all item groups to find the item
    for (const group of state.itemsGroups) {
      const item = group.items.find((item) => item.id === id);
      if (item) return item;
    }
    return undefined;
  },
  updateItem: (id: string, data: Partial<FileTreeEntryProps>) =>
    set((state) => {
      return {
        itemsGroups: state.itemsGroups.map((group) => ({
          ...group,
          items: group.items.map((item) =>
            item.id === id ? { ...item, ...data } : item
          ),
        })),
      };
    }),
  setItems: (parentId: string, items: FileTreeEntryProps[]) =>
    set((state) => {
      // Update or add the items group for this parent
      const existingGroupIndex = state.itemsGroups.findIndex(
        (group) => group.id === parentId
      );

      let newItemsGroups;
      if (existingGroupIndex >= 0) {
        // Update existing group
        newItemsGroups = state.itemsGroups.map((group, index) =>
          index === existingGroupIndex ? { id: parentId, items } : group
        );
      } else {
        // Add new group
        newItemsGroups = [...state.itemsGroups, { id: parentId, items }];
      }

      return {
        itemsGroups: newItemsGroups,
      };
    }),
  getItems: (parentId: string) => {
    const group = get().itemsGroups.find((group) => group.id === parentId);
    return group ? group.items : [];
  },
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
