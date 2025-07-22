import { KnowledgeBaseDataProps } from "@/types/file-picker.types";

export async function putKnowledgeBaseSync(
  id: string,
  orgId: string
): Promise<KnowledgeBaseDataProps> {
  const response = await fetch(`/api/knowledge-bases/${id}/sync`, {
    method: "PUT",
    body: JSON.stringify({
      org_id: orgId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to update knowledge base");
  }

  return response.json();
}
