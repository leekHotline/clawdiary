'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface DayRecord {
  date: string;
  habits: { id: string; completed: boolean }[];
}

export default function HabitsCalendarPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [records, setRecords] = useState<DayRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchData();
  }, [currentMonth]);

  const fetchData = async () => {
    try {
      const [habitsRes, recordsRes] = await Promise.all([
        fetch('/api/habits/list'),
        fetch('/api/habits/calendar'),
      ]);
      const habitsData = await habitsRes.json();
      const recordsData = await recordsRes.json();
      setHabits(habitsData.habits || []);
      setRecords(recordsData.records || []);
    } catch (_error) {
      console.error('Failed to fetch data:', _error);
      // Demo data
      setHabits([
        { id: '1', name: '冥想', icon: '🧘', color: '#8b5cf6' },
        { id: '2', name: '阅读', icon: '📚', color: '#06b6d4' },
        { id: '3', name: '运动', icon: '💪', color: '#10b981' },
        { id: '4', name: '日记', icon: '📝', color: '#f59e0b' },
        { id: '5', name: '早睡', icon: '🌙', color: '#6366f1' },
      ]);
      // Generate demo records
      const demoRecords: DayRecord[] = [];
      const today = new Date();
      for (let i = 0; i < 60; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        demoRecords.push({
          date: date.toISOString().split('T')[0],
          habits: [
            { id: '1', completed: Math.random() > 0.15 },
            { id: '2', completed: Math.random() > 0.25 },
            { id: '3', completed: Math.random() > 0.35 },
            { id: '4', completed: Math.random() > 0.05 },
            { id: '5', completed: Math.random() > 0.4 },
          ],
        });
      }
      setRecords(demoRecords);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];
    
    // Add days from previous month
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push(d);
    }
    
    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    // Add days from next month
    const endPadding = 42 - days.length;
    for (let i = 1; i <= endPadding; i++) {
      days.push(new Date(year, month + 1, i));
    }
    
    return days;
  };

  const getRecordForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return records.find(r => r.date === dateStr);
  };

  const getCompletionLevel = (date: Date) => {
    const record = getRecordForDate(date);
    if (!record) return 0;
    const completed = record.habits.filter(h => h.completed).length;
    const total = record.habits.length;
    return total > 0 ? Math.round((completed / total) * 4) : 0;
  };

  const levelColors = [
    'bg-gray-100',
    'bg-green-100',
    'bg-green-200',
    'bg-green-300',
    'bg-green-400',
  ];

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentMonth);
  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-2xl text-indigo-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/habits" className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center">
            ←
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">📅 习惯日历</h1>
        </div>

        {/* Month Navigation */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={previousMonth}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            >
              ‹
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
            </h2>
            <button
              onClick={nextMonth}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            >
              ›
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
            {days.map((day, i) => {
              const dateStr = day.toISOString().split('T')[0];
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const isToday = dateStr === today;
              const level = getCompletionLevel(day);
              
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center ${
                    isCurrentMonth ? levelColors[level] : 'bg-gray-50'
                  } ${isToday ? 'ring-2 ring-indigo-500' : ''} ${
                    isCurrentMonth ? 'cursor-pointer hover:ring-2 hover:ring-indigo-300' : ''
                  }`}
                  title={`${dateStr}: ${level * 25}% 完成`}
                >
                  <span className={`text-sm ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}`}>
                    {day.getDate()}
                  </span>
                  {level > 0 && isCurrentMonth && (
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(Math.min(level, 4))].map((_, j) => (
                        <div key={j} className="w-1 h-1 rounded-full bg-green-500" />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-2xl p-4 shadow-lg mb-6">
          <div className="flex items-center justify-around">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-gray-100" />
              <span className="text-sm text-gray-500">未记录</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100" />
              <span className="text-sm text-gray-500">1-25%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-200" />
              <span className="text-sm text-gray-500">26-50%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-300" />
              <span className="text-sm text-gray-500">51-75%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-400" />
              <span className="text-sm text-gray-500">76-100%</span>
            </div>
          </div>
        </div>

        {/* Habits List */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="font-semibold text-gray-800 mb-4">习惯图例</h3>
          <div className="space-y-2">
            {habits.map((habit) => (
              <div key={habit.id} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: habit.color + '20' }}
                >
                  {habit.icon}
                </div>
                <span className="text-gray-700">{habit.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}