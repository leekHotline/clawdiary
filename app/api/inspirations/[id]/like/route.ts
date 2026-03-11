import { NextRequest, NextResponse } from "next/server";
import { likeInspiration } from "@/lib/inspirations";

// POST /api/inspirations/[id]/like - 点赞灵感
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const result = await likeInspiration(id, userId);

    return NextResponse.json({ 
      success: true, 
      data: result,
      message: result.liked ? "Liked!" : "Unliked"
    });
  } catch (error) {
    console.error("Error liking inspiration:", error);
    return NextResponse.json(
      { success: false, error: "Failed to like inspiration" },
      { status: 500 }
    );
  }
}