import { bytesToHumanReadable, formatDateTime } from "@/lib/utils";
import { useKnowledgeBaseStore } from "@/store/use-knowledge-base-store";
import { Skeleton } from "../ui/skeleton";

export default function FileTreeFooter({ isLoading }: { isLoading: boolean }) {
  const { knowledgeBase } = useKnowledgeBaseStore();

  if (isLoading) {
    return <Skeleton className="w-full h-10 rounded" />;
  }

  return (
    <>
      <hr className="my-1" />
      <div className="flex flex-row justify-between items-center">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Total Size: {bytesToHumanReadable(knowledgeBase?.totalSize)}.
        </div>

        <div className="text-sm text-slate-600 dark:text-slate-400">
          <strong>Last update:</strong>{" "}
          <span className="text-xs">
            {formatDateTime(knowledgeBase?.lastUpdate)}
          </span>
        </div>
      </div>
    </>
  );
}
