import { bytesToHumanReadable, formatDateTime } from "@/lib/utils";
import { useKnowledgeBaseStore } from "@/store/use-knowledge-base-store";

export default function FileTreeFooter({ isLoading }: { isLoading: boolean }) {
  const { knowledgeBase } = useKnowledgeBaseStore();

  return (
    <>
      <hr className="my-1" />
      <div className="flex flex-row justify-between items-center">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          <strong>{knowledgeBase?.totalFiles}</strong> resources with{" "}
          {bytesToHumanReadable(knowledgeBase?.totalSize)}.
          <br />
          <strong>ID:</strong>{" "}
          <span className="text-xs">{knowledgeBase?.id}</span>
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
