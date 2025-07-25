"use client";

import FileTree from "./file-tree";
import { FileTreeResourceProps } from "@/types/file-picker.types";
import { useKnowledgeBaseStore } from "@/store/use-knowledge-base-store";

interface FileTreeContainerProps {
  loading: boolean;
}

export default function FileTreeContainer({ loading }: FileTreeContainerProps) {
  const { knowledgeBase } = useKnowledgeBaseStore();

  const resource: FileTreeResourceProps = {
    knowledgeBaseId: knowledgeBase?.id,
    orgId: knowledgeBase?.orgId,
    connectionId: knowledgeBase?.connectionId,
  };

  return (
    <FileTree disabled={loading} resource={resource} type="knowledge-base" />
  );
}
