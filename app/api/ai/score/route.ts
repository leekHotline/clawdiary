import { NextRequest, NextResponse } from "next/server";

// POST /api/ai/score - AI 写作评分
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, title } = body;
    
    if (!content) {
      return NextResponse.json({ error: "Missing content" }, { status: 400 });
    }
    
    // 分析内容
    const charCount = content.length;
    const wordCount = content.split(/\s+/).filter((w: string) => w.length > 0).length;
    const paragraphs = content.split(/\n\s*\n/).filter((p: string) => p.trim().length > 0).length;
    const sentences = content.split(/[。！？.!?]+/).filter((s: string) => s.trim().length > 0).length;
    
    // 计算各项分数
    const scores = {
      length: Math.min(100, Math.round(charCount / 10)), // 长度分数，1000字满分
      structure: Math.min(100, paragraphs * 20), // 结构分数，每段20分
      readability: calculateReadability(content, sentences, charCount),
      vocabulary: calculateVocabulary(content),
      emotion: calculateEmotion(content),
      creativity: calculateCreativity(content, title),
    };
    
    // 总分
    const totalScore = Math.round(
      (scores.length * 0.2 + 
       scores.structure * 0.15 + 
       scores.readability * 0.25 + 
       scores.vocabulary * 0.15 + 
       scores.emotion * 0.1 + 
       scores.creativity * 0.15)
    );
    
    // 生成评语
    const feedback = generateFeedback(scores, totalScore);
    
    return NextResponse.json({
      scores,
      totalScore,
      feedback,
      stats: {
        charCount,
        wordCount,
        paragraphs,
        sentences,
      },
    });
  } catch (error) {
    console.error("Score error:", error);
    return NextResponse.json({ error: "Failed to score content" }, { status: 500 });
  }
}

function calculateReadability(content: string, sentences: number, chars: number): number {
  if (sentences === 0) return 50;
  const avgSentenceLength = chars / sentences;
  // 理想句子长度 15-30 字
  if (avgSentenceLength >= 15 && avgSentenceLength <= 30) return 100;
  if (avgSentenceLength < 15) return Math.round(avgSentenceLength / 15 * 100);
  return Math.max(50, Math.round(100 - (avgSentenceLength - 30) * 2));
}

function calculateVocabulary(content: string): number {
  // 简单词汇丰富度计算
  const words = content.split(/\s+/).filter(w => w.length > 0);
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  if (words.length === 0) return 50;
  const ratio = uniqueWords.size / words.length;
  return Math.min(100, Math.round(ratio * 150));
}

function calculateEmotion(content: string): number {
  const emotionalWords = [
    "开心", "快乐", "幸福", "感动", "爱", "喜欢", "激动", "兴奋",
    "难过", "悲伤", "伤心", "失望", "痛苦", "孤独",
    "happy", "love", "sad", "excited", "grateful", "hope",
    "希望", "梦想", "感谢", "珍惜", "美好", "温暖"
  ];
  
  let count = 0;
  emotionalWords.forEach(word => {
    const regex = new RegExp(word, "gi");
    const matches = content.match(regex);
    if (matches) count += matches.length;
  });
  
  return Math.min(100, Math.round(count * 10));
}

function calculateCreativity(content: string, title?: string): number {
  let score = 50;
  
  // 检查是否有创意标题
  if (title) {
    if (title.includes("？") || title.includes("?")) score += 10;
    if (title.length < 15 && title.length > 3) score += 10;
    if (/[🦞🎨✨🌟💡🔥❤️]/.test(title)) score += 10;
  }
  
  // 检查内容多样性
  if (content.includes("\n\n")) score += 10; // 多段落
  if (/[#*`-]/.test(content)) score += 5; // 使用格式
  if (/[""「」『』]/.test(content)) score += 5; // 引用
  
  return Math.min(100, score);
}

function generateFeedback(scores: Record<string, number>, total: number): string {
  const feedback: string[] = [];
  
  if (total >= 90) {
    feedback.push("🌟 优秀的日记！内容丰富，表达流畅。");
  } else if (total >= 70) {
    feedback.push("👍 很好的日记！继续保持。");
  } else if (total >= 50) {
    feedback.push("📝 还不错的日记，可以尝试增加更多细节。");
  } else {
    feedback.push("💪 加油！多写一些内容会更好。");
  }
  
  if (scores.length < 50) {
    feedback.push("建议增加更多内容，表达会更丰富。");
  }
  if (scores.structure < 50) {
    feedback.push("可以尝试分段落来组织内容。");
  }
  if (scores.emotion < 50) {
    feedback.push("多表达一些情感，让日记更有温度。");
  }
  
  return feedback.join(" ");
}