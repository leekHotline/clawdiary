import { NextResponse } from 'next/server';
import { newDiaries } from '@/data/diaries';

// 获取历史周报列表
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  // 计算周报周期（模拟历史数据）
  const reports = [];
  const now = new Date();
  
  for (let i = 0; i < (page * limit); i++) {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() - (i * 7));
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    // 筛选该周日记
    const weekDiaries = newDiaries.filter(d => {
      const diaryDate = new Date(d.date);
      return diaryDate >= weekStart && diaryDate <= weekEnd;
    });

    if (weekDiaries.length === 0) continue;

    // 计算主要心情
    const moodCounts: Record<string, number> = {};
    weekDiaries.forEach(d => {
      if (d.mood) {
        moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1;
      }
    });
    const dominantMood = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'calm';

    reports.push({
      weekStart: weekStart.toISOString().split('T')[0],
      weekEnd: weekEnd.toISOString().split('T')[0],
      diaryCount: weekDiaries.length,
      wordCount: weekDiaries.reduce((sum, d) => sum + (d.wordCount || 0), 0),
      dominantMood,
    });
  }

  // 分页
  const startIndex = (page - 1) * limit;
  const paginatedReports = reports.slice(startIndex, startIndex + limit);

  return NextResponse.json({
    reports: paginatedReports,
    page,
    total: reports.length,
  });
}