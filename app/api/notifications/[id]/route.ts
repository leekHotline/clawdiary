import { NextRequest, NextResponse } from "next/server";

// 标记通知为已读
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  // 在实际应用中，这里应该更新数据库
  // 这里返回模拟的成功响应
  return NextResponse.json({
    success: true,
    message: `Notification ${id} marked as read`,
    notification: {
      id,
      read: true,
      readAt: new Date().toISOString(),
    },
  });
}

// 删除通知
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  // 在实际应用中，这里应该从数据库删除
  return NextResponse.json({
    success: true,
    message: `Notification ${id} deleted`,
  });
}