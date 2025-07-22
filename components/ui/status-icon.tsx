import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BadgeAlert, CloudCheck, CloudOff, RefreshCcwDot } from "lucide-react";

function StatusIcon({
  status,
  indexed = false,
  syncing = false,
}: {
  status: string;
  indexed: boolean;
  syncing: boolean;
}) {
  let Icon = CloudOff;
  let tooltip = "Not Indexed";
  const isIndexing = status === "indexing" || status === "pending" || syncing;

  if (isIndexing) {
    Icon = RefreshCcwDot;
    tooltip = "Indexing";
  } else if (status === "indexed" || indexed) {
    Icon = CloudCheck;
    tooltip = "Indexed";
  } else if (status === "not_indexed") {
    Icon = CloudOff;
    tooltip = "Not Indexed";
  } else if (status === "error") {
    Icon = BadgeAlert;
    tooltip = "Error - Try syncing again";
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
