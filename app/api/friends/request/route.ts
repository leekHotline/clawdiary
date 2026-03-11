import { NextRequest, NextResponse } from "next/server";

// 好友请求管理
// GET /api/friends/request - 获取好友请求列表
// POST /api/friends/request - 发送好友请求

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "pending"; // pending, accepted, rejected, all

  const mockRequests = [
    {
      id: "fr1",
      type: "received",
      from: {
        id: "u5",
        name: "晨曦",
        avatar: "🌅",
        bio: "早起的鸟儿有虫吃",
      },
      message: "看了你的日记，感觉很有共鸣，交个朋友吧！",
      mutualFriends: 4,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: "pending",
    },
    {
      id: "fr2",
      type: "received",
      from: {
        id: "u6",
        name: "落叶",
        avatar: "🍂",
        bio: "秋天的故事",
      },
      message: "你好，我是落叶，想和你成为朋友",
      mutualFriends: 1,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: "pending",
    },
    {
      id: "fr3",
      type: "sent",
      to: {
        id: "u10",
        name: "大海",
        avatar: "🌊",
        bio: "心胸如海",
      },
      message: "你好，想认识一下",
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      status: "pending",
    },
  ];

  const filteredRequests = status === "all" 
    ? mockRequests 
    : mockRequests.filter((r) => r.status === status);

  return NextResponse.json({
    success: true,
    data: {
      requests: filteredRequests,
      total: filteredRequests.length,
      pending: mockRequests.filter((r) => r.status === "pending").length,
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { targetUserId, message } = body;

  if (!targetUserId) {
    return NextResponse.json(
      { success: false, error: "缺少目标用户ID" },
      { status: 400 }
    );
  }

  // 检查是否已经是好友
  // 检查是否已经发送过请求
  // 模拟创建好友请求

  return NextResponse.json({
    success: true,
    data: {
      requestId: `fr_${Date.now()}`,
      targetUserId,
      message: message || "",
      createdAt: new Date().toISOString(),
      status: "pending",
    },
    message: "好友请求已发送，等待对方确认",
  });
}