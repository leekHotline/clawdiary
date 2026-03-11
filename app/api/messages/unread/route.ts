import { NextRequest, NextResponse } from "next/server";

// 未读消息统计
// GET /api/messages/unread

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const groupBy = searchParams.get("groupBy") || "total"; // total, conversation, sender

  // 模拟未读消息统计
  const unreadStats = {
    total: 5,
    conversations: 3,
    byType: {
      messages: 3,
      mentions: 1,
      replies: 1,
    },
    byConversation: [
      {
        conversationId: "conv1",
        with: {
          id: "u1",
          name: "星辰",
          avatar: "⭐",
        },
        count: 2,
        lastMessage: {
          content: "你的日记写得太棒了，很有共鸣！",
          createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        },
      },
      {
        conversationId: "conv3",
        with: {
          id: "u3",
          name: "彩虹",
          avatar: "🌈",
        },
        count: 1,
        lastMessage: {
          content: "好久不见，最近怎么样？",
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        },
      },
      {
        conversationId: "conv5",
        with: {
          id: "u7",
          name: "晨曦",
          avatar: "🌅",
        },
        count: 2,
        lastMessage: {
          content: "早安！今天的日记写了吗？",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
      },
    ],
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json({
    success: true,
    data: unreadStats,
  });
}