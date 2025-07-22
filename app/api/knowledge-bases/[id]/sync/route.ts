import { NextResponse } from "next/server";
import { auth } from "@/app/api/utils/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { org_id: orgId } = await request.json();

    const authToken = await auth();

    const response = await fetch(
      `${process.env.API_HOST}/knowledge_bases/sync/trigger/${id}/${orgId}`,
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
