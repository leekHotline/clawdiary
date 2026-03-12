'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  Check,
  X,
  Flame,
  Target,
  Clock
} from 'lucide-react';

interface HabitHistory {
  id: string;
  name: string;
  icon: string;
  color: string;
  records: {
    date: string;
    completed: boolean;
    note?: string;
    streak: number;
  }[];
  stats: {
    totalDays: number;
    completedDays: number;
    completionRate: number;
    longestStreak: number;
    currentStreak: number;
    averageTime?: string;
  };
}

export default function HabitHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const habitId = params.id as string;
  
  const [habit, setHabit] = useState<HabitHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('calendar');
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    fetchHabitHistory();
  }, [habitId]);

  const fetchHabitHistory = async () => {
    try {
      const res = await fetch(`/api/habits/${habitId}/history`);
      if (res.ok) {
        const data = await res.json();
        setHabit(data);
      } else {
        // Mock data
        setHabit({
          id: habitId,
          name: '晨间冥想',
          icon: '🧘',
          color: '#8B5CF6',
          records: generateMockRecords(),
          stats: {
            totalDays: 90,
            completedDays: 72,
            completionRate: 80,
            longestStreak: 21,
            currentStreak: 7,
            averageTime: '15分钟'
          }
        });
      }
    } catch (error) {
      // Mock data on error
      setHabit({
        id: habitId,
        name: '晨间冥想',
        icon: '🧘',
        color: '#8B5CF6',
        records: generateMockRecords(),
        stats: {
          totalDays: 90,
          completedDays: 72,
          completionRate: 80,
          longestStreak: 21,
          currentStreak: 7,
          averageTime: '15分钟'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const generateMockRecords = () => {
    const records = [];
    const today = new Date();
    for (let i = 0; i < 90; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const completed = Math.random() > 0.2;
      records.push({
        date: date.toISOString().split('T')[0],
        completed,
        note: completed && Math.random() > 0.7 ? '感觉很棒！' : undefined,
        streak: completed ? Math.floor(Math.random() * 10) + 1 : 0
      });
    }
    return records;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add empty days for alignment
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    // Add actual days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getRecordForDate = (date: Date) => {
    if (!habit) return null;
    const dateStr = date.toISOString().split('T')[0];
    return habit.records.find(r => r.date === dateStr);
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
        <p className="text-gray-500">习惯不存在</p>
      </div>
    );
  }

  const days = getDaysInMonth(selectedMonth);
  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{habit.icon}</span>
                <div>
                  <h1 className="text-xl font-bold text-gray-800">{habit.name}</h1>
                  <p className="text-sm text-gray-500">历史记录</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-1" />
                日历
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                列表
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <Target className="w-5 h-5" />
              <span className="text-sm font-medium">完成率</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{habit.stats.completionRate}%</p>
            <p className="text-xs text-gray-500 mt-1">
              {habit.stats.completedDays}/{habit.stats.totalDays} 天
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100">
            <div className="flex items-center gap-2 text-orange-600 mb-2">
              <Flame className="w-5 h-5" />
              <span className="text-sm font-medium">当前连续</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{habit.stats.currentStreak} 天</p>
            <p className="text-xs text-gray-500 mt-1">继续保持！</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">最长连续</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{habit.stats.longestStreak} 天</p>
            <p className="text-xs text-gray-500 mt-1">个人记录</p>
          </div>
          
          {habit.stats.averageTime && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Clock className="w-5 h-5" />
                <span className="text-sm font-medium">平均时长</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{habit.stats.averageTime}</p>
              <p className="text-xs text-gray-500 mt-1">每次练习</p>
            </div>
          )}
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-6">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() - 1)))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-gray-800">{getMonthName(selectedMonth)}</h2>
              <button
                onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() + 1)))}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </button>
            </div>

            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="aspect-square" />;
                }

                const record = getRecordForDate(day);
                const isToday = day.toDateString() === new Date().toDateString();
                const isFuture = day > new Date();

                return (
                  <div
                    key={index}
                    className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm relative ${
                      isFuture
                        ? 'text-gray-300'
                        : record?.completed
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-50 text-red-400'
                    } ${isToday ? 'ring-2 ring-purple-500' : ''}`}
                  >
                    <span className="font-medium">{day.getDate()}</span>
                    {record?.completed && (
                      <Check className="w-3 h-3 absolute bottom-1" />
                    )}
                    {!record?.completed && !isFuture && (
                      <X className="w-3 h-3 absolute bottom-1 opacity-50" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 rounded"></div>
                <span>已完成</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-50 rounded"></div>
                <span>未完成</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 ring-2 ring-purple-500 rounded"></div>
                <span>今天</span>
              </div>
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-xl shadow-sm border border-purple-100 divide-y divide-gray-100">
            {habit.records.slice(0, 30).map((record, index) => (
              <div key={index} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    record.completed ? 'bg-green-100' : 'bg-red-50'
                  }`}>
                    {record.completed ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {new Date(record.date).toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long'
                      })}
                    </p>
                    {record.note && (
                      <p className="text-sm text-gray-500">{record.note}</p>
                    )}
                  </div>
                </div>
                {record.completed && record.streak > 0 && (
                  <div className="flex items-center gap-1 text-orange-500">
                    <Flame className="w-4 h-4" />
                    <span className="text-sm font-medium">{record.streak}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Monthly Summary */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">本月概览</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold">
                {habit.records.filter(r => {
                  const date = new Date(r.date);
                  return date.getMonth() === selectedMonth.getMonth() && 
                         date.getFullYear() === selectedMonth.getFullYear() &&
                         r.completed;
                }).length}
              </p>
              <p className="text-sm opacity-80">完成天数</p>
            </div>
            <div>
              <p className="text-3xl font-bold">
                {Math.round(
                  habit.records.filter(r => {
                    const date = new Date(r.date);
                    return date.getMonth() === selectedMonth.getMonth() && 
                           date.getFullYear() === selectedMonth.getFullYear();
                  }).filter(r => r.completed).length /
                  habit.records.filter(r => {
                    const date = new Date(r.date);
                    return date.getMonth() === selectedMonth.getMonth() && 
                           date.getFullYear() === selectedMonth.getFullYear();
                  }).length * 100
                )}%
              </p>
              <p className="text-sm opacity-80">完成率</p>
            </div>
            <div>
              <p className="text-3xl font-bold">
                {Math.max(...habit.records
                  .filter(r => {
                    const date = new Date(r.date);
                    return date.getMonth() === selectedMonth.getMonth() && 
                           date.getFullYear() === selectedMonth.getFullYear();
                  })
                  .map(r => r.streak), 0)}
              </p>
              <p className="text-sm opacity-80">最长连续</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}