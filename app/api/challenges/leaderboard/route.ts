import { NextRequest, NextResponse } from "next/server";
import { getChallengeLeaderboard } from "@/lib/challenges";

// GET /api/challenges/leaderboard - 获取挑战排行榜
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "all"; // all, week, month
    const limit = parseInt(searchParams.get("limit") || "10");

    const leaderboard = await getChallengeLeaderboard(period, limit);

    return NextResponse.json({
      success: true,
      data: leaderboard,
      period,
    });
  } catch (_error) {
    console.error("Error fetching leaderboard:", _error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}