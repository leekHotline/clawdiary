"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface MoodEntry {
  date: string;
  mood: number; // 1-5
  emoji: string;
  note?: string;
}

interface DayMood {
  date: string;
  mood: MoodEntry | null;
  hasDiary: boolean;
}

const moodEmojis: Record<number, string> = {
  1: "😢",
  2: "😕",
  3: "😐",
  4: "😊",
  5: "😄",
};

const moodColors: Record<number, string> = {
  1: "bg-blue-200",
  2: "bg-cyan-200",
  3: "bg-gray-200",
  4: "bg-lime-200",
  5: "bg-green-300",
};

export default function MoodCalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [moodData, setMoodData] = useState<Record<string, MoodEntry>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoodData();
  }, [currentMonth]);

  const fetchMoodData = async () => {
    try {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const res = await fetch(`/api/mood/calendar?year=${year}&month=${month}`);
      const data = await res.json();
      setMoodData(data.moods || {});
    } catch (error) {
      console.error("Failed to fetch mood data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date): DayMood[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: DayMood[] = [];

    // 填充前面的空白
    const startPadding = firstDay.getDay();
    for (let i = 0; i < startPadding; i++) {
      days.push({
        date: "",
        mood: null,
        hasDiary: false,
      });
    }

    // 填充日期
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({
        date: dateStr,
        mood: moodData[dateStr] || null,
        hasDiary: Math.random() > 0.3, // 模拟数据
      });
    }

    return days;
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString("zh-CN", { year: "numeric", month: "long" });
  };

  // 统计心情
  const moodStats = Object.values(moodData).reduce(
    (acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  const avgMood = Object.keys(moodStats).length > 0
    ? Object.entries(moodStats).reduce((sum, [mood, count]) => sum + parseInt(mood) * count, 0) /
      Object.values(moodStats).reduce((a, b) => a + b, 0)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">📅 心情日历</h1>
          <p className="text-gray-600 mt-1">以日历视图追踪你的情绪变化</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <div className="text-4xl mb-1">
              {avgMood >= 4 ? "😄" : avgMood >= 3 ? "😊" : avgMood >= 2 ? "😕" : "😢"}
            </div>
            <div className="text-sm text-gray-600">本月平均心情</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <div className="text-3xl font-bold text-green-600">
              {Object.values(moodStats).reduce((a, b) => a + b, 0)}
            </div>
            <div className="text-sm text-gray-600">记录天数</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <div className="text-3xl font-bold text-purple-600">
              {moodStats[5] || 0}
            </div>
            <div className="text-sm text-gray-600">开心天数 😄</div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              ← 上月
            </button>
            <h2 className="text-xl font-semibold">{getMonthName(currentMonth)}</h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              下月 →
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
              <div key={day} className="text-center text-sm text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentMonth).map((day, index) => (
              <div
                key={index}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition ${
                  day.date
                    ? day.mood
                      ? moodColors[day.mood.mood]
                      : "hover:bg-gray-100"
                    : ""
                } ${selectedDate === day.date ? "ring-2 ring-purple-500" : ""}`}
                onClick={() => day.date && setSelectedDate(day.date)}
              >
                {day.date && (
                  <>
                    <span className="text-sm font-medium">{parseInt(day.date.split("-")[2])}</span>
                    {day.mood && (
                      <span className="text-lg">{day.mood.emoji}</span>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-900 mb-3">心情图例</h3>
          <div className="flex flex-wrap gap-4">
            {[1, 2, 3, 4, 5].map((mood) => (
              <div key={mood} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded ${moodColors[mood]}`}></div>
                <span className="text-2xl">{moodEmojis[mood]}</span>
                <span className="text-sm text-gray-600">
                  {mood === 1 ? "很差" : mood === 2 ? "不好" : mood === 3 ? "一般" : mood === 4 ? "不错" : "很棒"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Day Detail */}
        {selectedDate && moodData[selectedDate] && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">
                {new Date(selectedDate).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <span className="text-3xl">{moodData[selectedDate].emoji}</span>
            </div>
            {moodData[selectedDate].note && (
              <p className="text-gray-600">{moodData[selectedDate].note}</p>
            )}
            <Link
              href={`/diary/${selectedDate}`}
              className="text-purple-600 hover:underline text-sm mt-2 inline-block"
            >
              查看当日日记 →
            </Link>
          </div>
        )}

        {/* Mood Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">📊 心情分布</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((mood) => {
              const count = moodStats[mood] || 0;
              const total = Object.values(moodStats).reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={mood} className="flex items-center gap-3">
                  <span className="text-2xl">{moodEmojis[mood]}</span>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${moodColors[mood]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-16 text-right">
                    {count} 天 ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/mood" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition text-center">
            <div className="text-2xl mb-1">📝</div>
            <div className="text-sm text-gray-700">记录心情</div>
          </Link>
          <Link href="/mood/stats" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition text-center">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-sm text-gray-700">心情统计</div>
          </Link>
          <Link href="/mood/trends" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition text-center">
            <div className="text-2xl mb-1">📈</div>
            <div className="text-sm text-gray-700">心情趋势</div>
          </Link>
          <Link href="/insights" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition text-center">
            <div className="text-2xl mb-1">💡</div>
            <div className="text-sm text-gray-700">情绪洞察</div>
          </Link>
        </div>
      </main>

      {/* Back */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <Link href="/" className="text-purple-600 hover:underline">
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}