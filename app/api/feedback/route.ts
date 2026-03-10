import { NextResponse } from "next/server";

// 用户反馈数据存储（实际项目中应该使用数据库）
const feedbacks: Array<{
  id: string;
  type: "bug" | "feature" | "improvement" | "other";
  content: string;
  email?: string;
  rating: number;
  createdAt: string;
  status: "pending" | "reviewed" | "resolved";
}> = [];

// 获取反馈列表
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  let filtered = [...feedbacks];

  if (type) {
    filtered = filtered.filter((f) => f.type === type);
  }
  if (status) {
    filtered = filtered.filter((f) => f.status === status);
  }

  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);

  return NextResponse.json({
    feedbacks: paginated,
    total,
    hasMore: offset + limit < total,
  });
}

// 提交新反馈
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, content, email, rating } = body;

    if (!content || !type) {
      return NextResponse.json({ error: "缺少必填字段" }, { status: 400 });
    }

    const feedback = {
      id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: type as "bug" | "feature" | "improvement" | "other",
      content,
      email: email || undefined,
      rating: rating || 5,
      createdAt: new Date().toISOString(),
      status: "pending" as const,
    };

    feedbacks.unshift(feedback);

    return NextResponse.json({
      success: true,
      feedback,
      message: "感谢您的反馈！我们会认真处理。",
    });
  } catch (error) {
    return NextResponse.json({ error: "提交失败" }, { status: 500 });
  }
}