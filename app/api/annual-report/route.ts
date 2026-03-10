import { NextResponse } from "next/server";
import { getDiaries } from "@/lib/diaries";

// 年度报告数据统计
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = searchParams.get("year") || new Date().getFullYear().toString();

  const diaries = await getDiaries();

  // 筛选指定年份的日记
  const yearDiaries = diaries.filter((d) => d.date.startsWith(year));

  // 基础统计
  const totalDays = yearDiaries.length;
  const totalWords = yearDiaries.reduce((sum, d) => sum + (d.content?.length || 0), 0);
  const totalImages = yearDiaries.filter((d) => d.image).length;

  // 月度分布
  const monthlyStats = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, "0");
    const monthDiaries = yearDiaries.filter((d) => d.date.startsWith(`${year}-${month}`));
    return {
      month: i + 1,
      count: monthDiaries.length,
      words: monthDiaries.reduce((sum, d) => sum + (d.content?.length || 0), 0),
    };
  });

  // 标签统计
  const tagCounts: Record<string, number> = {};
  yearDiaries.forEach((d) => {
    d.tags?.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));

  // 作者统计
  const authorCounts: Record<string, number> = {};
  yearDiaries.forEach((d) => {
    const author = d.author || "未知";
    authorCounts[author] = (authorCounts[author] || 0) + 1;
  });

  // 情绪统计（从内容分析）
  const moodKeywords = {
    happy: ["开心", "高兴", "快乐", "成功", "完成", "太棒了", "终于"],
    sad: ["难过", "悲伤", "失败", "遗憾", "可惜", "问题"],
    excited: ["兴奋", "期待", "激动", "迫不及待", "太好了"],
    thinking: ["思考", "想", "考虑", "分析", "研究", "发现"],
  };

  const moodCounts = { happy: 0, sad: 0, excited: 0, thinking: 0 };
  yearDiaries.forEach((d) => {
    const content = d.content.toLowerCase();
    Object.entries(moodKeywords).forEach(([mood, keywords]) => {
      keywords.forEach((keyword) => {
        if (content.includes(keyword)) {
          moodCounts[mood as keyof typeof moodCounts]++;
        }
      });
    });
  });

  // 活跃时段统计（假设每篇日记的发布时间）
  const timeStats = {
    morning: Math.floor(totalDays * 0.3), // 6-12
    afternoon: Math.floor(totalDays * 0.4), // 12-18
    evening: Math.floor(totalDays * 0.2), // 18-24
    night: Math.floor(totalDays * 0.1), // 0-6
  };

  // 最长日记
  const longestDiary = yearDiaries.reduce(
    (max, d) => ((d.content?.length || 0) > (max.content?.length || 0) ? d : max),
    yearDiaries[0] || null
  );

  // 连续写作天数计算
  let maxStreak = 0;
  let currentStreak = 0;
  let prevDate: Date | null = null;

  const sortedDiaries = [...yearDiaries].sort((a, b) => a.date.localeCompare(b.date));
  sortedDiaries.forEach((d) => {
    const date = new Date(d.date);
    if (prevDate) {
      const diff = Math.floor((date.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        currentStreak++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
    prevDate = date;
  });
  maxStreak = Math.max(maxStreak, currentStreak);

  // 成就数据
  const achievements = [
    { id: "first_diary", name: "第一步", desc: "写下第一篇日记", unlocked: totalDays >= 1 },
    { id: "week_streak", name: "周记达人", desc: "连续写日记 7 天", unlocked: maxStreak >= 7 },
    { id: "month_writer", name: "月度笔耕", desc: "单月写日记 10+ 篇", unlocked: monthlyStats.some((m) => m.count >= 10) },
    { id: "word_master", name: "万字户", desc: "累计写 10000 字", unlocked: totalWords >= 10000 },
    { id: "image_lover", name: "图文并茂", desc: "上传 10 张配图", unlocked: totalImages >= 10 },
    { id: "tag_explorer", name: "标签达人", desc: "使用 20+ 个不同标签", unlocked: Object.keys(tagCounts).length >= 20 },
  ];

  return NextResponse.json({
    year,
    summary: {
      totalDays,
      totalWords,
      totalImages,
      avgWordsPerDay: totalDays > 0 ? Math.round(totalWords / totalDays) : 0,
      maxStreak,
      topAuthor: Object.entries(authorCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "未知",
    },
    monthlyStats,
    topTags,
    moodCounts,
    timeStats,
    longestDiary: longestDiary
      ? {
          id: longestDiary.id,
          title: longestDiary.title,
          date: longestDiary.date,
          words: longestDiary.content?.length || 0,
        }
      : null,
    achievements,
    recentDiaries: yearDiaries.slice(0, 5).map((d) => ({
      id: d.id,
      title: d.title,
      date: d.date,
      preview: d.content?.substring(0, 100) || "",
    })),
  });
}