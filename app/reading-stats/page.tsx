"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ReadingTimeData {
  totalMinutes: number;
  totalHours: number;
  totalWords: number;
  avgMinutes: number;
  totalDiaries: number;
  distribution: {
    short: number;
    medium: number;
    long: number;
  };
  longestDiary: {
    id: string;
    title: string;
    chars: number;
    minutes: number;
  };
  dailyBreakdown: Array<{
    date: string;
    minutes: number;
    count: number;
    avgMinutes: number;
  }>;
}

export default function ReadingStatsPage() {
  const [data, setData] = useState<ReadingTimeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reading-time")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-teal-600 hover:text-teal-800 mb-4 inline-block">
            ← 返回首页
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">⏱️ 阅读时间统计</h1>
          <p className="text-gray-600">你花在日记上的每一分钟都值得记录</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">📚</div>
            <div className="text-3xl font-bold text-teal-600">{data.totalHours}</div>
            <div className="text-gray-500">总阅读时间（小时）</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">📝</div>
            <div className="text-3xl font-bold text-cyan-600">{data.totalWords.toLocaleString()}</div>
            <div className="text-gray-500">总字数</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-2">⏰</div>
            <div className="text-3xl font-bold text-indigo-600">{data.avgMinutes}</div>
            <div className="text-gray-500">平均阅读（分钟）</div>
          </div>
        </div>

        {/* Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">📊 阅读时长分布</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-3xl">⚡</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{data.distribution.short}</div>
              <div className="text-sm text-gray-500">快读（≤2分钟）</div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-3xl">📖</span>
              </div>
              <div className="text-2xl font-bold text-yellow-600">{data.distribution.medium}</div>
              <div className="text-sm text-gray-500">中等（3-5分钟）</div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-3xl">📚</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{data.distribution.long}</div>
              <div className="text-sm text-gray-500">长文（>5分钟）</div>
            </div>
          </div>
        </div>

        {/* Longest Diary */}
        {data.longestDiary && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🏆 最长日记</h2>
            <Link
              href={`/diary/${data.longestDiary.id}`}
              className="block p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl hover:from-teal-100 hover:to-cyan-100 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-gray-800">{data.longestDiary.title}</h3>
                  <p className="text-sm text-gray-500">
                    {data.longestDiary.chars.toLocaleString()} 字 · 约 {data.longestDiary.minutes} 分钟阅读
                  </p>
                </div>
                <span className="text-teal-500 text-2xl">→</span>
              </div>
            </Link>
          </div>
        )}

        {/* Daily Breakdown */}
        {data.dailyBreakdown && data.dailyBreakdown.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📅 最近阅读统计</h2>
            <div className="space-y-3">
              {data.dailyBreakdown.map((day, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600 w-28">{day.date}</div>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full"
                        style={{ width: `${Math.min(100, day.minutes * 2)}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 w-20 text-right">
                    {day.minutes} 分钟
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}