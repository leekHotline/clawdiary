import { NextRequest, NextResponse } from "next/server";

// 作者订阅 API
// GET /api/subscriptions/authors - 获取关注的作者
// POST /api/subscriptions/authors - 关注作者

interface AuthorSubscription {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorBio: string;
  diariesCount: number;
  subscribersCount: number;
  subscribedAt: string;
  lastPublishAt: string;
  unreadDiaries: number;
}

// 模拟关注的作者
const mockAuthorSubs: AuthorSubscription[] = [
  {
    id: "as1",
    authorId: "u1",
    authorName: "星辰",
    authorAvatar: "⭐",
    authorBio: "追逐星空的人",
    diariesCount: 128,
    subscribersCount: 1256,
    subscribedAt: "2026-01-20",
    lastPublishAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    unreadDiaries: 2,
  },
  {
    id: "as2",
    authorId: "u2",
    authorName: "月光",
    authorAvatar: "🌙",
    authorBio: "夜猫子日记",
    diariesCount: 89,
    subscribersCount: 856,
    subscribedAt: "2026-02-01",
    lastPublishAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    unreadDiaries: 1,
  },
  {
    id: "as3",
    authorId: "u3",
    authorName: "彩虹",
    authorAvatar: "🌈",
    authorBio: "生活多彩多姿",
    diariesCount: 256,
    subscribersCount: 2345,
    subscribedAt: "2025-12-20",
    lastPublishAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
    unreadDiaries: 0,
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort") || "recent"; // recent, active, unread
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  const sorted = [...mockAuthorSubs];
  switch (sort) {
    case "active":
      sorted.sort((a, b) => 
        new Date(b.lastPublishAt).getTime() - new Date(a.lastPublishAt).getTime()
      );
      break;
    case "unread":
      sorted.sort((a, b) => b.unreadDiaries - a.unreadDiaries);
      break;
    default:
      sorted.sort((a, b) => 
        new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime()
      );
  }

  const paginated = sorted.slice(offset, offset + limit);
  const totalUnread = mockAuthorSubs.reduce((sum, a) => sum + a.unreadDiaries, 0);

  return NextResponse.json({
    success: true,
    data: {
      authors: paginated,
      total: mockAuthorSubs.length,
      totalUnread,
      newUpdates: totalUnread > 0,
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { authorId, notifyOnNew } = body;

  if (!authorId) {
    return NextResponse.json(
      { success: false, error: "缺少作者ID" },
      { status: 400 }
    );
  }

  // 模拟关注作者
  const newSubscription = {
    id: `as_${Date.now()}`,
    authorId,
    authorName: "新作者",
    authorAvatar: "✨",
    subscribedAt: new Date().toISOString(),
    lastPublishAt: null,
    unreadDiaries: 0,
    notifyOnNew: notifyOnNew !== false,
  };

  return NextResponse.json({
    success: true,
    data: {
      subscription: newSubscription,
    },
    message: "已关注该作者",
  });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const authorId = searchParams.get("authorId");

  if (!authorId) {
    return NextResponse.json(
      { success: false, error: "缺少作者ID" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      authorId,
      unfollowedAt: new Date().toISOString(),
    },
    message: "已取消关注",
  });
}