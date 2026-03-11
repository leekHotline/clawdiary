import { NextRequest, NextResponse } from "next/server";

// 私信系统 API
// GET /api/messages - 获取消息列表（对话列表）
// POST /api/messages - 发送私信

interface Message {
  id: string;
  from: string;
  to: string;
  content: string;
  createdAt: string;
  read: boolean;
}

interface Conversation {
  id: string;
  with: {
    id: string;
    name: string;
    avatar: string;
    status: "online" | "offline" | "away";
  };
  lastMessage: {
    content: string;
    createdAt: string;
    fromMe: boolean;
  };
  unreadCount: number;
  updatedAt: string;
}

// 模拟对话数据
const mockConversations: Conversation[] = [
  {
    id: "conv1",
    with: {
      id: "u1",
      name: "星辰",
      avatar: "⭐",
      status: "online",
    },
    lastMessage: {
      content: "你的日记写得太棒了，很有共鸣！",
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      fromMe: false,
    },
    unreadCount: 2,
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: "conv2",
    with: {
      id: "u2",
      name: "月光",
      avatar: "🌙",
      status: "away",
    },
    lastMessage: {
      content: "明天一起写日记吧！",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      fromMe: true,
    },
    unreadCount: 0,
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "conv3",
    with: {
      id: "u3",
      name: "彩虹",
      avatar: "🌈",
      status: "offline",
    },
    lastMessage: {
      content: "好久不见，最近怎么样？",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      fromMe: false,
    },
    unreadCount: 1,
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "current-user";
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  const paginatedConversations = mockConversations.slice(offset, offset + limit);
  const totalUnread = mockConversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return NextResponse.json({
    success: true,
    data: {
      conversations: paginatedConversations,
      total: mockConversations.length,
      totalUnread,
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { toUserId, content, replyTo } = body;

  if (!toUserId || !content) {
    return NextResponse.json(
      { success: false, error: "缺少收件人或消息内容" },
      { status: 400 }
    );
  }

  if (content.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: "消息内容不能为空" },
      { status: 400 }
    );
  }

  if (content.length > 2000) {
    return NextResponse.json(
      { success: false, error: "消息内容不能超过2000字" },
      { status: 400 }
    );
  }

  // 模拟发送消息
  const newMessage = {
    id: `msg_${Date.now()}`,
    from: "current-user",
    to: toUserId,
    content,
    createdAt: new Date().toISOString(),
    read: false,
    replyTo: replyTo || null,
  };

  return NextResponse.json({
    success: true,
    data: {
      message: newMessage,
      conversation: {
        id: `conv_${toUserId}`,
        lastMessage: {
          content,
          createdAt: new Date().toISOString(),
          fromMe: true,
        },
        updatedAt: new Date().toISOString(),
      },
    },
    message: "消息已发送",
  });
}