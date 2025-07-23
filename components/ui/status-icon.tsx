import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BadgeAlert, CloudCheck, CloudOff, RefreshCw } from "lucide-react";

function StatusIcon({
  status,
  indexed = false,
  syncing = false,
}: {
  status: string;
  indexed: boolean;
  syncing: boolean;
}) {
  let Icon = null;
  let tooltip = null;

  const isIndexing = status === "indexing" || status === "pending" || syncing;

  const isIndexed = !isIndexing && (status === "indexed" || indexed);

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
