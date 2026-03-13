import { NextRequest, NextResponse } from "next/server";
import { analyzeStyle, saveWritingStyle, getWritingAnalysis } from "@/lib/writing-analysis";
import { getDiaries } from "@/lib/diaries";

// GET /api/writing-analysis/style - 获取写作风格分析
export async function GET(request: NextRequest) {
  try {
    const analysis = await getWritingAnalysis();
    const styles = analysis.styles;
    
    return NextResponse.json(styles);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch writing style" }, { status: 500 });
  }
}

// POST /api/writing-analysis/style - 分析并保存写作风格
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { period } = body;
    
    // 获取日记数据
    const diaries = await getDiaries();
    
    // 根据期间过滤
    let filteredDiaries = diaries;
    if (period === "last-30-days") {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 30);
      filteredDiaries = diaries.filter(d => new Date(d.date) >= cutoff);
    } else if (period === "last-7-days") {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      filteredDiaries = diaries.filter(d => new Date(d.date) >= cutoff);
    }
    
    if (filteredDiaries.length === 0) {
      return NextResponse.json({ error: "No diaries found for analysis" }, { status: 400 });
    }
    
    const style = analyzeStyle(filteredDiaries);
    style.period = period || "all-time";
    
    await saveWritingStyle(style);
    
    return NextResponse.json(style, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to analyze writing style" }, { status: 500 });
  }
}