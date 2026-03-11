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

// GET /api/writing-habits/[id] - 获取单个习惯详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const habit = habits.find(h => h.id === id)

  if (!habit) {
    return NextResponse.json({
      success: false,
      error: '习惯不存在'
    }, { status: 404 })
  }

  // 获取该习惯的所有日志
  const habitLogs = logs.filter(l => l.habitId === id)
  const completedLogs = habitLogs.filter(l => l.completed)

  // 计算连续天数
  let streak = 0
  const completedDates = [...new Set(completedLogs.map(l => l.date))].sort().reverse()
  
  if (completedDates.length > 0) {
    const today = new Date().toISOString().split('T')[0]
    const checkDate = new Date()
    
    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split('T')[0]
      if (completedDates.includes(dateStr)) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else if (dateStr === today) {
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }
  }

  // 计算最长连续
  let longestStreak = 0
  let tempStreak = 0
  const sortedDates = completedDates.sort()
  
  if (sortedDates.length > 0) {
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
  const totalDays = habitLogs.length
  const completedDays = completedLogs.length
  const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0

  // 按周统计
  const weeklyStats: Record<string, { completed: number; total: number }> = {}
  completedLogs.forEach(log => {
    const date = new Date(log.date)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    const weekKey = weekStart.toISOString().split('T')[0]
    
    if (!weeklyStats[weekKey]) {
      weeklyStats[weekKey] = { completed: 0, total: 7 }
    }
    weeklyStats[weekKey].completed++
  })

  // 按月统计
  const monthlyStats: Record<string, { completed: number }> = {}
  completedLogs.forEach(log => {
    const date = new Date(log.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    if (!monthlyStats[monthKey]) {
      monthlyStats[monthKey] = { completed: 0 }
    }
    monthlyStats[monthKey].completed++
  })

  return NextResponse.json({
    success: true,
    data: {
      ...habit,
      streak,
      longestStreak,
      totalCompletions: completedDays,
      completionRate,
      weeklyStats,
      monthlyStats,
      recentLogs: habitLogs.slice(-10).reverse()
    }
  })
}

// PUT /api/writing-habits/[id] - 更新习惯
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const habitIndex = habits.findIndex(h => h.id === id)

  if (habitIndex === -1) {
    return NextResponse.json({
      success: false,
      error: '习惯不存在'
    }, { status: 404 })
  }

  try {
    const body = await request.json()
    const now = new Date().toISOString()

    habits[habitIndex] = {
      ...habits[habitIndex],
      ...body,
      updatedAt: now
    }

    return NextResponse.json({
      success: true,
      data: habits[habitIndex],
      message: '习惯更新成功'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '更新失败'
    }, { status: 500 })
  }
}

// DELETE /api/writing-habits/[id] - 删除习惯
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const habitIndex = habits.findIndex(h => h.id === id)

  if (habitIndex === -1) {
    return NextResponse.json({
      success: false,
      error: '习惯不存在'
    }, { status: 404 })
  }

  // 删除习惯
  habits.splice(habitIndex, 1)

  // 删除相关日志
  const logIndices = logs
    .map((l, idx) => l.habitId === id ? idx : -1)
    .filter(idx => idx !== -1)
    .reverse()
  
  logIndices.forEach(idx => logs.splice(idx, 1))

  return NextResponse.json({
    success: true,
    message: '习惯已删除'
  })
}