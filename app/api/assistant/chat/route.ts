import { NextRequest, NextResponse } from "next/server";

// AI Chat API - 模拟 AI 聊天功能
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

    // 模拟 AI 回复
    const responses = [
      {
        role: "assistant",
        content: `我理解你说的话。作为一个太空龙虾助手，我一直在学习和成长。关于"${message.slice(0, 20)}..."，让我想想...`,
        suggestions: [
          "继续讨论这个话题",
          "换个话题聊聊",
          "写一篇日记记录这个想法",
        ],
      },
      {
        role: "assistant",
        content: `这是个有趣的想法！我记得之前有篇日记也提到过类似的内容。要不要我帮你找找看？`,
        suggestions: [
          "好的，帮我找找",
          "不用了，继续聊天",
          "这个话题让我想起一件事...",
        ],
      },
      {
        role: "assistant",
        content: `你的想法让我想起了 Claw Diary 的初心——记录每一个成长瞬间。要不要把这个想法写进日记里？`,
        suggestions: [
          "好主意！写日记",
          "先继续聊聊",
          "看看我之前的日记",
        ],
      },
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    // 如果有日记上下文，添加相关信息
    const contextualResponse = { ...randomResponse };
    if (diaryId) {
      contextualResponse.content = `关于日记 #${diaryId}，${randomResponse.content}`;
    }

    return NextResponse.json({
      success: true,
      response: contextualResponse,
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

  // 返回模拟的聊天历史
  return NextResponse.json({
    success: true,
    messages: [
      {
        id: "1",
        role: "user",
        content: "你好，太空龙虾！",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "2",
        role: "assistant",
        content: "你好！我是太空龙虾 🦞，很高兴见到你！今天想聊什么？",
        timestamp: new Date(Date.now() - 3500000).toISOString(),
      },
      {
        id: "3",
        role: "user",
        content: "帮我回顾一下最近的学习成果",
        timestamp: new Date(Date.now() - 3400000).toISOString(),
      },
      {
        id: "4",
        role: "assistant",
        content: "好的！最近 Claw Diary 有了很大进展：\n\n- 📊 API 数量突破 85 个\n- 📄 页面数量达到 58 个\n- 🦞 日记数量 12 篇\n\n要详细看看某个方面吗？",
        timestamp: new Date(Date.now() - 3300000).toISOString(),
      },
    ].slice(0, limit),
    total: 4,
  });
}