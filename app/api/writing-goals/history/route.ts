import { NextRequest, NextResponse } from 'next/server'

// 写作目标存储
declare global {
  var writingGoals: any[]
}

if (!globalThis.writingGoals) {
  globalThis.writingGoals = []
}

const goals = globalThis.writingGoals

// GET /api/writing-goals/history - 获取目标历史记录
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || 'default'
  const goalId = searchParams.get('goalId')
  const limit = parseInt(searchParams.get('limit') || '50')

  let userGoals = goals.filter(g => g.userId === userId)

  if (goalId) {
    userGoals = userGoals.filter(g => g.id === goalId)
  }

  // 构建历史记录
  const history: any[] = []

  userGoals.forEach(goal => {
    // 创建记录
    history.push({
      id: `history_${goal.id}_created`,
      goalId: goal.id,
      goalTitle: goal.title,
      type: 'created',
      timestamp: goal.createdAt,
      data: {
        target: goal.target,
        unit: goal.unit,
        goalType: goal.type
      }
    })

    // 里程碑记录
    if (goal.milestones) {
      goal.milestones.forEach((m: any) => {
        if (m.reachedAt) {
          history.push({
            id: `history_${goal.id}_milestone_${m.id}`,
            goalId: goal.id,
            goalTitle: goal.title,
            type: 'milestone',
            timestamp: m.reachedAt,
            data: {
              percentage: m.percentage
            }
          })
        }
      })
    }

    // 完成记录
    if (goal.status === 'completed' && goal.completedAt) {
      history.push({
        id: `history_${goal.id}_completed`,
        goalId: goal.id,
        goalTitle: goal.title,
        type: 'completed',
        timestamp: goal.completedAt,
        data: {
          finalProgress: goal.currentProgress,
          target: goal.target
        }
      })
    }

    // 奖励记录
    if (goal.rewards) {
      goal.rewards.forEach((r: any) => {
        if (r.unlockedAt) {
          history.push({
            id: `history_${goal.id}_reward_${r.id}`,
            goalId: goal.id,
            goalTitle: goal.title,
            type: 'reward',
            timestamp: r.unlockedAt,
            data: {
              reward: r
            }
          })
        }
      })
    }
  })

  // 按时间倒序排列
  history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return NextResponse.json({
    success: true,
    data: history.slice(0, limit),
    total: history.length
  })
}