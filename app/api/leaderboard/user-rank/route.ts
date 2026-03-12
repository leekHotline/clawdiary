import { NextResponse } from 'next/server'

// 获取用户在排行榜中的排名
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || 'current_user'
  const type = searchParams.get('type') || 'writing'
  
  // 模拟用户排名数据
  const userRank: Record<string, any> = {
    writing: {
      rank: 156,
      diaries: 45,
      words: 12500,
      streak: 15,
      percentile: 87,
      nextMilestone: { target: 50, current: 45, label: '50篇日记' },
    },
    mood: {
      rank: 89,
      avgMood: 7.5,
      stability: 68,
      positive: 72,
      percentile: 75,
      nextMilestone: { target: 8.0, current: 7.5, label: '心情指数8.0' },
    },
    streak: {
      rank: 234,
      currentStreak: 15,
      maxStreak: 28,
      totalDays: 45,
      percentile: 65,
      nextMilestone: { target: 30, current: 15, label: '连续30天' },
    },
    engagement: {
      rank: 56,
      likes: 128,
      comments: 45,
      shares: 12,
      percentile: 78,
      nextMilestone: { target: 200, current: 185, label: '200个互动' },
    },
    explorer: {
      rank: 128,
      features: 12,
      achievements: 5,
      exploreScore: 180,
      percentile: 70,
      nextMilestone: { target: 15, current: 12, label: '解锁15个功能' },
    },
    creativity: {
      rank: 89,
      tags: 15,
      templates: 2,
      themes: 1,
      creativityScore: 85,
      percentile: 72,
      nextMilestone: { target: 100, current: 85, label: '创意分100' },
    },
  }
  
  const rankData = userRank[type] || userRank.writing
  
  return NextResponse.json({
    success: true,
    data: {
      userId,
      type,
      ...rankData,
      badges: ['🌟 新手作家', '📝 写作爱好者'],
      recentProgress: [
        { date: '2026-03-12', change: +2, reason: '新增2篇日记' },
        { date: '2026-03-11', change: +1, reason: '连续打卡奖励' },
        { date: '2026-03-10', change: -1, reason: '排名下降' },
      ],
    }
  })
}