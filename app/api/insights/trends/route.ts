import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// GET /api/insights/trends - 趋势分析
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "week"; // week, month, year
    
    const diaries = await getDiaries();
    
    if (diaries.length === 0) {
      return NextResponse.json({
        trends: [],
        message: "暂无数据",
      });
    }
    
    // 计算时间范围
    const now = new Date();
    let startDate: Date;
    let groupBy: "day" | "week" | "month";
    
    switch (period) {
      case "week":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = "day";
        break;
      case "month":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        groupBy = "day";
        break;
      case "year":
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        groupBy = "month";
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        groupBy = "day";
    }
    
    // 过滤时间范围内的日记
    const filteredDiaries = diaries.filter(d => new Date(d.date) >= startDate);
    
    // 按时间分组
    const groups: Record<string, { count: number; words: number; tags: string[] }> = {};
    
    filteredDiaries.forEach(d => {
      let key: string;
      const date = new Date(d.date);
      
      if (groupBy === "day") {
        key = date.toISOString().split("T")[0];
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      }
      
      if (!groups[key]) {
        groups[key] = { count: 0, words: 0, tags: [] };
      }
      
      groups[key].count++;
      groups[key].words += d.content.length;
      groups[key].tags.push(...(d.tags || []));
    });
    
    // 计算趋势
    const trends = Object.entries(groups)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, data]) => ({
        date,
        count: data.count,
        words: data.words,
        avgWords: Math.round(data.words / data.count),
        topTags: [...new Set(data.tags)].slice(0, 3),
      }));
    
    // 计算变化趋势
    const recentTrend = trends.slice(-3);
    const previousTrend = trends.slice(-6, -3);
    
    const recentAvg = recentTrend.length > 0 
      ? recentTrend.reduce((sum, t) => sum + t.count, 0) / recentTrend.length 
      : 0;
    const previousAvg = previousTrend.length > 0 
      ? previousTrend.reduce((sum, t) => sum + t.count, 0) / previousTrend.length 
      : 0;
    
    const trendDirection = recentAvg > previousAvg ? "up" : recentAvg < previousAvg ? "down" : "stable";
    const trendPercentage = previousAvg > 0 
      ? Math.round(((recentAvg - previousAvg) / previousAvg) * 100) 
      : 0;
    
    return NextResponse.json({
      period,
      groupBy,
      trends,
      analysis: {
        total: filteredDiaries.length,
        trendDirection,
        trendPercentage,
        message: trendDirection === "up" 
          ? `📈 写作频率上升 ${Math.abs(trendPercentage)}%` 
          : trendDirection === "down" 
          ? `📉 写作频率下降 ${Math.abs(trendPercentage)}%`
          : "➡️ 写作频率稳定",
      },
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("获取趋势失败:", error);
    return NextResponse.json(
      { error: "获取趋势失败" },
      { status: 500 }
    );
  }
}