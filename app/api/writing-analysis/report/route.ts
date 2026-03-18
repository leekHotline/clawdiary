import { NextResponse } from "next/server";
import { getWritingAnalysis } from "@/lib/writing-analysis";
import { getDiaries } from "@/lib/diaries";

// GET /api/writing-analysis/report - 获取完整的写作分析报告
export async function GET() {
  try {
    const analysis = await getWritingAnalysis();
    const diaries = await getDiaries();
    
    // 计算总体统计
    const totalDiaries = diaries.length;
    const totalWords = diaries.reduce((sum, d) => sum + d.content.length, 0);
    const totalChars = diaries.reduce((sum, d) => sum + d.content.length, 0);
    
    // 按作者统计
    const byAuthor: Record<string, number> = {};
    diaries.forEach(d => {
      byAuthor[d.author] = (byAuthor[d.author] || 0) + 1;
    });
    
    // 按日期统计
    const byDate: Record<string, number> = {};
    diaries.forEach(d => {
      const month = d.date.substring(0, 7); // YYYY-MM
      byDate[month] = (byDate[month] || 0) + 1;
    });
    
    // 标签统计
    const tagCount: Record<string, number> = {};
    diaries.forEach(d => {
      d.tags?.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    const topTags = Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    // 最近 7 天统计
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const recentDiaries = diaries.filter(d => new Date(d.date) >= last7Days);
    
    // 最近 30 天统计
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const monthlyDiaries = diaries.filter(d => new Date(d.date) >= last30Days);
    
    // 计算连续写作天数
    const sortedDates = [...new Set(diaries.map(d => d.date))].sort().reverse();
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedDates.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const checkStr = checkDate.toISOString().split("T")[0];
      
      if (sortedDates.includes(checkStr)) {
        streak++;
      } else {
        break;
      }
    }
    
    const report = {
      overview: {
        totalDiaries,
        totalWords,
        totalChars,
        avgWordsPerDiary: totalDiaries > 0 ? Math.round(totalWords / totalDiaries) : 0,
        streak,
      },
      byAuthor,
      byDate,
      topTags,
      recent: {
        last7Days: {
          count: recentDiaries.length,
          words: recentDiaries.reduce((sum, d) => sum + d.content.length, 0),
        },
        last30Days: {
          count: monthlyDiaries.length,
          words: monthlyDiaries.reduce((sum, d) => sum + d.content.length, 0),
        },
      },
      style: analysis.styles[0] || null,
      stats: analysis.stats.slice(-30), // 最近 30 条统计
    };
    
    return NextResponse.json(report);
  } catch {
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}