import { NextRequest, NextResponse } from "next/server";

// 模拟统计数据存储
const statsStore: Record<string, { views: number; likes: number; comments: number; shares: number }> = {};

// GET /api/diaries/[id]/stats - 获取日记统计
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const stats = statsStore[id] || {
      views: Math.floor(Math.random() * 100) + 10,
      likes: Math.floor(Math.random() * 50) + 5,
      comments: Math.floor(Math.random() * 20),
      shares: Math.floor(Math.random() * 10),
    };
    
    // 确保存储
    statsStore[id] = stats;
    
    return NextResponse.json({
      diaryId: id,
      stats: {
        ...stats,
        engagement: stats.likes + stats.comments * 2 + stats.shares * 3,
      },
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("获取统计失败:", error);
    return NextResponse.json(
      { error: "获取统计失败" },
      { status: 500 }
    );
  }
}

// POST /api/diaries/[id]/stats - 增加统计
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body;
    
    if (!statsStore[id]) {
      statsStore[id] = { views: 0, likes: 0, comments: 0, shares: 0 };
    }
    
    switch (action) {
      case "view":
        statsStore[id].views++;
        break;
      case "like":
        statsStore[id].likes++;
        break;
      case "unlike":
        statsStore[id].likes = Math.max(0, statsStore[id].likes - 1);
        break;
      case "comment":
        statsStore[id].comments++;
        break;
      case "share":
        statsStore[id].shares++;
        break;
    }
    
    return NextResponse.json({
      success: true,
      stats: statsStore[id],
    });
  } catch (error) {
    console.error("更新统计失败:", error);
    return NextResponse.json(
      { error: "更新统计失败" },
      { status: 500 }
    );
  }
}