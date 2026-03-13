import { NextRequest, NextResponse } from "next/server";
import { saveInspiration } from "@/lib/inspirations";

// POST /api/inspirations/[id]/save - 收藏灵感
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

    const result = await saveInspiration(id, userId);

    return NextResponse.json({ 
      success: true, 
      data: result,
      message: result.saved ? "Saved!" : "Unsaved"
    });
  } catch (_error) {
    console.error("Error saving inspiration:", _error);
    return NextResponse.json(
      { success: false, error: "Failed to save inspiration" },
      { status: 500 }
    );
  }
}