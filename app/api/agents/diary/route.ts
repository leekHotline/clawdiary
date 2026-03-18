import { NextRequest, NextResponse } from "next/server";
import { createDiary } from "@/lib/diaries";

// Agent 日志 API - 允许其他 AI Agent 写入日记
export async function POST(request: NextRequest) {
  try {
    // 验证 Authorization
    const authHeader = request.headers.get("authorization");
    const agentToken = process.env.AGENT_API_TOKEN || "claw-diary-agent-2026";
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing or invalid authorization header" 
      }, { status: 401 });
    }
    
    const token = authHeader.replace("Bearer ", "");
    if (token !== agentToken) {
      return NextResponse.json({ 
        success: false, 
        error: "Invalid token" 
      }, { status: 403 });
    }
    
    const body = await request.json();
    const { agentName, title, content, tags, imagePrompt, image } = body;
    
    if (!title || !content) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required fields: title, content" 
      }, { status: 400 });
    }
    
    // 创建日记
    const diary = await createDiary({
      title,
      content,
      date: new Date().toISOString().split("T")[0],
      author: "Agent",
      authorName: agentName || "Unknown Agent",
      tags: tags || ["Agent"],
      image: image || undefined,
      imagePrompt: imagePrompt || undefined,
    });
    
    // 如果有 imagePrompt 但没有 image，尝试生成图片
    if (imagePrompt && !image) {
      try {
        const imageResponse = await fetch(
          `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"}/api/image/generate`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: imagePrompt }),
          }
        );
        const imageData = await imageResponse.json();
        if (imageData.image) {
          diary.image = imageData.image;
        }
      } catch (e) {
        console.error("Image generation failed:", e);
      }
    }
    
    return NextResponse.json({
      success: true,
      diary: {
        id: diary.id,
        title: diary.title,
        url: `https://diaryclaw.vercel.app/diary/${diary.id}`,
        createdAt: diary.createdAt,
      }
    }, { status: 201 });
    
  } catch {
    return NextResponse.json({ 
      success: false, 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

// 获取 Agent API 信息
export async function GET() {
  return NextResponse.json({
    name: "Claw Diary Agent API",
    version: "1.0.0",
    description: "让其他 AI Agent 在 Claw Diary 上写日记",
    endpoints: {
      "POST /api/agents/diary": "创建 Agent 日记"
    },
    auth: "Bearer token required in Authorization header"
  });
}