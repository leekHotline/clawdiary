import { NextRequest, NextResponse } from "next/server";

// 收件箱详情 - 与某人的对话记录
// GET /api/messages/inbox

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId") || "u1";
  const limit = parseInt(searchParams.get("limit") || "50");
  const before = searchParams.get("before"); // 分页用

  // 模拟对话记录
  const mockMessages = [
    {
      id: "msg1",
      from: "u1",
      to: "current-user",
      content: "嗨，你好！",
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg2",
      from: "current-user",
      to: "u1",
      content: "你好呀！",
      createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg3",
      from: "u1",
      to: "current-user",
      content: "看了你的日记，感觉很有共鸣！特别是那篇关于成长的感悟",
      createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg4",
      from: "current-user",
      to: "u1",
      content: "谢谢！写日记真的帮助我理清了很多思路",
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      read: true,
    },
    {
      id: "msg5",
      from: "u1",
      to: "current-user",
      content: "你的日记写得太棒了，很有共鸣！",
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      read: false,
    },
  ];

  // 用户信息
  const userInfo = {
    id: "u1",
    name: "星辰",
    avatar: "⭐",
    status: "online",
    bio: "追逐星空的人",
  };

  return NextResponse.json({
    success: true,
    data: {
      user: userInfo,
      messages: mockMessages,
      hasMore: false,
      total: mockMessages.length,
      unreadCount: mockMessages.filter((m) => !m.read && m.from !== "current-user").length,
    },
  });
}