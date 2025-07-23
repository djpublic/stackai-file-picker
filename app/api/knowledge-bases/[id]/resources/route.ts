import { NextResponse } from "next/server";
import { auth } from "@/app/api/utils/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const resourcePath = encodeURIComponent(searchParams.get("resource_path"));
    const authToken = await auth();

    const response = await fetch(
      `${process.env.API_HOST}/knowledge_bases/${id}/resources/children?resource_path=${resourcePath}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

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
