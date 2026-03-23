"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 情绪预报数据类型
interface ForecastDay {
  date: string;
  dayName: string;
  prediction: {
    score: number; // 1-100
    label: string;
    emoji: string;
    color: string;
  };
  confidence: number;
  factors: string[];
  suggestions: string[];
}

// 历史分析
interface HistoryAnalysis {
  avgScore: number;
  trend: "rising" | "falling" | "stable";
  patterns: string[];
  topFactors: string[];
}

export default function EmotionForecastPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [historyAnalysis, setHistoryAnalysis] = useState<HistoryAnalysis | null>(null);
  const [selectedDay, setSelectedDay] = useState<ForecastDay | null>(null);
  const [diaryCount, setDiaryCount] = useState(0);

  useEffect(() => {
    loadForecast();
  }, []);

  const loadForecast = async () => {
    try {
      // 获取日记数量
      const diariesRes = await fetch("/api/diaries");
      const diaries = await diariesRes.json();
      setDiaryCount(diaries.length || 0);

      if (diaries.length < 3) {
        setIsLoading(false);
        return;
      }

      // 获取预报
      const res = await fetch("/api/emotion-forecast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diaries: diaries.slice(0, 30).map((d: { title: string; content: string; date: string; mood?: string }) => ({
            title: d.title,
            content: d.content,
            date: d.date,
            mood: d.mood,
          })),
        }),
      });
      const data = await res.json();
      
      if (data.forecast) {
        setForecast(data.forecast);
      }
      if (data.historyAnalysis) {
        setHistoryAnalysis(data.historyAnalysis);
      }
    } catch (error) {
      console.error("加载预报失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 获取分数对应的颜色和标签
  const getScoreStyle = (score: number) => {
    if (score >= 80) return { label: "极佳", emoji: "🌟", color: "text-green-600 bg-green-100" };
    if (score >= 65) return { label: "良好", emoji: "😊", color: "text-blue-600 bg-blue-100" };
    if (score >= 50) return { label: "平稳", emoji: "😐", color: "text-gray-600 bg-gray-100" };
    if (score >= 35) return { label: "一般", emoji: "😔", color: "text-orange-600 bg-orange-100" };
    return { label: "低落", emoji: "😢", color: "text-red-600 bg-red-100" };
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 获取星期几
  const getDayName = (dateStr: string) => {
    const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    return days[new Date(dateStr).getDay()];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-pulse mb-4">🔮</div>
          <p className="text-white/70">正在预测你的情绪未来...</p>
        </div>
      </div>
    );
  }

  // 数据不足时的提示
  if (diaryCount < 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md px-6">
          <div className="text-6xl mb-4">📝</div>
          <h1 className="text-2xl font-bold mb-4">需要更多日记数据</h1>
          <p className="text-white/70 mb-6">
            情绪预报需要至少 3 篇日记才能进行分析。继续记录你的生活，让我们更好地了解你的情绪模式！
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            开始写日记
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* 星空背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      <main className="relative max-w-5xl mx-auto px-6 py-12">
        {/* 返回按钮 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors"
        >
          <span>←</span>
          <span>返回首页</span>
        </Link>

        {/* 标题 */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🔮</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            情绪预报站
          </h1>
          <p className="text-white/60 max-w-lg mx-auto">
            基于你的日记历史，AI 预测你未来 7 天的情绪趋势
          </p>
        </div>

        {/* 历史分析摘要 */}
        {historyAnalysis && (
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-white/20">
            <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span>📊</span>
              <span>历史分析</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-white/60 text-sm mb-1">平均情绪指数</div>
                <div className="text-3xl font-bold text-white">{historyAnalysis.avgScore}</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-white/60 text-sm mb-1">趋势</div>
                <div className="text-xl font-bold text-white flex items-center gap-2">
                  {historyAnalysis.trend === "rising" && "📈 上升中"}
                  {historyAnalysis.trend === "falling" && "📉 下降中"}
                  {historyAnalysis.trend === "stable" && "➡️ 稳定"}
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-white/60 text-sm mb-1">发现模式</div>
                <div className="text-sm text-white/80">{historyAnalysis.patterns.length} 个</div>
              </div>
            </div>
            {historyAnalysis.patterns.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {historyAnalysis.patterns.map((pattern, i) => (
                  <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm">
                    {pattern}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 7 天预报 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-white/20">
          <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
            <span>📅</span>
            <span>未来 7 天情绪预报</span>
          </h2>
          <div className="grid grid-cols-7 gap-2">
            {forecast.map((day, index) => (
              <div
                key={index}
                onClick={() => setSelectedDay(day)}
                className={`cursor-pointer rounded-xl p-4 text-center transition-all hover:scale-105 ${
                  selectedDay?.date === day.date
                    ? "bg-white/30 ring-2 ring-white/50"
                    : "bg-white/10 hover:bg-white/20"
                }`}
              >
                <div className="text-white/60 text-xs mb-1">{getDayName(day.date)}</div>
                <div className="text-white/80 text-sm mb-2">{formatDate(day.date)}</div>
                <div className="text-2xl mb-2">{day.prediction.emoji}</div>
                <div className={`text-lg font-bold ${day.prediction.color.split(" ")[0]}`}>
                  {day.prediction.score}
                </div>
                <div className="text-white/60 text-xs mt-1">
                  {Math.round(day.confidence * 100)}% 置信度
                </div>
              </div>
            ))}
          </div>

          {/* 情绪曲线 */}
          <div className="mt-6 h-32 relative">
            <svg className="w-full h-full" viewBox="0 0 700 100" preserveAspectRatio="none">
              {/* 背景网格 */}
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="50%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#f472b6" />
                </linearGradient>
              </defs>
              
              {/* 预测曲线 */}
              <path
                d={`M ${forecast.map((d, i) => 
                  `${i * 116 + 58},${100 - d.prediction.score}`
                ).join(" L ")}`}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* 数据点 */}
              {forecast.map((d, i) => (
                <circle
                  key={i}
                  cx={i * 116 + 58}
                  cy={100 - d.prediction.score}
                  r="6"
                  fill="#fff"
                  stroke="url(#lineGradient)"
                  strokeWidth="2"
                />
              ))}
            </svg>
          </div>
        </div>

        {/* 选中日期详情 */}
        {selectedDay && (
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 mb-8 border border-white/20 animate-fadeIn">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-white font-bold text-xl">
                  {getDayName(selectedDay.date)} · {formatDate(selectedDay.date)}
                </h2>
                <p className="text-white/60 mt-1">预测情绪: {selectedDay.prediction.label}</p>
              </div>
              <div className="text-4xl">{selectedDay.prediction.emoji}</div>
            </div>

            {/* 影响因素 */}
            <div className="mb-4">
              <h3 className="text-white/80 text-sm font-medium mb-2">🎯 影响因素</h3>
              <div className="flex flex-wrap gap-2">
                {selectedDay.factors.map((factor, i) => (
                  <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-white/80 text-sm">
                    {factor}
                  </span>
                ))}
              </div>
            </div>

            {/* 建议 */}
            <div>
              <h3 className="text-white/80 text-sm font-medium mb-2">💡 智能建议</h3>
              <ul className="space-y-2">
                {selectedDay.suggestions.map((suggestion, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/70">
                    <span className="text-white/50">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* 预报说明 */}
        <div className="bg-white/5 rounded-2xl p-6 text-center">
          <p className="text-white/50 text-sm">
            🧠 预测基于你的日记历史、情绪模式、周几规律等因素综合分析
          </p>
          <p className="text-white/40 text-xs mt-2">
            预测仅供参考，真正的情绪掌握在你手中 ✨
          </p>
        </div>
      </main>
    </div>
  );
}