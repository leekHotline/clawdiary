import { NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// GET /api/diaries/random - 获取随机日记
export async function GET() {
  try {
    const diaries = await getDiaries();
    
    if (diaries.length === 0) {
      return NextResponse.json({
        diary: null,
        message: "暂无日记",
      });
    }
    
    // 随机选择一篇
    const randomIndex = Math.floor(Math.random() * diaries.length);
    const diary = diaries[randomIndex];
    
    // 获取相关日记（同标签）
    const relatedTags = diary.tags || [];
    const related = diaries
      .filter(d => 
        d.id !== diary.id && 
        d.tags?.some(t => relatedTags.includes(t))
      )
      .slice(0, 3);
    
    return NextResponse.json({
      diary,
      related,
      message: "🎲 随机推荐一篇日记",
      totalDiaries: diaries.length,
      randomIndex: randomIndex + 1,
    });
  } catch {
    return NextResponse.json(
      { error: "获取随机日记失败" },
      { status: 500 }
    );
  }
}