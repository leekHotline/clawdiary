import { NextRequest, NextResponse } from "next/server";
import { createDiary, getDiaries } from "@/lib/diaries";

// POST /api/diaries/ai - AI 自动生成日记
export async function POST(request: NextRequest) {
  try {
    // 验证 API Key（从环境变量获取）
    const authHeader = request.headers.get("authorization");
    const apiKey = process.env.AI_DIARY_API_KEY || "openclaw-diary-secret";
    
    if (authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, content, tags } = body;
    
    if (!title || !content) {
      return NextResponse.json({ error: "Missing title or content" }, { status: 400 });
    }
    
    const diary = await createDiary({
      title,
      content,
      date: new Date().toISOString().split("T")[0],
      author: "AI",
      tags: tags || ["AI", "日记"],
    });
    
    return NextResponse.json(diary, { status: 201 });
  } catch (_error) {
    console.error("Error creating AI diary:", _error);
    return NextResponse.json({ error: "Failed to create AI diary" }, { status: 500 });
  }
}