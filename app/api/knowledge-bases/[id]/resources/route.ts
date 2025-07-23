import { NextResponse } from "next/server";
import { auth } from "@/app/api/utils/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const resourcePath = searchParams.get("resource_path");
    const search = searchParams.get("search");
    const authToken = await auth();
    const baseUrl = `${process.env.API_HOST}/knowledge_bases/${id}`;

    const url =
      search !== null
        ? `${baseUrl}/search?search_query=${search}`
        : `${baseUrl}/resources/children?resource_path=${resourcePath}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching knowledge base resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch knowledge base resources" },
      { status: 500 }
    );
  }
}
