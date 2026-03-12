import { NextResponse } from 'next/server'

// 模拟排行榜数据
const generateLeaderboard = (type: string, limit: number = 20) => {
  const names = ['星辰大海', '月光诗人', '时间旅行者', '森林精灵', '海洋之心', '山间清风', '云端漫步', '星河旅人', '阳光向日葵', '雨后彩虹']
  const avatars = ['🌟', '🌙', '⏰', '🌲', '🌊', '🍃', '☁️', '💫', '🌻', '🌈']
  
  return Array.from({ length: limit }, (_, i) => {
    const base: Record<string, any> = {
      rank: i + 1,
      userId: `user_${i + 1}`,
      name: names[i % names.length],
      avatar: avatars[i % avatars.length],
    }
    
    switch (type) {
      case 'writing':
        return {
          ...base,
          diaries: Math.max(1, 1000 - i * 45),
          words: Math.max(1000, 300000 - i * 12000),
          streak: Math.max(1, 365 - i * 15),
          badge: i < 3 ? ['👑', '💎', '🏆'][i] : i < 10 ? '⭐' : null,
        }
      case 'mood':
        return {
          ...base,
          avgMood: Math.max(5, 10 - i * 0.2).toFixed(1),
          stability: Math.max(50, 98 - i * 3),
          positive: Math.max(50, 99 - i * 3),
          badge: i < 3 ? ['👑', '💎', '🏆'][i] : i < 10 ? '⭐' : null,
        }
      case 'streak':
        return {
          ...base,
          currentStreak: Math.max(1, 400 - i * 18),
          maxStreak: Math.max(10, 450 - i * 20),
          totalDays: Math.max(10, 1000 - i * 40),
          badge: i < 3 ? ['👑', '💎', '🏆'][i] : i < 10 ? '⭐' : null,
        }
      case 'engagement':
        return {
          ...base,
          likes: Math.max(10, 2000 - i * 80),
          comments: Math.max(5, 800 - i * 35),
          shares: Math.max(1, 200 - i * 10),
          badge: i < 3 ? ['👑', '💎', '🏆'][i] : i < 10 ? '⭐' : null,
        }
      case 'explorer':
        return {
          ...base,
          features: Math.max(5, 50 - i * 2),
          achievements: Math.max(2, 35 - i * 1.5),
          exploreScore: Math.max(100, 1000 - i * 40),
          badge: i < 3 ? ['👑', '💎', '🏆'][i] : i < 10 ? '⭐' : null,
        }
      case 'creativity':
        return {
          ...base,
          tags: Math.max(5, 200 - i * 8),
          templates: Math.max(1, 30 - i),
          themes: Math.max(1, 15 - Math.floor(i / 2)),
          creativityScore: Math.max(100, 1000 - i * 45),
          badge: i < 3 ? ['👑', '💎', '🏆'][i] : i < 10 ? '⭐' : null,
        }
      default:
        return base
    }
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'writing'
  const period = searchParams.get('period') || 'all'
  const limit = parseInt(searchParams.get('limit') || '20')
  
  const leaderboard = generateLeaderboard(type, limit)
  
  return NextResponse.json({
    success: true,
    data: {
      type,
      period,
      leaderboard,
      stats: {
        totalUsers: 1234,
        activeToday: 892,
        totalDiaries: 56789,
      },
      updatedAt: new Date().toISOString(),
    }
  })
}