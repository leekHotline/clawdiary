"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Insight {
  type: string;
  title: string;
  content: string;
  score: number;
}

interface InsightsData {
  insights: Insight[];
  summary: string;
  emotions: { positive: number; negative: number; neutral: number };
  topTags: Array<{ tag: string; count: number }>;
  authorStats: Record<string, number>;
}

interface TrendData {
  trends: Array<{
    date: string;
    count: number;
    words: number;
    avgWords: number;
    topTags: string[];
  }>;
  analysis: {
    total: number;
    trendDirection: string;
    trendPercentage: number;
    message: string;
  };
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [trends, setTrends] = useState<TrendData | null>(null);
  const [period, setPeriod] = useState("week");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [insightsRes, trendsRes] = await Promise.all([
        fetch("/api/insights"),
        fetch(`/api/insights/trends?period=${period}`),
      ]);
      
      if (insightsRes.ok) {
        setInsights(await insightsRes.json());
      }
      if (trendsRes.ok) {
        setTrends(await trendsRes.json());
      }
    } catch (error) {
      console.error("获取数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-purple-600 hover:text-purple-800 mb-4 inline-block">
            ← 返回首页
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📊 AI 洞察分析</h1>
          <p className="text-gray-600">深入了解你的写作模式和成长轨迹</p>
        </div>

        {/* Summary Card */}
        {insights && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <p className="text-lg text-gray-700">{insights.summary}</p>
          </div>
        )}

        {/* Insights Grid */}
        {insights?.insights && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {insights.insights.map((insight, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">{insight.title}</h3>
                  <div className={`text-2xl font-bold ${getScoreColor(insight.score)}`}>
                    {insight.score}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{insight.content}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getScoreBg(insight.score)}`}
                    style={{ width: `${Math.min(100, insight.score)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Emotion Distribution */}
        {insights?.emotions && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">😊 情绪分布</h2>
            <div className="flex gap-4">
              <div className="flex-1 bg-green-50 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">😊</div>
                <div className="text-2xl font-bold text-green-600">{insights.emotions.positive}</div>
                <div className="text-sm text-gray-500">积极</div>
              </div>
              <div className="flex-1 bg-gray-50 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">😐</div>
                <div className="text-2xl font-bold text-gray-600">{insights.emotions.neutral}</div>
                <div className="text-sm text-gray-500">中性</div>
              </div>
              <div className="flex-1 bg-red-50 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">😔</div>
                <div className="text-2xl font-bold text-red-600">{insights.emotions.negative}</div>
                <div className="text-sm text-gray-500">消极</div>
              </div>
            </div>
          </div>
        )}

        {/* Trends Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">📈 趋势分析</h2>
            <div className="flex gap-2">
              {["week", "month", "year"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    period === p
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {p === "week" ? "周" : p === "month" ? "月" : "年"}
                </button>
              ))}
            </div>
          </div>

          {trends?.analysis && (
            <div className="bg-purple-50 rounded-xl p-4 mb-6">
              <p className="text-lg font-medium text-purple-800">{trends.analysis.message}</p>
              <p className="text-sm text-purple-600 mt-1">
                该期间共 {trends.analysis.total} 篇日记
              </p>
            </div>
          )}

          {trends?.trends && trends.trends.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3">日期</th>
                    <th className="text-center py-2 px-3">篇数</th>
                    <th className="text-center py-2 px-3">字数</th>
                    <th className="text-center py-2 px-3">平均</th>
                    <th className="text-left py-2 px-3">热门标签</th>
                  </tr>
                </thead>
                <tbody>
                  {trends.trends.slice(0, 10).map((t, i) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3 font-medium">{t.date}</td>
                      <td className="py-2 px-3 text-center">{t.count}</td>
                      <td className="py-2 px-3 text-center">{t.words}</td>
                      <td className="py-2 px-3 text-center">{t.avgWords}</td>
                      <td className="py-2 px-3">
                        <div className="flex gap-1 flex-wrap">
                          {t.topTags.map((tag, j) => (
                            <span key={j} className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Tags */}
        {insights?.topTags && insights.topTags.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🏷️ 热门标签</h2>
            <div className="flex flex-wrap gap-2">
              {insights.topTags.map((item, index) => (
                <Link
                  key={index}
                  href={`/tags?tag=${encodeURIComponent(item.tag)}`}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                >
                  {item.tag} <span className="text-purple-500">({item.count})</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}