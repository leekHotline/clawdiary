import { NextRequest, NextResponse } from 'next/server';
import { diaries } from '@/data/diaries';

// GET /api/tags/stats - 获取标签统计
export async function GET() {
  // 统计每个标签的详细信息
  const tagStats: Record<string, {
    count: number;
    firstUsed: string;
    lastUsed: string;
    avgWordCount: number;
    moods: Record<string, number>;
    authors: Record<string, number>;
    trend: 'up' | 'down' | 'stable';
  }> = {};

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  diaries.forEach((diary) => {
    diary.tags?.forEach((tag: string) => {
      if (!tagStats[tag]) {
        tagStats[tag] = {
          count: 0,
          firstUsed: diary.date,
          lastUsed: diary.date,
          avgWordCount: 0,
          moods: {},
          authors: {},
          trend: 'stable',
        };
      }

      const stats = tagStats[tag];
      stats.count++;
      stats.avgWordCount = (stats.avgWordCount * (stats.count - 1) + (diary.wordCount || 0)) / stats.count;

      // 更新时间范围
      if (diary.date < stats.firstUsed) {
        stats.firstUsed = diary.date;
      }
      if (diary.date > stats.lastUsed) {
        stats.lastUsed = diary.date;
      }

      // 统计心情分布
      if (diary.mood) {
        stats.moods[diary.mood] = (stats.moods[diary.mood] || 0) + 1;
      }

      // 统计作者
      if (diary.author) {
        stats.authors[diary.author] = (stats.authors[diary.author] || 0) + 1;
      }
    });
  });

  // 计算趋势
  const recentDiaries = diaries.filter(d => new Date(d.date) >= thirtyDaysAgo);
  const olderDiaries = diaries.filter(d => new Date(d.date) < thirtyDaysAgo);

  Object.keys(tagStats).forEach(tag => {
    const recentCount = recentDiaries.filter(d => d.tags?.includes(tag)).length;
    const olderCount = olderDiaries.filter(d => d.tags?.includes(tag)).length;

    if (recentCount > olderCount * 1.2) {
      tagStats[tag].trend = 'up';
    } else if (recentCount < olderCount * 0.8) {
      tagStats[tag].trend = 'down';
    }
  });

  // 排序
  const sortedStats = Object.entries(tagStats)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([name, stats]) => ({ name, ...stats }));

  // 总体统计
  const totalTags = sortedStats.length;
  const totalUsages = sortedStats.reduce((sum, t) => sum + t.count, 0);
  const avgTagsPerDiary = diaries.length > 0 ? totalUsages / diaries.length : 0;

  // 热门标签（使用次数前 10）
  const hotTags = sortedStats.slice(0, 10);

  // 上升趋势标签
  const risingTags = sortedStats.filter(t => t.trend === 'up').slice(0, 5);

  // 下降趋势标签
  const decliningTags = sortedStats.filter(t => t.trend === 'down').slice(0, 5);

  // 新标签（最近 30 天首次出现）
  const newTags = sortedStats.filter(t => new Date(t.firstUsed) >= thirtyDaysAgo);

  return NextResponse.json({
    totalTags,
    totalUsages,
    avgTagsPerDiary: avgTagsPerDiary.toFixed(2),
    hotTags,
    risingTags,
    decliningTags,
    newTags,
    allTags: sortedStats,
  });
}