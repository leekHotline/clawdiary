"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface InsightData {
  totalDiaries: number;
  totalWords: number;
  streakDays: number;
  longestStreak: number;
  avgWordsPerDiary: number;
  bestWritingTime: string;
  topTags: { tag: string; count: number }[];
  emotionTrend: { date: string; score: number }[];
  weeklyActivity: { day: string; count: number }[];
  recentGrowth: string[];
  wordFrequency: { word: string; count: number }[];
}

// 模拟数据生成
function generateInsightData(): InsightData {
  return {
    totalDiaries: 47,
    totalWords: 28650,
    streakDays: 22,
    longestStreak: 35,
    avgWordsPerDiary: 610,
    bestWritingTime: "晚间 21:00-23:00",
    topTags: [
      { tag: "成长", count: 15 },
      { tag: "思考", count: 12 },
      { tag: "感恩", count: 10 },
      { tag: "工作", count: 8 },
      { tag: "学习", count: 7 },
    ],
    emotionTrend: [
      { date: "3/1", score: 7 },
      { date: "3/8", score: 8 },
      { date: "3/15", score: 6 },
      { date: "3/22", score: 9 },
    ],
    weeklyActivity: [
      { day: "周一", count: 5 },
      { day: "周二", count: 7 },
      { day: "周三", count: 6 },
      { day: "周四", count: 8 },
      { day: "周五", count: 9 },
      { day: "周六", count: 12 },
      { day: "周日", count: 10 },
    ],
    recentGrowth: [
      "写作速度提升 23%",
      "情绪词汇丰富度 +15%",
      "连续写作天数创新高",
      "反思深度增加",
    ],
    wordFrequency: [
      { word: "今天", count: 45 },
      { word: "感觉", count: 38 },
      { word: "学习", count: 32 },
      { word: "思考", count: 28 },
      { word: "成长", count: 25 },
      { word: "感恩", count: 22 },
      { word: "努力", count: 20 },
      { word: "坚持", count: 18 },
    ],
  };
}

// 情绪趋势图组件
function EmotionChart({ data }: { data: { date: string; score: number }[] }) {
  const maxScore = 10;
  
  return (
    <div className="bg-white/5 rounded-xl p-4">
      <div className="flex items-end justify-between h-32 gap-2">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t transition-all hover:from-purple-400 hover:to-pink-400"
              style={{ height: `${(item.score / maxScore) * 100}%` }}
            />
            <span className="text-xs text-gray-500">{item.date}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-400">
        <span>😊 情绪指数</span>
        <span className="text-green-400">↑ 趋势向好</span>
      </div>
    </div>
  );
}

// 周活动图组件
function WeeklyChart({ data }: { data: { day: string; count: number }[] }) {
  const maxCount = Math.max(...data.map(d => d.count));
  
  return (
    <div className="bg-white/5 rounded-xl p-4">
      <div className="flex items-end justify-between h-24 gap-1">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full bg-gradient-to-t from-indigo-500 to-cyan-500 rounded-t transition-all hover:from-indigo-400 hover:to-cyan-400"
              style={{ height: `${(item.count / maxCount) * 100}%` }}
            />
            <span className="text-xs text-gray-500">{item.day}</span>
          </div>
        ))}
      </div>
      <div className="mt-2 text-center text-sm text-gray-400">
        周六是你最活跃的写作日 📝
      </div>
    </div>
  );
}

// 词云组件
function WordCloud({ words }: { words: { word: string; count: number }[] }) {
  const sizes = ["text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl"];
  const colors = ["text-purple-300", "text-pink-300", "text-indigo-300", "text-cyan-300", "text-violet-300"];
  
  return (
    <div className="flex flex-wrap gap-3 justify-center items-center p-4">
      {words.map((item, i) => {
        const sizeIndex = Math.min(Math.floor(item.count / 10), sizes.length - 1);
        const colorIndex = i % colors.length;
        return (
          <span
            key={i}
            className={`${sizes[sizeIndex]} ${colors[colorIndex]} hover:scale-110 transition-transform cursor-default`}
          >
            {item.word}
          </span>
        );
      })}
    </div>
  );
}

// 成就徽章
function AchievementBadge({ emoji, title, desc, unlocked }: { 
  emoji: string; 
  title: string; 
  desc: string;
  unlocked: boolean;
}) {
  return (
    <div className={`p-4 rounded-xl ${unlocked ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30" : "bg-white/5 opacity-50"}`}>
      <div className="text-3xl mb-2">{emoji}</div>
      <div className="font-bold text-white text-sm">{title}</div>
      <div className="text-xs text-gray-400">{desc}</div>
    </div>
  );
}

