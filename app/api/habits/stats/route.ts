import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || 'month';
  
  // Demo stats
  const stats = {
    totalHabits: 12,
    activeHabits: 8,
    archivedHabits: 4,
    totalCompletions: 1250,
    averageStreak: 18.5,
    bestStreak: 67,
    bestStreakHabit: '日记',
    mostConsistent: '冥想',
    mostConsistentRate: 95.5,
    weeklyTrend: [
      { week: '第1周', completions: 42 },
      { week: '第2周', completions: 48 },
      { week: '第3周', completions: 45 },
      { week: '第4周', completions: 52 },
    ],
    habitsByCategory: [
      { category: '健康', count: 4 },
      { category: '学习', count: 3 },
      { category: '生活', count: 2 },
      { category: '工作', count: 2 },
    ],
    topHabits: [
      { name: '日记', icon: '📝', streak: 67, rate: 100 },
      { name: '冥想', icon: '🧘', streak: 15, rate: 95 },
      { name: '阅读', icon: '📚', streak: 8, rate: 85 },
      { name: '运动', icon: '💪', streak: 4, rate: 75 },
      { name: '早睡', icon: '🌙', streak: 5, rate: 70 },
    ],
    period,
    generatedAt: new Date().toISOString(),
  };
  
  return NextResponse.json(stats);
}