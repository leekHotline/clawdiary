import { NextRequest, NextResponse } from "next/server";

// 获取所有置顶日记列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    
    // 模拟置顶日记数据
    const pinnedDiaries = [
      {
        id: "pin-1",
        title: "2024年度总结",
        content: "这一年发生了太多事情...",
        mood: "grateful",
        pinnedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        order: 100,
      },
      {
        id: "pin-2",
        title: "重要决定记录",
        content: "今天做了一个重要的决定...",
        mood: "peaceful",
        pinnedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        order: 99,
      },
      {
        id: "pin-3",
        title: "旅行计划",
        content: "计划中的旅行路线...",
        mood: "excited",
        pinnedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        order: 98,
      },
    ];
    
    return NextResponse.json({
      pinned: pinnedDiaries.slice(0, limit),
      total: pinnedDiaries.length,
    });
  } catch {
    return NextResponse.json(
      { error: "获取置顶列表失败" },
      { status: 500 }
    );
  }
}

// 批量更新置顶顺序
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orders } = body; // [{ diaryId: string, order: number }, ...]
    
    return NextResponse.json({
      success: true,
      message: "置顶顺序已更新",
      updated: orders.length,
    });
  } catch {
    return NextResponse.json(
      { error: "更新失败" },
      { status: 500 }
    );
  }
}