"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface WritingReport {
  overview: {
    totalDiaries: number;
    totalWords: number;
    totalChars: number;
    avgWordsPerDiary: number;
    streak: number;
  };
  byAuthor: Record<string, number>;
  topTags: [string, number][];
  recent: {
    last7Days: { count: number; words: number };
    last30Days: { count: number; words: number };
  };
  style: {
    writingPatterns: {
      preferredDays: string[];
      preferredHours: number[];
      avgPostLength: number;
    };
    vocabulary: {
      topWords: string[];
      avgWordLength: number;
    };
    style: {
      formality: number;
      emotionality: number;
      complexity: number;
    };
  } | null;
}

export default function WritingAnalysisPage() {
  const [report, setReport] = useState<WritingReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await fetch("/api/writing-analysis/report");
      const data = await res.json();
      setReport(data);
    } catch (_error) {
      console.error("Failed to fetch report:", _error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeStyle = async () => {
    try {
      await fetch("/api/writing-analysis/style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ period: "all-time" }),
      });
      fetchReport();
    } catch (_error) {
      console.error("Failed to analyze style:", _error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">📊 写作分析</h1>
          <p className="text-gray-600 mt-1">深入了解你的写作习惯和风格</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="text-3xl font-bold text-teal-600">{report?.overview.totalDiaries || 0}</div>
            <div className="text-gray-600 text-sm mt-1">总日记数</div>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="text-3xl font-bold text-cyan-600">{report?.overview.totalChars.toLocaleString() || 0}</div>
            <div className="text-gray-600 text-sm mt-1">总字数</div>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="text-3xl font-bold text-emerald-600">{report?.overview.avgWordsPerDiary || 0}</div>
            <div className="text-gray-600 text-sm mt-1">平均字数/篇</div>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <div className="text-3xl font-bold text-orange-500">{report?.overview.streak || 0}🔥</div>
            <div className="text-gray-600 text-sm mt-1">连续写作</div>
          </div>
        </div>

        {/* Recent Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">📈 最近 7 天</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">日记数量</span>
                <span className="font-semibold">{report?.recent.last7Days.count || 0} 篇</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">总字数</span>
                <span className="font-semibold">{report?.recent.last7Days.words.toLocaleString() || 0} 字</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">📊 最近 30 天</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">日记数量</span>
                <span className="font-semibold">{report?.recent.last30Days.count || 0} 篇</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">总字数</span>
                <span className="font-semibold">{report?.recent.last30Days.words.toLocaleString() || 0} 字</span>
              </div>
            </div>
          </div>
        </div>

        {/* By Author */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">👥 作者分布</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(report?.byAuthor || {}).map(([author, count]) => (
              <div key={author} className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                <span className="font-medium">{author}</span>
                <span className="text-gray-500">{count} 篇</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Tags */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">🏷️ 热门标签</h3>
          <div className="flex flex-wrap gap-2">
            {report?.topTags.map(([tag, count]) => (
              <span key={tag} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
                {tag} ({count})
              </span>
            ))}
          </div>
        </div>

        {/* Writing Style */}
        {report?.style ? (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">✍️ 写作风格分析</h3>
              <button
                onClick={analyzeStyle}
                className="text-sm text-teal-600 hover:underline"
              >
                重新分析
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Formality */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">正式程度</span>
                  <span>{Math.round((report.style.style.formality || 0) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-teal-500 h-2 rounded-full"
                    style={{ width: `${(report.style.style.formality || 0) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Emotionality */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">情感表达</span>
                  <span>{Math.round((report.style.style.emotionality || 0) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-pink-500 h-2 rounded-full"
                    style={{ width: `${(report.style.style.emotionality || 0) * 100}%` }}
                  />
                </div>
              </div>
              
              {/* Complexity */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">复杂度</span>
                  <span>{Math.round((report.style.style.complexity || 0) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{ width: `${(report.style.style.complexity || 0) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Preferred Writing Time */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">写作偏好</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">偏好的日子：</span>
                  <span className="ml-2">{report.style.writingPatterns.preferredDays.join(", ") || "暂无数据"}</span>
                </div>
                <div>
                  <span className="text-gray-500">偏好的时间：</span>
                  <span className="ml-2">
                    {report.style.writingPatterns.preferredHours.map(h => `${h}:00`).join(", ") || "暂无数据"}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Words */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">常用词汇</h4>
              <div className="flex flex-wrap gap-2">
                {report.style.vocabulary.topWords.slice(0, 15).map((word) => (
                  <span key={word} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <p className="text-gray-600 mb-4">还没有足够的写作数据来分析风格</p>
            <button
              onClick={analyzeStyle}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
            >
              开始分析
            </button>
          </div>
        )}

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/stats" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition text-center">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-sm text-gray-700">数据统计</div>
          </Link>
          <Link href="/stats/heatmap" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition text-center">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-sm text-gray-700">热力图</div>
          </Link>
          <Link href="/insights" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition text-center">
            <div className="text-2xl mb-1">💡</div>
            <div className="text-sm text-gray-700">写作洞察</div>
          </Link>
          <Link href="/writing-goals" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition text-center">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-sm text-gray-700">写作目标</div>
          </Link>
        </div>
      </main>

      {/* Back */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <Link href="/" className="text-teal-600 hover:underline">
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}