import { NextRequest, NextResponse } from 'next/server'

// 写作目标存储（与主路由共享）
declare global {
  var writingGoals: any[]
}

if (!globalThis.writingGoals) {
  globalThis.writingGoals = []
}

const goals = globalThis.writingGoals

// GET /api/writing-goals/[id] - 获取单个目标详情
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

  // 计算进度百分比
  const progressPercentage = Math.round((goal.currentProgress / goal.target) * 100)
  
  // 计算剩余时间和每日所需
  let daysRemaining = 0
  let dailyRequired = 0
  
  if (goal.endDate) {
    const end = new Date(goal.endDate)
    const now = new Date()
    daysRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    
    if (daysRemaining > 0) {
      dailyRequired = Math.ceil((goal.target - goal.currentProgress) / daysRemaining)
    }
  }

  return NextResponse.json({
    success: true,
    data: {
      ...goal,
      progressPercentage,
      daysRemaining,
      dailyRequired,
      isOnTrack: dailyRequired > 0 ? goal.currentProgress >= (goal.target * (1 - daysRemaining / 30)) : true
    }
  })
}

// PUT /api/writing-goals/[id] - 更新目标
export async function PUT(
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
    const now = new Date().toISOString()

    goals[goalIndex] = {
      ...goals[goalIndex],
      ...body,
      updatedAt: now
    }

    return NextResponse.json({
      success: true,
      data: goals[goalIndex],
      message: '目标更新成功'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: '更新失败'
    }, { status: 500 })
  }
}

// DELETE /api/writing-goals/[id] - 删除目标
export async function DELETE(
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

  goals.splice(goalIndex, 1)

  return NextResponse.json({
    success: true,
    message: '目标已删除'
  })
}