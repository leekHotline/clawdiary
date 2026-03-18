import { NextRequest, NextResponse } from 'next/server'

// 写作目标存储
declare global {
  var writingGoals: any[]
}

if (!globalThis.writingGoals) {
  globalThis.writingGoals = []
}

const goals = globalThis.writingGoals

// POST /api/writing-goals/[id]/progress - 更新进度
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const goalIndex = goals.findIndex(g => g.id === id)

  if (goalIndex === -1) {
    return NextResponse.json({
      success: false,
      error: '目标不存在'
    }, { status: 404 })
  }

  try {
    const body = await request.json()
    const { increment, value } = body
    const now = new Date().toISOString()

    const goal = goals[goalIndex]
    let newProgress: number

    if (typeof value === 'number') {
      newProgress = value
    } else if (typeof increment === 'number') {
      newProgress = goal.currentProgress + increment
    } else {
      newProgress = goal.currentProgress + 1 // 默认增加1
    }

    // 确保不超过目标（或允许超过）
    newProgress = Math.max(0, newProgress)

    goal.currentProgress = newProgress
    goal.updatedAt = now

    // 检查里程碑
    const progressPercentage = Math.round((newProgress / goal.target) * 100)
    const reachedMilestones: number[] = []

    if (goal.milestones) {
      goal.milestones.forEach((m: any) => {
        if (progressPercentage >= m.percentage && !m.reachedAt) {
          m.reachedAt = now
          m.celebrated = false
          reachedMilestones.push(m.percentage)
        }
      })
    }

    // 检查是否完成
    if (newProgress >= goal.target && goal.status === 'active') {
      goal.status = 'completed'
      goal.completedAt = now
      
      // 添加完成奖励
      if (!goal.rewards) goal.rewards = []
      goal.rewards.push({
        id: `reward_${Date.now()}`,
        name: '目标达成',
        description: `恭喜完成「${goal.title}」目标！`,
        icon: '🏆',
        unlockedAt: now
      })
    }

    return NextResponse.json({
      success: true,
      data: goal,
      reachedMilestones,
      message: reachedMilestones.length > 0 
        ? `🎉 恭喜达到 ${reachedMilestones.join('%、')}% 里程碑！` 
        : '进度更新成功'
    })
  } catch {
    return NextResponse.json({
      success: false,
      error: '更新进度失败'
    }, { status: 500 })
  }
}

// GET /api/writing-goals/[id]/progress - 获取进度历史
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const goal = goals.find(g => g.id === id)

  if (!goal) {
    return NextResponse.json({
      success: false,
      error: '目标不存在'
    }, { status: 404 })
  }

  // 返回进度信息
  const progressData = {
    current: goal.currentProgress,
    target: goal.target,
    percentage: Math.round((goal.currentProgress / goal.target) * 100),
    remaining: Math.max(0, goal.target - goal.currentProgress),
    milestones: goal.milestones || [],
    status: goal.status
  }

  return NextResponse.json({
    success: true,
    data: progressData
  })
}