export default function InsightsPage() {
  const [data, setData] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      setData(generateInsightData());
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">📊</div>
          <p className="text-gray-400">正在分析你的写作数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-6xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-3xl hover:scale-110 transition-transform">
              🦞
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span>📊</span>
                <span>写作洞察</span>
              </h1>
              <p className="text-gray-400 text-sm">
                发现你的写作模式，追踪成长轨迹
              </p>
            </div>
          </div>
          <Link
            href="/chat-diary"
            className="px-4 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-500 transition-colors flex items-center gap-2"
          >
            <span>✍️</span>
            <span>写日记</span>
          </Link>
        </div>

        {/* 核心指标 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-5">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-3xl font-bold text-white">{data?.totalDiaries}</div>
            <div className="text-sm text-gray-400">总日记数</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/30 rounded-2xl p-5">
            <div className="text-3xl mb-2">📖</div>
            <div className="text-3xl font-bold text-white">{data?.totalWords.toLocaleString()}</div>
            <div className="text-sm text-gray-400">总字数</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 rounded-2xl p-5">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-3xl font-bold text-white">{data?.streakDays}</div>
            <div className="text-sm text-gray-400">连续天数</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-5">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-3xl font-bold text-white">{data?.avgWordsPerDiary}</div>
            <div className="text-sm text-gray-400">平均字数</div>
          </div>
        </div>

        {/* 两栏布局 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 情绪趋势 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>🎭</span>
              <span>情绪趋势</span>
            </h2>
            <EmotionChart data={data?.emotionTrend || []} />
            <div className="mt-4 p-3 bg-purple-500/10 rounded-lg">
              <p className="text-sm text-gray-300">
                💡 你的情绪整体稳定且有上升趋势。继续保持写作习惯！
              </p>
            </div>
          </div>

          {/* 周活动 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>📅</span>
              <span>周活动分布</span>
            </h2>
            <WeeklyChart data={data?.weeklyActivity || []} />
            <div className="mt-4 p-3 bg-indigo-500/10 rounded-lg">
              <p className="text-sm text-gray-300">
                💡 你在周末更有写作热情，可以尝试在周中设定小目标。
              </p>
            </div>
          </div>
        </div>

        {/* 高频词汇 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>💬</span>
            <span>常用词汇</span>
          </h2>
          <WordCloud words={data?.wordFrequency || []} />
          <div className="mt-4 text-center text-sm text-gray-400">
            这些词汇反映了你的写作主题和关注点
          </div>
        </div>

        {/* 标签分布 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🏷️</span>
            <span>热门标签</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {data?.topTags.map((item, i) => (
              <div
                key={i}
                className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30 hover:border-purple-500/50 transition-colors"
              >
                <span className="text-white">{item.tag}</span>
                <span className="text-gray-400 text-sm ml-2">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 成长亮点 */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-5 mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>📈</span>
            <span>成长亮点</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {data?.recentGrowth.map((item, i) => (
              <div key={i} className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 成就徽章 */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🏆</span>
            <span>成就徽章</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AchievementBadge emoji="🔥" title="连续7天" desc="坚持写作一周" unlocked={true} />
            <AchievementBadge emoji="📝" title="笔耕不辍" desc="累计50篇日记" unlocked={false} />
            <AchievementBadge emoji="🌟" title="情绪大师" desc="记录100次情绪" unlocked={false} />
            <AchievementBadge emoji="🎯" title="目标达成" desc="完成10个目标" unlocked={true} />
          </div>
        </div>

        {/* AI 洞察卡片 */}
        <div className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🧠</div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">AI 洞察</h3>
              <p className="text-gray-300 leading-relaxed">
                基于你的写作数据，你是一位善于反思和成长的写作者。你的日记主题集中在「成长」和「思考」，
                表明你有较强的自我觉察能力。建议：尝试记录更多生活中的小确幸，丰富情绪维度。
              </p>
              <div className="mt-4 flex gap-3">
                <Link
                  href="/chat-diary?theme=gratitude"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-500 transition-colors"
                >
                  写感恩日记
                </Link>
                <Link
                  href="/challenges"
                  className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm font-medium hover:bg-white/20 transition-colors"
                >
                  查看挑战
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 快速行动 */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link
            href="/growth"
            className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-purple-500/50 transition-all group"
          >
            <div className="text-2xl mb-2">📚</div>
            <div className="font-medium text-white group-hover:text-purple-300">查看所有日记</div>
            <div className="text-sm text-gray-500">回顾你的成长记录</div>
          </Link>
          <Link
            href="/stats"
            className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-purple-500/50 transition-all group"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="font-medium text-white group-hover:text-purple-300">详细统计</div>
            <div className="text-sm text-gray-500">更多数据分析</div>
          </Link>
          <Link
            href="/annual-report"
            className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-purple-500/50 transition-all group"
          >
            <div className="text-2xl mb-2">🎄</div>
            <div className="font-medium text-white group-hover:text-purple-300">年度报告</div>
            <div className="text-sm text-gray-500">精彩年度回顾</div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm text-gray-500">
          <p>🦞 Claw Diary · 让每一天都值得记录</p>
        </div>
      </footer>
    </div>
  );
}