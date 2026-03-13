'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DailyGoal {
  id: string;
  type: 'words' | 'time' | 'diaries';
  target: number;
  current: number;
  unit: string;
  icon: string;
  color: string;
}

interface GoalProgress {
  date: string;
  completed: boolean;
  percentage: number;
}

export default function DailyGoalsPage() {
  const [goals, setGoals] = useState<DailyGoal[]>([
    { id: '1', type: 'words', target: 500, current: 0, unit: '字', icon: '✍️', color: 'purple' },
    { id: '2', type: 'time', target: 30, current: 0, unit: '分钟', icon: '⏱️', color: 'blue' },
    { id: '3', type: 'diaries', target: 1, current: 0, unit: '篇', icon: '📝', color: 'green' },
  ]);
  const [weeklyProgress, setWeeklyProgress] = useState<GoalProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/writing-goals/today');
      if (res.ok) {
        const data = await res.json();
        if (data.goals) {
          setGoals(data.goals);
        }
        if (data.weeklyProgress) {
          setWeeklyProgress(data.weeklyProgress);
        }
      }
    } catch (_error) {
      console.error('Failed to fetch goals:', _error);
    } finally {
      setLoading(false);
    }
  };

  const updateGoalTarget = async (goalId: string, newTarget: number) => {
    try {
      await fetch(`/api/writing-goals/${goalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: newTarget }),
      });
      setEditingGoal(null);
      fetchGoals();
    } catch (_error) {
      console.error('Failed to update goal:', _error);
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'from-green-400 to-green-500';
    if (percentage >= 70) return 'from-blue-400 to-blue-500';
    if (percentage >= 40) return 'from-yellow-400 to-yellow-500';
    return 'from-red-400 to-red-500';
  };

  const todayProgress = goals.reduce((sum, g) => {
    const percentage = Math.min((g.current / g.target) * 100, 100);
    return sum + percentage;
  }, 0) / goals.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl">🦞</Link>
            <h1 className="text-xl font-bold">每日写作目标</h1>
          </div>
          <Link href="/writing-goals" className="text-sm text-purple-500 hover:text-purple-700">
            长期目标
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Today's Overview */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">今日进度</h2>
              <p className="text-white/80 mt-1">
                {new Date().toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="text-5xl">
              {todayProgress >= 100 ? '🎉' : todayProgress >= 70 ? '💪' : todayProgress >= 40 ? '📝' : '🌅'}
            </div>
          </div>
          
          {/* Overall Progress */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">总体完成度</span>
              <span className="text-lg font-bold">{Math.round(todayProgress)}%</span>
            </div>
            <div className="h-4 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${Math.min(todayProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Individual Goals */}
        <div className="space-y-4">
          {goals.map((goal) => {
            const percentage = Math.min((goal.current / goal.target) * 100, 100);
            const isCompleted = percentage >= 100;

            return (
              <div key={goal.id} className="bg-white rounded-xl p-5 border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                      isCompleted ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {isCompleted ? '✅' : goal.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {goal.type === 'words' ? '字数目标' : 
                         goal.type === 'time' ? '时间目标' : '日记目标'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {goal.current} / {goal.target} {goal.unit}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingGoal(editingGoal === goal.id ? null : goal.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    ⚙️
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getProgressColor(percentage)} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Edit Mode */}
                {editingGoal === goal.id && (
                  <div className="mt-4 pt-4 border-t">
                    <label className="block text-sm text-gray-500 mb-2">调整目标</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        defaultValue={goal.target}
                        className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        min={1}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            updateGoalTarget(goal.id, parseInt((e.target as HTMLInputElement).value));
                          }
                        }}
                      />
                      <span className="text-gray-500">{goal.unit}</span>
                      <button
                        onClick={(e) => {
                          const input = e.currentTarget.parentElement?.querySelector('input');
                          if (input) {
                            updateGoalTarget(goal.id, parseInt(input.value));
                          }
                        }}
                        className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        保存
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                {goal.type === 'diaries' && !isCompleted && (
                  <div className="mt-4">
                    <Link
                      href="/write"
                      className="block text-center py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      立即写作 →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Weekly Progress */}
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="font-bold text-gray-900 mb-4">本周完成情况</h3>
          <div className="grid grid-cols-7 gap-2">
            {['日', '一', '二', '三', '四', '五', '六'].map((day, i) => {
              const progress = weeklyProgress[i];
              const isToday = i === new Date().getDay();
              
              return (
                <div key={i} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">{day}</div>
                  <div
                    className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center ${
                      isToday ? 'ring-2 ring-purple-500' : ''
                    } ${
                      progress?.completed
                        ? 'bg-green-500 text-white'
                        : progress?.percentage && progress.percentage > 50
                        ? 'bg-yellow-100'
                        : progress?.percentage
                        ? 'bg-gray-100'
                        : 'bg-gray-50'
                    }`}
                  >
                    {progress?.completed ? '✓' : progress?.percentage ? 
                      `${Math.round(progress.percentage)}%` : '-'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivation */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="text-3xl">💡</div>
            <div>
              <h4 className="font-bold text-gray-900">写作小贴士</h4>
              <p className="text-gray-600 mt-1">
                建立固定的写作时间和地点，可以帮助你更容易养成写作习惯。
                每天同一时间写作，大脑会自动进入写作状态。
              </p>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border text-center">
            <div className="text-2xl font-bold text-green-600">
              {weeklyProgress.filter(p => p.completed).length}
            </div>
            <div className="text-sm text-gray-500">本周完成</div>
          </div>
          <div className="bg-white rounded-xl p-4 border text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(weeklyProgress.reduce((sum, p) => sum + (p.percentage || 0), 0) / 7)}%
            </div>
            <div className="text-sm text-gray-500">平均完成度</div>
          </div>
          <div className="bg-white rounded-xl p-4 border text-center">
            <div className="text-2xl font-bold text-purple-600">
              {goals.reduce((sum, g) => sum + g.current, 0)}
            </div>
            <div className="text-sm text-gray-500">今日产出</div>
          </div>
        </div>
      </main>
    </div>
  );
}