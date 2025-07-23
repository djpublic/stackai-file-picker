import { Skeleton } from "@/components/ui/skeleton";

function FileTreeRowLoading() {
  return (
    <tr>
      <td colSpan={3} className="p-3 bg-muted/70">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-full h-4" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4" />
            <Skeleton className="w-full h-4" />
          </div>
        </div>
      </td>
    </tr>
  );
}

export { FileTreeRowLoading };
