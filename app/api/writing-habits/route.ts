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

interface WritingHabit {
  id: string
  userId: string
  name: string
  description?: string
  icon: string
  frequency: 'daily' | 'weekly'
  targetDays?: number[] // 0-6 (Sunday-Saturday)
  reminder?: string
  color: string
  createdAt: string
  isActive: boolean
}

// 生成唯一ID
function generateId(): string {
  return `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// GET /api/writing-habits - 获取用户的所有写作习惯
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || 'default'
  const activeOnly = searchParams.get('active') === 'true'

  let filteredHabits = habits.filter(h => h.userId === userId)

  if (activeOnly) {
    filteredHabits = filteredHabits.filter(h => h.isActive)
  }

  // 获取今天的完成状态
  const today = new Date().toISOString().split('T')[0]
  const todayLogs = logs.filter(l => l.date === today && l.completed)

  const habitsWithStatus = filteredHabits.map(habit => {
    const completedToday = todayLogs.some(l => l.habitId === habit.id)
    const habitLogs = logs.filter(l => l.habitId === habit.id)
    
    // 计算连续天数
    let streak = 0
    const sortedLogs = habitLogs
      .filter(l => l.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    if (sortedLogs.length > 0) {
      const checkDate = new Date()
      for (let i = 0; i < 365; i++) {
        const dateStr = checkDate.toISOString().split('T')[0]
        const logForDate = habitLogs.find(l => l.date === dateStr)
        
        if (logForDate?.completed) {
          streak++
          checkDate.setDate(checkDate.getDate() - 1)
        } else if (dateStr === today) {
          // 今天还没完成，继续往前检查
          checkDate.setDate(checkDate.getDate() - 1)
        } else {
          break
        }
      }
    }

    return {
      ...habit,
      completedToday,
      streak,
      totalCompletions: habitLogs.filter(l => l.completed).length
    }
  })

  return NextResponse.json({
    success: true,
    data: habitsWithStatus
  })
}

// POST /api/writing-habits - 创建新的写作习惯
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      userId = 'default', 
      name, 
      description, 
      icon = '✍️', 
      frequency = 'daily',
      targetDays = [0, 1, 2, 3, 4, 5, 6],
      reminder,
      color = 'indigo'
    } = body

    if (!name) {
      return NextResponse.json({
        success: false,
        error: '习惯名称不能为空'
      }, { status: 400 })
    }

    const now = new Date().toISOString()
    const newHabit: WritingHabit = {
      id: generateId(),
      userId,
      name,
      description,
      icon,
      frequency,
      targetDays: frequency === 'weekly' ? targetDays : undefined,
      reminder,
      color,
      createdAt: now,
      isActive: true
    }

    habits.push(newHabit)

    return NextResponse.json({
      success: true,
      data: newHabit,
      message: '写作习惯创建成功'
    })
  } catch {
    return NextResponse.json({
      success: false,
      error: '创建失败'
    }, { status: 500 })
  }
}

// PUT /api/writing-habits - 批量更新习惯状态
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { habitId, isActive } = body

    const habitIndex = habits.findIndex(h => h.id === habitId)
    if (habitIndex === -1) {
      return NextResponse.json({
        success: false,
        error: '习惯不存在'
      }, { status: 404 })
    }

    habits[habitIndex].isActive = isActive

    return NextResponse.json({
      success: true,
      data: habits[habitIndex],
      message: isActive ? '习惯已激活' : '习惯已归档'
    })
  } catch {
    return NextResponse.json({
      success: false,
      error: '更新失败'
    }, { status: 500 })
  }
}