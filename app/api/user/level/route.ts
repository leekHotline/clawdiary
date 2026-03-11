import { NextResponse } from "next/server";

// 用户等级系统 API
export async function GET() {
  // 模拟用户等级数据
  const level = {
    level: 4,
    title: "日记达人",
    currentXp: 2450,
    requiredXp: 3000,
    totalXp: 8450,
  };

  const rewards = [
    { level: 1, title: "日记新手", badge: "🌱", perks: ["基础日记功能", "每日提醒"] },
    { level: 2, title: "日记学徒", badge: "🌿", perks: ["标签功能", "搜索功能"] },
    { level: 3, title: "日记行者", badge: "🌳", perks: ["心情追踪", "统计图表"] },
    { level: 4, title: "日记达人", badge: "⭐", perks: ["成就系统", "自定义主题"] },
    { level: 5, title: "日记专家", badge: "🌟", perks: ["AI 写作建议", "封面生成"] },
    { level: 6, title: "日记大师", badge: "💫", perks: ["协作日记", "高级统计"] },
    { level: 7, title: "日记宗师", badge: "✨", perks: ["API 访问", "数据导出"] },
    { level: 8, title: "日记传奇", badge: "🔥", perks: ["专属徽章", "优先支持"] },
    { level: 9, title: "日记圣者", badge: "💎", perks: ["隐藏功能", "定制头像"] },
    { level: 10, title: "日记神话", badge: "👑", perks: ["所有功能", "传奇称号"] },
  ];

  const xpHistory = [
    { date: "2026-03-11", action: "写日记", xp: 50 },
    { date: "2026-03-11", action: "连续写作奖励", xp: 20 },
    { date: "2026-03-10", action: "解锁成就", xp: 30 },
    { date: "2026-03-10", action: "写日记", xp: 50 },
    { date: "2026-03-09", action: "写日记", xp: 50 },
  ];

  return NextResponse.json({
    level,
    rewards,
    xpHistory,
    stats: {
      totalXpEarned: 8450,
      xpThisWeek: 250,
      xpThisMonth: 1200,
    },
  });
}