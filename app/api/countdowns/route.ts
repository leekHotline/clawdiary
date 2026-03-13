import { NextRequest, NextResponse } from 'next/server';

// Mock data for development
const countdowns: Array<{
  id: string;
  title: string;
  description?: string;
  targetDate: string;
  type: 'birthday' | 'anniversary' | 'holiday' | 'custom' | 'reminder';
  icon: string;
  color: string;
  repeat: 'none' | 'yearly' | 'monthly' | 'weekly';
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

// GET - List all countdowns
export async function GET() {
  return NextResponse.json({ 
    countdowns: countdowns.sort((a, b) => 
      new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
    )
  });
}

// POST - Create a new countdown
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, targetDate, type, icon, color, repeat, isPrivate } = body;

    if (!title?.trim() || !targetDate) {
      return NextResponse.json(
        { error: '标题和目标日期是必填项' },
        { status: 400 }
      );
    }

    const newCountdown = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description?.trim() || undefined,
      targetDate,
      type: type || 'custom',
      icon: icon || '',
      color: color || 'purple',
      repeat: repeat || 'none',
      isPrivate: isPrivate || false,
      createdAt: new Date().toISOString(),
    };

    countdowns.push(newCountdown);
    
    return NextResponse.json({ 
      success: true, 
      countdown: newCountdown 
    });
  } catch (error) {
    console.error('Create countdown error:', error);
    return NextResponse.json(
      { error: '创建倒计时失败' },
      { status: 500 }
    );
  }
}