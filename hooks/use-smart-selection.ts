import { useCallback } from "react";
import { useFileTreeStore } from "@/store/use-file-tree-store";
import { FileTreeEntryProps } from "@/types/file-picker.types";

interface UseSmartSelectionProps {
  entry: FileTreeEntryProps;
  parentId?: string;
}

/**
 * Gets all descendant IDs for a directory element in the DOM
 */
const getDirectoryDescendants = (currentElement: Element): string[] => {
  const descendants: string[] = [];
  const currentLevel = parseInt(
    currentElement.getAttribute("data-level") || "1"
  );

  let nextSibling = currentElement.nextElementSibling;

  while (nextSibling) {
    const siblingLevel = parseInt(
      nextSibling.getAttribute("data-level") || "1"
    );
    const siblingId = nextSibling.getAttribute("data-id");

    // Stop when we reach an element at the same level or higher
    if (siblingLevel <= currentLevel) {
      break;
    }

    // Add descendant IDs
    if (siblingId) {
      descendants.push(siblingId);
    }

    nextSibling = nextSibling.nextElementSibling;
  }

  return descendants;
};

/**
 * Checks if an item is checked (either by default or explicitly selected)
 */
const isItemChecked = (
  itemId: string,
  selectedItems: string[],
  allSelectedDefault: boolean
): boolean => {
  return allSelectedDefault || selectedItems.includes(itemId);
};

/**
 * Determines if this item is a level 1 item (top-level)
 */
const isLevel1Item = (parentId?: string): boolean => {
  return !parentId || parentId === "/";
};

/**
 * Gets the DOM level attribute for an element
 */
const getElementLevel = (elementId: string): string | null => {
  const element = document.querySelector(`[data-id="${elementId}"]`);
  return element?.getAttribute("data-level") ?? null;
};

export const useSmartSelection = ({
  entry,
  parentId,
}: UseSmartSelectionProps) => {
  const {
    selectedItems,
    toggleSelected,
    selectAll,
    allSelectedDefault,
    calculateAllSelected,
  } = useFileTreeStore();

  const { id, type } = entry;

  /**
   * Handles directory selection by selecting/unselecting all descendants
   */
  const handleDirectorySelection = useCallback(
    (checkedState: boolean) => {
      const currentElement = document.querySelector(`[data-id="${id}"]`);
      if (!currentElement) return;

      const descendants = getDirectoryDescendants(currentElement);
      const allIds = [id, ...descendants];
      selectAll(allIds, checkedState);
    },
    [id, selectAll]
  );

  /**
   * Handles file selection
   */
  const handleFileSelection = useCallback(
    (checkedState: boolean) => {
      toggleSelected(id, checkedState);
    },
    [id, toggleSelected]
  );

  /**
   * Handles parent unchecking logic when a child is unchecked
   */
  const handleParentUnchecking = useCallback(
    (checkedState: boolean): boolean => {
      // Only uncheck parent when unchecking a child
      if (checkedState || !parentId) return false;

      const parentIsChecked = isItemChecked(
        parentId,
        selectedItems,
        allSelectedDefault
      );

      if (!parentIsChecked) return false;

      // Get levels to determine if we should trigger main selector update
      const parentLevel = getElementLevel(parentId);
      const currentLevel = getElementLevel(id);

      // Uncheck the parent
      toggleSelected(parentId, false);

      // Return true if this should trigger main selector update
      // (only when a level 2 item unchecks a level 1 parent)
      return parentLevel === "1" && currentLevel === "2";
    },
    [parentId, selectedItems, allSelectedDefault, toggleSelected, id]
  );

  /**
   * Main selection handler
   */
  const handleSelection = useCallback(
    (checkedState: boolean) => {
      // Handle selection based on item type
      if (type === "directory") {
        handleDirectorySelection(checkedState);
      } else {
        handleFileSelection(checkedState);
      }

      // Handle parent unchecking and check if main selector should update
      const willUpdateMainSelector = handleParentUnchecking(checkedState);

      // Update main selector for level 1 items or when level 2 unchecks level 1 parent
      const shouldUpdateMainSelector =
        isLevel1Item(parentId) || willUpdateMainSelector;

      if (shouldUpdateMainSelector) {
        setTimeout(() => calculateAllSelected(), 0);
      }
    },
    [
      type,
      handleDirectorySelection,
      handleFileSelection,
      handleParentUnchecking,
      parentId,
      calculateAllSelected,
    ]
  );

  return {
    handleSelection,
  };
};
