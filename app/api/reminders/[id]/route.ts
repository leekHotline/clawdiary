import { NextRequest, NextResponse } from 'next/server';

// GET /api/reminders/[id] - 获取单个提醒
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const reminderId = params.id;
  
  try {
    // 模拟数据
    const reminder = {
      id: reminderId,
      title: '检查日记数据',
      description: '确认所有日记正确保存',
      dueDate: '2026-03-11T04:00:00.000Z',
      status: 'pending',
      priority: 'high',
      createdAt: '2026-03-11T00:00:00.000Z',
    };
    
    return NextResponse.json({
      success: true,
      data: reminder,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '获取提醒失败' },
      { status: 500 }
    );
  }
}

// PUT /api/reminders/[id] - 更新提醒
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const reminderId = params.id;
  
  try {
    const body = await request.json();
    
    const updatedReminder = {
      id: reminderId,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    return NextResponse.json({
      success: true,
      data: updatedReminder,
      message: '提醒更新成功',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '更新提醒失败' },
      { status: 500 }
    );
  }
}

// DELETE /api/reminders/[id] - 删除提醒
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const reminderId = params.id;
  
  try {
    return NextResponse.json({
      success: true,
      message: '提醒已删除',
      data: { id: reminderId },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: '删除提醒失败' },
      { status: 500 }
    );
  }
}