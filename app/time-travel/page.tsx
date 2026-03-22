"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface TimeDiary {
  date: string;
  year: number;
  title: string;
  content: string;
  mood?: string;
  tags?: string[];
  wordCount: number;
}

interface GrowthInsight {
  aspect: string;
  before: string;
  after: string;
  emoji: string;
}

// 模拟历史日记数据
const historicalDiaries: Record<string, TimeDiary> = {
  "03-22": {
    date: "2025-03-22",
    year: 2025,
    title: "春分时节，新的开始",
    content: "今天是春分，万物复苏的季节。开始学习新的技术栈，感觉有些吃力，但也充满期待。希望能坚持下去，不要半途而废。最近睡眠质量不太好，需要调整作息。\n\n今天完成了项目的第一个功能模块，虽然很简单，但很有成就感。继续加油！",
    mood: "期待",
    tags: ["学习", "新项目", "成长"],
    wordCount: 89
  },
  "03-15": {
    date: "2025-03-15",
    year: 2025,
    title: "忙碌的一周",
    content: "这周真的很忙，加班到很晚。但感觉学到了很多东西，特别是关于 AI 的知识。开始尝试用 AI 辅助工作，效率提升了不少。\n\n周末要好好休息一下，充充电。",
    mood: "疲惫",
    tags: ["工作", "AI", "学习"],
    wordCount: 67
  }
};

// 模拟今日日记
const todayDiary: TimeDiary = {
  date: "2026-03-22",
  year: 2026,
  title: "春分，一年后的回望",
  content: "一年前的今天，我正在学习新技术栈，充满期待又有些迷茫。现在回看，那个项目已经成功上线，而我也成长了很多。\n\n这一年来，坚持写日记的习惯让我更了解自己。睡眠问题也改善了不少，学会了更好的时间管理。\n\n继续前进，下一个目标：掌握更多 AI 技能。",
  mood: "满足",
  tags: ["成长", "日记", "AI"],
  wordCount: 98
};

// 生成成长洞察
const generateInsights = (): GrowthInsight[] => [
  {
    aspect: "技术成长",
    before: "开始学习新技术，感觉吃力",
    after: "项目上线，技术成熟",
    emoji: "💻"
  },
  {
    aspect: "生活习惯",
    before: "睡眠质量差，作息不规律",
    after: "时间管理改善，作息稳定",
    emoji: "😴"
  },
  {
    aspect: "心态变化",
    before: "期待又迷茫",
    after: "自信且明确方向",
    emoji: "🧭"
  },
  {
    aspect: "写作习惯",
    before: "刚开始写日记",
    after: "坚持一年，收获满满",
    emoji: "📝"
  }
];

// 情绪颜色映射
const moodColors: Record<string, string> = {
  "开心": "from-yellow-400 to-orange-400",
  "期待": "from-blue-400 to-indigo-400",
  "满足": "from-green-400 to-emerald-400",
  "疲惫": "from-gray-400 to-slate-400",
  "迷茫": "from-purple-400 to-violet-400",
  "平静": "from-cyan-400 to-teal-400",
};

