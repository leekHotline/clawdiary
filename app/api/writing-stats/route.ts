import { NextRequest, NextResponse } from "next/server";

// 模拟写作统计数据
const writingStats = {
  // 总体概览
  overview: {
    totalEntries: 73,
    totalWords: 156420,
    totalChars: 234650,
    avgWordsPerEntry: 2143,
    streakDays: 45,
    longestStreak: 62,
    writingDays: 68,
    firstEntry: "2025-12-01",
    lastEntry: "2026-03-12",
  },
  
  // 本月数据
  thisMonth: {
    entries: 12,
    words: 28750,
    avgWords: 2396,
    bestDay: "2026-03-10",
    bestDayWords: 4521,
    improvement: 15,
  },
  
  // 每周模式
  weeklyPattern: [
    { day: "周一", dayOfWeek: 1, entries: 8, avgWords: 1820, percentage: 12 },
    { day: "周二", dayOfWeek: 2, entries: 10, avgWords: 2156, percentage: 14 },
    { day: "周三", dayOfWeek: 3, entries: 12, avgWords: 2345, percentage: 16 },
    { day: "周四", dayOfWeek: 4, entries: 14, avgWords: 2589, percentage: 19 },
    { day: "周五", dayOfWeek: 5, entries: 11, avgWords: 2234, percentage: 15 },
    { day: "周六", dayOfWeek: 6, entries: 9, avgWords: 1987, percentage: 12 },
    { day: "周日", dayOfWeek: 0, entries: 9, avgWords: 1765, percentage: 12 },
  ],
  
  // 时间分布
  timeDistribution: [
    { hour: "6-8", label: "清晨", entries: 5, percentage: 7, avgWords: 1650 },
    { hour: "8-12", label: "上午", entries: 18, percentage: 25, avgWords: 2340 },
    { hour: "12-14", label: "午间", entries: 8, percentage: 11, avgWords: 1890 },
    { hour: "14-18", label: "下午", entries: 15, percentage: 21, avgWords: 2156 },
    { hour: "18-22", label: "晚间", entries: 22, percentage: 30, avgWords: 2450 },
    { hour: "22-6", label: "深夜", entries: 5, percentage: 7, avgWords: 1230 },
  ],
  
  // 月度趋势
  monthlyTrend: [
    { month: "2025-12", words: 28000, entries: 13, avgWords: 2154 },
    { month: "2026-01", words: 28500, entries: 13, avgWords: 2192 },
    { month: "2026-02", words: 32100, entries: 15, avgWords: 2140 },
    { month: "2026-03", words: 28750, entries: 12, avgWords: 2396 },
  ],
  
  // 热门标签
  topTags: [
    { tag: "AI", count: 28, avgWords: 2450 },
    { tag: "系统", count: 24, avgWords: 2230 },
    { tag: "功能", count: 21, avgWords: 2180 },
    { tag: "优化", count: 18, avgWords: 2340 },
    { tag: "日记", count: 15, avgWords: 1890 },
    { tag: "学习", count: 12, avgWords: 2560 },
    { tag: "项目", count: 10, avgWords: 2100 },
    { tag: "成长", count: 8, avgWords: 1980 },
  ],
  
  // 字数分布
  wordDistribution: [
    { range: "0-500", count: 8, label: "简短", percentage: 11 },
    { range: "500-1000", count: 15, label: "适中", percentage: 21 },
    { range: "1000-2000", count: 25, label: "详细", percentage: 34 },
    { range: "2000-3000", count: 18, label: "深度", percentage: 25 },
    { range: "3000+", count: 7, label: "长篇", percentage: 10 },
  ],
  
  // 心情关联
  moodCorrelation: [
    { mood: "开心", avgWords: 2890, entries: 18, color: "#fbbf24" },
    { mood: "满足", avgWords: 2456, entries: 22, color: "#34d399" },
    { mood: "平静", avgWords: 1823, entries: 15, color: "#60a5fa" },
    { mood: "疲惫", avgWords: 1234, entries: 8, color: "#9ca3af" },
    { mood: "焦虑", avgWords: 987, entries: 5, color: "#f87171" },
    { mood: "兴奋", avgWords: 3210, entries: 5, color: "#a78bfa" },
  ],
  
  // 写作连贯性
  consistency: {
    streaks: [
      { start: "2026-01-05", end: "2026-02-06", days: 32 },
      { start: "2026-02-10", end: "2026-03-12", days: 31 },
    ],
    avgGap: 0.5,
    longestGap: 3,
    writingDaysPercentage: 93,
  },
  
  // 成长指标
  growthMetrics: {
    wordGrowthRate: 12, // 每月增长百分比
    consistencyScore: 89,
    qualityScore: 85,
    diversityScore: 78,
  },
};

