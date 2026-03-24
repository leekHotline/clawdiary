import { NextResponse } from "next/server";

// 模拟回复库 - 按话题分类
const responses: Record<string, string[]> = {
  mood: [
    "从你的文字里，我能感受到你今天的心情～无论是开心还是有些低落，都值得被记录下来。",
    "心情是流动的，像天气一样变化。你愿意和我多聊聊吗？",
    "每一种心情都是真实的，都值得被看见。我在这里听着呢～",
  ],
  memory: [
    "我记得你在日记里写过很多有意思的故事呢！每一篇都是独一无二的记忆。",
    "翻开你的日记，就像打开了一个时光胶囊。想回忆哪一段？",
    "你的故事都在这里，我可以帮你找回那些珍贵的瞬间～",
  ],
  growth: [
    "回顾你的日记，我看到了你的成长轨迹。每一天的努力都在积累呢！",
    "成长不是一条直线，而是一条蜿蜒向上的路。你已经在路上了！",
    "你的日记见证了你的变化，每一次记录都是成长的印记。",
  ],
  encourage: [
    "嘿，你比想象中更棒！每一天你都在用自己的方式发光 ✨",
    "别忘了，你能坚持写日记本身就是一件很了不起的事！",
    "你走过的每一步都有意义，继续相信自己！",
  ],
  default: [
    "嗯，我在听呢～继续说吧，你的故事我都记着呢！",
    "这个话题很有意思，让我想想你的日记里有没有相关的内容...",
    "你的经历很珍贵，谢谢你愿意和我分享！",
    "我在想，这个故事如果写进日记会是什么样子呢～",
    "有时候，对话本身就是一种疗愈。你今天想聊什么？",
  ],
};

// 分析用户消息意图
function analyzeIntent(message: string): string {
  const lower = message.toLowerCase();
  
  if (lower.includes("心情") || lower.includes("感觉") || lower.includes("开心") || lower.includes("难过") || lower.includes("焦虑")) {
    return "mood";
  }
  if (lower.includes("记忆") || lower.includes("难忘") || lower.includes("日记") || lower.includes("过去") || lower.includes("回忆")) {
    return "memory";
  }
  if (lower.includes("成长") || lower.includes("进步") || lower.includes("变化") || lower.includes("轨迹")) {
    return "growth";
  }
  if (lower.includes("鼓励") || lower.includes("加油") || lower.includes("打气") || lower.includes("能量")) {
    return "encourage";
  }
  return "default";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message, persona } = body;
    
    if (!message) {
      return NextResponse.json(
        { success: false, error: "消息不能为空" },
        { status: 400 }
      );
    }

    // 分析意图
    const intent = analyzeIntent(message);
    
    // 获取对应类别的回复
    const possibleResponses = responses[intent] || responses.default;
    const baseResponse = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
    
    // 根据人格调整回复
    const emoji = persona?.emoji || "🧚";
    const name = persona?.name || "日记小精灵";
    
    // 有时候加入人格特色
    const personalityAdditions = [
      "",
      ` ${emoji}`,
      `\n\n——${name}`,
      `\n\n你的日记化身 ${emoji}`,
    ];
    
    const addition = personalityAdditions[Math.floor(Math.random() * personalityAdditions.length)];
    const response = baseResponse + addition;
    
    return NextResponse.json({
      success: true,
      response,
      intent,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { success: false, error: "对话失败" },
      { status: 500 }
    );
  }
}