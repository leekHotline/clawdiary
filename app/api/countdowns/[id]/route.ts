import { NextRequest, NextResponse } from 'next/server';

// Mock data (shared with main route)
const countdowns: Array<{
  id: string;
  title: string;
  description?: string;
  targetDate: string;
  type: string;
  icon: string;
  color: string;
  repeat: string;
  isPrivate: boolean;
  createdAt: string;
}> = [
  {
    id: '1',
    title: '结婚纪念日',
    description: '2018年结婚，每年都要记得这个特殊的日子',
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'anniversary',
    icon: '💕',
    color: 'red',
    repeat: 'yearly',
    isPrivate: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: '妈妈生日',
    description: '记得提前准备礼物',
    targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'birthday',
    icon: '🎂',
    color: 'pink',
    repeat: 'yearly',
    isPrivate: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: '项目截止日',
    description: '年度大项目交付',
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'reminder',
    icon: '⏰',
    color: 'orange',
    repeat: 'none',
    isPrivate: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: '春节',
    targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'holiday',
    icon: '🧧',
    color: 'red',
    repeat: 'yearly',
    isPrivate: false,
    createdAt: new Date().toISOString(),
  },
];

// GET - Get single countdown
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const countdown = countdowns.find(c => c.id === id);
  
  if (!countdown) {
    return NextResponse.json(
      { error: '倒计时不存在' },
      { status: 404 }
    );
  }

  return NextResponse.json({ countdown });
}

// PUT - Update countdown
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const index = countdowns.findIndex(c => c.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: '倒计时不存在' },
        { status: 404 }
      );
    }

    countdowns[index] = {
      ...countdowns[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ 
      success: true, 
      countdown: countdowns[index] 
    });
  } catch {
    return NextResponse.json(
      { error: '更新失败' },
      { status: 500 }
    );
  }
}

// DELETE - Delete countdown
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = countdowns.findIndex(c => c.id === id);

  if (index === -1) {
    return NextResponse.json(
      { error: '倒计时不存在' },
      { status: 404 }
    );
  }

  countdowns.splice(index, 1);
  
  return NextResponse.json({ success: true });
}