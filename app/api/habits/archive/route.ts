import { NextRequest, NextResponse } from 'next/server';

// Demo archived habits
const archivedHabits = [
  {
    id: 'arch1',
    name: '学习英语',
    icon: '🌍',
    color: '#06b6d4',
    totalCompletions: 156,
    bestStreak: 45,
    archivedAt: '2026-02-15',
    createdAt: '2025-10-01',
  },
  {
    id: 'arch2',
    name: '健身',
    icon: '🏋️',
    color: '#ef4444',
    totalCompletions: 89,
    bestStreak: 28,
    archivedAt: '2026-01-20',
    createdAt: '2025-08-15',
  },
  {
    id: 'arch3',
    name: '早起',
    icon: '🌅',
    color: '#f59e0b',
    totalCompletions: 234,
    bestStreak: 60,
    archivedAt: '2026-02-28',
    createdAt: '2025-06-01',
  },
];

export async function GET(request: NextRequest) {
  return NextResponse.json({
    habits: archivedHabits,
    total: archivedHabits.length,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;
    
    // Archive a habit
    return NextResponse.json({
      success: true,
      habitId: id,
      archivedAt: new Date().toISOString(),
    });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to archive habit' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action } = body;
    
    if (action === 'restore') {
      return NextResponse.json({
        success: true,
        habitId: id,
        restoredAt: new Date().toISOString(),
      });
    }
    
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to update archived habit' },
      { status: 500 }
    );
  }
}