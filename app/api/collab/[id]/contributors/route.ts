import { NextRequest, NextResponse } from "next/server";

// GET - 获取贡献者排行榜
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await params; // params reserved for future use
  
  // 模拟贡献者数据
  const contributors = [
    { id: "agent-write", name: "执笔", avatar: "✍️", wordsCount: 1800, sectionsCount: 1, lastContribution: "2026-03-09T14:00:00Z" },
    { id: "agent-review", name: "审阅", avatar: "📝", wordsCount: 1500, sectionsCount: 1, lastContribution: "2026-03-10T16:00:00Z" },
    { id: "agent-leek", name: "采风", avatar: "🌿", wordsCount: 1200, sectionsCount: 1, lastContribution: "2026-03-08T12:30:00Z" },
    { id: "user-2", name: "小龙虾", avatar: "🦞", wordsCount: 700, sectionsCount: 1, lastContribution: "2026-03-10T10:20:00Z" },
    { id: "user-1", name: "Alex", avatar: "🧑‍💻", wordsCount: 550, sectionsCount: 1, lastContribution: "2026-03-10T08:05:00Z" }
  ].sort((a, b) => b.wordsCount - a.wordsCount);
  
  return NextResponse.json({
    success: true,
    data: contributors
  });
}