'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface HabitStats {
  totalHabits: number;
  activeHabits: number;
  archivedHabits: number;
  totalCompletions: number;
  averageStreak: number;
  bestStreak: number;
  bestStreakHabit: string;
  mostConsistent: string;
  mostConsistentRate: number;
  weeklyTrend: { week: string; completions: number }[];
  habitsByCategory: { category: string; count: number }[];
  topHabits: { name: string; icon: string; streak: number; rate: number }[];
}

export default function HabitsStatsPage() {
  const [stats, setStats] = useState<HabitStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/habits/stats?period=${period}`);
      const data = await res.json();
      setStats(data);
    } catch (_error) {
      console.error('Failed to fetch stats:', _error);
      // Demo data
      setStats({
        totalHabits: 12,
        activeHabits: 8,
        archivedHabits: 4,
        totalCompletions: 1250,
        averageStreak: 18.5,
        bestStreak: 67,
        bestStreakHabit: '日记',
        mostConsistent: '冥想',
        mostConsistentRate: 95.5,
        weeklyTrend: [
          { week: '第1周', completions: 42 },
          { week: '第2周', completions: 48 },
          { week: '第3周', completions: 45 },
          { week: '第4周', completions: 52 },
        ],
        habitsByCategory: [
          { category: '健康', count: 4 },
          { category: '学习', count: 3 },
          { category: '生活', count: 2 },
          { category: '工作', count: 2 },
        ],
        topHabits: [
          { name: '日记', icon: '📝', streak: 67, rate: 100 },
          { name: '冥想', icon: '🧘', streak: 15, rate: 95 },
          { name: '阅读', icon: '📚', streak: 8, rate: 85 },
          { name: '运动', icon: '💪', streak: 4, rate: 75 },
          { name: '早睡', icon: '🌙', streak: 5, rate: 70 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-2xl text-indigo-600">加载中...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <div className="text-xl text-gray-600">暂无统计数据</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/habits" className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
            ←
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">📊 习惯统计</h1>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 mb-6">
          {(['week', 'month', 'year'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-xl transition ${
                period === p ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {p === 'week' ? '本周' : p === 'month' ? '本月' : '今年'}
            </button>
          ))}
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <div className="text-3xl font-bold text-indigo-600">{stats.totalHabits}</div>
            <div className="text-sm text-gray-500">总习惯数</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <div className="text-3xl font-bold text-green-600">{stats.activeHabits}</div>
            <div className="text-sm text-gray-500">活跃习惯</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <div className="text-3xl font-bold text-orange-600">{stats.totalCompletions}</div>
            <div className="text-sm text-gray-500">总完成次数</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <div className="text-3xl font-bold text-purple-600">{stats.averageStreak}</div>
            <div className="text-sm text-gray-500">平均连续天数</div>
          </div>
        </div>

        {/* Best Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold text-gray-800 mb-4">🏆 最佳连续记录</h3>
            <div className="text-4xl font-bold text-indigo-600 mb-2">{stats.bestStreak}天</div>
            <div className="text-gray-500">{stats.bestStreakHabit}</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="font-semibold text-gray-800 mb-4">⭐ 最稳定习惯</h3>
            <div className="text-4xl font-bold text-green-600 mb-2">{stats.mostConsistentRate}%</div>
            <div className="text-gray-500">{stats.mostConsistent}</div>
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">📈 周趋势</h3>
          <div className="flex items-end gap-2 h-32">
            {stats.weeklyTrend.map((week, i) => {
              const maxCompletions = Math.max(...stats.weeklyTrend.map(w => w.completions));
              const height = (week.completions / maxCompletions) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-indigo-500 rounded-t-lg transition-all hover:bg-indigo-600"
                    style={{ height: `${height}%` }}
                    title={`${week.completions}次完成`}
                  />
                  <div className="text-xs text-gray-500 mt-2">{week.week}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Habits */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">🎯 Top 5 习惯</h3>
          <div className="space-y-3">
            {stats.topHabits.map((habit, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="text-lg font-bold text-gray-400 w-6">#{i + 1}</div>
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-xl">
                  {habit.icon}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{habit.name}</div>
                  <div className="text-sm text-gray-500">🔥 {habit.streak}天连续</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-indigo-600">{habit.rate}%</div>
                  <div className="text-xs text-gray-400">完成率</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Habits by Category */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-semibold text-gray-800 mb-4">📂 分类分布</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.habitsByCategory.map((cat, i) => (
              <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
                <div className="text-2xl font-bold text-indigo-600">{cat.count}</div>
                <div className="text-sm text-gray-500">{cat.category}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}