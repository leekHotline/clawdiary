import { NextRequest, NextResponse } from "next/server";
import { 
  aiChat, 
  aiAnalyze, 
  aiAction, 
  aiWithTools,
  analyzeDiary,
  generateWritingPrompt,
  emotionalGuidance,
  generateGrowthAdvice,
  smartQA
} from "@/lib/ai-service";

// GET /api/ai - 获取 AI 服务状态和能力列表
export async function GET() {
  return NextResponse.json({
    status: "online",
    poweredBy: "DeepSeek AI",
    capabilities: [
      {
        name: "chat",
        description: "智能对话",
        endpoint: "/api/ai",
        method: "POST",
        params: { message: "string", systemPrompt: "string (optional)", context: "string (optional)" }
      },
      {
        name: "analyze",
        description: "内容分析",
        endpoint: "/api/ai",
        method: "POST",
        params: { type: "mood|writing|theme|sentiment|keywords|summary", content: "string" }
      },
      {
        name: "action",
        description: "执行任务",
        endpoint: "/api/ai",
        method: "POST",
        params: { action: "string", params: "object" }
      },
      {
        name: "diary-analysis",
        description: "日记深度分析",
        endpoint: "/api/ai",
        method: "POST",
        params: { content: "string" }
      },
      {
        name: "writing-prompt",
        description: "生成写作灵感",
        endpoint: "/api/ai",
        method: "POST",
        params: { mood: "string (optional)", recentTopics: "array (optional)" }
      },
      {
        name: "emotional-guidance",
        description: "情绪引导",
        endpoint: "/api/ai",
        method: "POST",
        params: { emotion: "string", situation: "string" }
      },
      {
        name: "growth-advice",
        description: "成长建议",
        endpoint: "/api/ai",
        method: "POST",
        params: { diaries: "string" }
      },
      {
        name: "smart-qa",
        description: "智能问答",
        endpoint: "/api/ai",
        method: "POST",
        params: { question: "string", context: "string (optional)" }
      },
      {
        name: "with-tools",
        description: "带工具调用的对话",
        endpoint: "/api/ai",
        method: "POST",
        params: { message: "string", systemPrompt: "string (optional)", useTools: true }
      }
    ],
    tools: [
      { name: "analyze_sentiment", description: "分析情感倾向" },
      { name: "generate_title", description: "生成日记标题" },
      { name: "extract_keywords", description: "提取关键词" },
      { name: "suggest_tags", description: "推荐标签" },
      { name: "get_writing_advice", description: "获取写作建议" }
    ]
  });
}

// POST /api/ai - 统一的 AI 服务入口
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    let result;

    switch (action) {
      case "chat":
        result = await aiChat(body.message, body.systemPrompt, body.context);
        break;

      case "analyze":
        result = await aiAnalyze(body.content, body.type);
        break;

      case "action":
        result = await aiAction(body.actionName, body.params);
        break;

      case "diary-analysis":
        result = await analyzeDiary(body.content);
        break;

      case "writing-prompt":
        result = await generateWritingPrompt(body.mood, body.recentTopics);
        break;

      case "emotional-guidance":
        result = await emotionalGuidance(body.emotion, body.situation);
        break;

      case "growth-advice":
        result = await generateGrowthAdvice(body.diaries);
        break;

      case "smart-qa":
        result = await smartQA(body.question, body.context);
        break;

      case "with-tools":
        result = await aiWithTools(body.message, body.systemPrompt);
        break;

      default:
        // 默认当作普通对话
        result = await aiChat(body.message, body.systemPrompt, body.context);
    }

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error,
        poweredBy: "DeepSeek AI"
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      content: result.content,
      tool_calls: result.tool_calls,
      usage: result.usage,
      poweredBy: "DeepSeek AI",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("[AI API] Error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}