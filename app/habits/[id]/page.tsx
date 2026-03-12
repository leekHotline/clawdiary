'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly';
  streak: number;
  bestStreak: number;
  totalCompletions: number;
  createdAt: string;
  history: { date: string; completed: boolean }[];
}

export default function HabitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHabit();
  }, [params.id]);

  const fetchHabit = async () => {
    try {
      const res = await fetch(`/api/habits/${params.id}`);
      const data = await res.json();
      setHabit(data);
    } catch (error) {
      console.error('Failed to fetch habit:', error);
      // Demo data
      setHabit({
        id: params.id as string,
        name: '冥想',
        icon: '🧘',
        color: '#8b5cf6',
        frequency: 'daily',
        streak: 15,
        bestStreak: 23,
        totalCompletions: 45,
        createdAt: '2026-02-01',
        history: generateDemoHistory(),
      });
    } finally {
      setLoading(false);
    }
  };

  const generateDemoHistory = () => {
    const history = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      history.push({
        date: date.toISOString().split('T')[0],
        completed: Math.random() > 0.2,
      });
    }
    return history;
  };

  const getDayOfWeek = (dateStr: string) => {
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    return days[new Date(dateStr).getDay()];
  };

  const completionRate = habit ? (habit.history.filter(h => h.completed).length / habit.history.length * 100).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-2xl text-purple-600">加载中...</div>
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <div className="text-xl text-gray-600">习惯未找到</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-gray-800">习惯详情</h1>
        </div>

        {/* Habit Info Card */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl"
              style={{ backgroundColor: habit.color + '20' }}
            >
              {habit.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{habit.name}</h2>
              <div className="text-sm text-gray-500 mt-1">
                {habit.frequency === 'daily' ? '每日习惯' : '每周习惯'} · 创建于 {habit.createdAt}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-3xl font-bold" style={{ color: habit.color }}>
                {habit.streak}
              </div>
              <div className="text-xs text-gray-500 mt-1">当前连续</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600">{habit.bestStreak}</div>
              <div className="text-xs text-gray-500 mt-1">最佳记录</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-3xl font-bold text-orange-600">{habit.totalCompletions}</div>
              <div className="text-xs text-gray-500 mt-1">总完成次数</div>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">📊 过去30天完成率</h3>
          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="absolute h-full rounded-full"
              style={{
                width: `${completionRate}%`,
                backgroundColor: habit.color,
              }}
            />
          </div>
          <div className="text-right text-sm text-gray-500 mt-2">{completionRate}%</div>
        </div>

        {/* Calendar Heatmap */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">📅 完成日历</h3>
          <div className="grid grid-cols-7 gap-2">
            {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
              <div key={day} className="text-center text-xs text-gray-400">{day}</div>
            ))}
            {habit.history.map((h, i) => (
              <div
                key={i}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs ${
                  h.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}
                title={`${h.date} ${h.completed ? '✓' : '✗'}`}
              >
                {new Date(h.date).getDate()}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href={`/habits/${habit.id}/edit`}
            className="block w-full text-center py-3 bg-white rounded-xl shadow hover:shadow-md transition text-gray-700"
          >
            ✏️ 编辑习惯
          </Link>
          <button
            onClick={() => {
              if (confirm('确定要归档这个习惯吗？')) {
                fetch('/api/habits/archive', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id: habit.id }),
                });
                router.push('/habits');
              }
            }}
            className="w-full py-3 bg-white rounded-xl shadow hover:shadow-md transition text-gray-500"
          >
            📦 归档习惯
          </button>
        </div>
      </div>
    </div>
  );
}