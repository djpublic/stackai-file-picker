import { KnowledgeBaseDataProps } from "@/types/file-picker.types";

export async function getKnowledgeBase(
  id: string
): Promise<KnowledgeBaseDataProps> {
  const response = await fetch(`/api/knowledge-bases/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch knowledge base");
  }

  return response.json();
}
