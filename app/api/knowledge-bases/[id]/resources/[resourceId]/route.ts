import { NextResponse } from "next/server";
import { auth } from "@/app/api/utils/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const authToken = await auth();

    const response = await fetch(
      `${process.env.API_HOST}/knowledge_bases/${id}/resources?resource_path=${body.resource_path}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        method: "DELETE",
      }
    );

    const responseOk = response.ok;

    if (!responseOk) {
      throw new Error("Failed to delete knowledge base resources");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}
