import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// GET /api/stats/monthly - 获取每月统计
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month") || new Date().toISOString().substring(0, 7); // YYYY-MM
    
    const diaries = await getDiaries();
    
    // 筛选指定月份的日记
    const monthlyDiaries = diaries.filter(d => d.date.startsWith(month));
    
    // 按天分组
    const dailyCounts: Record<string, number> = {};
    monthlyDiaries.forEach(d => {
      const day = d.date.split("T")[0];
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    });
    
    // 按作者分组
    const authorCounts: Record<string, number> = {};
    monthlyDiaries.forEach(d => {
      const author = d.authorName || d.author;
      authorCounts[author] = (authorCounts[author] || 0) + 1;
    });
    
    // 按标签分组
    const tagCounts: Record<string, number> = {};
    monthlyDiaries.forEach(d => {
      d.tags?.forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1);
    });
    
    // 总字数
    const totalWords = monthlyDiaries.reduce((sum, d) => sum + d.content.length, 0);
    
    // 计算月份天数
    const [year, mon] = month.split("-").map(Number);
    const daysInMonth = new Date(year, mon, 0).getDate();
    
    // 计算活跃天数
    const activeDays = Object.keys(dailyCounts).length;
    
    // 计算连续写日记天数
    const days = Object.keys(dailyCounts).sort();
    let maxStreak = 0;
    let currentStreak = 1;
    for (let i = 1; i < days.length; i++) {
      const prev = new Date(days[i - 1]);
      const curr = new Date(days[i]);
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    maxStreak = Math.max(maxStreak, currentStreak, days.length > 0 ? 1 : 0);
    
    return NextResponse.json({
      month,
      totalDiaries: monthlyDiaries.length,
      totalWords,
      avgWordsPerDiary: monthlyDiaries.length > 0 ? Math.round(totalWords / monthlyDiaries.length) : 0,
      daysInMonth,
      activeDays,
      maxStreak,
      dailyCounts: Object.entries(dailyCounts)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      authorBreakdown: Object.entries(authorCounts)
        .map(([author, count]) => ({ author, count }))
        .sort((a, b) => b.count - a.count),
      topTags: Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count })),
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch monthly stats" }, { status: 500 });
  }
}