import { NextRequest, NextResponse } from "next/server";

// 模拟对比数据
const comparisons = [
  {
    id: 1,
    name: "1月 vs 2月",
    type: "period",
    createdAt: "2026-03-10",
    insight: "字数增长15%",
    data: {
      periodA: { label: "2026年1月", entries: 13, words: 28500 },
      periodB: { label: "2026年2月", entries: 15, words: 32100 },
    },
  },
  {
    id: 2,
    name: "开心 vs 疲惫",
    type: "mood",
    createdAt: "2026-03-08",
    insight: "字数差异1656字",
    data: {
      moodA: { label: "开心", avgWords: 2890, entries: 18 },
      moodB: { label: "疲惫", avgWords: 1234, entries: 8 },
    },
  },
  {
    id: 3,
    name: "年初 vs 现在",
    type: "growth",
    createdAt: "2026-03-05",
    insight: "进步显著",
    data: {
      before: { label: "年初", words: 0, entries: 0 },
      after: { label: "现在", words: 156420, entries: 73 },
    },
  },
];

// 计算时间段对比
function comparePeriods(startDateA: string, endDateA: string, startDateB: string, endDateB: string) {
  // 模拟数据
  const periodA = {
    label: `${startDateA} ~ ${endDateA}`,
    entries: 13,
    words: 28500,
    avgWords: 2192,
    topTags: ["AI", "系统", "功能"],
    moodDistribution: { happy: 5, calm: 4, tired: 3, anxious: 1 },
    writingDays: 20,
    streak: 12,
  };
  
  const periodB = {
    label: `${startDateB} ~ ${endDateB}`,
    entries: 15,
    words: 32100,
    avgWords: 2140,
    topTags: ["AI", "优化", "成长"],
    moodDistribution: { happy: 7, calm: 5, tired: 2, anxious: 1 },
    writingDays: 22,
    streak: 15,
  };
  
  const diff = {
    entries: periodB.entries - periodA.entries,
    words: periodB.words - periodA.words,
    avgWords: periodB.avgWords - periodA.avgWords,
    writingDays: periodB.writingDays - periodA.writingDays,
    streak: periodB.streak - periodA.streak,
  };
  
  const insights = generatePeriodInsights(periodA, periodB, diff);
  
  return { periodA, periodB, diff, insights };
}

// 生成洞察
function generatePeriodInsights(periodA: any, periodB: any, diff: any) {
  const insights = [];
  
  if (diff.words > 0) {
    insights.push({
      type: "positive",
      icon: "📈",
      text: `写作量增加，${periodB.label}比${periodA.label}多写${(diff.words / 1000).toFixed(1)}K字`,
    });
  }
  
  const moodImproveA = periodA.moodDistribution.happy / periodA.entries;
  const moodImproveB = periodB.moodDistribution.happy / periodB.entries;
  if (moodImproveB > moodImproveA) {
    insights.push({
      type: "positive",
      icon: "😊",
      text: `积极情绪比例从${(moodImproveA * 100).toFixed(0)}%提升到${(moodImproveB * 100).toFixed(0)}%`,
    });
  }
  
  if (diff.streak > 0) {
    insights.push({
      type: "positive",
      icon: "🔥",
      text: `连续写作天数从${periodA.streak}天提升到${periodB.streak}天`,
    });
  }
  
  insights.push({
    type: "suggestion",
    icon: "💡",
    text: `建议保持当前节奏，同时尝试增加单篇深度`,
  });
  
  return insights;
}

