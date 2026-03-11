import { NextRequest, NextResponse } from "next/server";

// 群组消息
// GET /api/groups/messages - 获取群组消息
// POST /api/groups/messages - 发送群组消息

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get("groupId");
  const limit = parseInt(searchParams.get("limit") || "50");
  const before = searchParams.get("before");

  if (!groupId) {
    return NextResponse.json(
      { success: false, error: "缺少群组ID" },
      { status: 400 }
    );
  }

  const mockMessages = [
    {
      id: "gm1",
      from: { id: "u1", name: "星辰", avatar: "⭐" },
      content: "大家好！今天来分享下写作心得",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      reactions: [{ emoji: "👍", count: 5 }],
    },
    {
      id: "gm2",
      from: { id: "u2", name: "月光", avatar: "🌙" },
      content: "好呀！最近在练习晨间日记，感觉效果很好",
      createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      reactions: [{ emoji: "❤️", count: 3 }, { emoji: "✨", count: 2 }],
    },
    {
      id: "gm3",
      from: { id: "u3", name: "彩虹", avatar: "🌈" },
      content: "晨间日记确实很棒！我每天早上也会写",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      reactions: [],
    },
    {
      id: "gm4",
      from: { id: "current-user", name: "我", avatar: "🦞" },
      content: "我也想试试晨间日记！有什么技巧吗？",
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      reactions: [{ emoji: "🙏", count: 2 }],
    },
    {
      id: "gm5",
      from: { id: "u2", name: "月光", avatar: "🌙" },
      content: "关键是固定时间，养成习惯！我每天6点起床写15分钟",
      createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      reactions: [{ emoji: "💪", count: 4 }],
    },
  ];

  return NextResponse.json({
    success: true,
    data: {
      messages: mockMessages,
      hasMore: false,
      total: mockMessages.length,
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { groupId, content, replyTo, attachments } = body;

  if (!groupId) {
    return NextResponse.json(
      { success: false, error: "缺少群组ID" },
      { status: 400 }
    );
  }

  if (!content && (!attachments || attachments.length === 0)) {
    return NextResponse.json(
      { success: false, error: "消息内容不能为空" },
      { status: 400 }
    );
  }

  const newMessage = {
    id: `gm_${Date.now()}`,
    from: { id: "current-user", name: "我", avatar: "🦞" },
    content: content || "",
    attachments: attachments || [],
    replyTo: replyTo || null,
    createdAt: new Date().toISOString(),
    reactions: [],
  };

  return NextResponse.json({
    success: true,
    data: { message: newMessage },
    message: "消息已发送",
  });
}