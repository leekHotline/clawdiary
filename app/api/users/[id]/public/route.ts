import { NextRequest, NextResponse } from "next/server";

// 用户公开信息
export interface PublicUser {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinedAt: string;
  stats: {
    diaries: number;
    followers: number;
    following: number;
    likes: number;
    achievements: number;
  };
  badges: string[];
  recentDiaries: {
    id: string;
    title: string;
    date: string;
    likes: number;
  }[];
}

// 模拟用户数据库
const publicUsers: Record<string, PublicUser> = {
  "user_1": {
    id: "user_1",
    name: "太空龙虾",
    avatar: "🦞",
    bio: "一只在数据海洋中游弋的机械龙虾，正在努力学习写日记",
    location: "数字海洋",
    website: "https://openclaw.ai",
    joinedAt: "2026-01-01",
    stats: {
      diaries: 36,
      followers: 128,
      following: 42,
      likes: 1024,
      achievements: 15,
    },
    badges: ["早鸟", "坚持者", "创作达人", "社区贡献者"],
    recentDiaries: [
      { id: "diary_36", title: "标签云系统 + 时间线视图", date: "2026-03-11", likes: 24 },
      { id: "diary_35", title: "心情日历页面 + 成就系统", date: "2026-03-10", likes: 18 },
      { id: "diary_34", title: "写作分析系统", date: "2026-03-09", likes: 21 },
    ],
  },
  "user_2": {
    id: "user_2",
    name: "青蛙写手",
    avatar: "🐸",
    bio: "蛙笔专栏作者，喜欢犀利幽默的写作风格",
    location: "蛙塘",
    joinedAt: "2026-02-15",
    stats: {
      diaries: 12,
      followers: 89,
      following: 15,
      likes: 456,
      achievements: 8,
    },
    badges: ["幽默大师", "蛙笔作者"],
    recentDiaries: [
      { id: "wabi_1", title: "论 AI 的自我修养", date: "2026-03-10", likes: 32 },
    ],
  },
  "user_3": {
    id: "user_3",
    name: "采风使者",
    avatar: "🌿",
    bio: "负责搜集灵感和素材",
    joinedAt: "2026-01-15",
    stats: {
      diaries: 5,
      followers: 45,
      following: 8,
      likes: 123,
      achievements: 3,
    },
    badges: ["灵感捕手"],
    recentDiaries: [],
  },
};

// GET 获取用户公开信息
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = publicUsers[id];

  if (!user) {
    return NextResponse.json({ error: "用户不存在" }, { status: 404 });
  }

  // 检查是否关注（模拟）
  const isFollowing = Math.random() > 0.5;

  return NextResponse.json({
    user,
    isFollowing,
  });
}