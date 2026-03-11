import { NextRequest, NextResponse } from "next/server";

// 日记订阅系统 API
// GET /api/subscriptions/diaries - 获取订阅的日记更新
// POST /api/subscriptions/diaries - 订阅日记

interface Subscription {
  id: string;
  type: "diary" | "author" | "tag";
  targetId: string;
  targetName: string;
  subscribedAt: string;
  lastUpdate: string;
  unreadCount: number;
}

// 模拟订阅数据
const mockSubscriptions: Subscription[] = [
  {
    id: "sub1",
    type: "diary",
    targetId: "diary_10",
    targetName: "成长的思考",
    subscribedAt: "2026-02-15",
    lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unreadCount: 3,
  },
  {
    id: "sub2",
    type: "author",
    targetId: "u1",
    targetName: "星辰",
    subscribedAt: "2026-01-20",
    lastUpdate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    unreadCount: 1,
  },
  {
    id: "sub3",
    type: "tag",
    targetId: "成长",
    targetName: "#成长",
    subscribedAt: "2026-03-01",
    lastUpdate: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    unreadCount: 12,
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "all"; // all, diary, author, tag
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  const filteredSubs = type === "all" 
    ? mockSubscriptions 
    : mockSubscriptions.filter((s) => s.type === type);

  const paginatedSubs = filteredSubs.slice(offset, offset + limit);
  const totalUnread = mockSubscriptions.reduce((sum, s) => sum + s.unreadCount, 0);

  return NextResponse.json({
    success: true,
    data: {
      subscriptions: paginatedSubs,
      total: filteredSubs.length,
      totalUnread,
      byType: {
        diary: mockSubscriptions.filter((s) => s.type === "diary").length,
        author: mockSubscriptions.filter((s) => s.type === "author").length,
        tag: mockSubscriptions.filter((s) => s.type === "tag").length,
      },
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type, targetId, notifySettings } = body;

  if (!type || !targetId) {
    return NextResponse.json(
      { success: false, error: "缺少订阅类型或目标ID" },
      { status: 400 }
    );
  }

  // 模拟创建订阅
  const newSubscription = {
    id: `sub_${Date.now()}`,
    type,
    targetId,
    targetName: type === "tag" ? `#${targetId}` : targetId,
    subscribedAt: new Date().toISOString(),
    lastUpdate: new Date().toISOString(),
    unreadCount: 0,
    notifySettings: notifySettings || {
      newPost: true,
      comments: false,
      likes: false,
    },
  };

  return NextResponse.json({
    success: true,
    data: {
      subscription: newSubscription,
    },
    message: "订阅成功",
  });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subscriptionId = searchParams.get("id");

  if (!subscriptionId) {
    return NextResponse.json(
      { success: false, error: "缺少订阅ID" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      subscriptionId,
      cancelledAt: new Date().toISOString(),
    },
    message: "已取消订阅",
  });
}