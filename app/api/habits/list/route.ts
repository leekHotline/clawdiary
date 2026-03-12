import { NextRequest, NextResponse } from 'next/server';

// Demo habits data
const habits = [
  {
    id: '1',
    name: '冥想',
    icon: '🧘',
    color: '#8b5cf6',
    frequency: 'daily',
    streak: 15,
    bestStreak: 23,
    completedToday: true,
    totalCompletions: 45,
    createdAt: '2026-02-01',
  },
  {
    id: '2',
    name: '阅读',
    icon: '📚',
    color: '#06b6d4',
    frequency: 'daily',
    streak: 8,
    bestStreak: 30,
    completedToday: false,
    totalCompletions: 120,
    createdAt: '2026-01-15',
  },
  {
    id: '3',
    name: '运动',
    icon: '💪',
    color: '#10b981',
    frequency: 'weekly',
    targetDays: [1, 3, 5],
    streak: 4,
    bestStreak: 12,
    completedToday: false,
    totalCompletions: 52,
    createdAt: '2026-01-01',
  },
  {
    id: '4',
    name: '日记',
    icon: '📝',
    color: '#f59e0b',
    frequency: 'daily',
    streak: 67,
    bestStreak: 67,
    completedToday: true,
    totalCompletions: 67,
    createdAt: '2026-01-05',
  },
  {
    id: '5',
    name: '早睡',
    icon: '🌙',
    color: '#6366f1',
    frequency: 'daily',
    streak: 5,
    bestStreak: 21,
    completedToday: false,
    totalCompletions: 89,
    createdAt: '2025-12-01',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const includeArchived = searchParams.get('includeArchived') === 'true';
  
  return NextResponse.json({
    habits: includeArchived ? habits : habits.filter(h => !('archived' in h)),
    total: habits.length,
  });
}