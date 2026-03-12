'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ArchivedHabit {
  id: string;
  name: string;
  icon: string;
  color: string;
  totalCompletions: number;
  bestStreak: number;
  archivedAt: string;
  createdAt: string;
}

export default function HabitsArchivePage() {
  const [habits, setHabits] = useState<ArchivedHabit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArchivedHabits();
  }, []);

  const fetchArchivedHabits = async () => {
    try {
      const res = await fetch('/api/habits/archive');
      const data = await res.json();
      setHabits(data.habits || []);
    } catch (error) {
      console.error('Failed to fetch archived habits:', error);
      // Demo data
      setHabits([
        {
          id: '1',
          name: '学习英语',
          icon: '🌍',
          color: '#06b6d4',
          totalCompletions: 156,
          bestStreak: 45,
          archivedAt: '2026-02-15',
          createdAt: '2025-10-01',
        },
        {
          id: '2',
          name: '健身',
          icon: '🏋️',
          color: '#ef4444',
          totalCompletions: 89,
          bestStreak: 28,
          archivedAt: '2026-01-20',
          createdAt: '2025-08-15',
        },
        {
          id: '3',
          name: '早起',
          icon: '🌅',
          color: '#f59e0b',
          totalCompletions: 234,
          bestStreak: 60,
          archivedAt: '2026-02-28',
          createdAt: '2025-06-01',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const restoreHabit = async (id: string) => {
    try {
      await fetch('/api/habits/archive', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'restore' }),
      });
      setHabits(habits.filter(h => h.id !== id));
    } catch (error) {
      console.error('Failed to restore habit:', error);
    }
  };

  const deleteHabit = async (id: string) => {
    if (!confirm('确定要永久删除这个习惯吗？此操作无法撤销。')) return;
    
    try {
      await fetch('/api/habits/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      setHabits(habits.filter(h => h.id !== id));
    } catch (error) {
      console.error('Failed to delete habit:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center">
        <div className="text-2xl text-gray-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/habits" className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
            ←
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">📦 已归档习惯</h1>
        </div>

        {habits.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">暂无归档习惯</h2>
            <p className="text-gray-500">归档的习惯会显示在这里</p>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => (
              <div key={habit.id} className="bg-white rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl opacity-60"
                    style={{ backgroundColor: habit.color + '20' }}
                  >
                    {habit.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-600">{habit.name}</h3>
                    <div className="text-sm text-gray-400">
                      创建于 {habit.createdAt} · 归档于 {habit.archivedAt}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-gray-600">{habit.totalCompletions}</div>
                    <div className="text-xs text-gray-400">总完成次数</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-gray-600">{habit.bestStreak}天</div>
                    <div className="text-xs text-gray-400">最佳连续</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => restoreHabit(habit.id)}
                    className="flex-1 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                  >
                    ↩️ 恢复
                  </button>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="flex-1 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                  >
                    🗑️ 删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 bg-white rounded-2xl p-5 shadow-lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-600">{habits.length}</div>
            <div className="text-sm text-gray-400">已归档习惯</div>
          </div>
        </div>
      </div>
    </div>
  );
}