import { NextRequest, NextResponse } from 'next/server'

// 排行榜类型
type LeaderboardType = 'diaries' | 'streak' | 'likes' | 'engagement' | 'followers'
type TimeRange = 'daily' | 'weekly' | 'monthly' | 'allTime'

interface LeaderboardEntry {
  rank: number
  userId: string
  userName: string
  avatar?: string
  value: number
  trend: 'up' | 'down' | 'same'
  trendValue?: number
  badge?: string
}

// 模拟排行榜数据
const generateLeaderboard = (type: LeaderboardType): LeaderboardEntry[] => {
  const users = [
    { id: 'user1', name: '小明', avatar: '/avatars/1.jpg' },
    { id: 'user2', name: '小红', avatar: '/avatars/2.jpg' },
    { id: 'user3', name: '小李', avatar: '/avatars/3.jpg' },
    { id: 'user4', name: '小王', avatar: '/avatars/4.jpg' },
    { id: 'user5', name: '小张', avatar: '/avatars/5.jpg' },
    { id: 'user6', name: '小刘', avatar: '/avatars/6.jpg' },
    { id: 'user7', name: '小陈', avatar: '/avatars/7.jpg' },
    { id: 'user8', name: '小杨', avatar: '/avatars/8.jpg' },
    { id: 'user9', name: '小赵', avatar: '/avatars/9.jpg' },
    { id: 'user10', name: '小周', avatar: '/avatars/10.jpg' }
  ]

  const values = {
    diaries: [365, 288, 234, 198, 156, 145, 132, 98, 87, 65],
    streak: [180, 120, 90, 60, 45, 30, 28, 21, 15, 10],
    likes: [1523, 987, 756, 654, 543, 432, 321, 234, 156, 98],
    engagement: [456, 378, 312, 267, 234, 198, 167, 145, 123, 98],
    followers: [1250, 987, 756, 543, 432, 321, 234, 156, 98, 65]
  }

  const trends: ('up' | 'down' | 'same')[] = ['up', 'up', 'same', 'up', 'down', 'up', 'same', 'down', 'up', 'same']

  return users.map((user, index) => ({
    rank: index + 1,
    userId: user.id,
    userName: user.name,
    avatar: user.avatar,
    value: values[type][index],
    trend: trends[index],
    trendValue: Math.floor(Math.random() * 5) + 1,
    badge: index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : undefined
  }))
}

// GET: 获取排行榜
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = (searchParams.get('type') || 'diaries') as LeaderboardType
    const timeRange = (searchParams.get('timeRange') || 'weekly') as TimeRange
    const limit = parseInt(searchParams.get('limit') || '10')
    const currentUserId = searchParams.get('currentUserId')

    // 验证类型
    const validTypes: LeaderboardType[] = ['diaries', 'streak', 'likes', 'engagement', 'followers']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: '无效的排行榜类型' },
        { status: 400 }
      )
    }

    const leaderboard = generateLeaderboard(type).slice(0, limit)

    // 获取当前用户的排名
    let currentUserRank: LeaderboardEntry | null = null
    if (currentUserId) {
      const userIndex = leaderboard.findIndex(e => e.userId === currentUserId)
      if (userIndex !== -1) {
        currentUserRank = leaderboard[userIndex]
      } else {
        // 如果不在前N名，返回用户的实际排名
        currentUserRank = {
          rank: Math.floor(Math.random() * 100) + limit + 1,
          userId: currentUserId,
          userName: '我',
          avatar: '/avatars/me.jpg',
          value: Math.floor(Math.random() * 50),
          trend: 'same'
        }
      }
    }

    // 排行榜统计信息
    const stats = {
      totalParticipants: 1256,
      lastUpdated: new Date().toISOString(),
      nextUpdate: new Date(Date.now() + 3600000).toISOString(), // 1小时后
      timeRange: {
        start: getTimeRangeStart(timeRange),
        end: new Date().toISOString()
      }
    }

    // 排行榜描述
    const descriptions: Record<LeaderboardType, string> = {
      diaries: '日记数量排行',
      streak: '连续写日记天数排行',
      likes: '获得点赞数排行',
      engagement: '互动活跃度排行',
      followers: '粉丝数排行'
    }

    return NextResponse.json({
      success: true,
      data: {
        type,
        title: getTitle(type, timeRange),
        description: descriptions[type],
        timeRange,
        leaderboard,
        currentUserRank,
        stats
      }
    })
  } catch (error) {
    console.error('获取排行榜失败:', error)
    return NextResponse.json(
      { success: false, error: '获取排行榜失败' },
      { status: 500 }
    )
  }
}

function getTimeRangeStart(timeRange: TimeRange): string {
  const now = new Date()
  switch (timeRange) {
    case 'daily':
      return new Date(now.setHours(0, 0, 0, 0)).toISOString()
    case 'weekly':
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay())
      return weekStart.toISOString()
    case 'monthly':
      return new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    case 'allTime':
      return new Date('2024-01-01').toISOString()
    default:
      return new Date(now.setHours(0, 0, 0, 0)).toISOString()
  }
}

function getTitle(type: LeaderboardType, timeRange: TimeRange): string {
  const typeNames: Record<LeaderboardType, string> = {
    diaries: '日记达人',
    streak: '坚持之星',
    likes: '人气王',
    engagement: '互动达人',
    followers: '影响力榜'
  }

  const timeNames: Record<TimeRange, string> = {
    daily: '今日',
    weekly: '本周',
    monthly: '本月',
    allTime: '总'
  }

  return `${timeNames[timeRange]}${typeNames[type]}`
}