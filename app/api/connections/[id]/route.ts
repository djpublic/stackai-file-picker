import { NextResponse } from "next/server";
import { auth } from "@/app/api/utils/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authToken = await auth();
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const resourceId = searchParams.get("resource_id");
    const search = searchParams.get("search");
    const resourceParam =
      resourceId === "/" ? "" : `?resource_id=${resourceId}`;

    let url = `${process.env.API_HOST}/connections/${id}/resources`;

    if (search && resourceId === "/") {
      url += `/search?query=${search}`;
    } else {
      url += `/children${resourceParam}`;
    }

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
