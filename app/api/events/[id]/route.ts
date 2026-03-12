import { NextRequest, NextResponse } from 'next/server';

// 模拟活动数据
const events: Record<string, any> = {
  '1': {
    id: '1',
    title: '团队周会',
    date: '2026-03-15',
    time: '10:00',
    endTime: '11:30',
    location: '会议室 A / Zoom 线上',
    description: '议程：\n1. 上周工作回顾\n2. 本周工作计划\n3. 项目进度更新\n4. 问题讨论',
    color: 'blue',
    repeat: 'weekly',
    reminder: '30',
    organizer: { name: 'Alex', avatar: '🦞' },
    participants: [
      { id: 'p1', name: '张三', avatar: '👨', status: 'going' },
      { id: 'p2', name: '李四', avatar: '👩', status: 'going' },
      { id: 'p3', name: '王五', avatar: '👦', status: 'maybe' },
    ],
  },
  '2': {
    id: '2',
    title: '产品评审',
    date: '2026-03-16',
    time: '14:00',
    endTime: '15:00',
    location: '线上',
    description: '新功能评审会议',
    color: 'green',
    repeat: 'none',
    reminder: '15',
    organizer: { name: '产品经理', avatar: '🎯' },
    participants: [],
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const event = events[id];

  if (!event) {
    return NextResponse.json(
      { success: false, error: '活动不存在' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: event,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  
  if (!events[id]) {
    return NextResponse.json(
      { success: false, error: '活动不存在' },
      { status: 404 }
    );
  }

  events[id] = {
    ...events[id],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json({
    success: true,
    data: events[id],
    message: '活动更新成功',
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  if (!events[id]) {
    return NextResponse.json(
      { success: false, error: '活动不存在' },
      { status: 404 }
    );
  }

  delete events[id];

  return NextResponse.json({
    success: true,
    message: '活动删除成功',
  });
}