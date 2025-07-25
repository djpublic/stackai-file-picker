import { useEffect, useRef } from "react";
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
  const runRef = useRef(false);

  useEffect(() => {
    // Only run once on mount, not on every state change
    if (runRef.current) return;
    runRef.current = true;

    const itemChecked = rowRef?.current?.querySelector(
      `button[data-state="checked"]`
    );

    let parentChecked = false;

    const parent = rowRef?.current?.parentElement?.querySelector(
      `[data-id="${parentId}"]`
    );

    if (parent) {
      parentChecked = !!parent.querySelector("button[data-state='checked']");
    }

    if (checked || parentChecked || itemChecked) {
      toggleSelected(id, parentId, true);
    }
  }, [id, parentId, rowRef]);
};
