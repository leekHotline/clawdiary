import { NextRequest, NextResponse } from 'next/server'

// 模拟模板数据
const templates: { id: string; usageCount: number }[] = [
  { id: 'daily-basic', usageCount: 1256 },
  { id: 'gratitude', usageCount: 892 },
  { id: 'work', usageCount: 678 },
  { id: 'reflection', usageCount: 567 },
  { id: 'travel', usageCount: 423 },
  { id: 'health', usageCount: 345 },
  { id: 'creative', usageCount: 234 },
  { id: 'morning-pages', usageCount: 189 },
  { id: 'dream', usageCount: 156 }
]

// 用户最近使用的模板
const userRecentTemplates: { [key: string]: string[] } = {
  user1: ['daily-basic', 'gratitude', 'reflection']
}

// GET: 获取单个模板详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const template = templates.find(t => t.id === id)

    if (!template) {
      return NextResponse.json(
        { success: false, error: '模板不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: template.id,
        usageCount: template.usageCount,
        lastUsed: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('获取模板详情失败:', error)
    return NextResponse.json(
      { success: false, error: '获取模板详情失败' },
      { status: 500 }
    )
  }
}

// POST: 记录模板使用
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { userId } = body

    // 更新模板使用次数
    const template = templates.find(t => t.id === id)
    if (template) {
      template.usageCount++
    }

    // 更新用户最近使用的模板
    if (userId) {
      if (!userRecentTemplates[userId]) {
        userRecentTemplates[userId] = []
      }
      // 移除重复
      userRecentTemplates[userId] = userRecentTemplates[userId].filter(t => t !== id)
      // 添加到最前面
      userRecentTemplates[userId].unshift(id)
      // 只保留最近5个
      userRecentTemplates[userId] = userRecentTemplates[userId].slice(0, 5)
    }

    return NextResponse.json({
      success: true,
      data: {
        templateId: id,
        newUsageCount: template?.usageCount || 0,
        userRecentTemplates: userRecentTemplates[userId] || []
      },
      message: '模板使用记录已更新'
    })
  } catch (error) {
    console.error('记录模板使用失败:', error)
    return NextResponse.json(
      { success: false, error: '记录模板使用失败' },
      { status: 500 }
    )
  }
}

// DELETE: 删除自定义模板
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 只能删除自定义模板
    if (!id.startsWith('custom-')) {
      return NextResponse.json(
        { success: false, error: '不能删除系统模板' },
        { status: 400 }
      )
    }

    // 实际删除逻辑

    return NextResponse.json({
      success: true,
      message: '模板已删除'
    })
  } catch (error) {
    console.error('删除模板失败:', error)
    return NextResponse.json(
      { success: false, error: '删除模板失败' },
      { status: 500 }
    )
  }
}