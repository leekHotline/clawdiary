import { NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// 阅读热力图数据 API
export async function GET() {
  const diaries = await getDiaries();
  
  // 计算过去 365 天的数据
  const today = new Date();
  const heatmapData: { date: string; count: number; words: number; level: number }[] = [];
  
  // 生成过去 365 天的日期
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // 找到该日期的日记
    const dayDiaries = diaries.filter(d => d.date === dateStr);
    const count = dayDiaries.length;
    const words = dayDiaries.reduce((sum, d) => sum + d.content.length, 0);
    
    // 热力等级 (0-4)
    let level = 0;
    if (count > 0) level = 1;
    if (count >= 2) level = 2;
    if (count >= 3) level = 3;
    if (words >= 2000) level = 4;
    
    heatmapData.push({ date: dateStr, count, words, level });
  }
  
  // 计算统计数据
  const activeDays = heatmapData.filter(d => d.count > 0).length;
  const totalWords = heatmapData.reduce((sum, d) => sum + d.words, 0);
  const longestStreak = calculateLongestStreak(heatmapData);
  const currentStreak = calculateCurrentStreak(heatmapData);
  const maxWordsDay = heatmapData.reduce((max, d) => d.words > max.words ? d : max, heatmapData[0]);
  
  return NextResponse.json({
    heatmap: heatmapData,
    stats: {
      activeDays,
      totalWords,
      longestStreak,
      currentStreak,
      maxWordsDay: maxWordsDay.count > 0 ? maxWordsDay : null,
      totalDiaries: diaries.length,
      avgWordsPerDay: activeDays > 0 ? Math.round(totalWords / activeDays) : 0,
    },
    // 月度数据用于详细视图
    monthlyData: getMonthlyData(heatmapData),
  });
}

function calculateLongestStreak(data: { date: string; count: number }[]): number {
  let maxStreak = 0;
  let currentStreak = 0;
  
  for (const day of data) {
    if (day.count > 0) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  return maxStreak;
}

function calculateCurrentStreak(data: { date: string; count: number }[]): number {
  let streak = 0;
  
  // 从今天往前数
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].count > 0) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

function getMonthlyData(data: { date: string; count: number; words: number }[]): { month: string; count: number; words: number }[] {
  const monthlyMap = new Map<string, { count: number; words: number }>();
  
  for (const day of data) {
    const month = day.date.substring(0, 7); // YYYY-MM
    const existing = monthlyMap.get(month) || { count: 0, words: 0 };
    existing.count += day.count;
    existing.words += day.words;
    monthlyMap.set(month, existing);
  }
  
  return [...monthlyMap.entries()]
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => a.month.localeCompare(b.month));
}