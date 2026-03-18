import { NextRequest, NextResponse } from "next/server";
import { analyzeText, saveWritingStats, getWritingAnalysis } from "@/lib/writing-analysis";

// GET /api/writing-analysis/stats - 获取写作统计
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");
    
    const analysis = await getWritingAnalysis();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    const recentStats = analysis.stats.filter(s => new Date(s.date) >= cutoff);
    
    // 汇总统计
    const summary = {
      totalWords: recentStats.reduce((sum, s) => sum + s.wordCount, 0),
      totalChars: recentStats.reduce((sum, s) => sum + s.charCount, 0),
      totalParagraphs: recentStats.reduce((sum, s) => sum + s.paragraphCount, 0),
      totalSentences: recentStats.reduce((sum, s) => sum + s.sentenceCount, 0),
      avgWordsPerDay: 0,
      avgCharsPerDay: 0,
      totalReadingTime: recentStats.reduce((sum, s) => sum + s.readingTime, 0),
      daysWithWriting: recentStats.length,
    };
    
    if (days > 0) {
      summary.avgWordsPerDay = Math.round(summary.totalWords / days);
      summary.avgCharsPerDay = Math.round(summary.totalChars / days);
    }
    
    return NextResponse.json({
      stats: recentStats,
      summary,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch writing stats" }, { status: 500 });
  }
}

// POST /api/writing-analysis/stats - 分析并保存文本统计
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;
    
    if (!content) {
      return NextResponse.json({ error: "Missing content" }, { status: 400 });
    }
    
    const stats = analyzeText(content);
    await saveWritingStats(stats);
    
    return NextResponse.json(stats, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to analyze text" }, { status: 500 });
  }
}