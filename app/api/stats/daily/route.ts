import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// GET /api/stats/daily - 获取每日统计
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
    
    const diaries = await getDiaries();
    
    // 筛选指定日期的日记
    const dailyDiaries = diaries.filter(d => d.date === date);
    
    // 计算统计
    const authorCounts: Record<string, number> = {};
    const tagCounts: Record<string, number> = {};
    let totalWords = 0;
    
    dailyDiaries.forEach(d => {
      const author = d.authorName || d.author;
      authorCounts[author] = (authorCounts[author] || 0) + 1;
      d.tags?.forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1);
      totalWords += d.content.length;
    });
    
    return NextResponse.json({
      date,
      totalDiaries: dailyDiaries.length,
      totalWords,
      avgWordsPerDiary: dailyDiaries.length > 0 ? Math.round(totalWords / dailyDiaries.length) : 0,
      authorBreakdown: Object.entries(authorCounts)
        .map(([author, count]) => ({ author, count }))
        .sort((a, b) => b.count - a.count),
      topTags: Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count })),
      diaries: dailyDiaries.map(d => ({
        id: d.id,
        title: d.title,
        author: d.authorName || d.author,
        wordCount: d.content.length,
      })),
    });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch daily stats" }, { status: 500 });
  }
}