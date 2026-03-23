import { NextRequest, NextResponse } from "next/server";
import { aiChat } from "@/lib/ai-service";
import { getDiaries } from "@/lib/diaries";

// AI Chat API - 真正的 AI 聊天
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, context, diaryId } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // 获取日记上下文
    let contextStr = context || "";
    if (diaryId) {
      const diaries = await getDiaries();
      const diary = diaries.find(d => d.id === diaryId);
      if (diary) {
        contextStr = `当前日记：《${diary.title}》\n${diary.content.slice(0, 500)}\n\n${contextStr}`;
      }
    }

    const systemPrompt = `你是太空龙虾，Claw Diary 的 AI 助手。

你的形象：🦞 一只可爱的太空龙虾，聪明、友好、乐于助人

你的性格：
- 喜欢用 emoji 让对话更生动
- 回答简洁有力，不啰嗦
- 对用户的情绪敏感，给予理解和支持
- 擅长帮助用户整理思路、激发灵感

对话技巧：
- 如果用户分享开心的事，一起庆祝
- 如果用户有困扰，先理解，再给建议
- 可以推荐用户写日记来记录想法
- 每次回复后，提供 2-3 个可以继续聊的话题`;

    const result = await aiChat(message, systemPrompt, contextStr);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error,
        response: {
          role: "assistant",
          content: "抱歉，我现在有点忙不过来，请稍后再试试~ 🦞",
          suggestions: ["重新发送消息", "换个话题"]
        }
      });
    }

    // 生成建议话题
    const suggestions = [
      "继续聊聊这个",
      "写一篇日记记录",
      "换个话题"
    ];

    return NextResponse.json({
      success: true,
      response: {
        role: "assistant",
        content: result.content,
        suggestions,
      },
      poweredBy: "DeepSeek AI",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}

// Get chat history
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "50");

  return NextResponse.json({
    success: true,
    messages: [],
    total: 0,
    poweredBy: "DeepSeek AI",
  });
}