import { NextRequest, NextResponse } from 'next/server'

// 用户成就状态
interface UserAchievement {
  achievementId: string
  unlocked: boolean
  unlockedAt?: string
  progress: number
  total: number
}

// 模拟用户统计数据
const getUserStats = (userId: string) => {
  // 实际项目中从数据库获取
  return {
    diaries: 42,
    currentStreak: 15,
    longestStreak: 30,
    likesReceived: 156,
    commentsReceived: 23,
    followers: 8,
    following: 12,
    uniqueTags: 18,
    uniqueMoods: 6,
    uniqueWeathers: 4,
    earlyDiaries: 3,
    lateDiaries: 7,
    longDiaries: 12,
    shares: 5,
    collections: 3
  }
}

// 检查成就是否达成
const checkAchievement = (
  achievement: {
    id: string
    requirement: { type: string; target: number; metric: string }
  },
  stats: ReturnType<typeof getUserStats>
): { unlocked: boolean; progress: number; total: number } => {
  const { requirement } = achievement

  let current = 0
  switch (requirement.metric) {
    case 'diaries':
      current = stats.diaries
      break
    case 'days':
      current = stats.currentStreak
      break
    case 'likes_received':
      current = stats.likesReceived
      break
    case 'comments_received':
      current = stats.commentsReceived
      break
    case 'followers':
      current = stats.followers
      break
    case 'tags':
      current = stats.uniqueTags
      break
    case 'moods':
      current = stats.uniqueMoods
      break
    case 'weathers':
      current = stats.uniqueWeathers
      break
    case 'early_diary':
      current = stats.earlyDiaries
      break
    case 'late_diary':
      current = stats.lateDiaries
      break
    case 'word_count':
      current = stats.longDiaries > 0 ? 1000 : 0
      break
    case 'shares':
      current = stats.shares
      break
    case 'collections':
      current = stats.collections
      break
    default:
      current = 0
  }

  const unlocked = current >= requirement.target
  return {
    unlocked,
    progress: Math.min(current, requirement.target),
    total: requirement.target
  }
}

// GET: 获取用户成就状态
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params
    const stats = getUserStats(userId)

    // 从 achievements API 获取成就列表
    const achievementsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/achievements`
    )
    const achievementsData = await achievementsResponse.json()

    if (!achievementsData.success) {
      throw new Error('获取成就列表失败')
    }

    const userAchievements: UserAchievement[] = achievementsData.data.map(
      (achievement: {
        id: string
        requirement: { type: string; target: number; metric: string }
      }) => {
        const result = checkAchievement(achievement, stats)
        return {
          achievementId: achievement.id,
          unlocked: result.unlocked,
          unlockedAt: result.unlocked ? new Date().toISOString() : undefined,
          progress: result.progress,
          total: result.total
        }
      }
    )

    const unlockedCount = userAchievements.filter(a => a.unlocked).length
    const totalPoints = achievementsData.data
      .filter(
        (a: { id: string }) =>
          userAchievements.find(ua => ua.achievementId === a.id)?.unlocked
      )
      .reduce((sum: number, a: { points: number }) => sum + a.points, 0)

    return NextResponse.json({
      success: true,
      data: {
        userId,
        achievements: userAchievements,
        stats,
        summary: {
          total: userAchievements.length,
          unlocked: unlockedCount,
          progress: Math.round(
            (unlockedCount / userAchievements.length) * 100
          ),
          totalPoints,
          level: Math.floor(totalPoints / 100) + 1,
          nextLevelPoints: ((Math.floor(totalPoints / 100) + 1) * 100) - totalPoints
        }
      }
    })
  } catch (error) {
    console.error('获取用户成就失败:', error)
    return NextResponse.json(
      { success: false, error: '获取用户成就失败' },
      { status: 500 }
    )
  }
}

// POST: 手动触发成就检查
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params
    const body = await request.json()
    const { metric, value } = body

    // 检查是否解锁新成就
    const newAchievements: string[] = []

    // 返回新解锁的成就
    return NextResponse.json({
      success: true,
      data: {
        userId,
        metric,
        value,
        newAchievements,
        message:
          newAchievements.length > 0
            ? `恭喜解锁 ${newAchievements.length} 个新成就！`
            : '继续努力，即将解锁新成就！'
      }
    })
  } catch (error) {
    console.error('检查成就失败:', error)
    return NextResponse.json(
      { success: false, error: '检查成就失败' },
      { status: 500 }
    )
  }
}