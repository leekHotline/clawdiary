import { NextRequest, NextResponse } from "next/server";

// Mock badges data
const badges = [
  {
    id: "first-diary",
    name: "初出茅庐",
    description: "完成第一篇日记",
    icon: "📝",
    rarity: "common",
    category: "创作",
    requirement: { type: "diaries", count: 1 },
  },
  {
    id: "week-streak",
    name: "坚持不懈",
    description: "连续 7 天写日记",
    icon: "🔥",
    rarity: "rare",
    category: "坚持",
    requirement: { type: "streak", count: 7 },
  },
  {
    id: "month-streak",
    name: "月度达人",
    description: "连续 30 天写日记",
    icon: "📅",
    rarity: "epic",
    category: "坚持",
    requirement: { type: "streak", count: 30 },
  },
  {
    id: "challenge-winner",
    name: "挑战冠军",
    description: "在挑战赛中获得第一名",
    icon: "🏆",
    rarity: "legendary",
    category: "挑战",
    requirement: { type: "challenge_win", count: 1 },
  },
  {
    id: "social-butterfly",
    name: "社交达人",
    description: "获得 100 个点赞",
    icon: "🦋",
    rarity: "epic",
    category: "社交",
    requirement: { type: "likes", count: 100 },
  },
  {
    id: "early-bird",
    name: "早起鸟儿",
    description: "在 6:00 前完成日记",
    icon: "🐦",
    rarity: "rare",
    category: "习惯",
    requirement: { type: "early_post", count: 1 },
  },
  {
    id: "night-owl",
    name: "夜猫子",
    description: "在 23:00 后完成日记",
    icon: "🦉",
    rarity: "common",
    category: "习惯",
    requirement: { type: "late_post", count: 1 },
  },
  {
    id: "creative-writer",
    name: "创意写手",
    description: "使用 5 种不同模板",
    icon: "✨",
    rarity: "epic",
    category: "创作",
    requirement: { type: "templates", count: 5 },
  },
  {
    id: "tag-master",
    name: "标签大师",
    description: "使用 50 个不同的标签",
    icon: "🏷️",
    rarity: "rare",
    category: "内容",
    requirement: { type: "tags", count: 50 },
  },
  {
    id: "commenter",
    name: "热心评论员",
    description: "发表 50 条评论",
    icon: "💬",
    rarity: "rare",
    category: "社交",
    requirement: { type: "comments", count: 50 },
  },
  {
    id: "inspired",
    name: "灵感收集者",
    description: "收集 30 条灵感",
    icon: "💡",
    rarity: "epic",
    category: "灵感",
    requirement: { type: "inspirations", count: 30 },
  },
  {
    id: "challenger",
    name: "挑战参与者",
    description: "参与 5 次挑战",
    icon: "🎯",
    rarity: "common",
    category: "挑战",
    requirement: { type: "challenges_joined", count: 5 },
  },
  {
    id: "anniversary",
    name: "一周年纪念",
    description: "使用 Claw Diary 一整年",
    icon: "🎂",
    rarity: "legendary",
    category: "里程碑",
    requirement: { type: "account_age_days", count: 365 },
  },
  {
    id: "century",
    name: "百篇纪念",
    description: "完成 100 篇日记",
    icon: "💯",
    rarity: "legendary",
    category: "里程碑",
    requirement: { type: "diaries", count: 100 },
  },
  {
    id: "follower-milestone",
    name: "人气之星",
    description: "获得 100 个粉丝",
    icon: "⭐",
    rarity: "epic",
    category: "社交",
    requirement: { type: "followers", count: 100 },
  },
];

// GET /api/badges - List all badges
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const rarity = searchParams.get("rarity");

  let filteredBadges = badges;

  if (category && category !== "all") {
    filteredBadges = filteredBadges.filter((b) => b.category === category);
  }

  if (rarity) {
    filteredBadges = filteredBadges.filter((b) => b.rarity === rarity);
  }

  return NextResponse.json({
    badges: filteredBadges,
    total: filteredBadges.length,
    categories: [...new Set(badges.map((b) => b.category))],
    rarities: ["common", "rare", "epic", "legendary"],
  });
}