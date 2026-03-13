import { NextRequest, NextResponse } from "next/server";

// 获取写作热力图数据
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());
    const months = searchParams.get("months")?.split(",").map(Number) || null;
    
    // 生成一年的热力图数据
    const heatmapData: { date: string; count: number; words: number; mood: string }[] = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      
      // 随机生成模拟数据（实际应该从数据库获取）
      const hasEntry = Math.random() > 0.4;
      
      if (hasEntry) {
        const moods = ["happy", "sad", "peaceful", "excited", "anxious", "grateful", "neutral"];
        heatmapData.push({
          date: dateStr,
          count: Math.floor(Math.random() * 5) + 1,
          words: Math.floor(Math.random() * 1000) + 100,
          mood: moods[Math.floor(Math.random() * moods.length)],
        });
      }
    }
    
    // 计算统计数据
    const stats = {
      totalDays: heatmapData.length,
      totalEntries: heatmapData.reduce((sum, d) => sum + d.count, 0),
      totalWords: heatmapData.reduce((sum, d) => sum + d.words, 0),
      avgWordsPerDay: Math.round(
        heatmapData.reduce((sum, d) => sum + d.words, 0) / heatmapData.length
      ) || 0,
      longestStreak: calculateLongestStreak(heatmapData),
      currentStreak: calculateCurrentStreak(heatmapData),
      bestDay: findBestDay(heatmapData),
      busiestMonth: findBusiestMonth(heatmapData, year),
    };
    
    // 按月份分组
    const monthlyData: Record<number, typeof heatmapData> = {};
    heatmapData.forEach(d => {
      const month = new Date(d.date).getMonth() + 1;
      if (!monthlyData[month]) monthlyData[month] = [];
      monthlyData[month].push(d);
    });
    
    return NextResponse.json({
      year,
      heatmap: heatmapData,
      monthlyData,
      stats,
    });
  } catch (_error) {
    console.error("获取热力图数据失败:", _error);
    return NextResponse.json(
      { error: "获取热力图数据失败" },
      { status: 500 }
    );
  }
}

function calculateLongestStreak(data: { date: string }[]): number {
  if (!data.length) return 0;
  
  const sortedDates = data
    .map(d => d.date)
    .sort();
  
  let maxStreak = 1;
  let currentStreak = 1;
  
  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }
  
  return maxStreak;
}

function calculateCurrentStreak(data: { date: string }[]): number {
  if (!data.length) return 0;
  
  const today = new Date().toISOString().split("T")[0];
  const sortedDates = data
    .map(d => d.date)
    .sort()
    .reverse();
  
  let streak = 0;
  const currentDate = new Date(today);
  
  for (const date of sortedDates) {
    const dateStr = currentDate.toISOString().split("T")[0];
    
    if (date === dateStr) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (date === currentDate.toISOString().split("T")[0]) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

function findBestDay(data: { date: string; words: number }[]): { date: string; words: number } | null {
  if (!data.length) return null;
  
  return data.reduce((best, current) => 
    current.words > (best?.words || 0) ? current : best
  , null as { date: string; words: number } | null);
}

function findBusiestMonth(data: { date: string }[], year: number): { month: number; count: number } | null {
  if (!data.length) return null;
  
  const monthCounts: Record<number, number> = {};
  data.forEach(d => {
    const month = new Date(d.date).getMonth() + 1;
    monthCounts[month] = (monthCounts[month] || 0) + 1;
  });
  
  const entries = Object.entries(monthCounts);
  if (!entries.length) return null;
  
  const [month, count] = entries.reduce((a, b) => 
    (b[1] as number) > (a[1] as number) ? b : a
  );
  
  return { month: parseInt(month), count: count as number };
}