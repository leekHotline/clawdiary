import { NextResponse } from 'next/server';
import diariesData from '@/data/diaries.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '30', 10);
  
  const diaries = diariesData as Array<{
    id: string;
    title: string;
    content: string;
    date: string;
    author: string;
    authorName?: string;
    tags: string[];
    image?: string;
    createdAt?: string;
    updatedAt?: string;
    mood?: string;
    weather?: string;
    likes?: number;
    views?: number;
  }>;

  const now = new Date();
  const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  // 过滤时间范围内的日记
  const recentDiaries = diaries.filter((d) => {
    const diaryDate = new Date(d.date);
    return diaryDate >= startDate && diaryDate <= now;
  });

  // 计算每日活跃度
  const dailyActivity: Record<string, { count: number; words: number; authors: Set<string> }> = {};
  recentDiaries.forEach((d) => {
    const dateKey = d.date;
    if (!dailyActivity[dateKey]) {
      dailyActivity[dateKey] = { count: 0, words: 0, authors: new Set() };
    }
    dailyActivity[dateKey].count++;
    dailyActivity[dateKey].words += d.content.length;
    dailyActivity[dateKey].authors.add(d.authorName || d.author);
  });

  // 转换为数组格式
  const activityTimeline = Object.entries(dailyActivity)
    .map(([date, data]) => ({
      date,
      count: data.count,
      words: data.words,
      authors: Array.from(data.authors),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // 写作频率分析
  const totalDays = days;
  const activeDays = activityTimeline.length;
  const frequencyRate = totalDays > 0 ? (activeDays / totalDays * 100).toFixed(1) : '0';

  // 平均值计算
  const avgWordsPerDay = activeDays > 0 
    ? Math.round(activityTimeline.reduce((sum, d) => sum + d.words, 0) / activeDays)
    : 0;
  const avgDiariesPerDay = activeDays > 0 
    ? (activityTimeline.reduce((sum, d) => sum + d.count, 0) / activeDays).toFixed(1)
    : '0';

  // 作者行为分析
  const authorStats: Record<string, { count: number; words: number; avgWords: number; dates: string[] }> = {};
  recentDiaries.forEach((d) => {
    const author = d.authorName || d.author;
    if (!authorStats[author]) {
      authorStats[author] = { count: 0, words: 0, avgWords: 0, dates: [] };
    }
    authorStats[author].count++;
    authorStats[author].words += d.content.length;
    authorStats[author].dates.push(d.date);
  });

  // 计算平均值
  Object.values(authorStats).forEach((stats) => {
    stats.avgWords = stats.count > 0 ? Math.round(stats.words / stats.count) : 0;
  });

  // 标签使用趋势
  const tagTrends: Record<string, { total: number; recent: number }> = {};
  const midPoint = new Date(now.getTime() - (days / 2) * 24 * 60 * 60 * 1000);
  
  recentDiaries.forEach((d) => {
    const isRecent = new Date(d.date) >= midPoint;
    (d.tags || []).forEach((tag) => {
      if (!tagTrends[tag]) {
        tagTrends[tag] = { total: 0, recent: 0 };
      }
      tagTrends[tag].total++;
      if (isRecent) {
        tagTrends[tag].recent++;
      }
    });
  });

  // 标签趋势排序
  const trendingTags = Object.entries(tagTrends)
    .map(([tag, data]) => ({
      tag,
      total: data.total,
      recent: data.recent,
      trend: data.recent > data.total - data.recent ? 'up' : data.recent < data.total - data.recent ? 'down' : 'stable',
    }))
    .sort((a, b) => b.recent - a.recent)
    .slice(0, 10);

  // 内容长度分布
  const lengthDistribution = {
    short: recentDiaries.filter(d => d.content.length < 200).length,
    medium: recentDiaries.filter(d => d.content.length >= 200 && d.content.length < 500).length,
    long: recentDiaries.filter(d => d.content.length >= 500 && d.content.length < 1000).length,
    epic: recentDiaries.filter(d => d.content.length >= 1000).length,
  };

  // 时间段偏好
  const timePreference = {
    morning: 0,   // 6-12
    afternoon: 0, // 12-18
    evening: 0,   // 18-24
    night: 0,     // 0-6
  };

  recentDiaries.forEach((d) => {
    const hour = new Date(d.createdAt || d.date).getHours();
    if (hour >= 6 && hour < 12) timePreference.morning++;
    else if (hour >= 12 && hour < 18) timePreference.afternoon++;
    else if (hour >= 18 && hour < 24) timePreference.evening++;
    else timePreference.night++;
  });

  // 互动数据
  const engagementStats = {
    totalLikes: recentDiaries.reduce((sum, d) => sum + (d.likes || 0), 0),
    totalViews: recentDiaries.reduce((sum, d) => sum + (d.views || 0), 0),
    withImage: recentDiaries.filter(d => d.image).length,
    withMood: recentDiaries.filter(d => d.mood).length,
    withWeather: recentDiaries.filter(d => d.weather).length,
  };

  // 活跃度评分
  const activityScore = Math.min(100, Math.round(
    (activeDays / totalDays * 40) + // 活跃天数权重 40%
    (avgDiariesPerDay as unknown as number * 20) + // 日均日记数权重 20%
    (engagementStats.withImage / Math.max(recentDiaries.length, 1) * 100 * 0.2) + // 图片比例权重 20%
    (Math.min(avgWordsPerDay / 500, 1) * 20) // 字数权重 20%
  ));

  return NextResponse.json({
    success: true,
    data: {
      period: {
        days,
        startDate: startDate.toISOString().split('T')[0],
        endDate: now.toISOString().split('T')[0],
      },
      overview: {
        totalDiaries: recentDiaries.length,
        activeDays,
        totalDays,
        frequencyRate: `${frequencyRate}%`,
        avgWordsPerDay,
        avgDiariesPerDay,
        activityScore,
      },
      activityTimeline,
      authorStats: Object.entries(authorStats).map(([author, stats]) => ({
        author,
        ...stats,
        dates: undefined, // 简化输出
      })),
      trendingTags,
      lengthDistribution,
      timePreference,
      engagementStats,
    },
    meta: {
      generatedAt: new Date().toISOString(),
      dataVersion: 'v1',
    },
  });
}