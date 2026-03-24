import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";
import { aiAnalyze } from "@/lib/ai-service";

// POST /api/assistant/mood - AI 驱动的心情分析
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
    
    if (!textToAnalyze) {
      return NextResponse.json({ 
        error: "No content to analyze" 
      }, { status: 400 });
    }
    
    // 调用 AI 进行情感分析
    const aiResult = await aiAnalyze(textToAnalyze, 'mood');
    
    if (aiResult.success && aiResult.content) {
      try {
        const jsonMatch = aiResult.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const moodData = JSON.parse(jsonMatch[0]);
          
          return NextResponse.json({
            dominantMood: moodData.primaryMood || "neutral",
            moodScore: moodData.moodScore || 5,
            moodDescription: moodData.moodDescription || "",
            suggestions: moodData.suggestions || [],
            scores: {
              positive: moodData.primaryMood === 'happy' ? 10 : 0,
              negative: moodData.primaryMood === 'sad' ? 10 : 0,
              neutral: moodData.primaryMood === 'calm' ? 10 : 0,
            },
            wordCount: textToAnalyze.length,
            poweredBy: "DeepSeek AI",
          });
        }
      } catch {
        // Fall through to keyword analysis
      }
    }
    
    // Fallback: 关键词分析
    const moodKeywords = {
      positive: ["开心", "快乐", "幸福", "满足", "感激", "喜欢", "爱", "希望", "成功", "棒", "好", "高兴", "兴奋", "期待"],
      negative: ["难过", "悲伤", "沮丧", "失望", "焦虑", "担心", "害怕", "生气", "愤怒", "烦", "累", "痛苦", "孤独", "压力"],
      neutral: ["一般", "正常", "普通", "平静", "安静", "还好", "无聊"],
    };

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
    
    let dominantMood = "neutral";
    if (positiveCount > negativeCount && positiveCount > neutralCount) {
      dominantMood = "positive";
    } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
      dominantMood = "negative";
    }
    
    return NextResponse.json({
      dominantMood,
      scores: {
        positive: positiveCount,
        negative: negativeCount,
        neutral: neutralCount,
      },
      wordCount: textToAnalyze.length,
      poweredBy: "Fallback Analysis",
    });
  } catch (error) {
    console.error("Mood analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze mood" }, { status: 500 });
  }
}