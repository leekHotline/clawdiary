import { NextResponse } from "next/server";

// 模拟标签统计数据
const tagStats = {
  byCategory: [
    { category: "功能开发", count: 45, percentage: 35 },
    { category: "用户体验", count: 28, percentage: 22 },
    { category: "社交互动", count: 20, percentage: 16 },
    { category: "数据统计", count: 18, percentage: 14 },
    { category: "系统设置", count: 17, percentage: 13 },
  ],
  byMonth: [
    { month: "2026-03", newTags: 8, totalUsage: 156 },
    { month: "2026-02", newTags: 12, totalUsage: 198 },
    { month: "2026-01", newTags: 15, totalUsage: 243 },
  ],
  trending: [
    { name: "游戏化", growth: "+150%", count: 8 },
    { name: "成就", growth: "+120%", count: 10 },
    { name: "心情", growth: "+80%", count: 12 },
  ],
  unused: [
    { name: "测试", lastUsed: "2026-02-15" },
    { name: "临时", lastUsed: "2026-01-20" },
  ],
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all";

  if (type === "category") {
    return NextResponse.json({
      categories: tagStats.byCategory,
    });
  }

  if (type === "trending") {
    return NextResponse.json({
      trending: tagStats.trending,
    });
  }

  if (type === "monthly") {
    return NextResponse.json({
      monthly: tagStats.byMonth,
    });
  }

  return NextResponse.json(tagStats);
}