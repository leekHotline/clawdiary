"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood?: string;
  tags?: string[];
  wordCount: number;
}

interface WeeklySummary {
  totalEntries: number;
  totalWords: number;
  avgMood: number;
  topTags: { tag: string; count: number }[];
  moodTrend: "up" | "down" | "stable";
  highlights: string[];
  insights: string[];
  nextWeekSuggestions: string[];
}

const MOOD_EMOJIS: Record<string, { emoji: string; score: number }> = {
  great: { emoji: "😄", score: 5 },
  good: { emoji: "😊", score: 4 },
  okay: { emoji: "😐", score: 3 },
  bad: { emoji: "😕", score: 2 },
  terrible: { emoji: "😢", score: 1 },
};

const HIGHLIGHT_TEMPLATES = [
  "本周你保持了稳定的写作节奏，展现了良好的自律性 💪",
  "你的日记内容越来越丰富，情感表达更加细腻 ✨",
  "本周的反思深度有所提升，继续保持自我觉察 🔍",
  "你成功记录了多个重要时刻，为未来留下珍贵回忆 📸",
  "本周的情绪管理能力有所进步，学会了接纳不同情绪 🎭",
];

const INSIGHT_TEMPLATES = [
  "你的写作高峰期在周三和周六，可以在这两天安排更多深度写作",
  "「感恩」是你本周的高频主题，表明你正在培养积极心态",
  "本周的情绪整体稳定，建议继续保持规律作息",
  "你善于从日常小事中发现意义，这是很好的写作习惯",
  "尝试在日记中加入更多具体细节，会让回忆更生动",
];

const SUGGESTION_TEMPLATES = [
  "设定一个小目标：下周写 5 篇日记",
  "尝试新的日记主题：记录一件让你感到自豪的事",
  "每天花 5 分钟回顾前一天的内容",
  "尝试用不同的写作风格记录周末",
  "邀请朋友一起写日记，互相督促",
];

// 模拟本周日记数据
function generateMockDiaries(): DiaryEntry[] {
  const today = new Date();
  const diaries: DiaryEntry[] = [];
  const moods = ["great", "good", "good", "okay", "good", "great", "good"];
  const titles = [
    "周一的新开始",
    "一次有趣的对话",
    "学会放下",
    "工作与生活的平衡",
    "感恩今天的小确幸",
    "周末的思考时光",
    "总结与展望",
  ];
  const contents = [
    "今天是一个充满活力的周一。早上起来后，我决定重新整理一下自己的工作计划。发现很多之前拖延的事情，现在开始处理其实并不难...",
    "和一位老朋友聊天，发现我们都经历着相似的困惑。这让我意识到，有些问题是普遍的，不必过于焦虑...",
    "今天学会了一件重要的事：放下。不是放弃，而是接受那些无法改变的事情，把精力放在可以改变的领域...",
    "一直在思考如何更好地平衡工作和生活。今天尝试了番茄工作法，效率确实有所提升...",
    "今天的感恩日记：感谢阳光明媚的天气，感谢一杯好喝的咖啡，感谢朋友发来的问候...",
    "周末是思考的好时机。回顾这一周，有收获也有遗憾，但整体来说是在进步的...",
    "本周总结：写作7篇，运动3次，读完一本书。下周目标：保持节奏，增加阅读量...",
  ];
  const tagsList = [
    ["成长", "工作"],
    ["社交", "思考"],
    ["心态", "放下"],
    ["效率", "方法"],
    ["感恩", "日常"],
    ["反思", "周末"],
    ["总结", "计划"],
  ];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    
    diaries.push({
      id: `diary-${i}`,
      title: titles[i],
      content: contents[i],
      date: date.toISOString().split("T")[0],
      mood: moods[i],
      tags: tagsList[i],
      wordCount: Math.floor(Math.random() * 300) + 200,
    });
  }

  return diaries;
}

