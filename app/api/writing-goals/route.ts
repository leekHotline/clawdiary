import { NextRequest, NextResponse } from 'next/server'

// 写作目标存储
const goals: WritingGoal[] = []

interface WritingGoal {
  id: string
  userId: string
  title: string
  description?: string
  type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'
  target: number // 目标数量
  unit: 'words' | 'entries' | 'minutes' | 'pages'
  startDate: string
  endDate?: string
  currentProgress: number
  status: 'active' | 'completed' | 'paused' | 'failed'
  createdAt: string
  updatedAt: string
  milestones?: Milestone[]
  rewards?: Reward[]
}

interface Milestone {
  id: string
  percentage: number // 25, 50, 75, 100
  reachedAt?: string
  celebrated: boolean
}

interface Reward {
  id: string
  name: string
  description?: string
  icon: string
  unlockedAt?: string
}

// 生成唯一ID
function generateId(): string {
  return `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// GET /api/writing-goals - 获取用户的所有写作目标
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || 'default'
  const status = searchParams.get('status')
  const type = searchParams.get('type')

  let filteredGoals = goals.filter(g => g.userId === userId)

  if (status) {
    filteredGoals = filteredGoals.filter(g => g.status === status)
  }

  if (type) {
    filteredGoals = filteredGoals.filter(g => g.type === type)
  }

  // 计算统计信息
  const stats = {
    total: filteredGoals.length,
    active: filteredGoals.filter(g => g.status === 'active').length,
    completed: filteredGoals.filter(g => g.status === 'completed').length,
    paused: filteredGoals.filter(g => g.status === 'paused').length,
    totalProgress: filteredGoals.reduce((sum, g) => sum + g.currentProgress, 0),
    totalTarget: filteredGoals.reduce((sum, g) => sum + g.target, 0),
    completionRate: 0
  }

  if (stats.totalTarget > 0) {
    stats.completionRate = Math.round((stats.totalProgress / stats.totalTarget) * 100)
  }

  return NextResponse.json({
    success: true,
    data: filteredGoals,
    stats
  })
}

// POST /api/writing-goals - 创建新的写作目标
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId = 'default', title, description, type, target, unit, startDate, endDate } = body

    if (!title || !type || !target || !unit) {
      return NextResponse.json({
        success: false,
        error: '缺少必填字段'
      }, { status: 400 })
    }

    const now = new Date().toISOString()
    const newGoal: WritingGoal = {
      id: generateId(),
      userId,
      title,
      description,
      type,
      target: Number(target),
      unit,
      startDate: startDate || now,
      endDate,
      currentProgress: 0,
      status: 'active',
      createdAt: now,
      updatedAt: now,
      milestones: [
        { id: 'm1', percentage: 25, celebrated: false },
        { id: 'm2', percentage: 50, celebrated: false },
        { id: 'm3', percentage: 75, celebrated: false },
        { id: 'm4', percentage: 100, celebrated: false }
      ],
      rewards: []
    }

    goals.push(newGoal)

    return NextResponse.json({
      success: true,
      data: newGoal,
      message: '写作目标创建成功'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '创建失败'
    }, { status: 500 })
  }
}