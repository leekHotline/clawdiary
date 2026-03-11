import { NextRequest, NextResponse } from 'next/server'

// 写作习惯日志存储
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

// GET /api/writing-habits/log - 获取习惯日志
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || 'default'
  const habitId = searchParams.get('habitId')
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')

  let filteredLogs = logs

  if (habitId) {
    filteredLogs = filteredLogs.filter(l => l.habitId === habitId)
  }

  if (startDate) {
    filteredLogs = filteredLogs.filter(l => l.date >= startDate)
  }

  if (endDate) {
    filteredLogs = filteredLogs.filter(l => l.date <= endDate)
  }

  return NextResponse.json({
    success: true,
    data: filteredLogs
  })
}

// POST /api/writing-habits/log - 记录习惯完成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { habitId, date, completed, note } = body

    if (!habitId || !date) {
      return NextResponse.json({
        success: false,
        error: '缺少必填字段'
      }, { status: 400 })
    }

    // 检查习惯是否存在
    const habit = habits.find(h => h.id === habitId)
    if (!habit) {
      return NextResponse.json({
        success: false,
        error: '习惯不存在'
      }, { status: 404 })
    }

    // 查找现有日志
    const existingLogIndex = logs.findIndex(
      l => l.habitId === habitId && l.date === date
    )

    const now = new Date().toISOString()

    if (existingLogIndex !== -1) {
      // 更新现有日志（切换状态）
      logs[existingLogIndex] = {
        ...logs[existingLogIndex],
        completed: !logs[existingLogIndex].completed,
        note: note || logs[existingLogIndex].note,
        updatedAt: now,
        completedAt: !logs[existingLogIndex].completed ? now : undefined
      }

      return NextResponse.json({
        success: true,
        data: logs[existingLogIndex],
        toggled: true,
        message: logs[existingLogIndex].completed ? '习惯已完成 ✓' : '已取消完成'
      })
    }

    // 创建新日志
    const newLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      habitId,
      date,
      completed: completed ?? true,
      note,
      createdAt: now,
      completedAt: completed ?? true ? now : undefined
    }

    logs.push(newLog)

    return NextResponse.json({
      success: true,
      data: newLog,
      message: '习惯记录成功'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '记录失败'
    }, { status: 500 })
  }
}

// DELETE /api/writing-habits/log - 删除习惯日志
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const logId = searchParams.get('id')

  if (!logId) {
    return NextResponse.json({
      success: false,
      error: '缺少日志ID'
    }, { status: 400 })
  }

  const logIndex = logs.findIndex(l => l.id === logId)
  if (logIndex === -1) {
    return NextResponse.json({
      success: false,
      error: '日志不存在'
    }, { status: 404 })
  }

  logs.splice(logIndex, 1)

  return NextResponse.json({
    success: true,
    message: '日志已删除'
  })
}