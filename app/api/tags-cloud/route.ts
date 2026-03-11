import { NextResponse } from "next/server";

// 模拟标签数据
const tagsData = [
  { name: "功能", count: 28 },
  { name: "优化", count: 22 },
  { name: "UI", count: 18 },
  { name: "日记", count: 15 },
  { name: "心情", count: 12 },
  { name: "成就", count: 10 },
  { name: "社交", count: 9 },
  { name: "游戏化", count: 8 },
  { name: "数据", count: 7 },
  { name: "API", count: 6 },
  { name: "搜索", count: 5 },
  { name: "分享", count: 5 },
  { name: "统计", count: 4 },
  { name: "主题", count: 4 },
  { name: "写作", count: 4 },
  { name: "时间线", count: 3 },
  { name: "可视化", count: 3 },
  { name: "协作", count: 3 },
  { name: "通知", count: 2 },
  { name: "设置", count: 2 },
];

// 预设颜色
const tagColors = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
  "bg-yellow-100 text-yellow-700",
  "bg-pink-100 text-pink-700",
  "bg-orange-100 text-orange-700",
  "bg-red-100 text-red-700",
  "bg-indigo-100 text-indigo-700",
];

export async function GET() {
  const maxCount = Math.max(...tagsData.map(t => t.count));

  const tags = tagsData.map((tag, index) => ({
    ...tag,
    color: tagColors[index % tagColors.length],
    // 计算字体大小比例 (0.8 - 2.0)
    fontSize: 0.8 + (tag.count / maxCount) * 1.2,
  }));

  const stats = {
    totalTags: tagsData.length,
    totalUsage: tagsData.reduce((sum, t) => sum + t.count, 0),
    avgUsage: (tagsData.reduce((sum, t) => sum + t.count, 0) / tagsData.length).toFixed(1),
    maxCount,
    topTag: tagsData[0]?.name || null,
  };

  return NextResponse.json({
    tags,
    stats,
    lastUpdated: new Date().toISOString(),
  });
}