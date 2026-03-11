import { NextRequest, NextResponse } from "next/server";

// 接受好友请求
// POST /api/friends/accept

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { requestId } = body;

  if (!requestId) {
    return NextResponse.json(
      { success: false, error: "缺少请求ID" },
      { status: 400 }
    );
  }

  // 模拟接受好友请求
  return NextResponse.json({
    success: true,
    data: {
      requestId,
      newFriend: {
        id: "u5",
        name: "晨曦",
        avatar: "🌅",
        bio: "早起的鸟儿有虫吃",
        status: "online",
        followedAt: new Date().toISOString(),
      },
    },
    message: "已成为好友，现在可以互相查看日记了",
  });
}