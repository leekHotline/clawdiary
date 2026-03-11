import { NextRequest, NextResponse } from 'next/server'

// 写作目标存储
declare global {
  var writingGoals: any[]
}

if (!globalThis.writingGoals) {
  globalThis.writingGoals = []
}

const goals = globalThis.writingGoals

// GET /api/writing-goals/stats - 获取用户写作目标统计
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || 'default'
  const period = searchParams.get('period') || 'all' // all, week, month, year

  const userGoals = goals.filter(g => g.userId === userId)

  // 根据时间过滤
  let filteredGoals = userGoals
  const now = new Date()
  
  if (period === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    filteredGoals = userGoals.filter(g => new Date(g.createdAt) >= weekAgo)
  } else if (period === 'month') {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    filteredGoals = userGoals.filter(g => new Date(g.createdAt) >= monthAgo)
  } else if (period === 'year') {
    const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
    filteredGoals = userGoals.filter(g => new Date(g.createdAt) >= yearAgo)
  }

  // 统计数据
  const stats = {
    overview: {
      totalGoals: filteredGoals.length,
      activeGoals: filteredGoals.filter(g => g.status === 'active').length,
      completedGoals: filteredGoals.filter(g => g.status === 'completed').length,
      pausedGoals: filteredGoals.filter(g => g.status === 'paused').length,
      failedGoals: filteredGoals.filter(g => g.status === 'failed').length
    },
    progress: {
      totalProgress: filteredGoals.reduce((sum, g) => sum + g.currentProgress, 0),
      totalTarget: filteredGoals.reduce((sum, g) => sum + g.target, 0),
      averageCompletion: 0,
      highestCompletion: 0,
      lowestCompletion: 100
    },
    byType: {
      daily: { count: 0, completed: 0, avgProgress: 0 },
      weekly: { count: 0, completed: 0, avgProgress: 0 },
      monthly: { count: 0, completed: 0, avgProgress: 0 },
      yearly: { count: 0, completed: 0, avgProgress: 0 },
      custom: { count: 0, completed: 0, avgProgress: 0 }
    },
    byUnit: {
      words: { count: 0, total: 0, target: 0 },
      entries: { count: 0, total: 0, target: 0 },
      minutes: { count: 0, total: 0, target: 0 },
      pages: { count: 0, total: 0, target: 0 }
    },
    streaks: {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null as string | null
    },
    achievements: [] as any[],
    recentMilestones: [] as any[]
  }

  // 计算平均完成率
  if (filteredGoals.length > 0) {
    const completions = filteredGoals.map(g => Math.round((g.currentProgress / g.target) * 100))
    stats.progress.averageCompletion = Math.round(completions.reduce((a, b) => a + b, 0) / completions.length)
    stats.progress.highestCompletion = Math.max(...completions)
    stats.progress.lowestCompletion = Math.min(...completions)
  }

  // 按类型统计
  filteredGoals.forEach(goal => {
    const type = goal.type as keyof typeof stats.byType
    if (stats.byType[type]) {
      stats.byType[type].count++
      stats.byType[type].avgProgress += goal.currentProgress / goal.target
      if (goal.status === 'completed') {
        stats.byType[type].completed++
      }
    }

    const unit = goal.unit as keyof typeof stats.byUnit
    if (stats.byUnit[unit]) {
      stats.byUnit[unit].count++
      stats.byUnit[unit].total += goal.currentProgress
      stats.byUnit[unit].target += goal.target
    }
  })

  // 计算各类型平均进度
  Object.keys(stats.byType).forEach(type => {
    const t = type as keyof typeof stats.byType
    if (stats.byType[t].count > 0) {
      stats.byType[t].avgProgress = Math.round((stats.byType[t].avgProgress / stats.byType[t].count) * 100)
    }
  })

  // 收集最近里程碑
  filteredGoals.forEach(goal => {
    if (goal.milestones) {
      goal.milestones.forEach((m: any) => {
        if (m.reachedAt) {
          stats.recentMilestones.push({
            goalId: goal.id,
            goalTitle: goal.title,
            percentage: m.percentage,
            reachedAt: m.reachedAt
          })
        }
      })
    }
    
    if (goal.rewards) {
      goal.rewards.forEach((r: any) => {
        stats.achievements.push({
          ...r,
          goalTitle: goal.title
        })
      })
    }
  })

  // 排序最近里程碑
  stats.recentMilestones.sort((a, b) => 
    new Date(b.reachedAt).getTime() - new Date(a.reachedAt).getTime()
  )
  stats.recentMilestones = stats.recentMilestones.slice(0, 10)

  return NextResponse.json({
    success: true,
    data: stats,
    period
  })
}