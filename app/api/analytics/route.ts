import { NextResponse } from 'next/server';
import diariesData from '@/lib/diaries-data.json';

export async function GET() {
  // Calculate analytics
  const diaries = diariesData as Array<{
    id: string;
    title: string;
    content: string;
    date: string;
    author: string;
    tags: string[];
    image?: string;
  }>;

  // Basic stats
  const totalDiaries = diaries.length;
  const aiDiaries = diaries.filter((d) => d.author === 'AI').length;
  const humanDiaries = totalDiaries - aiDiaries;

  // Word count
  const totalWords = diaries.reduce(
    (sum, d) => sum + d.content.length + d.title.length,
    0
  );
  const avgWordsPerDiary = totalDiaries > 0 ? Math.round(totalWords / totalDiaries) : 0;

  // Tag analysis
  const tagCounts: Record<string, number> = {};
  diaries.forEach((d) => {
    d.tags?.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));

  // Date distribution
  const dateDistribution: Record<string, number> = {};
  diaries.forEach((d) => {
    const month = d.date.substring(0, 7); // YYYY-MM
    dateDistribution[month] = (dateDistribution[month] || 0) + 1;
  });

  // Author distribution
  const authorDistribution = {
    AI: aiDiaries,
    Human: humanDiaries,
  };

  // Image stats
  const diariesWithImages = diaries.filter((d) => d.image).length;

  // Calculate streak
  const sortedDates = diaries
    .map((d) => new Date(d.date))
    .sort((a, b) => b.getTime() - a.getTime());
  
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sortedDates.length; i++) {
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    
    const hasEntryOnDate = sortedDates.some((d) => {
      const dDate = new Date(d);
      dDate.setHours(0, 0, 0, 0);
      return dDate.getTime() === expectedDate.getTime();
    });
    
    if (hasEntryOnDate) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Longest streak calculation
  let longestStreak = 0;
  let tempStreak = 0;
  const uniqueDates = [...new Set(diaries.map((d) => d.date))].sort();
  
  for (let i = 0; i < uniqueDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffDays = Math.floor(
        (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
  }

  return NextResponse.json({
    success: true,
    data: {
      overview: {
        totalDiaries,
        aiDiaries,
        humanDiaries,
        totalWords,
        avgWordsPerDiary,
        diariesWithImages,
        currentStreak,
        longestStreak,
      },
      tags: {
        total: Object.keys(tagCounts).length,
        top: topTags,
        distribution: tagCounts,
      },
      timeline: {
        byMonth: dateDistribution,
        firstEntry: diaries.length > 0 ? diaries[0].date : null,
        lastEntry: diaries.length > 0 ? diaries[diaries.length - 1].date : null,
      },
      authors: authorDistribution,
    },
    meta: {
      generatedAt: new Date().toISOString(),
      dataVersion: 'v1',
    },
  });
}