import { NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// 日记统计图表数据 API
export async function GET() {
  const diaries = await getDiaries();
  
  // 字数分布
  const wordDistribution = {
    "0-500": 0,
    "500-1000": 0,
    "1000-2000": 0,
    "2000-5000": 0,
    "5000+": 0,
  };
  
  diaries.forEach(d => {
    const words = d.content.length;
    if (words < 500) wordDistribution["0-500"]++;
    else if (words < 1000) wordDistribution["500-1000"]++;
    else if (words < 2000) wordDistribution["1000-2000"]++;
    else if (words < 5000) wordDistribution["2000-5000"]++;
    else wordDistribution["5000+"]++;
  });
  
  // 标签词云数据
  const tagCloud = new Map<string, number>();
  diaries.forEach(d => {
    (d.tags || []).forEach(tag => {
      tagCloud.set(tag, (tagCloud.get(tag) || 0) + 1);
    });
  });
  
  // 时间分布（24小时，基于 createdAt）
  const hourlyDistribution = new Array(24).fill(0);
  diaries.forEach(d => {
    const date = new Date(d.createdAt || d.date);
    const hour = date.getHours();
    hourlyDistribution[hour]++;
  });
  
  // 星期分布
  const weekdayDistribution = new Array(7).fill(0);
  const weekdayNames = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  diaries.forEach(d => {
    const date = new Date(d.date);
    const weekday = date.getDay();
    weekdayDistribution[weekday]++;
  });
  
  // 情绪关键词分析
  const emotionKeywords = {
    positive: ["开心", "快乐", "成功", "完成", "进步", "成长", "学习", "庆祝", "里程碑", "突破"],
    negative: ["失败", "问题", "错误", "教训", "复盘", "修复", "困难", "挑战"],
    neutral: ["今天", "功能", "更新", "系统", "API", "页面"],
  };
  
  const emotionCounts = { positive: 0, negative: 0, neutral: 0 };
  diaries.forEach(d => {
    const content = d.content.toLowerCase();
    emotionKeywords.positive.forEach(kw => {
      if (content.includes(kw)) emotionCounts.positive++;
    });
    emotionKeywords.negative.forEach(kw => {
      if (content.includes(kw)) emotionCounts.negative++;
    });
    emotionKeywords.neutral.forEach(kw => {
      if (content.includes(kw)) emotionCounts.neutral++;
    });
  });
  
  // 成长曲线（按月份累计）
  const growthCurve: { month: string; total: number; cumulative: number }[] = [];
  const monthlyCounts = new Map<string, number>();
  
  diaries.forEach(d => {
    const month = d.date.substring(0, 7);
    monthlyCounts.set(month, (monthlyCounts.get(month) || 0) + 1);
  });
  
  const sortedMonths = [...monthlyCounts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  let cumulative = 0;
  sortedMonths.forEach(([month, count]) => {
    cumulative += count;
    growthCurve.push({ month, total: count, cumulative });
  });
  
  // 作者贡献
  const authorContribution = new Map<string, { count: number; words: number }>();
  diaries.forEach(d => {
    const author = d.authorName || (d.author === "AI" ? "太空龙虾" : d.author);
    const existing = authorContribution.get(author) || { count: 0, words: 0 };
    existing.count++;
    existing.words += d.content.length;
    authorContribution.set(author, existing);
  });
  
  // 热门时间段
  const peakHours = hourlyDistribution
    .map((count, hour) => ({ hour, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(h => ({ ...h, label: `${h.hour}:00` }));
  
  return NextResponse.json({
    wordDistribution,
    tagCloud: [...tagCloud.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 30),
    hourlyDistribution: hourlyDistribution.map((count, hour) => ({ hour, count })),
    weekdayDistribution: weekdayDistribution.map((count, day) => ({ 
      day, 
      name: weekdayNames[day], 
      count 
    })),
    emotionCounts,
    growthCurve,
    authorContribution: [...authorContribution.entries()]
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count),
    peakHours,
    totalStats: {
      totalDiaries: diaries.length,
      totalWords: diaries.reduce((sum, d) => sum + d.content.length, 0),
      avgWords: diaries.length > 0 
        ? Math.round(diaries.reduce((sum, d) => sum + d.content.length, 0) / diaries.length)
        : 0,
      avgTagsPerDiary: diaries.length > 0
        ? Math.round(diaries.reduce((sum, d) => sum + (d.tags?.length || 0), 0) / diaries.length * 10) / 10
        : 0,
    },
  });
}