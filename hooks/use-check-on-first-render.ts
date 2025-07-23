import { useEffect } from "react";
import { useFileTreeStore } from "@/store/use-file-tree-store";

interface UseCheckOnFirstRenderProps {
  id: string;
  checked: boolean;
  parentId?: string;
  rowRef?: React.RefObject<HTMLTableRowElement>;
}

/**
 * Hook to handle automatic checking of items on first render
 * based on their checked state or parent's checked state
 */
export const useCheckOnFirstRender = ({
  id,
  checked,
  parentId,
  rowRef,
}: UseCheckOnFirstRenderProps) => {
  const { toggleSelected } = useFileTreeStore();

  useEffect(() => {
    let parentChecked = false;

    const parent = rowRef?.current?.parentElement?.querySelector(
      `[data-id="${parentId}"]`
    );

    if (parent) {
      parentChecked = !!parent.querySelector("button[data-state='checked']");
    }

    if (checked || parentChecked) {
      toggleSelected(id, true);
    }
  }, [checked, id, toggleSelected, parentId, rowRef]);
};
