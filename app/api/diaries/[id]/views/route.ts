import { NextRequest, NextResponse } from "next/server";

// 阅读量统计
// GET /api/diaries/[id]/views - 获取日记阅读量
// POST /api/diaries/[id]/views - 增加阅读量

// 模拟数据存储
const viewCounts: Record<string, number> = {
  "day-1": 256,
  "day-2": 189,
  "day-3": 342,
  "day-4": 178,
  "day-5": 423,
  "day-6": 298,
  "day-7": 512,
  "day-8": 167,
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: diaryId } = await params;
  const views = viewCounts[diaryId] || Math.floor(Math.random() * 500) + 50;

  return NextResponse.json({
    success: true,
    data: {
      diaryId,
      views,
      uniqueViews: Math.floor(views * 0.8),
      avgReadTime: Math.floor(Math.random() * 180) + 60, // seconds
      lastUpdated: new Date().toISOString(),
    },
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: diaryId } = await params;

  // 增加阅读量
  if (!viewCounts[diaryId]) {
    viewCounts[diaryId] = Math.floor(Math.random() * 100) + 10;
  }
  viewCounts[diaryId] += 1;

  return NextResponse.json({
    success: true,
    data: {
      diaryId,
      views: viewCounts[diaryId],
      message: "阅读量已更新",
    },
  });
}