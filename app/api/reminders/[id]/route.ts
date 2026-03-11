import { NextRequest, NextResponse } from "next/server";

// 删除提醒
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  // 在实际应用中，这里应该从数据库删除
  return NextResponse.json({
    success: true,
    message: `Reminder ${id} deleted`,
  });
}

// 获取单个提醒详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  // 模拟返回提醒详情
  return NextResponse.json({
    reminder: {
      id,
      title: "每日写作提醒",
      message: "今天写日记了吗？",
      time: "21:00",
      frequency: "daily",
      active: true,
      icon: "📝",
    },
  });
}