import * as React from "react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
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
  onDelete,
}: FileTreeItemProps) {
  const {
    selectedItems,
    toggleSelected,
    syncingItems,
    allSelectedDefault,
    hiddenItems,
  } = useFileTreeStore();

  const { name, type, status, id } = entry;
  const indexed = status === "indexed";
  const hidden = hiddenItems.includes(id);
  const selected = selectedItems.includes(id);
  const syncing = syncingItems.includes(id) || status === "indexing";
  const Icon = getFileIcon(name, type, false);
  const checked = allSelectedDefault ? indexed : selected;
  const canDelete = type === "file" && indexed && !hidden && !syncing;

  // Only on the first render to allow indexed files to be checked
  React.useEffect(() => {
    if (checked) {
      toggleSelected(id, true);
    }
  }, []);

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
    >
      <td className="w-10 p-3 text-center">
        <Checkbox
          disabled={syncing}
          checked={checked}
          onCheckedChange={(checkedState) => toggleSelected(id, checkedState)}
        />
      </td>

      <td
        className="p-3 pl-0 min-w-0 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => {
          if (type === "directory") {
            return toggleFolder();
          }

          toggleSelected(id, !selected);
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
            <FileTreeItemDelete entry={entry} onDelete={onDelete} />
          </div>
        )}
      </td>
    </tr>
  );
}
