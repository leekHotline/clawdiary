'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WritingStats {
  totalDiaries: number;
  totalWords: number;
  avgWordsPerDiary: number;
  longestStreak: number;
  currentStreak: number;
  mostUsedTags: { tag: string; count: number }[];
  moodDistribution: { mood: string; count: number }[];
  writingTimeDistribution: { hour: number; count: number }[];
  weeklyProgress: { date: string; words: number; diaries: number }[];
  monthlyProgress: { month: string; words: number; diaries: number }[];
  topWritingDays: { date: string; words: number }[];
}

const MOOD_EMOJIS: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  excited: '🎉',
  calm: '😌',
  anxious: '😰',
  grateful: '🙏',
  inspired: '💡',
  tired: '😴',
  peaceful: '☮️',
  thoughtful: '🤔',
};

const MOOD_NAMES: Record<string, string> = {
  happy: '开心',
  sad: '难过',
  excited: '兴奋',
  calm: '平静',
  anxious: '焦虑',
  grateful: '感恩',
  inspired: '灵感',
  tired: '疲惫',
  peaceful: '宁静',
  thoughtful: '思考',
};

export default function StatsDashboardPage() {
  const [stats, setStats] = useState<WritingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/stats/dashboard?range=${timeRange}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">暂无数据</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl">🦞</Link>
            <h1 className="text-xl font-bold">写作统计仪表板</h1>
          </div>
          <div className="flex items-center gap-2">
            {(['week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  timeRange === range
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {range === 'week' ? '本周' : range === 'month' ? '本月' : '本年'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 border">
            <div className="text-sm text-gray-500 mb-1">总日记数</div>
            <div className="text-3xl font-bold text-purple-600">{stats.totalDiaries}</div>
            <div className="text-xs text-gray-400 mt-1">篇</div>
          </div>
          <div className="bg-white rounded-xl p-5 border">
            <div className="text-sm text-gray-500 mb-1">总字数</div>
            <div className="text-3xl font-bold text-blue-600">{stats.totalWords.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">字</div>
          </div>
          <div className="bg-white rounded-xl p-5 border">
            <div className="text-sm text-gray-500 mb-1">平均字数</div>
            <div className="text-3xl font-bold text-green-600">{stats.avgWordsPerDiary}</div>
            <div className="text-xs text-gray-400 mt-1">字/篇</div>
          </div>
          <div className="bg-white rounded-xl p-5 border">
            <div className="text-sm text-gray-500 mb-1">当前连续</div>
            <div className="text-3xl font-bold text-orange-600">{stats.currentStreak}</div>
            <div className="text-xs text-gray-400 mt-1">天</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mood Distribution */}
          <div className="bg-white rounded-xl p-6 border">
            <h3 className="font-bold text-gray-900 mb-4">心情分布</h3>
            <div className="space-y-3">
              {stats.moodDistribution.slice(0, 6).map((item) => {
                const maxCount = Math.max(...stats.moodDistribution.map(m => m.count));
                const percentage = (item.count / maxCount) * 100;
                return (
                  <div key={item.mood} className="flex items-center gap-3">
                    <div className="w-8 text-center text-xl">
                      {MOOD_EMOJIS[item.mood] || '📝'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">
                          {MOOD_NAMES[item.mood] || item.mood}
                        </span>
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Tags */}
          <div className="bg-white rounded-xl p-6 border">
            <h3 className="font-bold text-gray-900 mb-4">常用标签</h3>
            <div className="flex flex-wrap gap-2">
              {stats.mostUsedTags.slice(0, 15).map((item) => (
                <span
                  key={item.tag}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                >
                  #{item.tag} <span className="text-purple-400">×{item.count}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Writing Time Distribution */}
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="font-bold text-gray-900 mb-4">写作时段分布</h3>
          <div className="flex items-end gap-1 h-32">
            {stats.writingTimeDistribution.map((item) => {
              const maxCount = Math.max(...stats.writingTimeDistribution.map(w => w.count));
              const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
              return (
                <div
                  key={item.hour}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className="w-full bg-gradient-to-t from-purple-500 to-pink-400 rounded-t transition-all duration-300"
                    style={{ height: `${Math.max(height, 2)}%` }}
                    title={`${item.hour}:00 - ${item.count} 篇`}
                  />
                  {item.hour % 6 === 0 && (
                    <span className="text-xs text-gray-400 mt-1">{item.hour}:00</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="font-bold text-gray-900 mb-4">近期写作趋势</h3>
          <div className="space-y-3">
            {stats.weeklyProgress.slice(-7).map((day) => {
              const maxWords = Math.max(...stats.weeklyProgress.map(w => w.words));
              const percentage = maxWords > 0 ? (day.words / maxWords) * 100 : 0;
              return (
                <div key={day.date} className="flex items-center gap-4">
                  <div className="w-20 text-sm text-gray-500">
                    {new Date(day.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-24 text-right">
                    <span className="text-sm font-medium">{day.words}</span>
                    <span className="text-xs text-gray-400 ml-1">字</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Writing Days */}
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="font-bold text-gray-900 mb-4">最高产的日子 TOP 5</h3>
          <div className="space-y-3">
            {stats.topWritingDays.slice(0, 5).map((day, index) => (
              <div key={day.date} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-400 w-8">#{index + 1}</div>
                <div className="flex-1">
                  <div className="font-medium">
                    {new Date(day.date).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
                <div className="text-xl font-bold text-purple-600">{day.words.toLocaleString()} 字</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">继续写作</h3>
              <p className="text-white/80 mt-1">保持你的写作习惯，记录每一天</p>
            </div>
            <Link
              href="/write"
              className="px-6 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              开始写作
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}