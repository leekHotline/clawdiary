import { NextRequest, NextResponse } from "next/server";

// 简单情绪分析
function analyzeEmotion(text: string): number {
  const positiveWords = ["开心", "快乐", "幸福", "满足", "高兴", "感谢", "美好", "爱", "希望", "成功", "完成", "进步", "收获", "喜欢", "棒", "好", "太好了", "哈哈", "😊", "😄", "❤️", "🌟", "✨"];
  const negativeWords = ["难过", "伤心", "痛苦", "焦虑", "担心", "压力", "累", "烦", "失望", "沮丧", "迷茫", "孤独", "害怕", "紧张", "不安", "😢", "😭", "😔", "😞", "疲惫"];
  
  const lowerText = text.toLowerCase();
  let score = 50; // 基础分
  
  positiveWords.forEach(word => {
    if (lowerText.includes(word)) score += 5;
  });
  
  negativeWords.forEach(word => {
    if (lowerText.includes(word)) score -= 5;
  });
  
  return Math.max(10, Math.min(95, score));
}

// 获取周几影响因子
function getWeekdayFactor(dayOfWeek: number): { adjustment: number; factors: string[] } {
  const factors: string[] = [];
  let adjustment = 0;
  
  // 周一通常情绪较低
  if (dayOfWeek === 1) {
    adjustment = -5;
    factors.push("周一综合症");
  }
  // 周五周六情绪较高
  else if (dayOfWeek === 5 || dayOfWeek === 6) {
    adjustment = 8;
    factors.push("周末前夕");
  }
  // 周日
  else if (dayOfWeek === 0) {
    adjustment = 5;
    factors.push("休息日");
  }
  
  return { adjustment, factors };
}

// 获取建议
function getSuggestions(score: number, factors: string[]): string[] {
  const suggestions: string[] = [];
  
  if (score >= 70) {
    suggestions.push("这是个好日子，适合做些有挑战的事");
    suggestions.push("可以考虑约朋友聚会，分享好心情");
    suggestions.push("记录下这份愉悦，它会成为你的正能量储备");
  } else if (score >= 50) {
    suggestions.push("保持平稳节奏，专注当下");
    suggestions.push("可以尝试一些小目标，给自己小确幸");
    suggestions.push("写写日记，记录此刻的感受");
  } else {
    suggestions.push("给自己一点关爱，做些让自己舒服的事");
    suggestions.push("可以找朋友聊聊天，或者听听音乐");
    suggestions.push("低落是正常的，明天会更好");
  }
  
  // 根据因素添加特定建议
  if (factors.includes("周一综合症")) {
    suggestions.push("周一可以安排轻松一点的任务");
  }
  if (factors.includes("周末前夕")) {
    suggestions.push("可以提前规划周末活动");
  }
  
  return suggestions.slice(0, 3);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { diaries } = body as { diaries: Array<{ title: string; content: string; date: string; mood?: string }> };
    
    if (!diaries || diaries.length === 0) {
      return NextResponse.json({ error: "No diaries provided" }, { status: 400 });
    }

    // 分析历史数据
    const emotionScores = diaries.map(d => {
      const text = `${d.title} ${d.content}`;
      return analyzeEmotion(text);
    });
    
    const avgScore = Math.round(emotionScores.reduce((a, b) => a + b, 0) / emotionScores.length);
    
    // 计算趋势（最近5条 vs 之前5条）
    const recent = emotionScores.slice(0, Math.min(5, emotionScores.length));
    const earlier = emotionScores.slice(Math.min(5, emotionScores.length), Math.min(10, emotionScores.length));
    
    let trend: "rising" | "falling" | "stable" = "stable";
    if (earlier.length > 0) {
      const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
      if (recentAvg - earlierAvg > 5) trend = "rising";
      else if (earlierAvg - recentAvg > 5) trend = "falling";
    }
    
    // 分析周几模式
    const weekdayScores: number[][] = [[], [], [], [], [], [], []];
    diaries.forEach(d => {
      const dayOfWeek = new Date(d.date).getDay();
      const score = analyzeEmotion(`${d.title} ${d.content}`);
      weekdayScores[dayOfWeek].push(score);
    });
    
    const weekdayAvg = weekdayScores.map(scores => 
      scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : avgScore
    );
    
    // 发现模式
    const patterns: string[] = [];
    const bestDay = weekdayAvg.indexOf(Math.max(...weekdayAvg));
    const worstDay = weekdayAvg.indexOf(Math.min(...weekdayAvg));
    const dayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    
    if (weekdayAvg[bestDay] > avgScore + 5) {
      patterns.push(`${dayNames[bestDay]}情绪最佳`);
    }
    if (weekdayAvg[worstDay] < avgScore - 5) {
      patterns.push(`${dayNames[worstDay]}情绪较低`);
    }
    if (trend === "rising") {
      patterns.push("情绪上升期");
    } else if (trend === "falling") {
      patterns.push("注意情绪调节");
    }
    
    // 生成未来7天预报
    const today = new Date();
    const forecast = [];
    
    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      
      const dayOfWeek = futureDate.getDay();
      const { adjustment, factors } = getWeekdayFactor(dayOfWeek);
      
      // 基于历史 + 周几因子 + 趋势计算预测分数
      let predictedScore = avgScore + adjustment;
      
      // 加入趋势影响
      if (trend === "rising") {
        predictedScore += i * 0.5; // 每天略微上升
      } else if (trend === "falling") {
        predictedScore -= i * 0.3; // 每天略微下降，但幅度小
      }
      
      // 加入历史周几数据的影响
      if (weekdayScores[dayOfWeek].length > 0) {
        const historicalWeekdayAvg = weekdayAvg[dayOfWeek];
        predictedScore = predictedScore * 0.6 + historicalWeekdayAvg * 0.4;
      }
      
      // 加入随机波动（模拟不确定性）
      predictedScore += (Math.random() - 0.5) * 10;
      predictedScore = Math.max(15, Math.min(95, Math.round(predictedScore)));
      
      // 计算置信度（历史数据越多置信度越高）
      const dataPoints = weekdayScores[dayOfWeek].length;
      const confidence = Math.min(0.85, 0.5 + dataPoints * 0.05);
      
      // 获取分数对应的标签
      let label: string, emoji: string, color: string;
      if (predictedScore >= 80) {
        label = "极佳"; emoji = "🌟"; color = "text-green-400";
      } else if (predictedScore >= 65) {
        label = "良好"; emoji = "😊"; color = "text-blue-400";
      } else if (predictedScore >= 50) {
        label = "平稳"; emoji = "😐"; color = "text-gray-400";
      } else if (predictedScore >= 35) {
        label = "一般"; emoji = "😔"; color = "text-orange-400";
      } else {
        label = "低落"; emoji = "😢"; color = "text-red-400";
      }
      
      forecast.push({
        date: futureDate.toISOString().split("T")[0],
        dayName: dayNames[dayOfWeek],
        prediction: {
          score: predictedScore,
          label,
          emoji,
          color,
        },
        confidence,
        factors: factors.length > 0 ? factors : ["日常因素"],
        suggestions: getSuggestions(predictedScore, factors),
      });
    }
    
    return NextResponse.json({
      forecast,
      historyAnalysis: {
        avgScore,
        trend,
        patterns,
        topFactors: patterns,
      },
    });
    
  } catch (error) {
    console.error("Emotion forecast error:", error);
    return NextResponse.json({ error: "Failed to generate forecast" }, { status: 500 });
  }
}