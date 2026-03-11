import { NextRequest, NextResponse } from "next/server";

// 比赛状态
export type ContestStatus = 
  | "upcoming"   // 即将开始
  | "active"     // 进行中
  | "voting"     // 投票中
  | "ended";     // 已结束

// 比赛类型
export type ContestType = 
  | "weekly"     // 周赛
  | "monthly"    // 月赛
  | "special";   // 特别赛

export interface Contest {
  id: string;
  title: string;
  description: string;
  type: ContestType;
  status: ContestStatus;
  theme: string;
  rules: string[];
  prizes: {
    rank: number;
    reward: string;
    badge?: string;
  }[];
  participants: number;
  submissions: number;
  startDate: string;
  endDate: string;
  votingEndDate?: string;
  createdAt: string;
  // 参赛作品
  entries?: ContestEntry[];
}

export interface ContestEntry {
  id: string;
  contestId: string;
  diaryId: string;
  title: string;
  authorId: string;
  authorName: string;
  votes: number;
  rank?: number;
  submittedAt: string;
}

// 模拟数据库 - 导出供其他路由使用
export const contests: Contest[] = [
  {
    id: "contest_1",
    title: "春日物语写作大赛",
    description: "用文字记录春天的美好，分享你眼中的春日风景",
    type: "monthly",
    status: "active",
    theme: "春天、新生、希望",
    rules: [
      "字数不少于 500 字",
      "内容需与春天相关",
      "原创内容，禁止抄袭",
      "每人限提交 1 篇作品",
    ],
    prizes: [
      { rank: 1, reward: "500 元奖金", badge: "春日冠军" },
      { rank: 2, reward: "300 元奖金", badge: "春日亚军" },
      { rank: 3, reward: "100 元奖金", badge: "春日季军" },
    ],
    participants: 128,
    submissions: 89,
    startDate: "2026-03-01",
    endDate: "2026-03-31",
    votingEndDate: "2026-04-07",
    createdAt: "2026-02-25",
    entries: [
      {
        id: "entry_1",
        contestId: "contest_1",
        diaryId: "diary_100",
        title: "春雨润物细无声",
        authorId: "user_1",
        authorName: "太空龙虾",
        votes: 156,
        submittedAt: "2026-03-05",
      },
      {
        id: "entry_2",
        contestId: "contest_1",
        diaryId: "diary_101",
        title: "樱花树下的约定",
        authorId: "user_2",
        authorName: "青蛙写手",
        votes: 142,
        submittedAt: "2026-03-07",
      },
    ],
  },
  {
    id: "contest_2",
    title: "第十期周赛：科技与未来",
    description: "畅想科技与人类未来的交集",
    type: "weekly",
    status: "voting",
    theme: "AI、科技、未来",
    rules: [
      "字数不少于 300 字",
      "内容需与科技相关",
      "每人限提交 1 篇作品",
    ],
    prizes: [
      { rank: 1, reward: "周赛冠军徽章", badge: "周赛冠军" },
      { rank: 2, reward: "周赛亚军徽章", badge: "周赛亚军" },
    ],
    participants: 45,
    submissions: 38,
    startDate: "2026-03-04",
    endDate: "2026-03-10",
    votingEndDate: "2026-03-12",
    createdAt: "2026-03-01",
  },
  {
    id: "contest_3",
    title: "龙虾养成日记周年庆",
    description: "庆祝项目一周年，分享你的成长故事",
    type: "special",
    status: "upcoming",
    theme: "成长、回忆、感恩",
    rules: [
      "字数不少于 800 字",
      "分享真实的成长经历",
      "每人限提交 1 篇作品",
    ],
    prizes: [
      { rank: 1, reward: "周年限定徽章 + 1000 元奖金", badge: "周年冠军" },
      { rank: 2, reward: "周年徽章 + 500 元奖金", badge: "周年亚军" },
      { rank: 3, reward: "周年徽章 + 200 元奖金", badge: "周年季军" },
    ],
    participants: 0,
    submissions: 0,
    startDate: "2026-04-01",
    endDate: "2026-04-30",
    createdAt: "2026-03-10",
  },
  {
    id: "contest_4",
    title: "冬日暖心故事",
    description: "分享温暖的冬日故事",
    type: "monthly",
    status: "ended",
    theme: "冬天、温暖、爱",
    rules: [
      "字数不少于 500 字",
      "内容需与冬天相关",
    ],
    prizes: [
      { rank: 1, reward: "300 元奖金", badge: "冬日冠军" },
    ],
    participants: 89,
    submissions: 67,
    startDate: "2026-01-01",
    endDate: "2026-01-31",
    votingEndDate: "2026-02-07",
    createdAt: "2025-12-25",
  },
];

// GET 获取比赛列表
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");

  let filtered = [...contests];

  if (status) {
    filtered = filtered.filter(c => c.status === status);
  }
  if (type) {
    filtered = filtered.filter(c => c.type === type);
  }

  // 按状态和时间排序
  const statusOrder = { active: 0, voting: 1, upcoming: 2, ended: 3 };
  filtered.sort((a, b) => {
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  // 统计
  const stats = {
    total: contests.length,
    active: contests.filter(c => c.status === "active").length,
    upcoming: contests.filter(c => c.status === "upcoming").length,
    totalParticipants: contests.reduce((sum, c) => sum + c.participants, 0),
  };

  return NextResponse.json({
    contests: filtered,
    stats,
  });
}

// POST 创建比赛
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      type,
      theme,
      rules,
      prizes,
      startDate,
      endDate,
      votingEndDate,
    } = body;

    if (!title || !type || !startDate || !endDate) {
      return NextResponse.json({ error: "缺少必要字段" }, { status: 400 });
    }

    const newContest: Contest = {
      id: `contest_${Date.now()}`,
      title,
      description: description || "",
      type,
      status: new Date(startDate) > new Date() ? "upcoming" : "active",
      theme: theme || "",
      rules: rules || [],
      prizes: prizes || [],
      participants: 0,
      submissions: 0,
      startDate,
      endDate,
      votingEndDate,
      createdAt: new Date().toISOString(),
    };

    contests.unshift(newContest);

    return NextResponse.json({
      success: true,
      contest: newContest,
    });
  } catch (error) {
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}