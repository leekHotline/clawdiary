import { NextRequest, NextResponse } from "next/server";
import { getDiaryCovers, createDiaryCover, getCoverTemplates, generateCoverUrl } from "@/lib/covers";

// GET /api/covers - 获取所有封面或模板
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const templates = searchParams.get("templates");
    const diaryId = searchParams.get("diaryId");
    
    if (templates === "true") {
      return NextResponse.json(getCoverTemplates());
    }
    
    const covers = await getDiaryCovers();
    
    if (diaryId) {
      const cover = covers.find(c => c.diaryId === diaryId);
      return NextResponse.json(cover || null);
    }
    
    return NextResponse.json(covers);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch covers" }, { status: 500 });
  }
}

// POST /api/covers - 创建封面
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { diaryId, source, prompt, style, width, height, imageUrl } = body;
    
    if (!diaryId) {
      return NextResponse.json({ error: "Missing diaryId" }, { status: 400 });
    }
    
    let finalUrl = imageUrl;
    
    // 如果是 AI 生成，生成 URL
    if (source === "ai" && prompt) {
      finalUrl = generateCoverUrl(prompt, style || "default", width || 1200, height || 630);
    }
    
    const cover = await createDiaryCover({
      diaryId,
      imageUrl: finalUrl || "",
      source: source || "ai",
      prompt,
      style,
      width: width || 1200,
      height: height || 630,
    });
    
    return NextResponse.json(cover, { status: 201 });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to create cover" }, { status: 500 });
  }
}