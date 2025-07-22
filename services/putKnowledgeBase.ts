import { KnowledgeBaseDataProps } from "@/types/file-picker.types";

export async function putKnowledgeBase(
  id: string,
  data: KnowledgeBaseDataProps
): Promise<KnowledgeBaseDataProps> {
  const response = await fetch(`/api/knowledge-bases/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update knowledge base");
  }

  return response.json();
}
