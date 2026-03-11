import { NextRequest, NextResponse } from "next/server";

// 拒绝好友请求
// POST /api/friends/reject

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { requestId } = body;

  if (!requestId) {
    return NextResponse.json(
      { success: false, error: "缺少请求ID" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      requestId,
      status: "rejected",
    },
    message: "已拒绝好友请求",
  });
}