'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface MoodEntry {
  date: string;
  mood: string;
  diaryId?: string;
  title?: string;
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
  productive: '💪',
  creative: '🎨',
};

const MOOD_COLORS: Record<string, string> = {
  happy: 'bg-yellow-100 border-yellow-300',
  sad: 'bg-blue-100 border-blue-300',
  excited: 'bg-pink-100 border-pink-300',
  calm: 'bg-green-100 border-green-300',
  anxious: 'bg-orange-100 border-orange-300',
  grateful: 'bg-purple-100 border-purple-300',
  inspired: 'bg-indigo-100 border-indigo-300',
  tired: 'bg-gray-100 border-gray-300',
  peaceful: 'bg-teal-100 border-teal-300',
  thoughtful: 'bg-violet-100 border-violet-300',
  productive: 'bg-emerald-100 border-emerald-300',
  creative: 'bg-rose-100 border-rose-300',
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
  productive: '高效',
  creative: '创意',
};

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

export default function MoodCalendarPage() {
  const [moodData, setMoodData] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState<MoodEntry | null>(null);

  useEffect(() => {
    fetchMoodData();
  }, [currentDate]);

  const fetchMoodData = async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const res = await fetch(`/api/mood/calendar?year=${year}&month=${month}`);
      if (res.ok) {
        const data = await res.json();
        setMoodData(data.entries || []);
      }
    } catch (error) {
      console.error('Failed to fetch mood data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const days: { date: Date; isCurrentMonth: boolean; mood?: MoodEntry }[] = [];
    
    // Previous month days
    const startPadding = firstDay.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      const dateStr = date.toISOString().split('T')[0];
      const mood = moodData.find(m => m.date === dateStr);
      days.push({ date, isCurrentMonth: false, mood });
    }
    
    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateStr = date.toISOString().split('T')[0];
      const mood = moodData.find(m => m.date === dateStr);
      days.push({ date, isCurrentMonth: true, mood });
    }
    
    // Next month days
    const endPadding = 42 - days.length; // 6 rows × 7 days
    for (let i = 1; i <= endPadding; i++) {
      const date = new Date(year, month + 1, i);
      const dateStr = date.toISOString().split('T')[0];
      const mood = moodData.find(m => m.date === dateStr);
      days.push({ date, isCurrentMonth: false, mood });
    }
    
    return days;
  }, [currentDate, moodData]);

  const moodStats = useMemo(() => {
    const stats: Record<string, number> = {};
    moodData.forEach(entry => {
      stats[entry.mood] = (stats[entry.mood] || 0) + 1;
    });
    return Object.entries(stats)
      .map(([mood, count]) => ({ mood, count }))
      .sort((a, b) => b.count - a.count);
  }, [moodData]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

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
            <h1 className="text-xl font-bold">心情日历</h1>
          </div>
          <button
            onClick={goToToday}
            className="text-sm text-purple-500 hover:text-purple-700"
          >
            今天
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Month Navigation */}
        <div className="bg-white rounded-xl p-4 border">
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← 上个月
            </button>
            <div className="text-center">
              <h2 className="text-xl font-bold">
                {currentDate.getFullYear()}年 {MONTHS[currentDate.getMonth()]}
              </h2>
              <p className="text-sm text-gray-500">
                {moodData.length} 天有记录
              </p>
            </div>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              下个月 →
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-xl p-4 border">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const dateStr = day.date.toISOString().split('T')[0];
              const hasMood = day.mood;
              
              return (
                <button
                  key={index}
                  onClick={() => day.mood && setSelectedMood(day.mood)}
                  className={`aspect-square p-1 rounded-lg transition-all ${
                    day.isCurrentMonth ? '' : 'opacity-40'
                  } ${
                    isToday(day.date) ? 'ring-2 ring-purple-500' : ''
                  } ${
                    hasMood 
                      ? MOOD_COLORS[hasMood.mood] || 'bg-gray-50'
                      : 'hover:bg-gray-50'
                  }`}
                  disabled={!hasMood}
                >
                  <div className="h-full flex flex-col items-center justify-center">
                    <span className={`text-sm ${isToday(day.date) ? 'font-bold text-purple-600' : 'text-gray-700'}`}>
                      {day.date.getDate()}
                    </span>
                    {hasMood && (
                      <span className="text-lg">
                        {MOOD_EMOJIS[hasMood.mood] || '📝'}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mood Stats */}
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="font-bold text-gray-900 mb-4">本月心情统计</h3>
          <div className="flex flex-wrap gap-2">
            {moodStats.length > 0 ? (
              moodStats.map(({ mood, count }) => (
                <div
                  key={mood}
                  className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                    MOOD_COLORS[mood] || 'bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{MOOD_EMOJIS[mood]}</span>
                  <span className="font-medium">{MOOD_NAMES[mood] || mood}</span>
                  <span className="text-sm text-gray-500">×{count}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">暂无心情记录</p>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-xl p-6 border">
          <h3 className="font-bold text-gray-900 mb-4">心情图例</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {Object.entries(MOOD_EMOJIS).map(([mood, emoji]) => (
              <div
                key={mood}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
                  MOOD_COLORS[mood] || 'bg-gray-50'
                }`}
              >
                <span className="text-xl">{emoji}</span>
                <span className="text-sm">{MOOD_NAMES[mood]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Day Detail */}
        {selectedMood && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">
                  {new Date(selectedMood.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h3>
                <button
                  onClick={() => setSelectedMood(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>
              
              <div className={`p-4 rounded-xl ${MOOD_COLORS[selectedMood.mood] || 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{MOOD_EMOJIS[selectedMood.mood]}</span>
                  <div>
                    <div className="font-bold text-lg">{MOOD_NAMES[selectedMood.mood]}</div>
                    {selectedMood.title && (
                      <div className="text-sm text-gray-600">{selectedMood.title}</div>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedMood.diaryId && (
                <Link
                  href={`/diary/${selectedMood.diaryId}`}
                  className="block mt-4 text-center py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors"
                >
                  查看日记 →
                </Link>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}