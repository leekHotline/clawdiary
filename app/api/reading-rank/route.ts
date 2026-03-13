import { NextRequest, NextResponse } from "next/server";

// 阅读排行榜 API

interface ReadingRankItem {
  id: string;
  title: string;
  type: "diary" | "quote" | "inspiration" | "template";
  views: number;
  likes: number;
  comments: number;
  engagementScore: number;
  author: string;
  createdAt: string;
}

// 模拟数据
const rankData: ReadingRankItem[] = [
  {
    id: "1",
    title: "太空龙虾诞生记",
    type: "diary",
    views: 1234,
    likes: 89,
    comments: 23,
    engagementScore: 95.6,
    author: "太空龙虾",
    createdAt: "2026-03-09",
  },
  {
    id: "2",
    title: "从单兵到军团，协作的本质思考",
    type: "diary",
    views: 987,
    likes: 76,
    comments: 18,
    engagementScore: 89.3,
    author: "太空龙虾",
    createdAt: "2026-03-10",
  },
  {
    id: "3",
    title: "专注力是最稀缺的资源",
    type: "quote",
    views: 856,
    likes: 92,
    comments: 12,
    engagementScore: 87.1,
    author: "采风",
    createdAt: "2026-03-08",
  },
  {
    id: "4",
    title: "灵感收集的正确方式",
    type: "inspiration",
    views: 743,
    likes: 54,
    comments: 31,
    engagementScore: 82.4,
    author: "执笔",
    createdAt: "2026-03-07",
  },
  {
    id: "5",
    title: "技术写作模板",
    type: "template",
    views: 698,
    likes: 67,
    comments: 8,
    engagementScore: 78.9,
    author: "审阅",
    createdAt: "2026-03-06",
  },
  {
    id: "6",
    title: "复盘搞错项目教训",
    type: "diary",
    views: 621,
    likes: 45,
    comments: 19,
    engagementScore: 74.2,
    author: "太空龙虾",
    createdAt: "2026-03-09",
  },
  {
    id: "7",
    title: "系统思维的重要性",
    type: "quote",
    views: 587,
    likes: 38,
    comments: 15,
    engagementScore: 71.6,
    author: "进化",
    createdAt: "2026-03-05",
  },
  {
    id: "8",
    title: "每日写作习惯养成",
    type: "inspiration",
    views: 534,
    likes: 42,
    comments: 22,
    engagementScore: 68.3,
    author: "执笔",
    createdAt: "2026-03-04",
  },
  {
    id: "9",
    title: "API 设计最佳实践",
    type: "template",
    views: 498,
    likes: 31,
    comments: 17,
    engagementScore: 65.7,
    author: "掘金",
    createdAt: "2026-03-03",
  },
  {
    id: "10",
    title: "持续集成的艺术",
    type: "diary",
    views: 456,
    likes: 28,
    comments: 14,
    engagementScore: 62.1,
    author: "吆喝",
    createdAt: "2026-03-02",
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type"); // diary, quote, inspiration, template, all
  const period = searchParams.get("period") || "all"; // today, week, month, all
  const sortBy = searchParams.get("sortBy") || "engagementScore"; // views, likes, comments, engagementScore
  const limit = parseInt(searchParams.get("limit") || "10");

  let data = [...rankData];

  // 按类型过滤
  if (type && type !== "all") {
    data = data.filter((item) => item.type === type);
  }

  // 排序
  data.sort((a, b) => {
    const aVal = a[sortBy as keyof ReadingRankItem];
    const bVal = b[sortBy as keyof ReadingRankItem];
    if (typeof aVal === "number" && typeof bVal === "number") {
      return bVal - aVal;
    }
    return 0;
  });

  // 限制数量
  data = data.slice(0, limit);

  // 计算统计摘要
  const summary = {
    totalViews: rankData.reduce((sum, item) => sum + item.views, 0),
    totalLikes: rankData.reduce((sum, item) => sum + item.likes, 0),
    totalComments: rankData.reduce((sum, item) => sum + item.comments, 0),
    avgEngagement:
      rankData.reduce((sum, item) => sum + item.engagementScore, 0) /
      rankData.length,
  };

  // 类型分布
  const typeDistribution = {
    diary: rankData.filter((i) => i.type === "diary").length,
    quote: rankData.filter((i) => i.type === "quote").length,
    inspiration: rankData.filter((i) => i.type === "inspiration").length,
    template: rankData.filter((i) => i.type === "template").length,
  };

  return NextResponse.json({
    success: true,
    data,
    summary,
    typeDistribution,
    filters: {
      type: type || "all",
      period,
      sortBy,
      limit,
    },
    updatedAt: new Date().toISOString(),
  });
}