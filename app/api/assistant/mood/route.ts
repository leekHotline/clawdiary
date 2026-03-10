import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// 情绪关键词
const moodKeywords = {
  positive: ["开心", "快乐", "幸福", "满足", "感激", "喜欢", "爱", "希望", "成功", "棒", "好", "高兴", "兴奋", "期待"],
  negative: ["难过", "悲伤", "沮丧", "失望", "焦虑", "担心", "害怕", "生气", "愤怒", "烦", "累", "痛苦", "孤独", "压力"],
  neutral: ["一般", "正常", "普通", "平静", "安静", "还好", "无聊"],
};

// POST /api/assistant/mood - 心情分析
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, diaryIds } = body;
    
    let textToAnalyze = content || "";
    
    // 如果提供了日记 ID，分析这些日记
    if (diaryIds && diaryIds.length > 0) {
      const diaries = await getDiaries();
      const selectedDiaries = diaries.filter(d => diaryIds.includes(d.id));
      textToAnalyze = selectedDiaries.map(d => d.content).join(" ");
    }
    
    // 简单的关键词分析
    let positiveCount = 0;
    let negativeCount = 0;
    let neutralCount = 0;
    
    moodKeywords.positive.forEach(kw => {
      const matches = textToAnalyze.match(new RegExp(kw, "g"));
      if (matches) positiveCount += matches.length;
    });
    
    moodKeywords.negative.forEach(kw => {
      const matches = textToAnalyze.match(new RegExp(kw, "g"));
      if (matches) negativeCount += matches.length;
    });
    
    moodKeywords.neutral.forEach(kw => {
      const matches = textToAnalyze.match(new RegExp(kw, "g"));
      if (matches) neutralCount += matches.length;
    });
    
    const total = positiveCount + negativeCount + neutralCount;
    
    let dominantMood = "neutral";
    if (positiveCount > negativeCount && positiveCount > neutralCount) {
      dominantMood = "positive";
    } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
      dominantMood = "negative";
    }
    
    const positiveRatio = total > 0 ? (positiveCount / total * 100).toFixed(1) : "0";
    const negativeRatio = total > 0 ? (negativeCount / total * 100).toFixed(1) : "0";
    
    return NextResponse.json({
      dominantMood,
      scores: {
        positive: positiveCount,
        negative: negativeCount,
        neutral: neutralCount,
      },
      percentages: {
        positive: `${positiveRatio}%`,
        negative: `${negativeRatio}%`,
      },
      detectedKeywords: {
        positive: moodKeywords.positive.filter(kw => textToAnalyze.includes(kw)),
        negative: moodKeywords.negative.filter(kw => textToAnalyze.includes(kw)),
      },
      wordCount: textToAnalyze.length,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to analyze mood" }, { status: 500 });
  }
}