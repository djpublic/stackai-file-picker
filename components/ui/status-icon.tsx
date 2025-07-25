import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BadgeAlert, CloudCheck, CloudOff, RefreshCw } from "lucide-react";
import { FileTreeEntryStatusProps } from "@/types/file-picker.types";

function StatusIcon({ status }: { status: FileTreeEntryStatusProps | null }) {
  let Icon = null;
  let tooltip = null;

  const isIndexing = status === "indexing" || status === "pending";

  const isIndexed = !isIndexing && status === "indexed";

  const isError =
    (!isIndexed && !isIndexing && status === "error") ||
    status === "deleting_error";

  if (isIndexing) {
    Icon = RefreshCw;
    tooltip = "Indexing";
  } else if (isIndexed) {
    Icon = CloudCheck;
    tooltip = "Indexed";
  } else if (isError) {
    Icon = BadgeAlert;
    tooltip = "Error - Try syncing again";
  } else {
    Icon = CloudOff;
    tooltip = "Not Indexed";
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>
          <Icon className={cn("w-5 h-5", isIndexing && "animate-spin")} />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export { StatusIcon };
