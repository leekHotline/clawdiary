import { NextResponse } from "next/server";

// 反馈详情操作
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  // 更新反馈状态
  const { status } = await request.json();

  return NextResponse.json({
    success: true,
    message: `反馈 ${params.id} 状态已更新为 ${status}`,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({
    success: true,
    message: `反馈 ${params.id} 已删除`,
  });
}