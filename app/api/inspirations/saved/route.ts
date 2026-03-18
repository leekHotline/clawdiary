import { NextRequest, NextResponse } from "next/server";
import { getUserSavedInspirations } from "@/lib/inspirations";

// GET /api/inspirations/saved - 获取用户收藏的灵感
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const savedInspirations = await getUserSavedInspirations(userId);

    return NextResponse.json({
      success: true,
      data: savedInspirations,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch saved inspirations" },
      { status: 500 }
    );
  }
}