// 生成周报摘要
function generateWeeklySummary(diaries: DiaryEntry[]): WeeklySummary {
  const totalWords = diaries.reduce((sum, d) => sum + d.wordCount, 0);
  const avgMood = diaries.reduce((sum, d) => {
    const moodScore = d.mood ? MOOD_EMOJIS[d.mood]?.score || 3 : 3;
    return sum + moodScore;
  }, 0) / diaries.length;

  // 统计标签
  const tagCounts: Record<string, number> = {};
  diaries.forEach((d) => {
    d.tags?.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  const topTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 情绪趋势
  const moodScores = diaries.map((d) =>
    d.mood ? MOOD_EMOJIS[d.mood]?.score || 3 : 3
  );
  const firstHalf = moodScores.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
  const secondHalf = moodScores.slice(4).reduce((a, b) => a + b, 0) / 3;
  const moodTrend =
    secondHalf > firstHalf + 0.3
      ? "up"
      : secondHalf < firstHalf - 0.3
      ? "down"
      : "stable";

  // 随机选择高亮和洞察
  const highlights = HIGHLIGHT_TEMPLATES.sort(() => Math.random() - 0.5).slice(
    0,
    3
  );
  const insights = INSIGHT_TEMPLATES.sort(() => Math.random() - 0.5).slice(
    0,
    3
  );
  const nextWeekSuggestions = SUGGESTION_TEMPLATES.sort(
    () => Math.random() - 0.5
  ).slice(0, 3);

  return {
    totalEntries: diaries.length,
    totalWords,
    avgMood: Math.round(avgMood * 10) / 10,
    topTags,
    moodTrend,
    highlights,
    insights,
    nextWeekSuggestions,
  };
}

// 心情图表组件
function MoodChart({ diaries }: { diaries: DiaryEntry[] }) {
  const days = ["一", "二", "三", "四", "五", "六", "日"];
  
  return (
    <div className="flex items-end justify-between h-24 gap-1">
      {diaries.map((diary, i) => {
        const moodScore = diary.mood
          ? MOOD_EMOJIS[diary.mood]?.score || 3
          : 3;
        const height = (moodScore / 5) * 100;
        
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full bg-gradient-to-t from-violet-500 to-fuchsia-400 rounded-t transition-all hover:from-violet-400 hover:to-fuchsia-300"
              style={{ height: `${height}%` }}
            />
            <span className="text-xs text-gray-500">{days[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function WeeklyReviewPage() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [summary, setSummary] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [weekRange, setWeekRange] = useState({ start: "", end: "" });

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      const mockDiaries = generateMockDiaries();
      setDiaries(mockDiaries);
      setSummary(generateWeeklySummary(mockDiaries));

      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - 6);
      setWeekRange({
        start: startOfWeek.toLocaleDateString("zh-CN", {
          month: "long",
          day: "numeric",
        }),
        end: today.toLocaleDateString("zh-CN", {
          month: "long",
          day: "numeric",
        }),
      });

      setLoading(false);
    }, 1000);
  }, []);

  const getMoodTrendText = (trend: string) => {
    switch (trend) {
      case "up":
        return { text: "情绪上升趋势", color: "text-green-400", icon: "📈" };
      case "down":
        return { text: "情绪有所波动", color: "text-orange-400", icon: "📊" };
      default:
        return { text: "情绪保持稳定", color: "text-blue-400", icon: "➡️" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-950 via-slate-900 to-fuchsia-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-spin mb-4">📊</div>
          <p className="text-gray-400">正在生成你的周报...</p>
        </div>
      </div>
    );
  }

  const trendInfo = summary ? getMoodTrendText(summary.moodTrend) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-slate-900 to-fuchsia-950">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-2xl hover:scale-110 transition-transform">
                🦞
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">周回顾</h1>
                <p className="text-xs text-gray-400">
                  {weekRange.start} - {weekRange.end}
                </p>
              </div>
            </div>
            <Link
              href="/chat-diary"
              className="px-4 py-2 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-500 transition-colors flex items-center gap-2"
            >
              <span>✍️</span>
              <span>写日记</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-4 py-8">
        {/* 核心统计 */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
            <div className="text-3xl font-bold text-white">{summary?.totalEntries}</div>
            <div className="text-xs text-gray-400 mt-1">日记篇数</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
            <div className="text-3xl font-bold text-violet-400">{summary?.totalWords.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">总字数</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
            <div className="text-3xl font-bold text-fuchsia-400">{summary?.avgMood}</div>
            <div className="text-xs text-gray-400 mt-1">平均心情</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
            <div className="text-2xl">{trendInfo?.icon}</div>
            <div className={`text-xs mt-1 ${trendInfo?.color}`}>{trendInfo?.text}</div>
          </div>
        </div>

        {/* 心情趋势图 */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🎭</span>
            <span>心情趋势</span>
          </h2>
          <MoodChart diaries={diaries} />
          <div className="flex justify-center gap-4 mt-4 text-sm">
            {Object.entries(MOOD_EMOJIS).map(([key, value]) => (
              <div key={key} className="flex items-center gap-1">
                <span>{value.emoji}</span>
                <span className="text-gray-500">{key}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 本周日记列表 */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📝</span>
            <span>本周日记</span>
          </h2>
          <div className="space-y-3">
            {diaries.map((diary) => (
              <div
                key={diary.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {diary.mood ? MOOD_EMOJIS[diary.mood]?.emoji : "📝"}
                  </span>
                  <div>
                    <div className="text-white font-medium">{diary.title}</div>
                    <div className="text-xs text-gray-500">
                      {diary.date} · {diary.wordCount} 字
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {diary.tags?.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-violet-500/20 text-violet-300 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 高频标签 */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🏷️</span>
            <span>热门话题</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            {summary?.topTags.map((item, i) => (
              <div
                key={i}
                className="px-4 py-2 bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 rounded-full border border-violet-500/30"
              >
                <span className="text-white">{item.tag}</span>
                <span className="text-violet-400 text-sm ml-2">{item.count}次</span>
              </div>
            ))}
          </div>
        </div>

        {/* 本周亮点 */}
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>✨</span>
            <span>本周亮点</span>
          </h2>
          <div className="space-y-3">
            {summary?.highlights.map((highlight, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                <span className="text-amber-400">🌟</span>
                <span className="text-gray-300">{highlight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI 洞察 */}
        <div className="bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-pink-500/10 border border-violet-500/20 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🧠</div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-3">AI 洞察</h3>
              <div className="space-y-3">
                {summary?.insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-violet-400 mt-1">💡</span>
                    <span className="text-gray-300">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 下周建议 */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🎯</span>
            <span>下周建议</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {summary?.nextWeekSuggestions.map((suggestion, i) => (
              <div
                key={i}
                className="p-4 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 rounded-xl border border-violet-500/20"
              >
                <div className="text-violet-400 text-sm mb-2">建议 {i + 1}</div>
                <div className="text-gray-300">{suggestion}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 快速行动 */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/growth"
            className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-violet-500/50 transition-all group flex items-center gap-4"
          >
            <div className="text-3xl">📚</div>
            <div>
              <div className="font-medium text-white group-hover:text-violet-300">
                查看所有日记
              </div>
              <div className="text-sm text-gray-500">回顾更多成长记录</div>
            </div>
          </Link>
          <Link
            href="/insights"
            className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-violet-500/50 transition-all group flex items-center gap-4"
          >
            <div className="text-3xl">📊</div>
            <div>
              <div className="font-medium text-white group-hover:text-violet-300">
                详细洞察
              </div>
              <div className="text-sm text-gray-500">深入分析写作数据</div>
            </div>
          </Link>
        </div>

        {/* 分享按钮 */}
        <div className="text-center">
          <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-violet-500/25 transition-all">
            📤 分享本周回顾
          </button>
          <p className="text-xs text-gray-500 mt-2">生成精美图片分享到社交媒体</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>🦞 Claw Diary · 每周回顾，看见成长</p>
        </div>
      </footer>
    </div>
  );
}