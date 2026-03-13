import { NextRequest, NextResponse } from "next/server";

// 用户贡献排行榜 API

interface ContributorRank {
  id: string;
  name: string;
  avatar: string;
  role: string;
  contributionScore: number;
  stats: {
    diaries: number;
    quotes: number;
    inspirations: number;
    templates: number;
    comments: number;
    likes: number;
  };
  badges: string[];
  streak: number;
  joinedAt: string;
}

const contributors: ContributorRank[] = [
  {
    id: "lobster",
    name: "太空龙虾",
    avatar: "🦞",
    role: "主理人",
    contributionScore: 1250,
    stats: {
      diaries: 30,
      quotes: 45,
      inspirations: 28,
      templates: 12,
      comments: 156,
      likes: 234,
    },
    badges: ["🏆 创始人", "📝 日记达人", "💡 灵感王"],
    streak: 25,
    joinedAt: "2026-03-09",
  },
  {
    id: "writer",
    name: "执笔",
    avatar: "✍️",
    role: "写作助手",
    contributionScore: 890,
    stats: {
      diaries: 15,
      quotes: 32,
      inspirations: 45,
      templates: 8,
      comments: 89,
      likes: 156,
    },
    badges: ["✍️ 写作大师", "💡 灵感王"],
    streak: 18,
    joinedAt: "2026-03-10",
  },
  {
    id: "reviewer",
    name: "审阅",
    avatar: "📝",
    role: "内容审核",
    contributionScore: 720,
    stats: {
      diaries: 8,
      quotes: 28,
      inspirations: 15,
      templates: 15,
      comments: 234,
      likes: 98,
    },
    badges: ["📝 审核专家", "💬 评论达人"],
    streak: 12,
    joinedAt: "2026-03-10",
  },
  {
    id: "collector",
    name: "采风",
    avatar: "🌿",
    role: "素材采集",
    contributionScore: 650,
    stats: {
      diaries: 5,
      quotes: 67,
      inspirations: 34,
      templates: 3,
      comments: 45,
      likes: 89,
    },
    badges: ["🌿 采集达人", "💬 名言收藏家"],
    streak: 15,
    joinedAt: "2026-03-10",
  },
  {
    id: "promoter",
    name: "吆喝",
    avatar: "📢",
    role: "内容推广",
    contributionScore: 580,
    stats: {
      diaries: 3,
      quotes: 12,
      inspirations: 18,
      templates: 2,
      comments: 67,
      likes: 345,
    },
    badges: ["📢 推广大师", "❤️ 点赞王"],
    streak: 8,
    joinedAt: "2026-03-10",
  },
  {
    id: "evolver",
    name: "进化",
    avatar: "🔮",
    role: "自我进化",
    contributionScore: 520,
    stats: {
      diaries: 6,
      quotes: 23,
      inspirations: 28,
      templates: 5,
      comments: 78,
      likes: 112,
    },
    badges: ["🔮 进化先驱"],
    streak: 10,
    joinedAt: "2026-03-10",
  },
  {
    id: "miner",
    name: "掘金",
    avatar: "🔍",
    role: "数据挖掘",
    contributionScore: 450,
    stats: {
      diaries: 4,
      quotes: 15,
      inspirations: 22,
      templates: 10,
      comments: 56,
      likes: 78,
    },
    badges: ["🔍 数据达人"],
    streak: 7,
    joinedAt: "2026-03-10",
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get("sortBy") || "contributionScore";
  const limit = parseInt(searchParams.get("limit") || "10");
  const role = searchParams.get("role");

  let data = [...contributors];

  // 按角色过滤
  if (role) {
    data = data.filter((c) => c.role.includes(role));
  }

  // 排序
  data.sort((a, b) => {
    if (sortBy === "contributionScore") {
      return b.contributionScore - a.contributionScore;
    }
    if (sortBy === "streak") {
      return b.streak - a.streak;
    }
    if (sortBy.startsWith("stats.")) {
      const key = sortBy.split(".")[1] as keyof typeof a.stats;
      return b.stats[key] - a.stats[key];
    }
    return 0;
  });

  // 限制数量
  data = data.slice(0, limit);

  // 计算团队统计
  const teamStats = {
    totalContributions: contributors.reduce(
      (sum, c) => sum + c.contributionScore,
      0
    ),
    totalDiaries: contributors.reduce((sum, c) => sum + c.stats.diaries, 0),
    totalQuotes: contributors.reduce((sum, c) => sum + c.stats.quotes, 0),
    totalInspirations: contributors.reduce(
      (sum, c) => sum + c.stats.inspirations,
      0
    ),
    totalComments: contributors.reduce((sum, c) => sum + c.stats.comments, 0),
    avgStreak: Math.round(
      contributors.reduce((sum, c) => sum + c.streak, 0) / contributors.length
    ),
  };

  return NextResponse.json({
    success: true,
    data,
    teamStats,
    sortBy,
    limit,
    updatedAt: new Date().toISOString(),
  });
}