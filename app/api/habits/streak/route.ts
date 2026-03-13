import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const habitId = searchParams.get('habitId');
  
  // Demo streak data
  const streakData = {
    currentStreak: habitId ? 15 : 25,
    bestStreak: habitId ? 23 : 67,
    totalDays: habitId ? 45 : 365,
    streakHistory: [
      { date: '2026-03-12', completed: true },
      { date: '2026-03-11', completed: true },
      { date: '2026-03-10', completed: true },
      { date: '2026-03-09', completed: false },
      { date: '2026-03-08', completed: true },
    ],
    weeklyStreak: {
      current: 4,
      best: 12,
    },
    monthlyStreak: {
      current: 1,
      best: 3,
    },
  };
  
  return NextResponse.json(streakData);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { habitId, date, completed } = body;
    
    return NextResponse.json({
      success: true,
      habitId,
      date,
      completed,
      updatedAt: new Date().toISOString(),
    });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to update streak' },
      { status: 500 }
    );
  }
}