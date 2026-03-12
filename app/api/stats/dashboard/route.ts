import { NextRequest, NextResponse } from 'next/server';
import { getDiaries } from '@/lib/diaries';

const MOOD_EMOJIS: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  excited: '🎉',
  calm: '😌',
  anxious: '😰',
  grateful: '🙏',
  inspired: '💡',
  tired: '😴',
  peaceful: '☮️',
  thoughtful: '🤔',
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || 'month';

  try {
    const diaries = await getDiaries();
    
    // Calculate time range
    const now = new Date();
    let startDate: Date;
    
    switch (range) {
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
    }

    // Filter diaries by time range
    const filteredDiaries = diaries.filter((d: { date?: string; createdAt?: string }) => {
      const dateStr = d.date || d.createdAt;
      if (!dateStr) return false;
      return new Date(dateStr) >= startDate;
    });

    // Calculate total stats
    const totalDiaries = filteredDiaries.length;
    const totalWords = filteredDiaries.reduce((sum: number, d: { wordCount?: number; content?: string }) => 
      sum + (d.wordCount || d.content?.length || 0), 0);
    const avgWordsPerDiary = totalDiaries > 0 ? Math.round(totalWords / totalDiaries) : 0;

    // Calculate streaks
    const dates = [...new Set(diaries.map((d: { date?: string; createdAt?: string }) => 
      (d.date || d.createdAt)?.split('T')[0]).filter(Boolean))].sort().reverse();
    
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (dates.includes(dateStr)) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    const sortedDates = dates.filter((d): d is string => !!d).map((d: string) => new Date(d)).sort((a: Date, b: Date) => a.getTime() - b.getTime());
    
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const diff = (sortedDates[i].getTime() - sortedDates[i-1].getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    // Most used tags
    const tagCounts: Record<string, number> = {};
    diaries.forEach((d: { tags?: string[] }) => {
      d.tags?.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    const mostUsedTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);

    // Mood distribution
    const moodCounts: Record<string, number> = {};
    diaries.forEach((d) => {
      if (d.mood) {
        moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1;
      }
    });
    const moodDistribution = Object.entries(moodCounts)
      .map(([mood, count]) => ({ mood, count }))
      .sort((a, b) => b.count - a.count);

    // Writing time distribution (hourly)
    const hourCounts: Record<number, number> = {};
    for (let i = 0; i < 24; i++) {
      hourCounts[i] = 0;
    }
    diaries.forEach((d: { createdAt?: string }) => {
      if (d.createdAt) {
        const hour = new Date(d.createdAt).getHours();
        hourCounts[hour]++;
      }
    });
    const writingTimeDistribution = Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour: parseInt(hour), count }))
      .sort((a, b) => a.hour - b.hour);

    // Weekly progress
    const weeklyProgress: { date: string; words: number; diaries: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayDiaries = diaries.filter((d: { date?: string; createdAt?: string }) => {
        const dDate = (d.date || d.createdAt)?.split('T')[0];
        return dDate === dateStr;
      });
      
      weeklyProgress.push({
        date: dateStr,
        words: dayDiaries.reduce((sum: number, d: { wordCount?: number; content?: string }) => 
          sum + (d.wordCount || d.content?.length || 0), 0),
        diaries: dayDiaries.length,
      });
    }

    // Top writing days
    const dayWordCounts: Record<string, number> = {};
    diaries.forEach((d: { date?: string; createdAt?: string; wordCount?: number; content?: string }) => {
      const dateStr = (d.date || d.createdAt)?.split('T')[0];
      if (dateStr) {
        dayWordCounts[dateStr] = (dayWordCounts[dateStr] || 0) + (d.wordCount || d.content?.length || 0);
      }
    });
    const topWritingDays = Object.entries(dayWordCounts)
      .map(([date, words]) => ({ date, words }))
      .sort((a, b) => b.words - a.words)
      .slice(0, 10);

    return NextResponse.json({
      totalDiaries,
      totalWords,
      avgWordsPerDiary,
      longestStreak,
      currentStreak,
      mostUsedTags,
      moodDistribution,
      writingTimeDistribution,
      weeklyProgress,
      monthlyProgress: [],
      topWritingDays,
    });
  } catch (error) {
    console.error('Error calculating stats:', error);
    return NextResponse.json({
      totalDiaries: 0,
      totalWords: 0,
      avgWordsPerDiary: 0,
      longestStreak: 0,
      currentStreak: 0,
      mostUsedTags: [],
      moodDistribution: [],
      writingTimeDistribution: Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 })),
      weeklyProgress: [],
      monthlyProgress: [],
      topWritingDays: [],
    });
  }
}