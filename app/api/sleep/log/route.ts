import { NextRequest, NextResponse } from 'next/server';

// Demo sleep records
const sleepRecords = [
  {
    id: '1',
    date: '2026-03-12',
    bedtime: '23:30',
    wakeTime: '07:00',
    duration: 7.5,
    quality: 4,
    mood: 'refreshed',
    notes: '睡得不错，梦见在太空漫步',
    factors: ['冥想', '温水澡'],
  },
  {
    id: '2',
    date: '2026-03-11',
    bedtime: '00:15',
    wakeTime: '07:30',
    duration: 7.25,
    quality: 3,
    mood: 'okay',
    notes: '睡前看了手机，有点难入睡',
    factors: ['手机'],
  },
  {
    id: '3',
    date: '2026-03-10',
    bedtime: '22:45',
    wakeTime: '06:30',
    duration: 7.75,
    quality: 5,
    mood: 'great',
    notes: '完美的一天！',
    factors: ['冥想', '运动', '早睡'],
  },
  {
    id: '4',
    date: '2026-03-09',
    bedtime: '01:00',
    wakeTime: '08:00',
    duration: 7,
    quality: 2,
    mood: 'tired',
    notes: '熬夜了，精神不好',
    factors: ['咖啡', '晚班'],
  },
  {
    id: '5',
    date: '2026-03-08',
    bedtime: '23:00',
    wakeTime: '06:45',
    duration: 7.75,
    quality: 4,
    mood: 'good',
    notes: '规律作息的感觉真好',
    factors: ['冥想'],
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '30');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  
  let filtered = [...sleepRecords];
  
  if (startDate) {
    filtered = filtered.filter(r => r.date >= startDate);
  }
  if (endDate) {
    filtered = filtered.filter(r => r.date <= endDate);
  }
  
  return NextResponse.json({
    records: filtered.slice(0, limit),
    total: filtered.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newRecord = {
      id: Date.now().toString(),
      ...body,
    };
    
    return NextResponse.json({
      success: true,
      record: newRecord,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save sleep record' },
      { status: 500 }
    );
  }
}