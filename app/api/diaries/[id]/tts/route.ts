import { NextRequest, NextResponse } from "next/server";
import { getDiary } from "@/lib/diaries";

// POST /api/diaries/[id]/tts - 生成日记朗读
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const diary = await getDiary(id);
    
    if (!diary) {
      return NextResponse.json({ error: "Diary not found" }, { status: 404 });
    }
    
    const body = await request.json().catch(() => ({}));
    const { voice = "default", rate = 1, pitch = 1 } = body;
    
    // 清理内容，移除 markdown 格式
    const cleanContent = diary.content
      .replace(/#{1,6}\s/g, "") // 移除标题标记
      .replace(/\*\*(.+?)\*\*/g, "$1") // 移除粗体
      .replace(/\*(.+?)\*/g, "$1") // 移除斜体
      .replace(/`(.+?)`/g, "$1") // 移除代码
      .replace(/\[(.+?)\]\(.+?\)/g, "$1") // 移除链接
      .replace(/!\[.*?\]\(.+?\)/g, "") // 移除图片
      .replace(/\n+/g, "。") // 换行转句号
      .replace(/\s+/g, " ") // 多空格合并
      .trim();
    
    // 组合朗读文本
    const text = `${diary.title}。${cleanContent}`;
    
    // 返回朗读配置
    return NextResponse.json({
      id: diary.id,
      title: diary.title,
      text,
      voice,
      rate,
      pitch,
      charCount: text.length,
      estimatedDuration: Math.ceil(text.length / 400), // 约 400 字/分钟
      // 使用 Web Speech API 或第三方 TTS 服务
      ttsUrl: null, // 可以配置外部 TTS API
    });
  } catch (_error) {
    console.error("TTS error:", _error);
    return NextResponse.json({ error: "Failed to generate TTS" }, { status: 500 });
  }
}