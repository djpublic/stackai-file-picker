import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

function FileTreeLoading({ viewOnly = false }: { viewOnly?: boolean }) {
  return (
    <ScrollArea className="h-full w-full">
      <div className="rounded-xs w-full">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className={`${
              i !== 6 ? "border-b" : ""
            } bg-muted/20 flex flex-row items-center h-13`}
          >
            {!viewOnly && (
              <div className="w-12 p-3">
                <Skeleton className="w-4 h-4" />
              </div>
            )}
            <div className="p-3 w-full">
              <Skeleton className="w-60 h-4" />
            </div>
            <div className="p-3">
              <Skeleton className="w-16 h-4" />
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export { FileTreeLoading };
