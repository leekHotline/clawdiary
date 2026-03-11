import { NextRequest, NextResponse } from "next/server";

// POST - 添加贡献（新章节）
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { title, content, author } = body;
  
  // 计算字数
  const wordCount = content.length;
  
  const newSection = {
    id: `section-${Date.now()}`,
    title,
    content,
    author: author?.id || "anonymous",
    authorName: author?.name || "匿名",
    authorAvatar: author?.avatar || "👤",
    wordCount,
    createdAt: new Date().toISOString(),
    likes: 0
  };
  
  return NextResponse.json({
    success: true,
    message: "贡献已添加！",
    data: newSection
  });
}