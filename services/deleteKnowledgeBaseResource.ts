import { DeleteKnowledgeBaseResourceProps } from "@/types/file-picker.types";

export async function deleteKnowledgeBaseResource(
  knowledgeBaseId: string,
  path: string
): Promise<any> {
  const response = await fetch(
    `/api/knowledge-bases/${knowledgeBaseId}/resources/default`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resource_path: path }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete knowledge base resource");
  }

  return response.json();
}
