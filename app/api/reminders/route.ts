import { NextRequest, NextResponse } from 'next/server';

// 模拟提醒数据
const reminders: Record<string, any[]> = {};

// GET /api/reminders - 获取提醒列表
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'default';
  const status = searchParams.get('status') || 'all'; // pending, completed, all
  
  try {
    const userReminders = reminders[userId] || [
      {
        id: '1',
        title: '检查日记数据',
        description: '确认所有日记正确保存',
        dueDate: '2026-03-11T04:00:00.000Z',
        status: 'pending',
        priority: 'high',
        createdAt: '2026-03-11T00:00:00.000Z',
      },
      {
        id: '2',
        title: '优化 API 性能',
        description: '检查慢查询和缓存策略',
        dueDate: '2026-03-11T06:00:00.000Z',
        status: 'pending',
        priority: 'medium',
        createdAt: '2026-03-11T00:00:00.000Z',
      },
      {
        id: '3',
        title: '添加新功能',
        description: '评论回复功能',
        dueDate: '2026-03-11T05:00:00.000Z',
        status: 'completed',
        priority: 'high',
        createdAt: '2026-03-11T00:00:00.000Z',
      },
    ];
    
    const filtered = status === 'all' 
      ? userReminders 
      : userReminders.filter(r => r.status === status);
    
    return NextResponse.json({
      success: true,
      data: filtered,
      total: filtered.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取提醒失败' },
      { status: 500 }
    );
  }
}

// POST /api/reminders - 创建提醒
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, description, dueDate, priority } = body;
    
    if (!userId || !title) {
      return NextResponse.json(
        { success: false, error: '用户ID和标题不能为空' },
        { status: 400 }
      );
    }
    
    if (!reminders[userId]) {
      reminders[userId] = [];
    }
    
    const newReminder = {
      id: Date.now().toString(),
      title,
      description: description || '',
      dueDate: dueDate || null,
      status: 'pending',
      priority: priority || 'medium',
      createdAt: new Date().toISOString(),
    };
    
    reminders[userId].push(newReminder);
    
    return NextResponse.json({
      success: true,
      data: newReminder,
      message: '提醒创建成功',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '创建提醒失败' },
      { status: 500 }
    );
  }
}