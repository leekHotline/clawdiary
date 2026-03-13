import { NextRequest, NextResponse } from "next/server";
import { getRandomInspiration } from "@/lib/inspirations";

// GET /api/inspirations/random - 获取随机灵感
export async function GET(request: NextRequest) {
  try {
    const inspiration = await getRandomInspiration();

    if (!inspiration) {
      return NextResponse.json(
        { success: false, error: "No inspirations available" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: inspiration,
    });
  } catch (_error) {
    console.error("Error fetching random inspiration:", _error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch random inspiration" },
      { status: 500 }
    );
  }
}