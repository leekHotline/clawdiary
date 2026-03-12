import { NextResponse } from 'next/server';
import { newDiaries } from '@/data/diaries';

// 获取本周周报
export async function GET() {
  // 计算本周起止日期
  const now = new Date();
  const dayOfWeek = now.getDay();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - dayOfWeek);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  // 筛选本周日记
  const thisWeekDiaries = newDiaries.filter(d => {
    const diaryDate = new Date(d.date);
    return diaryDate >= weekStart && diaryDate <= weekEnd;
  });

  // 上周日记（用于对比）
  const lastWeekStart = new Date(weekStart);
  lastWeekStart.setDate(weekStart.getDate() - 7);
  const lastWeekEnd = new Date(weekEnd);
  lastWeekEnd.setDate(weekEnd.getDate() - 7);
  const lastWeekDiaries = newDiaries.filter(d => {
    const diaryDate = new Date(d.date);
    return diaryDate >= lastWeekStart && diaryDate <= lastWeekEnd;
  });

  // 计算统计数据
  const summary = {
    totalDiaries: thisWeekDiaries.length,
    totalWords: thisWeekDiaries.reduce((sum, d) => sum + (d.wordCount || 0), 0),
    totalReadingTime: thisWeekDiaries.reduce((sum, d) => sum + (d.readingTime || 0), 0),
    avgWordsPerDay: thisWeekDiaries.length > 0 
      ? Math.round(thisWeekDiaries.reduce((sum, d) => sum + (d.wordCount || 0), 0) / 7)
      : 0,
  };

  // 心情分布
  const moodDistribution: Record<string, number> = {};
  thisWeekDiaries.forEach(d => {
    if (d.mood) {
      moodDistribution[d.mood] = (moodDistribution[d.mood] || 0) + 1;
    }
  });

  // 热门标签
  const tagCounts: Record<string, number> = {};
  thisWeekDiaries.forEach(d => {
    d.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));

  // 本周精选日记
  const bestDiaries = [...thisWeekDiaries]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 5)
    .map(d => ({
      id: d.id,
      title: d.title,
      likes: d.likes || 0,
      wordCount: d.wordCount || 0,
    }));

  // 写作时段分析
  const writingTimeSlots = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: Math.floor(Math.random() * 5), // 模拟数据
  }));
  // 让晚上时段更多
  writingTimeSlots[20].count = 8;
  writingTimeSlots[21].count = 6;
  writingTimeSlots[22].count = 4;

  // 对比上周
  const lastWeekWords = lastWeekDiaries.reduce((sum, d) => sum + (d.wordCount || 0), 0);
  const comparison = {
    diariesChange: thisWeekDiaries.length - lastWeekDiaries.length,
    wordsChange: summary.totalWords - lastWeekWords,
    moodTrend: Object.keys(moodDistribution).length > Object.keys(lastWeekDiaries.reduce((acc, d) => {
      if (d.mood) acc[d.mood] = (acc[d.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)).length ? 'up' : 'stable',
  };

  return NextResponse.json({
    weekStart: weekStart.toISOString(),
    weekEnd: weekEnd.toISOString(),
    summary,
    moodDistribution,
    topTags,
    bestDiaries,
    writingTimeSlots,
    comparison,
  });
}