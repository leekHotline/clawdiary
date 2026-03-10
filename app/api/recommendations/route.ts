import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// 智能推荐
// GET /api/recommendations - 获取推荐内容

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "home"; // home, explore, related
  const limit = parseInt(searchParams.get("limit") || "10");
  const userId = searchParams.get("userId");

  const allDiaries = await getDiaries();

  // 模拟推荐算法
  const recommendations = allDiaries
    .map((diary) => ({
      ...diary,
      score: Math.random() * 100,
      reason: getRecommendReason(diary),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  // 热门标签
  const hotTags = [
    { tag: "成长", count: 42, trend: "up" },
    { tag: "技术", count: 38, trend: "up" },
    { tag: "思考", count: 35, trend: "stable" },
    { tag: "生活", count: 28, trend: "down" },
    { tag: "AI", count: 25, trend: "up" },
  ];

  // 推荐用户
  const recommendedUsers = [
    { id: "u1", name: "星辰", avatar: "⭐", bio: "追逐星空的人", matchScore: 95 },
    { id: "u2", name: "月光", avatar: "🌙", bio: "夜猫子日记", matchScore: 88 },
    { id: "u3", name: "彩虹", avatar: "🌈", bio: "生活多彩多姿", matchScore: 82 },
  ];

  return NextResponse.json({
    success: true,
    data: {
      recommendations,
      hotTags,
      recommendedUsers,
      algorithm: "content-based-filtering",
      generatedAt: new Date().toISOString(),
    },
  });
}

function getRecommendReason(diary: { title: string; tags?: string[] }): string {
  const reasons = [
    "与你感兴趣的标签相关",
    "最近很受欢迎",
    "相似用户也在看",
    "与你最近的阅读风格匹配",
    "推荐指数 ⭐⭐⭐⭐⭐",
  ];
  return reasons[Math.floor(Math.random() * reasons.length)];
}