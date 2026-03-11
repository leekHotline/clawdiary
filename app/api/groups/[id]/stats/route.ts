import { NextResponse } from "next/server";

// 群组统计 API
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get("groupId");
  const period = searchParams.get("period") || "week"; // day, week, month, year

  // 模拟统计数据
  const stats = {
    overview: {
      totalMembers: 128,
      newMembersToday: 5,
      totalDiaries: 1567,
      diariesToday: 12,
      totalComments: 4521,
      commentsToday: 34,
      totalReactions: 8934,
      activeMembersToday: 28,
    },
    growth: {
      membersChange: 12,
      diariesChange: 45,
      engagementChange: 23,
    },
    topContributors: [
      { id: "u1", name: "星辰", avatar: "⭐", diaries: 45, comments: 120, likes: 356 },
      { id: "u2", name: "月光", avatar: "🌙", diaries: 38, comments: 89, likes: 234 },
      { id: "u3", name: "彩虹", avatar: "🌈", diaries: 22, comments: 67, likes: 178 },
    ],
    recentActivity: [
      { date: "2026-03-12", diaries: 12, comments: 34, members: 5 },
      { date: "2026-03-11", diaries: 8, comments: 28, members: 3 },
      { date: "2026-03-10", diaries: 15, comments: 42, members: 7 },
      { date: "2026-03-09", diaries: 10, comments: 35, members: 2 },
      { date: "2026-03-08", diaries: 6, comments: 20, members: 4 },
    ],
    tagDistribution: [
      { tag: "写作", count: 234 },
      { tag: "成长", count: 189 },
      { tag: "思考", count: 156 },
      { tag: "生活", count: 123 },
      { tag: "学习", count: 98 },
    ],
  };

  return NextResponse.json({
    success: true,
    data: stats,
  });
}