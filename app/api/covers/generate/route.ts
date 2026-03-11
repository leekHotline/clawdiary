import { NextRequest, NextResponse } from "next/server";
import { generateCoverUrl, getCoverTemplate } from "@/lib/covers";

// POST /api/covers/generate - 生成封面图 URL
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, style, templateId, title, tags, width, height } = body;
    
    let finalPrompt = prompt;
    
    // 如果提供了模板 ID，使用模板
    if (templateId) {
      const template = getCoverTemplate(templateId);
      if (template) {
        finalPrompt = template.promptTemplate.replace("{topic}", prompt || title || "diary");
      }
    }
    
    // 如果没有 prompt，根据标题和标签生成
    if (!finalPrompt && (title || tags)) {
      const topic = [title, ...(tags || [])].filter(Boolean).join(", ");
      finalPrompt = `beautiful illustration for diary about ${topic}, artistic, warm colors, inspiring`;
    }
    
    if (!finalPrompt) {
      return NextResponse.json({ error: "Missing prompt or template" }, { status: 400 });
    }
    
    const imageUrl = generateCoverUrl(finalPrompt, style || "default", width || 1200, height || 630);
    
    return NextResponse.json({
      imageUrl,
      prompt: finalPrompt,
      style: style || "default",
      width: width || 1200,
      height: height || 630,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate cover" }, { status: 500 });
  }
}