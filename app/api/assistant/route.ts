import { NextRequest, NextResponse } from "next/server";

// GET /api/assistant - 获取助手状态和功能列表
export async function GET() {
  try {
    return NextResponse.json({
      name: "太空龙虾 AI 助手",
      version: "1.0.0",
      capabilities: [
        {
          id: "write",
          name: "日记写作助手",
          description: "帮助你写日记，提供写作建议和灵感",
          endpoint: "/api/assistant/write",
        },
        {
          id: "mood",
          name: "心情分析",
          description: "分析你的日记内容，识别情绪变化",
          endpoint: "/api/assistant/mood",
        },
        {
          id: "summary",
          name: "日记总结",
          description: "总结一段时间内的日记内容",
          endpoint: "/api/assistant/summary",
        },
        {
          id: "recommend",
          name: "智能推荐",
          description: "根据历史日记推荐写作主题",
          endpoint: "/api/assistant/recommend",
        },
      ],
      status: "online",
    });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to get assistant status" }, { status: 500 });
  }
}