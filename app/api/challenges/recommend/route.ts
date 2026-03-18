import { NextResponse } from "next/server";
import { getRecommendedChallenges } from "@/lib/challenges";

// GET /api/challenges/recommend - 获取推荐挑战
export async function GET() {
  try {
    const recommendations = await getRecommendedChallenges();

    return NextResponse.json({
      success: true,
      data: recommendations,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}