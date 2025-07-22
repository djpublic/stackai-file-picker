import { ConnectionResourceListResponse } from "@/types/file-picker.types";

// Minimal interface for the API response data we actually need
export async function getConnectionResource(
  url: string
): Promise<ConnectionResourceListResponse> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch connection resource");
  }

  return response.json();
}
