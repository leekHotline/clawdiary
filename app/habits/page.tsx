'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly' | 'custom';
  targetDays?: number[];
  streak: number;
  bestStreak: number;
  completedToday: boolean;
  totalCompletions: number;
  createdAt: string;
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    icon: '✨',
    color: '#6366f1',
    frequency: 'daily' as const,
  });

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const res = await fetch('/api/habits/list');
      const data = await res.json();
      setHabits(data.habits || []);
    } catch (error) {
      console.error('Failed to fetch habits:', error);
      // Demo data
      setHabits([
        {
          id: '1',
          name: '冥想',
          icon: '🧘',
          color: '#8b5cf6',
          frequency: 'daily',
          streak: 15,
          bestStreak: 23,
          completedToday: true,
          totalCompletions: 45,
          createdAt: '2026-02-01',
        },
        {
          id: '2',
          name: '阅读',
          icon: '📚',
          color: '#06b6d4',
          frequency: 'daily',
          streak: 8,
          bestStreak: 30,
          completedToday: false,
          totalCompletions: 120,
          createdAt: '2026-01-15',
        },
        {
          id: '3',
          name: '运动',
          icon: '💪',
          color: '#10b981',
          frequency: 'weekly',
          targetDays: [1, 3, 5],
          streak: 4,
          bestStreak: 12,
          completedToday: false,
          totalCompletions: 52,
          createdAt: '2026-01-01',
        },
        {
          id: '4',
          name: '日记',
          icon: '📝',
          color: '#f59e0b',
          frequency: 'daily',
          streak: 67,
          bestStreak: 67,
          completedToday: true,
          totalCompletions: 67,
          createdAt: '2026-01-05',
        },
        {
          id: '5',
          name: '早睡',
          icon: '🌙',
          color: '#6366f1',
          frequency: 'daily',
          streak: 5,
          bestStreak: 21,
          completedToday: false,
          totalCompletions: 89,
          createdAt: '2025-12-01',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleHabit = async (id: string) => {
    setHabits(habits.map(h => 
      h.id === id ? { ...h, completedToday: !h.completedToday, streak: h.completedToday ? h.streak - 1 : h.streak + 1 } : h
    ));
    
    try {
      await fetch('/api/habits/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'toggle' }),
      });
    } catch (error) {
      console.error('Failed to update habit:', error);
    }
  };

  const addHabit = async () => {
    if (!newHabit.name.trim()) return;
    
    const habit: Habit = {
      id: Date.now().toString(),
      ...newHabit,
      streak: 0,
      bestStreak: 0,
      completedToday: false,
      totalCompletions: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    setHabits([...habits, habit]);
    setShowAddModal(false);
    setNewHabit({ name: '', icon: '✨', color: '#6366f1', frequency: 'daily' });
    
    try {
      await fetch('/api/habits/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(habit),
      });
    } catch (error) {
      console.error('Failed to create habit:', error);
    }
  };

  const icons = ['✨', '🧘', '📚', '💪', '📝', '🌙', '🌅', '🏃', '🎨', '🎵', '💧', '🥗', '💊', '🛏️', '✍️'];
  const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#84cc16'];

  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
  const completedToday = habits.filter(h => h.completedToday).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-2xl text-indigo-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🎯 习惯追踪</h1>
          <p className="text-gray-600">坚持每一天，成就更好的自己</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <div className="text-3xl font-bold text-indigo-600">{habits.length}</div>
            <div className="text-sm text-gray-500">活跃习惯</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <div className="text-3xl font-bold text-green-600">{completedToday}/{habits.length}</div>
            <div className="text-sm text-gray-500">今日完成</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-lg">
            <div className="text-3xl font-bold text-orange-600">{totalStreak}</div>
            <div className="text-sm text-gray-500">总连续天数</div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex gap-3 mb-6">
          <Link
            href="/habits/calendar"
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow hover:shadow-md transition"
          >
            📅 日历视图
          </Link>
          <Link
            href="/habits/stats"
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow hover:shadow-md transition"
          >
            📊 统计报告
          </Link>
          <Link
            href="/habits/archive"
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow hover:shadow-md transition"
          >
            📦 已归档
          </Link>
        </div>

        {/* Habits List */}
        <div className="space-y-3">
          {habits.map((habit) => (
            <div
              key={habit.id}
              className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition cursor-pointer"
              onClick={() => toggleHabit(habit.id)}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                    habit.completedToday ? 'ring-4 ring-green-200' : ''
                  }`}
                  style={{ backgroundColor: habit.color + '20' }}
                >
                  {habit.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg text-gray-800">{habit.name}</span>
                    {habit.completedToday && (
                      <span className="text-green-500">✓</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                    <span>🔥 {habit.streak}天连续</span>
                    <span>🏆 最佳: {habit.bestStreak}天</span>
                    <span>📊 {habit.totalCompletions}次完成</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold" style={{ color: habit.color }}>
                    {habit.streak}
                  </div>
                  <div className="text-xs text-gray-400">
                    {habit.frequency === 'daily' ? '每日' : '每周'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition text-2xl"
        >
          +
        </button>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">添加新习惯</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">习惯名称</label>
                  <input
                    type="text"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="例如：每天阅读30分钟"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">图标</label>
                  <div className="flex flex-wrap gap-2">
                    {icons.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setNewHabit({ ...newHabit, icon })}
                        className={`w-10 h-10 rounded-lg text-xl ${
                          newHabit.icon === icon ? 'ring-2 ring-indigo-500 bg-indigo-50' : 'bg-gray-100'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">颜色</label>
                  <div className="flex gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewHabit({ ...newHabit, color })}
                        className={`w-10 h-10 rounded-lg ${
                          newHabit.color === color ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">频率</label>
                  <select
                    value={newHabit.frequency}
                    onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value as any })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="daily">每天</option>
                    <option value="weekly">每周</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={addHabit}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}