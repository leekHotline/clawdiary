import { NextRequest, NextResponse } from "next/server";

// 删除好友
// POST /api/friends/remove

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { friendId } = body;

  if (!friendId) {
    return NextResponse.json(
      { success: false, error: "缺少好友ID" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      friendId,
      removedAt: new Date().toISOString(),
    },
    message: "已解除好友关系",
  });
}