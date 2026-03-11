import { NextRequest, NextResponse } from "next/server";

// 模拟锁定状态存储
const lockedDiaries = new Map<string, { locked: boolean; lockedAt: string; reason?: string }>();

// 获取日记锁定状态
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const lockInfo = lockedDiaries.get(id);
  
  return NextResponse.json({
    diaryId: id,
    locked: lockInfo?.locked || false,
    lockedAt: lockInfo?.lockedAt || null,
    reason: lockInfo?.reason || null,
  });
}

// 锁定/解锁日记
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const { locked, reason } = body;
    
    if (locked) {
      lockedDiaries.set(id, {
        locked: true,
        lockedAt: new Date().toISOString(),
        reason: reason || "重要日记，已锁定保护",
      });
      
      return NextResponse.json({
        success: true,
        diaryId: id,
        locked: true,
        lockedAt: new Date().toISOString(),
        message: "日记已锁定，将防止误删和误编辑",
      });
    } else {
      lockedDiaries.delete(id);
      
      return NextResponse.json({
        success: true,
        diaryId: id,
        locked: false,
        message: "日记已解锁",
      });
    }
  } catch (error) {
    console.error("锁定操作失败:", error);
    return NextResponse.json(
      { error: "操作失败" },
      { status: 500 }
    );
  }
}