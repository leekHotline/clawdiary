'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface StatData {
  daily: Array<{ date: string; count: number; minutes: number }>;
  weekly: Array<{ week: string; count: number; minutes: number }>;
  monthly: Array<{ month: string; count: number; minutes: number }>;
  byType: Array<{ type: string; count: number; minutes: number }>;
  byMood: Array<{ mood: string; count: number }>;
  byTimeOfDay: Array<{ hour: number; count: number }>;
  streaks: {
    current: number;
    longest: number;
  };
  insights: string[];
}

const meditationTypes = [
  { value: 'breathing', label: '呼吸冥想', icon: '🌬️' },
  { value: 'mindfulness', label: '正念冥想', icon: '🧘' },
  { value: 'guided', label: '引导冥想', icon: '🎧' },
  { value: 'body-scan', label: '身体扫描', icon: '👁️' },
  { value: 'loving-kindness', label: '慈心冥想', icon: '💚' },
  { value: 'walking', label: '行走冥想', icon: '🚶' },
  { value: 'transcendental', label: '超验冥想', icon: '✨' },
  { value: 'visualization', label: '可视化冥想', icon: '🌅' },
  { value: 'chanting', label: '唱诵冥想', icon: '🎵' },
  { value: 'zen', label: '禅修', icon: '⛩️' },
];

const moodOptions = [
  { value: 'calm', label: '平静', emoji: '😌' },
  { value: 'refreshed', label: '焕然一新', emoji: '✨' },
  { value: 'focused', label: '专注', emoji: '🎯' },
  { value: 'relaxed', label: '放松', emoji: '😊' },
  { value: 'peaceful', label: '宁静', emoji: '🕊️' },
  { value: 'energized', label: '充满能量', emoji: '⚡' },
  { value: 'grateful', label: '感恩', emoji: '🙏' },
  { value: 'neutral', label: '一般', emoji: '😐' },
];

export default function MeditationStatsPage() {
  const [stats, setStats] = useState<StatData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/meditation/stats?range=${timeRange}`);
      const data = await res.json();
      setStats(data);
    } catch (_error) {
      console.error('Failed to fetch stats:', _error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeInfo = (type: string) => {
    return meditationTypes.find(t => t.value === type) || meditationTypes[0];
  };

  const getMoodInfo = (mood: string) => {
    return moodOptions.find(m => m.value === mood) || moodOptions[0];
  };

  // Calculate max for charts
  const maxDailyMinutes = stats?.daily ? Math.max(...stats.daily.map(d => d.minutes)) : 0;
  const maxTypeMinutes = stats?.byType ? Math.max(...stats.byType.map(d => d.minutes)) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 flex items-center justify-center">
        <div className="text-gray-500">加载统计数据...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-500">暂无统计数据</p>
          <Link href="/meditation" className="text-indigo-600 hover:text-indigo-700 mt-4 inline-block">
            开始记录冥想
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/meditation" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 mb-4 inline-block">
            ← 返回冥想
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            📊 冥想统计
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            了解你的冥想习惯和进展
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-6">
          {(['week', 'month', 'year'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg transition-all ${
                timeRange === range
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {range === 'week' ? '本周' : range === 'month' ? '本月' : '今年'}
            </button>
          ))}
        </div>

        {/* Streak Cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🔥</div>
              <div>
                <div className="text-3xl font-bold">{stats.streaks?.current || 0}</div>
                <div className="opacity-90">当前连续天数</div>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-400 to-indigo-500 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🏆</div>
              <div>
                <div className="text-3xl font-bold">{stats.streaks?.longest || 0}</div>
                <div className="opacity-90">最长连续天数</div>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📈 每日趋势
          </h3>
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="flex items-end gap-1 h-40">
                {stats.daily?.slice(-14).map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t transition-all hover:from-indigo-600 hover:to-purple-600"
                      style={{ height: `${maxDailyMinutes > 0 ? (day.minutes / maxDailyMinutes) * 100 : 0}%`, minHeight: day.minutes > 0 ? '4px' : '0' }}
                      title={`${day.date}: ${day.minutes}分钟`}
                    />
                    <div className="text-xs text-gray-400 mt-1 truncate w-full text-center">
                      {new Date(day.date).getDate()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* By Type */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🎯 冥想类型分布
            </h3>
            <div className="space-y-3">
              {stats.byType?.map((item, i) => {
                const typeInfo = getTypeInfo(item.type);
                const percentage = maxTypeMinutes > 0 ? (item.minutes / maxTypeMinutes) * 100 : 0;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">
                        {typeInfo.icon} {typeInfo.label}
                      </span>
                      <span className="text-gray-500">
                        {item.count} 次 · {item.minutes} 分钟
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* By Mood */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              😊 冥想后心情
            </h3>
            <div className="space-y-2">
              {stats.byMood?.map((item, i) => {
                const moodInfo = getMoodInfo(item.mood);
                const total = stats.byMood.reduce((sum, m) => sum + m.count, 0);
                const percentage = total > 0 ? (item.count / total) * 100 : 0;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-2xl">{moodInfo.emoji}</span>
                    <span className="flex-1 text-gray-700 dark:text-gray-300">{moodInfo.label}</span>
                    <span className="text-gray-500">{item.count} 次</span>
                    <span className="text-xs text-gray-400 w-12 text-right">{percentage.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Time of Day Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ⏰ 冥想时间分布
          </h3>
          <div className="grid grid-cols-12 gap-1">
            {Array.from({ length: 24 }, (_, hour) => {
              const hourData = stats.byTimeOfDay?.find(d => d.hour === hour);
              const count = hourData?.count || 0;
              const maxCount = Math.max(...(stats.byTimeOfDay?.map(d => d.count) || [1]));
              const intensity = maxCount > 0 ? count / maxCount : 0;
              return (
                <div
                  key={hour}
                  className="aspect-square rounded flex items-center justify-center text-xs"
                  style={{
                    backgroundColor: `rgba(99, 102, 241, ${intensity * 0.8 + 0.1})`,
                    color: intensity > 0.3 ? 'white' : 'rgb(107, 114, 128)'
                  }}
                  title={`${hour}:00 - ${count}次`}
                >
                  {hour}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>凌晨</span>
            <span>上午</span>
            <span>下午</span>
            <span>晚上</span>
          </div>
        </div>

        {/* Insights */}
        {stats.insights && stats.insights.length > 0 && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              💡 冥想洞察
            </h3>
            <ul className="space-y-2">
              {stats.insights.map((insight, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-indigo-500">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}