// 计算洞察
function generateInsights() {
  return [
    {
      type: "pattern",
      icon: "📊",
      title: "写作黄金时段",
      desc: "你最喜欢在晚间(18-22点)写作，占全部日记的30%",
      action: "保持这个习惯",
      priority: "high",
    },
    {
      type: "improvement",
      icon: "📈",
      title: "字数增长中",
      desc: "本月平均字数2396字，比上月增长15%",
      action: "继续保持",
      priority: "medium",
    },
    {
      type: "suggestion",
      icon: "💡",
      title: "周末有空闲",
      desc: "周末写作量较少，可以考虑安排深度写作时间",
      action: "设置提醒",
      priority: "low",
    },
    {
      type: "milestone",
      icon: "🏆",
      title: "即将达成",
      desc: "再写27篇就达成「百篇日记」成就！",
      action: "继续加油",
      priority: "medium",
    },
    {
      type: "pattern",
      icon: "🎯",
      title: "高产日分析",
      desc: "周四是你写作最活跃的一天，平均2589字",
      action: "保持节奏",
      priority: "high",
    },
    {
      type: "correlation",
      icon: "❤️",
      title: "心情-字数关联",
      desc: "开心时写作字数最多(平均2890字)，焦虑时最少",
      action: "保持好心情",
      priority: "medium",
    },
  ];
}

// 计算成就
function getAchievements() {
  return [
    {
      id: 1,
      name: "新手作者",
      desc: "写第一篇日记",
      unlocked: true,
      date: "2025-12-01",
      icon: "✍️",
    },
    {
      id: 2,
      name: "坚持7天",
      desc: "连续写作7天",
      unlocked: true,
      date: "2025-12-08",
      icon: "🔥",
    },
    {
      id: 3,
      name: "字数破万",
      desc: "累计写作超过1万字",
      unlocked: true,
      date: "2025-12-20",
      icon: "📝",
    },
    {
      id: 4,
      name: "坚持30天",
      desc: "连续写作30天",
      unlocked: true,
      date: "2026-01-05",
      icon: "💪",
    },
    {
      id: 5,
      name: "字数十万",
      desc: "累计写作超过10万字",
      unlocked: true,
      date: "2026-02-28",
      icon: "🎯",
    },
    {
      id: 6,
      name: "坚持60天",
      desc: "连续写作60天",
      unlocked: true,
      date: "2026-03-04",
      icon: "🌟",
    },
    {
      id: 7,
      name: "百篇日记",
      desc: "写作100篇日记",
      unlocked: false,
      progress: 73,
      icon: "📚",
    },
    {
      id: 8,
      name: "百万字",
      desc: "累计写作超过100万字",
      unlocked: false,
      progress: 15.6,
      icon: "💎",
    },
  ];
}

// 获取建议
function getSuggestions() {
  return [
    {
      type: "timing",
      title: "优化写作时间",
      suggestion: "尝试在早晨6-8点写作15分钟，可能带来更好的创意",
      reason: "清晨大脑最清醒，适合创意写作",
    },
    {
      type: "length",
      title: "字数建议",
      suggestion: "可以尝试写一些更长的深度文章",
      reason: "你目前的平均字数2143字，还有提升空间",
    },
    {
      type: "consistency",
      title: "保持连贯",
      suggestion: "设置每日固定时间写作提醒",
      reason: "规律写作有助于养成习惯",
    },
    {
      type: "variety",
      title: "丰富主题",
      suggestion: "尝试更多不同类型的日记模板",
      reason: "使用模板可以激发新的写作灵感",
    },
  ];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") || "overview";
  
  switch (type) {
    case "overview":
      return NextResponse.json({
        success: true,
        data: writingStats.overview,
      });
      
    case "thisMonth":
      return NextResponse.json({
        success: true,
        data: writingStats.thisMonth,
      });
      
    case "weekly":
      return NextResponse.json({
        success: true,
        data: writingStats.weeklyPattern,
      });
      
    case "time":
      return NextResponse.json({
        success: true,
        data: writingStats.timeDistribution,
      });
      
    case "monthly":
      return NextResponse.json({
        success: true,
        data: writingStats.monthlyTrend,
      });
      
    case "tags":
      return NextResponse.json({
        success: true,
        data: writingStats.topTags,
      });
      
    case "distribution":
      return NextResponse.json({
        success: true,
        data: writingStats.wordDistribution,
      });
      
    case "mood":
      return NextResponse.json({
        success: true,
        data: writingStats.moodCorrelation,
      });
      
    case "consistency":
      return NextResponse.json({
        success: true,
        data: writingStats.consistency,
      });
      
    case "growth":
      return NextResponse.json({
        success: true,
        data: writingStats.growthMetrics,
      });
      
    case "insights":
      return NextResponse.json({
        success: true,
        data: generateInsights(),
      });
      
    case "achievements":
      return NextResponse.json({
        success: true,
        data: getAchievements(),
      });
      
    case "suggestions":
      return NextResponse.json({
        success: true,
        data: getSuggestions(),
      });
      
    case "all":
      return NextResponse.json({
        success: true,
        data: writingStats,
      });
      
    default:
      return NextResponse.json({
        success: true,
        data: writingStats.overview,
      });
  }
}