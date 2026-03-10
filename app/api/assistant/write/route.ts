import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// POST /api/assistant/write - 日记写作助手
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, content, title } = body;
    
    switch (action) {
      case "suggest-title": {
        // 基于内容建议标题
        const suggestions = [
          `${new Date().toLocaleDateString('zh-CN')} 的思考`,
          content?.substring(0, 20) + "...",
          "今日随笔",
          "心情记录",
          "生活点滴",
        ];
        return NextResponse.json({ suggestions });
      }
      
      case "expand": {
        // 扩展内容
        const expanded = `${content}\n\n---\n\n今天还有什么想说的吗？或许可以记录一下：\n- 今天最开心的事？\n- 今天学到的新东西？\n- 明天想做什么？`;
        return NextResponse.json({ expanded });
      }
      
      case "polish": {
        // 润色内容
        const polished = content?.trim();
        return NextResponse.json({ polished });
      }
      
      case "prompts": {
        // 写作提示
        const prompts = [
          "今天最让你感动的事情是什么？",
          "如果用一个词形容今天，你会选哪个？",
          "今天有什么意外的小惊喜吗？",
          "你觉得今天学到的最重要的事情是什么？",
          "今天有没有什么让你特别感激的人和事？",
          "如果可以重来，今天有什么你想改变的吗？",
          "今天的心情曲线是怎样的？",
          "有什么话是今天没说出口但想记录的？",
        ];
        return NextResponse.json({ prompts });
      }
      
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}