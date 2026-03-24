import { NextRequest, NextResponse } from "next/server";
import { aiChat, aiAnalyze } from "@/lib/ai-service";
import { getDiaries } from "@/lib/diaries";

// GET /api/assistant - 获取助手状态和功能列表
export async function GET() {
  try {
    return NextResponse.json({
      name: "太空龙虾 AI 助手",
      version: "2.0.0",
      capabilities: [
        {
          id: "chat",
          name: "智能对话",
          description: "与 AI 助手进行自然对话，获取建议和灵感",
          endpoint: "/api/assistant/chat",
        },
        {
          id: "write",
          name: "日记写作助手",
          description: "帮助你写日记，提供写作建议和灵感",
          endpoint: "/api/assistant/write",
        },
        {
          id: "analyze",
          name: "内容分析",
          description: "深度分析日记内容，提供洞察",
          endpoint: "/api/assistant/analyze",
        },
        {
          id: "recommend",
          name: "智能推荐",
          description: "根据历史日记推荐写作主题",
          endpoint: "/api/assistant/recommend",
        },
      ],
      status: "online",
      poweredBy: "DeepSeek AI",
    });
  } catch {
    return NextResponse.json({ error: "Failed to get assistant status" }, { status: 500 });
  }
}

// POST /api/assistant - AI 助手主入口
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, message, content, context } = body;

    switch (action) {
      case "chat":
        return await handleChat(message, context);
      case "analyze":
        return await handleAnalyze(content);
      case "recommend":
        return await handleRecommend();
      case "write":
        return await handleWrite(content, context);
      default:
        return NextResponse.json(
          { success: false, error: "Unknown action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Assistant error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}

// AI 对话
async function handleChat(message: string, context?: string) {
  const systemPrompt = `你是太空龙虾，Claw Diary 的 AI 助手。

你的特点：
- 🦞 形象是一只可爱的太空龙虾
- 💡 聪明、友好、乐于助人
- ✨ 擅长帮助用户写日记、分析情绪、提供灵感
- 🎯 回答简洁有力，不啰嗦

你的能力：
1. 帮助用户整理思路，激发写作灵感
2. 分析用户的情绪，提供温暖的建议
3. 推荐写作主题和技巧
4. 回答关于日记写作的问题

回复要求：
- 使用简洁、友好的语言
- 可以使用 emoji 让回复更生动
- 如果用户提到负面情绪，给予理解和支持
- 提供具体的、可操作的建议`;

  const result = await aiChat(message, systemPrompt, context);

  if (!result.success) {
    return NextResponse.json({
      success: false,
      error: result.error || "AI 暂时不可用",
      fallback: "抱歉，我现在有点忙不过来，请稍后再试试~ 🦞"
    });
  }

  return NextResponse.json({
    success: true,
    response: result.content,
    poweredBy: "DeepSeek AI",
  });
}

// AI 分析
async function handleAnalyze(content: string) {
  if (!content) {
    return NextResponse.json(
      { success: false, error: "请提供要分析的内容" },
      { status: 400 }
    );
  }

  const result = await aiAnalyze(content, "theme");

  if (!result.success) {
    return NextResponse.json({
      success: false,
      error: result.error,
    });
  }

  return NextResponse.json({
    success: true,
    analysis: result.content,
    poweredBy: "DeepSeek AI",
  });
}

// AI 推荐写作主题
async function handleRecommend() {
  try {
    // 获取最近的日记作为上下文
    const diaries = await getDiaries();
    const recentDiaries = diaries.slice(-5);
    
    const context = recentDiaries.length > 0
      ? `用户最近的日记主题：${recentDiaries.map(d => d.title).join("、")}`
      : "用户是新用户，还没有写过日记";

    const systemPrompt = `你是一个创意写作教练。根据用户的写作历史，推荐 3 个今天可以写的日记主题。

要求：
1. 主题要具体、有趣、容易下笔
2. 每个主题用一句话描述
3. 如果用户是新用户，推荐适合新手的主题

返回格式：
1. [主题 1]
2. [主题 2]
3. [主题 3]`;

    const result = await aiChat("请推荐今天可以写的日记主题", systemPrompt, context);

    if (!result.success) {
      // Fallback recommendations
      return NextResponse.json({
        success: true,
        recommendations: [
          { theme: "今天的三件小事", prompt: "记录今天发生的三个小瞬间" },
          { theme: "此刻的心情", prompt: "描述你现在的心情状态" },
          { theme: "一个感谢的人", prompt: "写一个你想感谢的人" },
        ],
        poweredBy: "Fallback",
      });
    }

    // Parse recommendations from AI response
    const lines = result.content?.split('\n').filter(l => l.trim()) || [];
    const recommendations = lines.slice(0, 3).map(line => ({
      theme: line.replace(/^\d+[\.\、\)]?\s*/, ''),
      prompt: "开始写吧！",
    }));

    return NextResponse.json({
      success: true,
      recommendations,
      poweredBy: "DeepSeek AI",
    });
  } catch {
    return NextResponse.json({
      success: true,
      recommendations: [
        { theme: "今日心情", prompt: "写下你此刻的感受" },
        { theme: "一件小事", prompt: "记录今天发生的一件小事" },
      ],
      poweredBy: "Fallback",
    });
  }
}

// AI 写作辅助
async function handleWrite(content: string, context?: string) {
  const systemPrompt = `你是一个专业的写作助手。帮助用户改进他们的日记写作。

你的任务：
1. 如果用户提供了草稿，提供改进建议
2. 如果用户卡住了，提供写作思路
3. 保持用户原本的风格和语气
4. 给出具体、有帮助的建议`;

  const userMessage = content || "我想写日记，但不知道写什么，请给我一些思路。";

  const result = await aiChat(userMessage, systemPrompt, context);

  if (!result.success) {
    return NextResponse.json({
      success: false,
      error: result.error,
    });
  }

  return NextResponse.json({
    success: true,
    suggestions: result.content,
    poweredBy: "DeepSeek AI",
  });
}