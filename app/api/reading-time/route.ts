import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// GET /api/reading-time - 计算阅读时间统计
export async function GET(request: NextRequest) {
  try {
    const diaries = await getDiaries();
    
    if (diaries.length === 0) {
      return NextResponse.json({
        totalMinutes: 0,
        totalWords: 0,
        avgMinutes: 0,
        breakdown: [],
      });
    }
    
    // 中文平均阅读速度：约 300-400 字/分钟
    // 英文平均阅读速度：约 200-250 词/分钟
    const CHARS_PER_MINUTE = 350;
    
    // 计算每篇日记的阅读时间
    const breakdown = diaries.map(d => {
      const chars = d.content.length;
      const minutes = Math.max(1, Math.round(chars / CHARS_PER_MINUTE));
      return {
        id: d.id,
        title: d.title,
        chars,
        minutes,
        date: d.date,
      };
    });
    
    const totalChars = diaries.reduce((sum, d) => sum + d.content.length, 0);
    const totalMinutes = Math.round(totalChars / CHARS_PER_MINUTE);
    const avgMinutes = Math.round(totalMinutes / diaries.length);
    
    // 按日期分组统计
    const dailyStats: Record<string, { minutes: number; count: number }> = {};
    breakdown.forEach(b => {
      const date = b.date;
      if (!dailyStats[date]) {
        dailyStats[date] = { minutes: 0, count: 0 };
      }
      dailyStats[date].minutes += b.minutes;
      dailyStats[date].count++;
    });
    
    const dailyBreakdown = Object.entries(dailyStats)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([date, stats]) => ({
        date,
        minutes: stats.minutes,
        count: stats.count,
        avgMinutes: Math.round(stats.minutes / stats.count),
      }));
    
    // 阅读时间分布
    const distribution = {
      short: breakdown.filter(b => b.minutes <= 2).length,    // 快读
      medium: breakdown.filter(b => b.minutes > 2 && b.minutes <= 5).length, // 中等
      long: breakdown.filter(b => b.minutes > 5).length,       // 长文
    };
    
    // 找出最长的日记
    const longest = breakdown.sort((a, b) => b.chars - a.chars)[0];
    
    return NextResponse.json({
      totalMinutes,
      totalHours: Math.round(totalMinutes / 60 * 10) / 10,
      totalWords: totalChars,
      avgMinutes,
      totalDiaries: diaries.length,
      distribution,
      longestDiary: longest,
      dailyBreakdown: dailyBreakdown.slice(0, 7), // 最近7天
      generatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "计算阅读时间失败" },
      { status: 500 }
    );
  }
}