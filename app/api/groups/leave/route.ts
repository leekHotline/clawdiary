import { NextRequest, NextResponse } from "next/server";

// 退出群组
// POST /api/groups/leave

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { groupId } = body;

  if (!groupId) {
    return NextResponse.json(
      { success: false, error: "缺少群组ID" },
      { status: 400 }
    );
  }

  // 检查是否是群主（群主不能直接退出，需要先转让）
  // 模拟退出

  return NextResponse.json({
    success: true,
    data: {
      groupId,
      leftAt: new Date().toISOString(),
    },
    message: "已退出群组",
  });
}