// 心情对比
function compareMoods(moodA: string, moodB: string) {
  const moodData: Record<string, { avgWords: number; entries: number; topTags: string[]; themes: string[] }> = {
    happy: {
      avgWords: 2890,
      entries: 18,
      topTags: ["成就", "感谢", "成长"],
      themes: ["目标达成", "社交活动", "学习进步"],
    },
    calm: {
      avgWords: 1823,
      entries: 15,
      topTags: ["日常", "平静", "思考"],
      themes: ["阅读", "散步", "冥想"],
    },
    tired: {
      avgWords: 1234,
      entries: 8,
      topTags: ["工作", "压力", "休息"],
      themes: ["加班", "失眠", "健康"],
    },
    anxious: {
      avgWords: 987,
      entries: 5,
      topTags: ["焦虑", "担忧", "问题"],
      themes: ["未来", "工作", "关系"],
    },
    excited: {
      avgWords: 3210,
      entries: 5,
      topTags: ["期待", "计划", "梦想"],
      themes: ["新项目", "旅行", "创意"],
    },
  };
  
  const dataA = moodData[moodA] || moodData.calm;
  const dataB = moodData[moodB] || moodData.happy;
  
  return {
    moodA: { name: moodA, ...dataA },
    moodB: { name: moodB, ...dataB },
    diff: {
      avgWords: dataB.avgWords - dataA.avgWords,
      entries: dataB.entries - dataA.entries,
    },
    insights: [
      {
        type: "pattern",
        icon: "📊",
        text: `${moodB}时平均写作${dataB.avgWords}字，${moodA}时${dataA.avgWords}字`,
      },
      {
        type: "suggestion",
        icon: "💡",
        text: `心情影响写作量，保持积极心态有助于深度写作`,
      },
    ],
  };
}

// 成长对比
function getGrowthComparison() {
  return {
    before: {
      label: "3个月前",
      date: "2025-12-01",
      totalWords: 0,
      entries: 0,
      habits: [],
    },
    now: {
      label: "现在",
      date: "2026-03-12",
      totalWords: 156420,
      entries: 73,
      avgWords: 2143,
      habits: ["每日写作", "早起记录", "周度反思"],
    },
    milestones: [
      { date: "2025-12-01", event: "开始写日记", icon: "🚀" },
      { date: "2025-12-20", event: "字数破万", icon: "📝" },
      { date: "2026-01-05", event: "连续30天", icon: "🔥" },
      { date: "2026-02-28", event: "字数十万", icon: "🎯" },
      { date: "2026-03-04", event: "连续60天", icon: "🌟" },
    ],
    growth: {
      wordGrowth: 156420,
      entryGrowth: 73,
      habitsGained: 3,
      consistency: 93,
    },
  };
}

// 创建对比
function createComparison(data: {
  name: string;
  type: "period" | "mood" | "growth";
  config: Record<string, any>;
}) {
  const newComparison = {
    id: comparisons.length + 1,
    name: data.name,
    type: data.type,
    createdAt: new Date().toISOString().split("T")[0],
    insight: "新创建的对比",
    data: data.config,
  };
  
  comparisons.push(newComparison);
  return newComparison;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action") || "list";
  
  if (action === "list") {
    return NextResponse.json({
      success: true,
      data: comparisons,
    });
  }
  
  if (action === "get") {
    const id = parseInt(searchParams.get("id") || "1");
    const comparison = comparisons.find(c => c.id === id);
    if (!comparison) {
      return NextResponse.json({ success: false, error: "对比不存在" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: comparison });
  }
  
  if (action === "period") {
    const startA = searchParams.get("startA") || "2026-01-01";
    const endA = searchParams.get("endA") || "2026-01-31";
    const startB = searchParams.get("startB") || "2026-02-01";
    const endB = searchParams.get("endB") || "2026-02-28";
    
    return NextResponse.json({
      success: true,
      data: comparePeriods(startA, endA, startB, endB),
    });
  }
  
  if (action === "mood") {
    const moodA = searchParams.get("moodA") || "calm";
    const moodB = searchParams.get("moodB") || "happy";
    
    return NextResponse.json({
      success: true,
      data: compareMoods(moodA, moodB),
    });
  }
  
  if (action === "growth") {
    return NextResponse.json({
      success: true,
      data: getGrowthComparison(),
    });
  }
  
  return NextResponse.json({
    success: false,
    error: "未知操作",
  }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, ...data } = body;
  
  if (action === "create") {
    const comparison = createComparison(data);
    return NextResponse.json({
      success: true,
      data: comparison,
      message: "对比创建成功",
    });
  }
  
  return NextResponse.json({
    success: false,
    error: "未知操作",
  }, { status: 400 });
}