export default function TimeTravelPage() {
  const [selectedDate, setSelectedDate] = useState<string>("03-22");
  const [isLoading, setIsLoading] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [insights, setInsights] = useState<GrowthInsight[]>([]);

  // 模拟加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setInsights(generateInsights());
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // 生成过去30天的日期列表
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      dates.push({
        key: monthDay,
        label: `${date.getMonth() + 1}月${date.getDate()}日`,
        hasHistory: !!historicalDiaries[monthDay]
      });
    }
    return dates;
  };

  const dateOptions = generateDateOptions();
  const historyDiary = historicalDiaries[selectedDate];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-bounce">🔮</div>
          <p className="text-lg opacity-80">正在穿越时空...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-violet-900">
      {/* 星空背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.8 + 0.2
            }}
          />
        ))}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 py-12">
        {/* 返回按钮 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <span>←</span>
          <span>返回首页</span>
        </Link>

        {/* 标题区域 */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🔮</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            时光回溯
          </h1>
          <p className="text-white/60 max-w-md mx-auto">
            穿越时间，看看去年的今天你在想什么、在经历什么
          </p>
        </div>

        {/* 日期选择器 */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-white/60 text-sm">📅 选择日期查看历史</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {dateOptions.map((date) => (
              <button
                key={date.key}
                onClick={() => setSelectedDate(date.key)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedDate === date.key
                    ? "bg-white text-purple-900 shadow-lg"
                    : date.hasHistory
                    ? "bg-white/20 text-white hover:bg-white/30"
                    : "bg-white/5 text-white/40"
                }`}
              >
                {date.label}
                {date.hasHistory && (
                  <span className="ml-1">✨</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 时间对比区域 */}
        {historyDiary ? (
          <div className="space-y-6">
            {/* 对比卡片 */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* 去年今日 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">📜</span>
                  <span className="text-white/60 text-sm">去年今日 · {historyDiary.year}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{historyDiary.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4 whitespace-pre-line">
                  {historyDiary.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/50">心情：</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${moodColors[historyDiary.mood || '平静']} text-white`}>
                      {historyDiary.mood}
                    </span>
                  </div>
                  <span className="text-xs text-white/40">{historyDiary.wordCount} 字</span>
                </div>
                {historyDiary.tags && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {historyDiary.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/60">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 今年今日 */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 relative overflow-hidden">
                <div className="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full text-xs font-bold text-white">
                  现在
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">✨</span>
                  <span className="text-white/60 text-sm">今年今日 · {todayDiary.year}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{todayDiary.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4 whitespace-pre-line">
                  {todayDiary.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-white/50">心情：</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${moodColors[todayDiary.mood || '平静']} text-white`}>
                      {todayDiary.mood}
                    </span>
                  </div>
                  <span className="text-xs text-white/40">{todayDiary.wordCount} 字</span>
                </div>
                {todayDiary.tags && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {todayDiary.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/60">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 成长洞察按钮 */}
            {!showComparison && (
              <button
                onClick={() => setShowComparison(true)}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>💡</span>
                <span>查看 AI 成长洞察</span>
              </button>
            )}

            {/* AI 成长洞察 */}
            {showComparison && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl">🧠</span>
                  <h3 className="text-xl font-bold text-white">AI 成长洞察</h3>
                </div>
                
                <div className="space-y-4">
                  {insights.map((insight, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">{insight.emoji}</span>
                        <span className="font-semibold text-white">{insight.aspect}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-white/40 mb-1">去年</div>
                          <div className="text-sm text-white/70">{insight.before}</div>
                        </div>
                        <div>
                          <div className="text-xs text-white/40 mb-1">今年</div>
                          <div className="text-sm text-emerald-300">{insight.after}</div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-1">
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full" style={{width: '75%'}} />
                        </div>
                        <span className="text-xs text-emerald-400">+75%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 总结 */}
                <div className="mt-6 p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <div className="font-semibold text-white mb-1">这一年，你成长了</div>
                      <p className="text-sm text-white/70">
                        从迷茫到自信，从学习到精通。你坚持写日记的习惯让你更了解自己，
                        技术能力也在不断提升。继续保持，下一个目标正向你招手！
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 统计对比 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-white">+9</div>
                <div className="text-xs text-white/50">字数增长</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-emerald-400">+1</div>
                <div className="text-xs text-white/50">标签数量</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <div className="text-2xl font-bold text-amber-400">↑</div>
                <div className="text-xs text-white/50">心情改善</div>
              </div>
            </div>
          </div>
        ) : (
          // 无历史日记
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-white mb-2">还没有去年的日记</h3>
            <p className="text-white/60 mb-6">这个日期没有找到去年的记录</p>
            <Link
              href="/chat-diary"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors"
            >
              <span>开始写今天的日记</span>
              <span>→</span>
            </Link>
          </div>
        )}

        {/* 功能说明 */}
        <div className="mt-12 text-center text-white/40 text-sm">
          <p>💡 提示：标记 ✨ 的日期有历史日记可查看</p>
          <p className="mt-1">坚持写日记，明年的你会感谢今年的自己</p>
        </div>

        {/* 底部快捷入口 */}
        <div className="mt-12 grid grid-cols-2 gap-4">
          <Link
            href="/growth"
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-colors text-center"
          >
            <span className="text-2xl block mb-2">📚</span>
            <span className="text-white/70 text-sm">查看全部日记</span>
          </Link>
          <Link
            href="/annual-report"
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-colors text-center"
          >
            <span className="text-2xl block mb-2">📊</span>
            <span className="text-white/70 text-sm">年度回顾</span>
          </Link>
        </div>
      </main>
    </div>
  );
}