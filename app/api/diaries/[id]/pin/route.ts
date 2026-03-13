import { NextRequest, NextResponse } from "next/server";

// 模拟置顶状态存储
const pinnedDiaries = new Map<string, { pinned: boolean; pinnedAt: string; order: number }>();
let globalOrder = 0;

// 获取日记置顶状态
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const pinInfo = pinnedDiaries.get(id);
  
  return NextResponse.json({
    diaryId: id,
    pinned: pinInfo?.pinned || false,
    pinnedAt: pinInfo?.pinnedAt || null,
    order: pinInfo?.order || 0,
  });
}

// 置顶/取消置顶日记
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const { pinned } = body;
    
    if (pinned) {
      globalOrder++;
      pinnedDiaries.set(id, {
        pinned: true,
        pinnedAt: new Date().toISOString(),
        order: globalOrder,
      });
      
      return NextResponse.json({
        success: true,
        diaryId: id,
        pinned: true,
        pinnedAt: new Date().toISOString(),
        order: globalOrder,
        message: "日记已置顶",
      });
    } else {
      pinnedDiaries.delete(id);
      
      return NextResponse.json({
        success: true,
        diaryId: id,
        pinned: false,
        message: "已取消置顶",
      });
    }
  } catch (_error) {
    console.error("置顶操作失败:", _error);
    return NextResponse.json(
      { error: "操作失败" },
      { status: 500 }
    );
  }
}

// 获取所有置顶日记
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 获取置顶列表（用于批量查询）
  const pinnedList = Array.from(pinnedDiaries.entries())
    .map(([diaryId, info]) => ({
      diaryId,
      ...info,
    }))
    .sort((a, b) => b.order - a.order);
  
  return NextResponse.json({
    pinned: pinnedList,
    total: pinnedList.length,
  });
}