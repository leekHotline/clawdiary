import { NextResponse } from 'next/server'

// 积分记录
interface PointsRecord {
  id: string
  userId: string
  points: number
  type: 'earn' | 'spend' | 'bonus' | 'refund'
  source: string
  description: string
  createdAt: string
}

// 积分规则
const pointsRules = {
  // 获得积分
  diary_create: { points: 10, description: '创建日记' },
  diary_words_100: { points: 5, description: '日记字数超过100' },
  diary_words_300: { points: 15, description: '日记字数超过300' },
  diary_words_800: { points: 30, description: '日记字数超过800' },
  diary_streak_7: { points: 50, description: '连续写日记7天' },
  diary_streak_30: { points: 200, description: '连续写日记30天' },
  diary_streak_100: { points: 500, description: '连续写日记100天' },
  comment_create: { points: 2, description: '发表评论' },
  comment_receive: { points: 1, description: '收到评论' },
  like_give: { points: 1, description: '点赞他人日记' },
  like_receive: { points: 1, description: '获得点赞' },
  share: { points: 5, description: '分享日记' },
  quest_complete_easy: { points: 5, description: '完成简单任务' },
  quest_complete_medium: { points: 15, description: '完成中等任务' },
  quest_complete_hard: { points: 30, description: '完成困难任务' },
  first_diary: { points: 100, description: '第一篇日记奖励' },
  early_bird: { points: 10, description: '早起写作奖励' },
  night_owl: { points: 10, description: '深夜写作奖励' },
  weekly_goal: { points: 100, description: '完成周目标' },
  monthly_goal: { points: 500, description: '完成月目标' },
  
  // 特殊活动
  event_participation: { points: 20, description: '参与活动' },
  event_winner: { points: 100, description: '活动获奖' },
  referral: { points: 50, description: '邀请好友' },
  feedback: { points: 20, description: '提交反馈' },
}

// 获取用户积分
const getUserPointsData = (userId: string) => ({
  current: 1250,
  total: 3500,
  spent: 2250,
  level: 12,
  nextLevelPoints: 1500,
  progressToNextLevel: 75,
  rank: 156,
  dailyEarned: 85,
  dailyLimit: 200,
})

// 获取积分历史
const getPointsHistory = (userId: string): PointsRecord[] => [
  {
    id: 'ph_1',
    userId,
    points: 30,
    type: 'earn',
    source: 'diary_words_800',
    description: '日记字数超过800',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'ph_2',
    userId,
    points: 10,
    type: 'earn',
    source: 'diary_create',
    description: '创建日记',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: 'ph_3',
    userId,
    points: 5,
    type: 'earn',
    source: 'like_give',
    description: '点赞他人日记',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'ph_4',
    userId,
    points: -200,
    type: 'spend',
    source: 'shop_purchase',
    description: '购买主题「森林秘境」',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'ph_5',
    userId,
    points: 50,
    type: 'bonus',
    source: 'streak_bonus',
    description: '连续写作7天奖励',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
]

// GET - 获取积分信息
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || 'default'
  const action = searchParams.get('action')

  if (action === 'history') {
    const history = getPointsHistory(userId)
    return NextResponse.json({
      success: true,
      data: {
        history,
        stats: {
          totalEarned: 3500,
          totalSpent: 2250,
          thisMonth: 450,
          lastMonth: 680,
        }
      }
    })
  }

  if (action === 'rules') {
    return NextResponse.json({
      success: true,
      data: {
        rules: pointsRules,
        categories: [
          { name: '日记创作', sources: ['diary_create', 'diary_words_100', 'diary_words_300', 'diary_words_800'] },
          { name: '连续打卡', sources: ['diary_streak_7', 'diary_streak_30', 'diary_streak_100'] },
          { name: '社交互动', sources: ['comment_create', 'comment_receive', 'like_give', 'like_receive', 'share'] },
          { name: '任务奖励', sources: ['quest_complete_easy', 'quest_complete_medium', 'quest_complete_hard'] },
          { name: '特殊奖励', sources: ['first_diary', 'early_bird', 'night_owl', 'weekly_goal', 'monthly_goal'] },
        ]
      }
    })
  }

  const userPoints = getUserPointsData(userId)
  const recentHistory = getPointsHistory(userId).slice(0, 5)

  return NextResponse.json({
    success: true,
    data: {
      ...userPoints,
      recentHistory,
      canEarnToday: userPoints.dailyLimit - userPoints.dailyEarned,
      rules: pointsRules,
    }
  })
}

// POST - 添加/扣除积分
export async function POST(request: Request) {
  const body = await request.json()
  const { userId, points, source, description, type = 'earn' } = body

  // 验证积分规则
  const rule = pointsRules[source as keyof typeof pointsRules]
  
  return NextResponse.json({
    success: true,
    data: {
      transactionId: `pt_${Date.now()}`,
      points: points || rule?.points || 0,
      type,
      source,
      description: description || rule?.description || '积分变动',
      newBalance: 1250 + (points || rule?.points || 0),
    }
  })
}