import { NextRequest, NextResponse } from "next/server";

// 心情预测模型 (简化版)
const moodFactors = {
  weekdayWeights: {
    0: 0.85, // 周日
    1: 0.75, // 周一
    2: 0.78, // 周二
    3: 0.80, // 周三
    4: 0.82, // 周四
    5: 0.88, // 周五
    6: 0.90, // 周六
  },
  sleepImpact: 0.15,
  exerciseImpact: 0.12,
  socialImpact: 0.08,
  creativeImpact: 0.10,
  workStressImpact: -0.05,
  weatherImpact: -0.03,
};

// 模拟历史心情数据
const historicalMoods = [
  { date: "2026-03-05", score: 7.5, factors: { sleep: 8, exercise: true, social: true } },
  { date: "2026-03-06", score: 8.0, factors: { sleep: 7, exercise: true, social: false } },
  { date: "2026-03-07", score: 7.0, factors: { sleep: 6, exercise: false, social: false } },
  { date: "2026-03-08", score: 7.8, factors: { sleep: 8, exercise: true, social: true } },
  { date: "2026-03-09", score: 8.2, factors: { sleep: 8, exercise: true, social: true } },
  { date: "2026-03-10", score: 7.5, factors: { sleep: 7, exercise: false, social: true } },
  { date: "2026-03-11", score: 8.5, factors: { sleep: 8, exercise: true, social: true } },
  { date: "2026-03-12", score: 8.0, factors: { sleep: 7, exercise: true, social: false } },
];

// 计算基础心情分数
function calculateBaseScore(date: Date): number {
  const dayOfWeek = date.getDay();
  return moodFactors.weekdayWeights[dayOfWeek as keyof typeof moodFactors.weekdayWeights] * 10;
}

// 预测未来心情
function predictMood(startDate: Date, days: number) {
  const predictions = [];
  const avgHistoricalScore = historicalMoods.reduce((sum, m) => sum + m.score, 0) / historicalMoods.length;
  const recentTrend = historicalMoods.slice(-3).reduce((sum, m) => sum + m.score, 0) / 3 - 
                     historicalMoods.slice(0, 3).reduce((sum, m) => sum + m.score, 0) / 3;
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const baseScore = calculateBaseScore(date);
    const trendAdjustment = recentTrend * 0.1;
    const randomVariation = (Math.random() - 0.5) * 0.5;
    
    let predictedScore = (baseScore + avgHistoricalScore) / 2 + trendAdjustment + randomVariation;
    predictedScore = Math.max(1, Math.min(10, predictedScore));
    
    const moodLabels = ["沮丧", "低落", "疲惫", "平静", "一般", "还好", "不错", "开心", "愉快", "兴奋"];
    const moodIndex = Math.min(Math.floor(predictedScore), 9);
    
    predictions.push({
      date: date.toISOString().split("T")[0],
      day: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][date.getDay()],
      score: Math.round(predictedScore * 10) / 10,
      mood: moodLabels[moodIndex],
      confidence: Math.max(60, 85 - i * 3), // 置信度随预测天数递减
    });
  }
  
  return predictions;
}

// 分析心情影响因素
function analyzeFactors() {
  return {
    positive: [
      { name: "睡眠质量", impact: "+15%", trend: "up", suggestion: "保持规律作息" },
      { name: "运动频率", impact: "+12%", trend: "up", suggestion: "每周运动3-4次" },
      { name: "社交活动", impact: "+8%", trend: "stable", suggestion: "适度社交有益" },
      { name: "创作输出", impact: "+10%", trend: "up", suggestion: "写作提升心情" },
    ],
    negative: [
      { name: "工作压力", impact: "-5%", trend: "down", suggestion: "学会放松" },
      { name: "天气变化", impact: "-3%", trend: "stable", suggestion: "无法改变，接受它" },
    ],
  };
}

// 生成行动建议
function generateSuggestions(predictions: any[]) {
  const suggestions = [];
  
  // 找出分数最低的一天
  const lowestDay = predictions.reduce((min, p) => p.score < min.score ? p : min, predictions[0]);
  if (lowestDay.score < 7) {
    suggestions.push({
      type: "warning",
      icon: "⚠️",
      title: `${lowestDay.day}可能情绪低落`,
      desc: `预计 ${lowestDay.day} 心情指数较低 (${lowestDay.score.toFixed(1)})，建议提前安排一些愉快活动`,
      action: "安排奖励",
    });
  }
  
  // 找出分数最高的一天
  const highestDay = predictions.reduce((max, p) => p.score > max.score ? p : max, predictions[0]);
  suggestions.push({
    type: "highlight",
    icon: "✨",
    title: `${highestDay.day}状态最佳`,
    desc: `${highestDay.day} 预测心情指数 ${highestDay.score.toFixed(1)}，适合处理重要事务`,
    action: "规划任务",
  });
  
  // 通用建议
  suggestions.push({
    type: "tip",
    icon: "💡",
    title: "本周行动建议",
    desc: "周三傍晚运动 30 分钟，可提升本周心情指数 15%",
    action: "设置提醒",
  });
  
  return suggestions;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const days = parseInt(searchParams.get("days") || "7");
  const type = searchParams.get("type") || "prediction";
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 1); // 从明天开始预测
  
  if (type === "factors") {
    return NextResponse.json({
      success: true,
      data: analyzeFactors(),
    });
  }
  
  if (type === "suggestions") {
    const predictions = predictMood(startDate, days);
    return NextResponse.json({
      success: true,
      data: generateSuggestions(predictions),
    });
  }
  
  if (type === "historical") {
    return NextResponse.json({
      success: true,
      data: historicalMoods,
    });
  }
  
  // 默认返回预测
  const predictions = predictMood(startDate, days);
  const avgScore = predictions.reduce((sum, p) => sum + p.score, 0) / predictions.length;
  const trend = predictions[predictions.length - 1].score > predictions[0].score ? "上升" : 
                predictions[predictions.length - 1].score < predictions[0].score ? "下降" : "稳定";
  
  return NextResponse.json({
    success: true,
    data: {
      predictions,
      summary: {
        averageScore: Math.round(avgScore * 10) / 10,
        trend,
        confidence: Math.round(80 - (days - 7) * 2),
      },
      factors: analyzeFactors(),
      suggestions: generateSuggestions(predictions),
    },
  });
}