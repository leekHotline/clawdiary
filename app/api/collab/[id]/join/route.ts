import { NextRequest, NextResponse } from "next/server";

// POST - 加入协作
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { user } = body;
  
  // 模拟加入协作
  const contributor = {
    id: user?.id || `user-${Date.now()}`,
    name: user?.name || "新贡献者",
    avatar: user?.avatar || "👤",
    contributedAt: new Date().toISOString(),
    wordsCount: 0
  };
  
  return NextResponse.json({
    success: true,
    message: "成功加入协作！",
    data: contributor
  });
}