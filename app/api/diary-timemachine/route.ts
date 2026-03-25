import { NextRequest, NextResponse } from 'next/server';

// 情感映射
const EMOTION_MAP: Record<string, { emoji: string; mood: string }> = {
  positive: { emoji: "😊", mood: "愉悦" },
  excited: { emoji: "🤩", mood: "兴奋" },
  calm: { emoji: "😌", mood: "平静" },
  reflective: { emoji: "🤔", mood: "沉思" },
  determined: { emoji: "💪", mood: "坚定" },
  curious: { emoji: "🔍", mood: "好奇" },
  creative: { emoji: "🎨", mood: "创造" },
  learning: { emoji: "📚", mood: "学习" },
  growth: { emoji: "🌱", mood: "成长" },
  challenge: { emoji: "🎯", mood: "挑战" },
};

// 简单情感分析
function analyzeEmotion(content: string, tags: string[]): { emoji: string; mood: string; keywords: string[] } {
  const lowerContent = content.toLowerCase();
  
  // 基于内容分析情感
  const emotions: Record<string, number> = {
    excited: 0,
    creative: 0,
    learning: 0,
    growth: 0,
    challenge: 0,
    reflective: 0,
  };
  
  // 情感关键词
  if (lowerContent.includes("完成") || lowerContent.includes("成功") || lowerContent.includes("实现")) {
    emotions.excited += 2;
  }
  if (lowerContent.includes("创建") || lowerContent.includes("设计") || lowerContent.includes("实现")) {
    emotions.creative += 2;
  }
  if (lowerContent.includes("学习") || lowerContent.includes("理解") || lowerContent.includes("掌握")) {
    emotions.learning += 2;
  }
  if (lowerContent.includes("成长") || lowerContent.includes("进步") || lowerContent.includes("提升")) {
    emotions.growth += 2;
  }
  if (lowerContent.includes("挑战") || lowerContent.includes("困难") || lowerContent.includes("问题")) {
    emotions.challenge += 1;
  }
  if (lowerContent.includes("思考") || lowerContent.includes("反思") || lowerContent.includes("回顾")) {
    emotions.reflective += 2;
  }
  
  // 标签影响
  tags.forEach(tag => {
    if (tag.includes("新功能") || tag.includes("功能")) emotions.creative += 1;
    if (tag.includes("学习") || tag.includes("技术")) emotions.learning += 1;
    if (tag.includes("成长") || tag.includes("里程碑")) emotions.growth += 1;
  });
  
  // 找出主要情感
  let maxEmotion = "growth";
  let maxScore = 0;
  Object.entries(emotions).forEach(([emotion, score]) => {
    if (score > maxScore) {
      maxScore = score;
      maxEmotion = emotion;
    }
  });
  
  // 提取关键词（简化版）
  const keywords: string[] = [];
  const patterns = [
    { regex: /新功能[：:]\s*([^\n，。]+)/g, prefix: "新功能" },
    { regex: /完成了?([^\n，。]+)/g, prefix: "完成" },
    { regex: /实现了?([^\n，。]+)/g, prefix: "实现" },
  ];
  
  patterns.forEach(({ regex, prefix }) => {
    let match;
    while ((match = regex.exec(content)) !== null && keywords.length < 5) {
      const kw = match[1]?.trim().slice(0, 10);
      if (kw && kw.length > 1) {
        keywords.push(`${prefix}: ${kw}`);
      }
    }
  });
  
  // 从标签中提取关键词
  tags.slice(0, 3).forEach(tag => {
    if (!keywords.includes(tag) && keywords.length < 5) {
      keywords.push(tag);
    }
  });
  
  const emotionData = EMOTION_MAP[maxEmotion] || EMOTION_MAP.growth;
  
  return {
    emoji: emotionData.emoji,
    mood: emotionData.mood,
    keywords: keywords.length > 0 ? keywords : tags.slice(0, 3),
  };
}

// 生成成长洞察
function generateGrowthInsight(content: string, tags: string[], daysDiff: number): string {
  const insights = [
    daysDiff < 7 
      ? "这段时间你持续保持着创造的势头，短期的积累正在转化为可见的成果。" 
      : daysDiff < 30 
        ? "回顾这段时间，你可以看到自己的进步轨迹。每一步都算数。" 
        : "时光飞逝，但成长的足迹清晰可见。你已经走了很远。",
    tags.includes("新功能") 
      ? "当时你正在开拓新的领域，这份探索精神是成长的源泉。" 
      : tags.includes("协作") 
        ? "协作的力量在于，我们总能在彼此的帮助下走得更远。" 
        : "",
    content.includes("完成") 
      ? "完成本身就是一种胜利。当时的每一个完成，都是今天能力的基石。" 
      : "",
  ].filter(Boolean);
  
  return insights.join(" ");
}

// 生成未来寄语
function generateFutureMessage(content: string, tags: string[], daysDiff: number): string {
  const messages = [
    daysDiff > 30 
      ? `那时候的你可能不知道，${daysDiff}天后的今天，你已经走得更远了。坚持的力量是惊人的。` 
      : `短短${daysDiff}天，每一步都算数。继续保持这份热情！`,
    tags.includes("成长") 
      ? "成长从来不是一蹴而就的，但你已经在路上。" 
      : "",
    content.includes("困难") 
      ? "当时遇到的困难，现在看来是否已经变成了成长的养分？" 
      : "那些曾经的努力，都变成了今天的实力。",
  ].filter(Boolean);
  
  return messages[Math.floor(Math.random() * messages.length)] || 
    "感谢过去的你，让今天的你更加优秀。继续前行吧！";
}

export async function POST(request: NextRequest) {
  try {
    const { diary } = await request.json();
    
    if (!diary) {
      return NextResponse.json({ error: "缺少日记数据" }, { status: 400 });
    }
    
    const { content, tags = [] } = diary;
    
    // 分析情感
    const emotionResult = analyzeEmotion(content || "", tags);
    
    // 计算天数差
    const daysDiff = diary.date 
      ? Math.floor((Date.now() - new Date(diary.date).getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    
    // 生成成长洞察
    const growthInsight = generateGrowthInsight(content || "", tags, daysDiff);
    
    // 生成未来寄语
    const message = generateFutureMessage(content || "", tags, daysDiff);
    
    return NextResponse.json({
      pastMood: emotionResult.emoji,
      pastEmotion: emotionResult.mood,
      pastKeywords: emotionResult.keywords,
      growthInsight,
      message,
      daysAgo: daysDiff,
    });
  } catch (error) {
    console.error("时光机分析失败:", error);
    return NextResponse.json({ error: "分析失败" }, { status: 500 });
  }
}