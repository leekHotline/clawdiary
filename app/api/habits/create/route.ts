import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, icon, color, frequency, targetDays } = body;
    
    const newHabit = {
      id: Date.now().toString(),
      name,
      icon: icon || '✨',
      color: color || '#6366f1',
      frequency: frequency || 'daily',
      targetDays: targetDays || undefined,
      streak: 0,
      bestStreak: 0,
      completedToday: false,
      totalCompletions: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    return NextResponse.json({
      success: true,
      habit: newHabit,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create habit' },
      { status: 500 }
    );
  }
}