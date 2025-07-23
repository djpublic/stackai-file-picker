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
  const currentId = currentElement.getAttribute("data-id");
  if (!currentId) return [];

  // Find all elements that have this element as their parent
  const directChildren = document.querySelectorAll(
    `[data-parent-id="${currentId}"]`
  );
  const allDescendants: string[] = [];

  // Get IDs of direct children and recursively get their descendants
  directChildren.forEach((child) => {
    const childId = child.getAttribute("data-id");
    if (childId) {
      allDescendants.push(childId);
      // Recursively get descendants of this child
      allDescendants.push(...getDirectoryDescendants(child));
    }
  });

  return allDescendants;
};

/**
 * Checks if an item is checked (either by default or explicitly selected)
 */
const isItemChecked = (
  itemId: string,
  isSelected: (id: string) => boolean,
  allSelectedDefault: boolean
): boolean => {
  return allSelectedDefault || isSelected(itemId);
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
  const { isSelected, toggleSelected, selectAll, allSelectedDefault } =
    useFileTreeStore();

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

      // Convert to SelectedItem objects with parentId information
      const items = allIds.map((itemId) => {
        // For the directory itself, use its parentId
        if (itemId === id) {
          return { id: itemId, parentId };
        }
        // For descendants, we need to find their actual parentId from DOM
        const element = document.querySelector(`[data-id="${itemId}"]`);
        const itemParentId =
          element?.getAttribute("data-parent-id") || undefined;
        return { id: itemId, parentId: itemParentId };
      });

      selectAll(items, checkedState);
    },
    [id, parentId, selectAll]
  );

  /**
   * Handles file selection
   */
  const handleFileSelection = useCallback(
    (checkedState: boolean) => {
      toggleSelected(id, parentId, checkedState);
    },
    [id, parentId, toggleSelected]
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
        isSelected,
        allSelectedDefault
      );

      if (!parentIsChecked) return false;

      // Get levels to determine if we should trigger main selector update
      const parentLevel = getElementLevel(parentId);
      const currentLevel = getElementLevel(id);

      // Get the parent's parentId from DOM
      const parentElement = document.querySelector(`[data-id="${parentId}"]`);
      const grandParentId =
        parentElement?.getAttribute("data-parent-id") || undefined;

      // Uncheck the parent
      toggleSelected(parentId, grandParentId, false);

      // Return true if this should trigger main selector update
      // (only when a level 2 item unchecks a level 1 parent)
      return parentLevel === "1" && currentLevel === "2";
    },
    [parentId, isSelected, allSelectedDefault, toggleSelected, id]
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
      handleParentUnchecking(checkedState);
    },
    [
      type,
      handleDirectorySelection,
      handleFileSelection,
      handleParentUnchecking,
      parentId,
    ]
  );

  return {
    handleSelection,
  };
};
