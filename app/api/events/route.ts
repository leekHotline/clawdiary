import { NextRequest, NextResponse } from 'next/server';

// 模拟活动数据
const events = [
  {
    id: '1',
    title: '团队周会',
    date: '2026-03-15',
    time: '10:00',
    endTime: '11:30',
    location: '会议室 A',
    description: '每周团队例会',
    color: 'blue',
    repeat: 'weekly',
    reminder: '30',
    participants: [],
    createdAt: '2026-03-10T10:00:00Z',
  },
  {
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
    participants: [],
    createdAt: '2026-03-11T14:00:00Z',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get('year');
  const month = searchParams.get('month');

  let filteredEvents = events;

  if (year && month) {
    filteredEvents = events.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate.getFullYear() === parseInt(year) && 
             eventDate.getMonth() + 1 === parseInt(month);
    });
  }

  return NextResponse.json({
    success: true,
    data: filteredEvents,
    total: filteredEvents.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, date, time, endTime, location, description, color, repeat, reminder, participants } = body;

    if (!title || !date || !time) {
      return NextResponse.json(
        { success: false, error: '缺少必填字段' },
        { status: 400 }
      );
    }

    const newEvent = {
      id: Date.now().toString(),
      title,
      date,
      time,
      endTime: endTime || '',
      location: location || '',
      description: description || '',
      color: color || 'blue',
      repeat: repeat || 'none',
      reminder: reminder || '30',
      participants: participants || [],
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: newEvent,
      message: '活动创建成功',
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: '创建活动失败' },
      { status: 500 }
    );
  }
}