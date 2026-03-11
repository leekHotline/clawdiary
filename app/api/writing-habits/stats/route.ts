import { NextRequest, NextResponse } from 'next/server'

// 写作习惯存储
declare global {
  var writingHabits: any[]
  var habitLogs: any[]
}

if (!globalThis.writingHabits) {
  globalThis.writingHabits = []
}

if (!globalThis.habitLogs) {
  globalThis.habitLogs = []
}

const habits = globalThis.writingHabits
const logs = globalThis.habitLogs

// GET /api/writing-habits/stats - 获取用户写作习惯统计
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || 'default'
  const period = searchParams.get('period') || 'all'

  const userHabits = habits.filter(h => h.userId === userId && h.isActive)
  const userLogs = logs.filter(l => {
    const habit = habits.find(h => h.id === l.habitId)
    return habit?.userId === userId
  })

  // 时间过滤
  const now = new Date()
  let filteredLogs = userLogs

  if (period === 'week') {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    filteredLogs = userLogs.filter(l => new Date(l.date) >= weekAgo)
  } else if (period === 'month') {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    filteredLogs = userLogs.filter(l => new Date(l.date) >= monthAgo)
  }

  // 今日统计
  const today = now.toISOString().split('T')[0]
  const todayLogs = userLogs.filter(l => l.date === today)
  const todayCompleted = todayLogs.filter(l => l.completed).length

  // 本周统计
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay())
  const weekLogs = userLogs.filter(l => new Date(l.date) >= weekStart)
  const weekCompleted = weekLogs.filter(l => l.completed).length

  // 计算连续天数
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0

  // 按日期分组所有完成的日志
  const completedDates = [...new Set(
    userLogs
      .filter(l => l.completed)
      .map(l => l.date)
  )].sort().reverse()

  if (completedDates.length > 0) {
    // 计算当前连续
    const checkDate = new Date()
    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split('T')[0]
      if (completedDates.includes(dateStr)) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else if (dateStr === today) {
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }

    // 计算最长连续
    const sortedDates = completedDates.sort()
    tempStreak = 1
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1])
      const currDate = new Date(sortedDates[i])
      const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        tempStreak++
      } else {
        longestStreak = Math.max(longestStreak, tempStreak)
        tempStreak = 1
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak)
  }

  // 计算完成率
  const totalPossible = filteredLogs.length
  const totalCompleted = filteredLogs.filter(l => l.completed).length
  const completionRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0

  // 按习惯统计
  const habitStats = userHabits.map(habit => {
    const habitLogs = filteredLogs.filter(l => l.habitId === habit.id)
    return {
      id: habit.id,
      name: habit.name,
      icon: habit.icon,
      color: habit.color,
      totalLogs: habitLogs.length,
      completed: habitLogs.filter(l => l.completed).length,
      completionRate: habitLogs.length > 0 
        ? Math.round((habitLogs.filter(l => l.completed).length / habitLogs.length) * 100)
        : 0
    }
  })

  // 每周热力图数据
  const heatmap: { date: string; completed: number; total: number }[] = []
  for (let i = 27; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    const dayLogs = userLogs.filter(l => l.date === dateStr)
    heatmap.push({
      date: dateStr,
      completed: dayLogs.filter(l => l.completed).length,
      total: userHabits.length
    })
  }

  // 最佳时间分析
  const hourlyDistribution: Record<number, number> = {}
  userLogs.filter(l => l.completed).forEach(log => {
    if (log.completedAt) {
      const hour = new Date(log.completedAt).getHours()
      hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1
    }
  })

  const bestHour = Object.entries(hourlyDistribution)
    .sort((a, b) => b[1] - a[1])[0]

  const stats = {
    overview: {
      totalHabits: userHabits.length,
      activeHabits: userHabits.filter(h => h.isActive).length,
      currentStreak,
      longestStreak,
      todayCompleted,
      todayTotal: userHabits.length,
      weekCompleted,
      weekTotal: userHabits.length * 7,
      completionRate
    },
    habits: habitStats,
    heatmap,
    insights: {
      bestHour: bestHour ? parseInt(bestHour[0]) : null,
      totalCompletions: userLogs.filter(l => l.completed).length,
      thisMonthCompletions: userLogs.filter(l => {
        const logDate = new Date(l.date)
        return l.completed && 
          logDate.getMonth() === now.getMonth() && 
          logDate.getFullYear() === now.getFullYear()
      }).length
    },
    streaks: {
      current: currentStreak,
      longest: longestStreak,
      thisWeek: weekCompleted,
      thisMonth: userLogs.filter(l => {
        const logDate = new Date(l.date)
        return l.completed && 
          logDate.getMonth() === now.getMonth() && 
          logDate.getFullYear() === now.getFullYear()
      }).length
    }
  }

  return NextResponse.json({
    success: true,
    data: stats
  })
}