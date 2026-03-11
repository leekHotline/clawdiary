import { NextRequest, NextResponse } from "next/server";

// 发送私信
// POST /api/messages/send

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { toUserId, content, replyTo, attachments } = body;

  if (!toUserId) {
    return NextResponse.json(
      { success: false, error: "请选择收件人" },
      { status: 400 }
    );
  }

  if (!content && (!attachments || attachments.length === 0)) {
    return NextResponse.json(
      { success: false, error: "消息内容不能为空" },
      { status: 400 }
    );
  }

  // 验证收件人是否是好友
  // 检查是否被拉黑
  // 模拟发送

  const newMessage = {
    id: `msg_${Date.now()}`,
    from: "current-user",
    to: toUserId,
    content: content || "",
    attachments: attachments || [],
    replyTo: replyTo || null,
    createdAt: new Date().toISOString(),
    read: false,
    status: "sent", // sent, delivered, read
  };

  return NextResponse.json({
    success: true,
    data: {
      message: newMessage,
      estimatedDelivery: "instant",
    },
    message: "消息已发送",
  });
}