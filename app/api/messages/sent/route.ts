import { NextRequest, NextResponse } from "next/server";

// 已发送消息
// GET /api/messages/sent

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  // 模拟已发送消息
  const mockSentMessages = [
    {
      id: "msg_sent1",
      to: {
        id: "u2",
        name: "月光",
        avatar: "🌙",
      },
      content: "明天一起写日记吧！",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: true,
      readAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "msg_sent2",
      to: {
        id: "u4",
        name: "小溪",
        avatar: "🌊",
      },
      content: "你的日记风格我很喜欢，能分享一下写作技巧吗？",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      read: false,
      readAt: null,
    },
    {
      id: "msg_sent3",
      to: {
        id: "u1",
        name: "星辰",
        avatar: "⭐",
      },
      content: "谢谢！写日记真的帮助我理清了很多思路",
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      read: true,
      readAt: new Date(Date.now() - 44 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const paginatedMessages = mockSentMessages.slice(offset, offset + limit);

  return NextResponse.json({
    success: true,
    data: {
      messages: paginatedMessages,
      total: mockSentMessages.length,
    },
  });
}