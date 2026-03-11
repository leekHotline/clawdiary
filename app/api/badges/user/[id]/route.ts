import { NextRequest, NextResponse } from "next/server";

// Badge data: earned badges have earnedAt, in-progress badges have only progress
type BadgeData = { earnedAt: string; progress?: number } | { earnedAt?: never; progress: number };

// Mock user badges data
const userBadges: Record<string, BadgeData[]> = {
  "user-1": [
    { earnedAt: "2026-03-09" }, // first-diary
    { earnedAt: "2026-03-11" }, // early-bird
    { earnedAt: "2026-03-10" }, // night-owl
    { earnedAt: "2026-03-11" }, // challenger
    { progress: 5 }, // week-streak in progress
    { progress: 3 }, // creative-writer in progress
    { progress: 67 }, // social-butterfly in progress
  ],
};

// GET /api/badges/user/[id] - Get user's badge progress
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = id;
  const userBadgeData = userBadges[userId] || [];

  // Calculate stats
  const earnedBadges = userBadgeData.filter((b) => b.earnedAt);
  const inProgressBadges = userBadgeData.filter((b) => b.progress && !b.earnedAt);

  return NextResponse.json({
    userId,
    badges: userBadgeData,
    stats: {
      earned: earnedBadges.length,
      inProgress: inProgressBadges.length,
      total: 15, // Total available badges
    },
  });
}