import { NextRequest, NextResponse } from "next/server";

// 模拟健康检查数据
const generateHealthCheckReport = () => {
  const diariesCount = Math.floor(Math.random() * 20) + 10;
  
  return {
    overallScore: Math.floor(Math.random() * 30) + 70,
    lastCheckDate: new Date().toLocaleDateString('zh-CN'),
    bestWritingTime: '晚间 21:00-23:00',
    writingTimeDistribution: [
      { period: '早晨', count: 3 },
      { period: '下午', count: 5 },
      { period: '晚间', count: 12 },
    ],
    avgCompletionTime: '18 分钟',
    weekendRatio: 35,
    avgReadingTime: 2.5,
    tagUsageRate: 78,
    locationUsageRate: 45,
    weatherUsageRate: 62,
    weeklyTrend: Math.floor(Math.random() * 20) - 5,
    monthlyTrend: Math.floor(Math.random() * 30) + 5,
    highestScore: 95,
    diariesCount,
  };
};

const generateWritingMetrics = () => {
  const diariesCount = Math.floor(Math.random() * 20) + 10;
  const avgWords = Math.floor(Math.random() * 500) + 300;
  
  return {
    frequencyScore: Math.min(100, Math.floor(diariesCount * 3.5)),
    wordCountScore: Math.min(100, Math.floor(avgWords / 5)),
    diariesCount,
    avgWords,
    totalWords: diariesCount * avgWords,
    longestDiary: Math.floor(Math.random() * 1000) + 800,
    shortestDiary: Math.floor(Math.random() * 100) + 50,
  };
};

const generateMoodMetrics = () => {
  const moods = [
    { mood: '开心', emoji: '😊', count: 8, percentage: 32 },
    { mood: '平静', emoji: '😌', count: 6, percentage: 24 },
    { mood: '思考', emoji: '🤔', count: 5, percentage: 20 },
    { mood: '忧郁', emoji: '😢', count: 3, percentage: 12 },
    { mood: '兴奋', emoji: '🤩', count: 3, percentage: 12 },
  ];
  
  return {
    stabilityScore: Math.floor(Math.random() * 20) + 75,
    dominantMood: '开心',
    positiveRatio: 68,
    negativeRatio: 12,
    neutralRatio: 20,
    distribution: moods,
    moodSwings: Math.floor(Math.random() * 5),
  };
};

const generateConsistencyScore = () => {
  const streak = Math.floor(Math.random() * 30) + 1;
  
  return {
    score: Math.min(100, streak * 3 + 40),
    streak,
    longestStreak: Math.floor(Math.random() * 20) + streak,
    streakStartDate: new Date(Date.now() - streak * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN'),
    missedDays: Math.floor(Math.random() * 5),
  };
};

const generateRecommendations = () => {
  return [
    {
      icon: '⏰',
      title: '固定写作时间',
      description: '建议在晚间 21:00 写作，这是你的最佳时段',
      priority: 'high',
    },
    {
      icon: '📍',
      title: '添加地点信息',
      description: '地点记录率较低，添加地点可以丰富日记回忆',
      priority: 'medium',
    },
    {
      icon: '🏷️',
      title: '使用标签分类',
      description: '标签有助于日记分类和检索',
      priority: 'low',
    },
    {
      icon: '🔥',
      title: '保持连续写作',
      description: '当前连续写作天数不错，继续保持！',
      priority: 'low',
    },
  ];
};

// GET /api/health-check - 获取健康检查报告
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "full";

    if (type === "writing") {
      return NextResponse.json({
        success: true,
        data: generateWritingMetrics(),
      });
    }

    if (type === "mood") {
      return NextResponse.json({
        success: true,
        data: generateMoodMetrics(),
      });
    }

    if (type === "consistency") {
      return NextResponse.json({
        success: true,
        data: generateConsistencyScore(),
      });
    }

    if (type === "recommendations") {
      return NextResponse.json({
        success: true,
        data: generateRecommendations(),
      });
    }

    // 返回完整报告
    return NextResponse.json({
      success: true,
      data: {
        report: generateHealthCheckReport(),
        writing: generateWritingMetrics(),
        mood: generateMoodMetrics(),
        consistency: generateConsistencyScore(),
        recommendations: generateRecommendations(),
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (_error) {
    console.error("Error generating health check:", _error);
    return NextResponse.json(
      { success: false, error: "Failed to generate health check report" },
      { status: 500 }
    );
  }
}

// POST /api/health-check - 生成新的健康检查报告
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { period = "30d" } = body;

    // 这里可以保存报告到数据库
    const report = {
      id: `health-${Date.now()}`,
      period,
      createdAt: new Date().toISOString(),
      ...generateHealthCheckReport(),
    };

    return NextResponse.json({
      success: true,
      data: report,
      message: "健康检查报告已生成",
    });
  } catch (_error) {
    console.error("Error creating health check report:", _error);
    return NextResponse.json(
      { success: false, error: "Failed to create health check report" },
      { status: 500 }
    );
  }
}