import { NextRequest, NextResponse } from "next/server";

// 获取公开分享的日记
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  
  // 模拟查找分享的日记
  // 实际应该从数据库中查找 shareToken === token 的日记
  
  if (!token || token.length < 10) {
    return NextResponse.json(
      { error: "分享链接无效" },
      { status: 404 }
    );
  }
  
  // 模拟日记数据
  const diaryData = {
    id: "shared-diary",
    title: "分享的日记",
    content: `这是一篇通过分享链接公开的日记内容。

分享链接允许其他人查看这篇日记，但不会暴露你的身份信息。

你可以在这里记录任何想分享的内容...`,
    mood: "peaceful",
    tags: ["分享", "日常"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    author: {
      name: "匿名用户",
      avatar: null,
    },
    allowComments: true,
    views: 42,
  };
  
  return NextResponse.json({
    success: true,
    diary: diaryData,
  });
}