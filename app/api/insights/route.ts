import { NextRequest, NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";
import { aiAnalyze } from "@/lib/ai-service";

// GET /api/insights - AI 驱动的洞察分析
export async function GET(request: NextRequest) {
  try {
    const diaries = await getDiaries();
    
    if (diaries.length === 0) {
      return NextResponse.json({
        insights: [],
        summary: "暂无日记数据，开始记录你的第一条日记吧！",
      });
    }
    
    // 基础统计分析
    const totalWords = diaries.reduce((sum, d) => sum + d.content.length, 0);
    const avgWords = Math.round(totalWords / diaries.length);
    
    // 标签统计
    const tagCounts: Record<string, number> = {};
    diaries.forEach(d => {
      d.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    // 作者统计
    const authorCounts: Record<string, number> = {};
    diaries.forEach(d => {
      authorCounts[d.author] = (authorCounts[d.author] || 0) + 1;
    });
    
    // 准备日记内容用于AI分析
    const recentDiaries = diaries.slice(-10); // 最近10篇
    const diaryTexts = recentDiaries.map(d => 
      `【${d.date}】${d.title}\n${d.content.slice(0, 500)}`
    ).join('\n\n---\n\n');
    
    // 调用AI进行深度分析
    const aiResult = await aiAnalyze(diaryTexts, 'theme');
    
    let aiInsights = null;
    if (aiResult.success && aiResult.content) {
      try {
        const jsonMatch = aiResult.content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          aiInsights = JSON.parse(jsonMatch[0]);
        }
      } catch {
        // AI返回的不是JSON格式，直接使用文本
        aiInsights = {
          mainTheme: '个人成长',
          summary: aiResult.content.slice(0, 200),
          insights: [aiResult.content.slice(0, 100)]
        };
      }
    }
    
    // 情绪分析（结合AI和关键词）
    const emotions = {
      positive: 0,
      negative: 0,
      neutral: 0,
    };
    
    const positiveWords = ["开心", "快乐", "成功", "完成", "庆祝", "进步", "喜欢", "爱", "美好", "感谢", "幸福"];
    const negativeWords = ["失败", "问题", "错误", "遗憾", "难过", "痛苦", "焦虑", "担心"];
    
    diaries.forEach(d => {
      const content = d.content.toLowerCase();
      const posCount = positiveWords.filter(w => content.includes(w)).length;
      const negCount = negativeWords.filter(w => content.includes(w)).length;
      
      if (posCount > negCount) emotions.positive++;
      else if (negCount > posCount) emotions.negative++;
      else emotions.neutral++;
    });
    
    // 写作习惯分析
    const days = diaries.map(d => d.date);
    const uniqueDays = [...new Set(days)].length;
    const firstDate = new Date(Math.min(...diaries.map(d => new Date(d.date).getTime())));
    const lastDate = new Date(Math.max(...diaries.map(d => new Date(d.date).getTime())));
    const daySpan = Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // 生成洞察（结合AI分析和统计数据）
    const insights = [
      {
        type: "ai_insight",
        title: "AI 深度洞察",
        content: aiInsights?.summary || "正在分析你的日记...",
        score: Math.min(100, Math.round((diaries.length / Math.max(daySpan, 1)) * 50)),
        aiGenerated: true,
      },
      {
        type: "writing_habit",
        title: "写作习惯",
        content: `你在 ${daySpan} 天内写了 ${diaries.length} 篇日记，平均每天 ${(diaries.length / Math.max(daySpan, 1)).toFixed(1)} 篇`,
        score: Math.min(100, Math.round((diaries.length / Math.max(daySpan, 1)) * 50)),
      },
      {
        type: "content_quality",
        title: "内容质量",
        content: `平均每篇 ${avgWords} 字，总计 ${totalWords} 字。内容质量${avgWords > 200 ? "优秀" : avgWords > 100 ? "良好" : "可以更丰富"}。`,
        score: Math.min(100, Math.round(avgWords / 3)),
      },
      {
        type: "emotion_balance",
        title: "情绪分布",
        content: `积极情绪 ${emotions.positive} 篇，消极情绪 ${emotions.negative} 篇，中性 ${emotions.neutral} 篇`,
        score: Math.round((emotions.positive / diaries.length) * 100),
      },
      {
        type: "tag_usage",
        title: "标签使用",
        content: `共使用 ${Object.keys(tagCounts).length} 个不同标签，最常用：${Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([t, c]) => `${t}(${c})`).join("、")}`,
        score: Math.min(100, Object.keys(tagCounts).length * 10),
      },
    ];
    
    // AI 生成的个性化建议
    if (aiInsights?.insights && aiInsights.insights.length > 0) {
      insights.push({
        type: "ai_suggestions",
        title: "AI 建议",
        content: aiInsights.insights.join("；"),
        score: 85,
        aiGenerated: true,
      });
    }
    
    return NextResponse.json({
      insights,
      summary: `共 ${diaries.length} 篇日记，${totalWords} 字，${uniqueDays} 个活跃写作日`,
      emotions,
      topTags: Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([tag, count]) => ({ tag, count })),
      authorStats: authorCounts,
      aiTheme: aiInsights?.mainTheme || null,
      aiKeywords: aiInsights?.keywords || [],
      generatedAt: new Date().toISOString(),
      poweredBy: "DeepSeek AI",
    });
  } catch (error) {
    console.error("生成洞察失败:", error);
    return NextResponse.json(
      { error: "生成洞察失败" },
      { status: 500 }
    );
  }
}