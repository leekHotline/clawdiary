import { NextRequest, NextResponse } from "next/server";

// POST /api/ai/suggestions - AI 写作建议
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, title } = body;
    
    if (!content) {
      return NextResponse.json({ error: "Missing content" }, { status: 400 });
    }
    
    const suggestions: string[] = [];
    
    // 分析标题
    if (title) {
      if (title.length < 3) {
        suggestions.push("💡 标题太短，可以更具体地描述主题");
      }
      if (title.length > 50) {
        suggestions.push("💡 标题可以更简洁，突出重点");
      }
    }
    
    // 分析内容长度
    if (content.length < 100) {
      suggestions.push("📝 内容较短，可以补充更多细节");
    }
    
    // 分析段落
    const paragraphs = content.split(/\n\s*\n/).filter((p: string) => p.trim().length > 0);
    if (paragraphs.length === 1 && content.length > 200) {
      suggestions.push("📄 建议分段，让内容更易阅读");
    }
    
    // 检查标点
    const punctuation = content.match(/[，。！？、；：]/g);
    if (!punctuation || punctuation.length < 3) {
      suggestions.push("✍️ 可以使用更多标点来分隔句子");
    }
    
    // 检查情感词汇
    const emotionalWords = ["开心", "难过", "感动", "喜欢", "讨厌", "希望"];
    const hasEmotion = emotionalWords.some(w => content.includes(w));
    if (!hasEmotion) {
      suggestions.push("💭 可以尝试表达更多情感");
    }
    
    // 检查细节
    const hasDetails = /[0-9]|今天|昨天|明天|上午|下午|晚上/.test(content);
    if (!hasDetails) {
      suggestions.push("📅 可以添加时间或具体细节，让日记更生动");
    }
    
    // 正向反馈
    if (content.length > 500) {
      suggestions.push("✅ 内容丰富，继续保持！");
    }
    
    if (paragraphs.length >= 3) {
      suggestions.push("✅ 结构清晰，分段合理！");
    }
    
    // 写作主题建议
    const topics = [
      "今天有什么让你开心的事情？",
      "最近学到了什么新东西？",
      "有什么人或事让你感激？",
      "今天遇到了什么挑战？是如何解决的？",
      "如果用一句话总结今天，你会说什么？",
    ];
    
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    return NextResponse.json({
      suggestions,
      writingPrompt: randomTopic,
      wordCount: content.length,
      paragraphCount: paragraphs.length,
    });
  } catch (_error) {
    console.error("Suggestions error:", _error);
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}