"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Diary {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  mood?: string;
  energy?: number;
  productivity?: number;
  wordCount?: number;
}

interface MonthAnalysis {
  year: number;
  month: number;
  totalEntries: number;
  totalWords: number;
  avgEnergy: number;
  avgProductivity: number;
  streakDays: number;
  topTags: { tag: string; count: number }[];
  moodDistribution: { mood: string; count: number; emoji: string }[];
  weeklyTrend: { week: number; entries: number; words: number }[];
  dailyActivity: { date: string; count: number; intensity: number }[];
  highlights: string[];
  insights: string[];
  growthAreas: string[];
  nextMonthSuggestions: string[];
  monthlyScore: number;
  bestDay: { date: string; title: string } | null;
  longestEntry: { date: string; title: string; words: number } | null;
}

// 心情表情映射
const moodEmojiMap: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  excited: "🤩",
  calm: "😌",
  anxious: "😰",
  angry: "😤",
  grateful: "🙏",
  neutral: "😐",
  love: "❤️",
  tired: "😴",
};

export default function MonthlyReportPage() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [analysis, setAnalysis] = useState<MonthAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);

  useEffect(() => {
    fetchDiaries();
  }, []);

  useEffect(() => {
    if (diaries.length > 0) {
      analyzeMonth();
    }
  }, [selectedMonth, diaries]);

  const fetchDiaries = async () => {
    try {
      const res = await fetch("/api/diaries");
      const allDiaries: Diary[] = await res.json();
      setDiaries(allDiaries);

      // 获取可用月份列表
      const months = new Set<string>();
      allDiaries.forEach((d) => {
        const month = d.date.substring(0, 7);
        months.add(month);
      });
      setAvailableMonths(Array.from(months).sort().reverse());
    } catch (error) {
      console.error("Failed to fetch diaries:", error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeMonth = () => {
    const [year, month] = selectedMonth.split("-").map(Number);
    
    // 筛选当月日记
    const monthDiaries = diaries.filter((d) => {
      const dDate = new Date(d.date);
      return dDate.getFullYear() === year && dDate.getMonth() + 1 === month;
    });

    if (monthDiaries.length === 0) {
      setAnalysis(null);
      return;
    }

    // 基础统计
    const totalWords = monthDiaries.reduce(
      (sum, d) => sum + (d.wordCount || d.content?.length || 0),
      0
    );
    const avgEnergy =
      monthDiaries
        .filter((d) => d.energy)
        .reduce((sum, d) => sum + (d.energy || 0), 0) /
        monthDiaries.filter((d) => d.energy).length || 0;
    const avgProductivity =
      monthDiaries
        .filter((d) => d.productivity)
        .reduce((sum, d) => sum + (d.productivity || 0), 0) /
        monthDiaries.filter((d) => d.productivity).length || 0;

    // 连续记录天数
    const dates = [
      ...new Set(monthDiaries.map((d) => d.date)),
    ].sort();
    let maxStreak = 1;
    let currentStreak = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diffDays = Math.floor(
        (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }

    // 标签分析
    const tagCounts: Record<string, number> = {};
    monthDiaries.forEach((d) => {
      d.tags?.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    const topTags = Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // 心情分布
    const moodCounts: Record<string, number> = {};
    monthDiaries
      .filter((d) => d.mood)
      .forEach((d) => {
        moodCounts[d.mood!] = (moodCounts[d.mood!] || 0) + 1;
      });
    const moodDistribution = Object.entries(moodCounts)
      .map(([mood, count]) => ({
        mood,
        count,
        emoji: moodEmojiMap[mood] || "📝",
      }))
      .sort((a, b) => b.count - a.count);

    // 周趋势
    const weekData: Record<number, { entries: number; words: number }> = {};
    monthDiaries.forEach((d) => {
      const date = new Date(d.date);
      const weekNum = Math.ceil(date.getDate() / 7);
      if (!weekData[weekNum]) weekData[weekNum] = { entries: 0, words: 0 };
      weekData[weekNum].entries++;
      weekData[weekNum].words += d.wordCount || d.content?.length || 0;
    });
    const weeklyTrend = Object.entries(weekData)
      .map(([week, data]) => ({ week: Number(week), ...data }))
      .sort((a, b) => a.week - b.week);

    // 每日活动热力图
    const daysInMonth = new Date(year, month, 0).getDate();
    const dailyActivity = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayDiaries = monthDiaries.filter((d) => d.date === dateStr);
      const count = dayDiaries.length;
      const words = dayDiaries.reduce(
        (sum, d) => sum + (d.wordCount || d.content?.length || 0),
        0
      );
      return {
        date: dateStr,
        count,
        intensity: Math.min(count * 25 + Math.min(words / 50, 25), 100),
      };
    });

    // 高亮日记
    const highlights = monthDiaries
      .filter((d) => (d.energy || 0) >= 8 || (d.productivity || 0) >= 8)
      .map((d) => d.title)
      .slice(0, 3);

    // 最长日记
    const longestEntry = monthDiaries.reduce(
      (max, d) => {
        const words = d.wordCount || d.content?.length || 0;
        if (words > max.words) {
          return { date: d.date, title: d.title, words };
        }
        return max;
      },
      { date: "", title: "", words: 0 }
    );

    // 最佳日记（综合评分）
    const bestDay = monthDiaries.reduce(
      (best, d) => {
        const score =
          (d.energy || 5) * 0.4 +
          (d.productivity || 5) * 0.3 +
          (d.wordCount || d.content?.length || 0) / 100 * 0.3;
        if (score > best.score) {
          return { date: d.date, title: d.title, score };
        }
        return best;
      },
      { date: "", title: "", score: 0 }
    );

    // 生成洞察
    const insights = generateInsights(
      monthDiaries,
      totalWords,
      avgEnergy,
      avgProductivity,
      maxStreak,
      topTags
    );

    // 成长领域
    const growthAreas = identifyGrowthAreas(
      monthDiaries,
      avgEnergy,
      avgProductivity,
      topTags
    );

    // 下月建议
    const nextMonthSuggestions = generateSuggestions(
      monthDiaries.length,
      totalWords,
      maxStreak,
      avgEnergy,
      growthAreas
    );

    // 月度评分
    const monthlyScore = calculateMonthlyScore(
      monthDiaries.length,
      totalWords,
      maxStreak,
      avgEnergy,
      avgProductivity
    );

    setAnalysis({
      year,
      month,
      totalEntries: monthDiaries.length,
      totalWords,
      avgEnergy: Math.round(avgEnergy * 10) / 10,
      avgProductivity: Math.round(avgProductivity * 10) / 10,
      streakDays: maxStreak,
      topTags,
      moodDistribution,
      weeklyTrend,
      dailyActivity,
      highlights,
      insights,
      growthAreas,
      nextMonthSuggestions,
      monthlyScore,
      bestDay: bestDay.title ? { date: bestDay.date, title: bestDay.title } : null,
      longestEntry: longestEntry.words > 0 ? longestEntry : null,
    });
  };

  const generateInsights = (
    diaries: Diary[],
    words: number,
    energy: number,
    productivity: number,
    streak: number,
    tags: { tag: string; count: number }[]
  ): string[] => {
    const insights: string[] = [];

    // 记录频率洞察
    if (diaries.length >= 20) {
      insights.push(
        `🎯 记录达人！本月写了 ${diaries.length} 篇日记，坚持就是胜利！`
      );
    } else if (diaries.length >= 10) {
      insights.push(
        `📈 稳步前行，本月 ${diaries.length} 篇日记记录了你的成长轨迹。`
      );
    } else if (diaries.length >= 5) {
      insights.push(
        `🌱 良好的开端，本月 ${diaries.length} 篇日记，继续加油！`
      );
    } else {
      insights.push(
        `💡 本月记录了 ${diaries.length} 篇日记，下个月可以尝试更频繁地记录。`
      );
    }

    // 连续性洞察
    if (streak >= 7) {
      insights.push(
        `🔥 连续记录 ${streak} 天！这种专注力是成功的关键。`
      );
    } else if (streak >= 3) {
      insights.push(
        `✨ 最长连续记录 ${streak} 天，保持这个势头！`
      );
    }

    // 内容深度洞察
    const avgWords = Math.round(words / diaries.length);
    if (avgWords >= 500) {
      insights.push(
        `📝 平均每篇 ${avgWords} 字，你的记录很有深度！`
      );
    } else if (avgWords >= 200) {
      insights.push(
        `✍️ 平均每篇 ${avgWords} 字，详细记录生活点滴。`
      );
    }

    // 能量洞察
    if (energy >= 7) {
      insights.push(`⚡ 本月平均能量 ${energy}，状态积极向上！`);
    } else if (energy >= 5) {
      insights.push(`🔋 本月平均能量 ${energy}，稳中有进。`);
    } else if (energy > 0) {
      insights.push(
        `🌙 本月能量偏低(${energy})，关注自我关怀很重要。`
      );
    }

    // 主题洞察
    if (tags.length > 0) {
      insights.push(
        `🏷️ 本月关注「${tags
          .slice(0, 3)
          .map((t) => t.tag)
          .join("、")}」等主题。`
      );
    }

    return insights;
  };

  const identifyGrowthAreas = (
    diaries: Diary[],
    energy: number,
    productivity: number,
    tags: { tag: string; count: number }[]
  ): string[] => {
    const areas: string[] = [];

    if (energy > 0 && energy < 5) {
      areas.push("能量管理：关注身心健康，增加运动和休息");
    }
    if (productivity > 0 && productivity < 5) {
      areas.push("专注力提升：尝试番茄工作法，减少干扰");
    }
    if (diaries.length < 10) {
      areas.push("记录习惯：设定每日提醒，培养写作习惯");
    }
    if (tags.length < 3) {
      areas.push("主题探索：尝试从不同角度记录生活");
    }

    if (areas.length === 0) {
      areas.push("继续保持：你在正确的轨道上前进！");
    }

    return areas;
  };

  const generateSuggestions = (
    entries: number,
    words: number,
    streak: number,
    energy: number,
    growthAreas: string[]
  ): string[] => {
    const suggestions: string[] = [];

    if (entries < 15) {
      suggestions.push("📅 设定每日固定时间写日记，养成习惯");
    }
    if (words < 3000) {
      suggestions.push("✍️ 尝试写得更详细些，记录过程和感受");
    }
    if (streak < 5) {
      suggestions.push("🔥 挑战连续7天记录，培养坚持力");
    }
    if (energy > 0 && energy < 6) {
      suggestions.push("🧘 加入情绪追踪，关注能量变化规律");
    }

    suggestions.push("📊 每周回顾一次，整理收获和反思");
    suggestions.push("🎯 设定下个月的记录目标");

    return suggestions.slice(0, 5);
  };

  const calculateMonthlyScore = (
    entries: number,
    words: number,
    streak: number,
    energy: number,
    productivity: number
  ): number => {
    let score = 0;

    // 记录频率 (最高35分)
    score += Math.min(entries * 1.5, 35);

    // 内容深度 (最高25分)
    score += Math.min(words / 200, 25);

    // 连续性 (最高20分)
    score += Math.min(streak * 2, 20);

    // 能量贡献 (最高10分)
    if (energy > 0) score += Math.round(energy);

    // 生产力贡献 (最高10分)
    if (productivity > 0) score += Math.round(productivity);

    return Math.min(Math.round(score), 100);
  };

  const getMonthName = (month: number) => {
    const months = [
      "一月", "二月", "三月", "四月", "五月", "六月",
      "七月", "八月", "九月", "十月", "十一月", "十二月",
    ];
    return months[month - 1];
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-emerald-500 via-green-500 to-teal-500";
    if (score >= 60) return "from-blue-500 via-indigo-500 to-purple-500";
    if (score >= 40) return "from-amber-500 via-orange-500 to-yellow-500";
    return "from-gray-400 via-slate-400 to-zinc-400";
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 80) return "🏆";
    if (score >= 60) return "🌟";
    if (score >= 40) return "💪";
    return "🌱";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">📊</div>
          <p className="text-gray-500">正在分析月度数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-rose-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-5xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
            >
              ← 返回首页
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">📊 月度总结报告</h1>
            <p className="text-gray-500 mt-1">回顾成长轨迹，发现更好的自己</p>
          </div>

          {/* 月份选择 */}
          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 bg-white/70 backdrop-blur-sm border border-orange-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
            >
              {availableMonths.length > 0 ? (
                availableMonths.map((m) => (
                  <option key={m} value={m}>
                    {getMonthName(Number(m.split("-")[1]))} {m.split("-")[0]}
                  </option>
                ))
              ) : (
                <option value={selectedMonth}>
                  {getMonthName(Number(selectedMonth.split("-")[1]))}
                </option>
              )}
            </select>
          </div>
        </div>

        {analysis ? (
          <>
            {/* 月度评分卡片 */}
            <div
              className={`bg-gradient-to-br ${getScoreGradient(
                analysis.monthlyScore
              )} rounded-2xl p-8 mb-8 text-white shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">
                    {analysis.year}年{getMonthName(analysis.month)}成长评分
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-7xl font-bold">
                      {analysis.monthlyScore}
                    </span>
                    <span className="text-2xl text-white/70">/ 100</span>
                  </div>
                  <p className="text-white/90 mt-3 text-lg">
                    {getScoreEmoji(analysis.monthlyScore)}{" "}
                    {analysis.monthlyScore >= 60
                      ? "这个月很棒！继续保持！"
                      : "每一次记录都是进步，继续加油！"}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-6xl opacity-30">📊</div>
                  <p className="text-white/70 text-sm mt-2">
                    连续记录 {analysis.streakDays} 天
                  </p>
                </div>
              </div>
            </div>

            {/* 核心指标 */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
                <div className="text-3xl font-bold text-amber-600">
                  {analysis.totalEntries}
                </div>
                <div className="text-sm text-gray-500 mt-1">📝 日记数</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
                <div className="text-3xl font-bold text-orange-600">
                  {(analysis.totalWords / 1000).toFixed(1)}k
                </div>
                <div className="text-sm text-gray-500 mt-1">📚 总字数</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
                <div className="text-3xl font-bold text-rose-600">
                  {analysis.streakDays}
                </div>
                <div className="text-sm text-gray-500 mt-1">🔥 连续天数</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
                <div className="text-3xl font-bold text-purple-600">
                  {analysis.avgEnergy || "-"}
                </div>
                <div className="text-sm text-gray-500 mt-1">⚡ 平均能量</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm">
                <div className="text-3xl font-bold text-blue-600">
                  {analysis.avgProductivity || "-"}
                </div>
                <div className="text-sm text-gray-500 mt-1">🎯 平均生产力</div>
              </div>
            </div>

            {/* 热力图 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🗓️</span> 本月活动热力图
              </h2>
              <div className="grid grid-cols-7 gap-1">
                {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs text-gray-400 py-1"
                  >
                    {day}
                  </div>
                ))}
                {/* 第一周空白填充 */}
                {Array.from(
                  { length: new Date(analysis.year, analysis.month - 1, 1).getDay() },
                  (_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  )
                )}
                {/* 日期格子 */}
                {analysis.dailyActivity.map((day, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-md flex items-center justify-center text-xs font-medium transition-all hover:scale-110 cursor-pointer"
                    style={{
                      backgroundColor:
                        day.intensity > 0
                          ? `rgba(251, 146, 60, ${day.intensity / 100})`
                          : "rgba(0,0,0,0.03)",
                      color:
                        day.intensity > 50
                          ? "white"
                          : day.intensity > 0
                          ? "#92400e"
                          : "#d1d5db",
                    }}
                    title={`${day.date}: ${day.count} 篇日记`}
                  >
                    {new Date(day.date).getDate()}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-end gap-2 mt-3 text-xs text-gray-400">
                <span>少</span>
                <div className="flex gap-1">
                  {[0, 25, 50, 75, 100].map((intensity) => (
                    <div
                      key={intensity}
                      className="w-4 h-4 rounded"
                      style={{
                        backgroundColor: `rgba(251, 146, 60, ${intensity / 100})`,
                      }}
                    />
                  ))}
                </div>
                <span>多</span>
              </div>
            </div>

            {/* 洞察与建议 */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* 月度洞察 */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>💡</span> 月度洞察
                </h2>
                <div className="space-y-3">
                  {analysis.insights.map((insight, i) => (
                    <div key={i} className="flex gap-3 text-sm text-gray-600">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span>{insight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 下月建议 */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🎯</span> 下月行动建议
                </h2>
                <div className="space-y-3">
                  {analysis.nextMonthSuggestions.map((suggestion, i) => (
                    <div key={i} className="flex gap-3 text-sm text-gray-600">
                      <span className="text-orange-500 mt-0.5">{i + 1}.</span>
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 标签与心情 */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* 热门标签 */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🏷️</span> 关注主题
                </h2>
                {analysis.topTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysis.topTags.map((item, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-sm font-medium"
                      >
                        #{item.tag}{" "}
                        <span className="text-amber-500">×{item.count}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">暂无标签数据</p>
                )}
              </div>

              {/* 心情分布 */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>😊</span> 心情分布
                </h2>
                {analysis.moodDistribution.length > 0 ? (
                  <div className="space-y-2">
                    {analysis.moodDistribution.slice(0, 6).map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-xl">{item.emoji}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-amber-400 to-orange-400 h-3 rounded-full"
                            style={{
                              width: `${
                                (item.count / analysis.totalEntries) * 100
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 w-8">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">暂无心情数据</p>
                )}
              </div>
            </div>

            {/* 周趋势 */}
            {analysis.weeklyTrend.length > 0 && (
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📈</span> 周趋势
                </h2>
                <div className="flex items-end justify-around h-40 gap-2">
                  {analysis.weeklyTrend.map((week, i) => {
                    const maxEntries = Math.max(
                      ...analysis.weeklyTrend.map((w) => w.entries)
                    );
                    const height = (week.entries / (maxEntries || 1)) * 100;
                    return (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div
                          className="w-12 bg-gradient-to-t from-amber-500 to-orange-400 rounded-t-lg transition-all hover:from-amber-400 hover:to-orange-300"
                          style={{ height: `${Math.max(height, 10)}%` }}
                        />
                        <span className="text-xs text-gray-500">
                          第{week.week}周
                        </span>
                        <span className="text-xs font-bold text-amber-600">
                          {week.entries}篇
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 特别记录 */}
            <div className="grid md:grid-cols-2 gap-6">
              {analysis.longestEntry && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <span>📝</span> 最长日记
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">
                    {analysis.longestEntry.title}
                  </p>
                  <p className="text-xs text-gray-400">
                    {analysis.longestEntry.date} · {analysis.longestEntry.words} 字
                  </p>
                </div>
              )}
              {analysis.bestDay && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
                  <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <span>⭐</span> 最佳日记
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">
                    {analysis.bestDay.title}
                  </p>
                  <p className="text-xs text-gray-400">{analysis.bestDay.date}</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-2xl">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-xl font-bold text-gray-600 mb-2">
              这个月还没有日记
            </h2>
            <p className="text-gray-400 mb-6">
              开始记录你的成长，下个月就能看到总结报告了！
            </p>
            <Link
              href="/chat-diary"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors"
            >
              <span>✍️</span> 开始写日记
            </Link>
          </div>
        )}

        {/* 相关入口 */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <Link
            href="/weekly-reflection"
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 hover:bg-white/90 transition-colors text-center"
          >
            <span className="text-2xl block mb-1">📊</span>
            <span className="text-sm text-gray-600">周复盘</span>
          </Link>
          <Link
            href="/heatmap"
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 hover:bg-white/90 transition-colors text-center"
          >
            <span className="text-2xl block mb-1">🗓️</span>
            <span className="text-sm text-gray-600">年度热力图</span>
          </Link>
          <Link
            href="/diary-coach"
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 hover:bg-white/90 transition-colors text-center"
          >
            <span className="text-2xl block mb-1">🎯</span>
            <span className="text-sm text-gray-600">AI 教练</span>
          </Link>
        </div>
      </main>
    </div>
  );
}