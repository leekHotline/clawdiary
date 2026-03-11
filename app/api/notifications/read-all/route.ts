import { NextResponse } from "next/server";

// 标记所有通知为已读
export async function POST() {
  // 在实际应用中，这里应该更新数据库中所有未读通知
  return NextResponse.json({
    success: true,
    message: "All notifications marked as read",
    updatedAt: new Date().toISOString(),
  });
}

export async function PUT() {
  // 同上
  return NextResponse.json({
    success: true,
    message: "All notifications marked as read",
    updatedAt: new Date().toISOString(),
  });
}