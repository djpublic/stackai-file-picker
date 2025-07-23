import * as React from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight } from "lucide-react";
import { StatusIcon } from "../ui/status-icon";
import { getFileIcon } from "../ui/file-icon";
import { FileTreeItemProps } from "@/types/file-picker.types";
import { useFileTreeStore } from "@/store/use-file-tree-store";
import { FileTreeItemDelete } from "./file-tree-item-delete";

export default function FileTreeItem({
  entry,
  isOpen = false,
  toggleFolder,
  level = 0,
  parentId,
}: FileTreeItemProps) {
  const {
    selectedItems,
    toggleSelected,
    selectAll,
    syncingItems,
    allSelectedDefault,
    hiddenItems,
    calculateAllSelected,
  } = useFileTreeStore();

  const { name, type, status, id } = entry;
  const indexed = status === "indexed";
  const hidden = hiddenItems.includes(id);
  const selected = selectedItems.includes(id);
  const syncing = syncingItems.includes(id) || status === "indexing";
  const Icon = getFileIcon(name, type, false);
  const checked = allSelectedDefault ? indexed : selected;
  const canDelete = type === "file" && indexed && !hidden && !syncing;

  // Smart checkbox selection handler
  const handleSmartSelection = (checkedState: boolean) => {
    if (type === "directory") {
      // If it's a directory (parent), select/unselect ALL descendants (not just direct children)
      const getAllDescendants = (currentElement: Element): string[] => {
        const descendants: string[] = [];
        const currentLevel = parseInt(
          currentElement.getAttribute("data-level") || "1"
        );

        // Start from the current element and look for subsequent elements at deeper levels
        let nextSibling = currentElement.nextElementSibling;

        while (nextSibling) {
          const siblingLevel = parseInt(
            nextSibling.getAttribute("data-level") || "1"
          );
          const siblingId = nextSibling.getAttribute("data-id");

          // If we encounter an element at the same level or higher, we've reached the end of descendants
          if (siblingLevel <= currentLevel) {
            break;
          }

          // If it's a deeper level and has an ID, it's a descendant
          if (siblingId) {
            descendants.push(siblingId);
          }

          nextSibling = nextSibling.nextElementSibling;
        }

        return descendants;
      };

      // Find the current element in the DOM
      const currentElement = document.querySelector(`[data-id="${id}"]`);
      if (currentElement) {
        const allDescendants = getAllDescendants(currentElement);
        // Include the directory itself + all descendants
        const allIds = [id, ...allDescendants];
        selectAll(allIds, checkedState);
      }
    } else {
      // If it's a file (child), handle individual selection
      toggleSelected(id, checkedState);
    }

    // If unchecking any child (file OR folder), also uncheck the immediate parent folder
    if (!checkedState && parentId) {
      // Check if the parent is currently selected in the store
      const isParentSelected = selectedItems.includes(parentId);
      const isParentSelectedDefault = allSelectedDefault;
      const parentIsChecked = isParentSelectedDefault || isParentSelected;

      // If parent is checked, uncheck it
      if (parentIsChecked) {
        toggleSelected(parentId, false);
      }
    }

    // Update the main checkbox state
    setTimeout(() => calculateAllSelected(), 0);
  };

  // Only on the first render to allow indexed files to be checked
  React.useEffect(() => {
    if (checked) {
      toggleSelected(id, true);
    }
  }, [checked, id, toggleSelected]);

  return (
    <tr
      className={cn(
        "border-b hover:bg-muted/70 transition-colors h-15",
        selected && "bg-muted/30"
      )}
      role="treeitem"
      aria-expanded={isOpen}
      aria-selected={checked ? "true" : "false"}
      aria-label={`${name} - ${status}`}
      data-id={id}
      data-level={level}
      data-parent-id={parentId}
    >
      <td className="w-10 p-3 text-center">
        <Checkbox
          disabled={syncing}
          checked={checked}
          onCheckedChange={(checkedState) =>
            handleSmartSelection(!!checkedState)
          }
        />
      </td>

      <td
        className="p-3 pl-0 min-w-0 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => {
          if (type === "directory") {
            return;
          }

          handleSmartSelection(!selected);
        }}
      >
        <div
          className="flex items-center gap-2 max-w-55 md:max-w-2xl lg:max-w-full"
          style={{ paddingLeft: `${level * 20}px` }}
        >
          {type === "directory" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFolder();
              }}
              className="flex items-center justify-center w-4 h-4 hover:bg-muted rounded-sm transition-colors flex-shrink-0 cursor-pointer"
              tabIndex={0}
              aria-label={`${true ? "Collapse" : "Expand"} folder ABD`}
            >
              {isOpen ? (
                <ChevronDown className="w-6 h-6" />
              ) : (
                <ChevronRight className="w-6 h-6" />
              )}
            </button>
          ) : (
            <div className="w-4 h-4 flex-shrink-0" />
          )}

          <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />

          <span className="text-sm truncate min-w-0 flex-1 break-all line-clamp-1 sm:max-w-55 md:max-w-md lg:max-w-lg flex">
            {name}
            <div className="w-4 h-4 flex-shrink-0" />
            {type === "file" && (
              <StatusIcon
                status={status}
                indexed={indexed}
                syncing={syncing}
                hidden={hidden}
              />
            )}
          </span>
        </div>
      </td>

      <td className="p-3 cursor-pointer hover:bg-muted/30 transition-colors text-right">
        {canDelete && (
          <div className="flex justify-end mr-4">
            <FileTreeItemDelete entry={entry} />
          </div>
        )}
      </td>
    </tr>
  );
}
