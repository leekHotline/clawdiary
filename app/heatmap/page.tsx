'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

interface HeatmapData {
  date: string;
  count: number;
  words: number;
  mood: number | null;
}

interface HeatmapStats {
  totalDays: number;
  activeDays: number;
  totalWords: number;
  avgWordsPerDay: number;
  longestStreak: number;
  currentStreak: number;
  bestDay: { date: string; words: number } | null;
}

const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
const DAYS = ['日', '一', '二', '三', '四', '五', '六'];

export default function HeatmapPage() {
  const [data, setData] = useState<HeatmapData[]>([]);
  const [stats, setStats] = useState<HeatmapStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [hoveredDay, setHoveredDay] = useState<HeatmapData | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchHeatmapData();
  }, [year]);

  const fetchHeatmapData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/stats/heatmap?year=${year}`);
      if (res.ok) {
        const result = await res.json();
        setData(result.data || []);
        setStats(result.stats || null);
      }
    } catch (error) {
      console.error('Failed to fetch heatmap:', error);
    } finally {
      setLoading(false);
    }
  };

  const heatmapGrid = useMemo(() => {
    const grid: (HeatmapData | null)[][] = [];
    const dataMap = new Map(data.map(d => [d.date, d]));
    
    // Get the first day of the year
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    // Adjust to start from Sunday
    let currentWeek: (HeatmapData | null)[] = new Array(7).fill(null);
    let dayOfWeek = startDate.getDay();
    
    // Fill initial empty days
    for (let i = 0; i < dayOfWeek; i++) {
      currentWeek[i] = null;
    }
    
    // Iterate through all days of the year
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayData = dataMap.get(dateStr) || { date: dateStr, count: 0, words: 0, mood: null };
      
      currentWeek[currentDate.getDay()] = dayData;
      
      // If it's Saturday, push the week and start a new one
      if (currentDate.getDay() === 6) {
        grid.push(currentWeek);
        currentWeek = new Array(7).fill(null);
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Push the last week if not empty
    if (currentWeek.some(d => d !== null)) {
      grid.push(currentWeek);
    }
    
    return grid;
  }, [data, year]);

  const getIntensityClass = (words: number, count: number) => {
    if (count === 0) return 'bg-gray-100';
    if (words === 0) return 'bg-gray-100';
    if (words < 100) return 'bg-green-200';
    if (words < 300) return 'bg-green-300';
    if (words < 500) return 'bg-green-400';
    if (words < 1000) return 'bg-green-500';
    return 'bg-green-600';
  };

  const handleMouseMove = (e: React.MouseEvent, day: HeatmapData | null) => {
    if (!day) return;
    setHoveredDay(day);
    setHoverPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  const maxValue = useMemo(() => {
    return Math.max(...data.map(d => d.words), 1);
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl">🦞</Link>
            <h1 className="text-xl font-bold">写作热力图</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setYear(year - 1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ←
            </button>
            <span className="font-medium w-16 text-center">{year}</span>
            <button
              onClick={() => setYear(Math.min(year + 1, new Date().getFullYear()))}
              disabled={year >= new Date().getFullYear()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-xl p-4 border">
              <div className="text-sm text-gray-500">活跃天数</div>
              <div className="text-2xl font-bold text-green-600">{stats.activeDays}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border">
              <div className="text-sm text-gray-500">总字数</div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalWords.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border">
              <div className="text-sm text-gray-500">日均字数</div>
              <div className="text-2xl font-bold text-purple-600">{stats.avgWordsPerDay}</div>
            </div>
            <div className="bg-white rounded-xl p-4 border">
              <div className="text-sm text-gray-500">最长连续</div>
              <div className="text-2xl font-bold text-orange-600">{stats.longestStreak} 天</div>
            </div>
            <div className="bg-white rounded-xl p-4 border">
              <div className="text-sm text-gray-500">当前连续</div>
              <div className="text-2xl font-bold text-pink-600">{stats.currentStreak} 天</div>
            </div>
            <div className="bg-white rounded-xl p-4 border">
              <div className="text-sm text-gray-500">最佳单日</div>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.bestDay ? stats.bestDay.words.toLocaleString() : '-'}
              </div>
            </div>
          </div>
        )}

        {/* Year Selector */}
        <div className="bg-white rounded-2xl p-6 border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">{year} 年写作记录</h2>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>少</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded bg-gray-100" />
                <div className="w-4 h-4 rounded bg-green-200" />
                <div className="w-4 h-4 rounded bg-green-300" />
                <div className="w-4 h-4 rounded bg-green-400" />
                <div className="w-4 h-4 rounded bg-green-500" />
                <div className="w-4 h-4 rounded bg-green-600" />
              </div>
              <span>多</span>
            </div>
          </div>

          {/* Month Labels */}
          <div className="flex gap-1 mb-2 pl-8">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="flex-1 text-xs text-gray-400 text-center"
                style={{ minWidth: '20px' }}
              >
                {MONTHS[i].slice(0, 2)}
              </div>
            ))}
          </div>

          {/* Heatmap Grid */}
          <div className="overflow-x-auto">
            <div className="inline-flex gap-1">
              {/* Day Labels */}
              <div className="flex flex-col gap-1 mr-1">
                {DAYS.map((day, i) => (
                  <div
                    key={i}
                    className="h-3 text-xs text-gray-400 flex items-center"
                    style={{ fontSize: '10px' }}
                  >
                    {i % 2 === 1 ? day : ''}
                  </div>
                ))}
              </div>

              {/* Weeks */}
              {heatmapGrid.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => (
                    <div
                      key={dayIndex}
                      className={`w-3 h-3 rounded-sm cursor-pointer transition-transform hover:scale-150 ${
                        day ? getIntensityClass(day.words, day.count) : 'bg-transparent'
                      }`}
                      onMouseMove={(e) => handleMouseMove(e, day)}
                      onMouseLeave={handleMouseLeave}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="bg-white rounded-2xl p-6 border">
          <h2 className="text-lg font-semibold mb-6">月度统计</h2>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {MONTHS.map((month, i) => {
              const monthData = data.filter(d => {
                const date = new Date(d.date);
                return date.getMonth() === i;
              });
              const totalWords = monthData.reduce((sum, d) => sum + d.words, 0);
              const activeDays = monthData.filter(d => d.count > 0).length;
              
              return (
                <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="font-medium text-gray-700">{month}</div>
                  <div className="text-2xl font-bold text-green-600 mt-1">
                    {(totalWords / 1000).toFixed(1)}k
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {activeDays} 天活跃
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Writing Time Distribution */}
        <div className="bg-white rounded-2xl p-6 border">
          <h2 className="text-lg font-semibold mb-6">写作时段分布</h2>
          <div className="space-y-4">
            {['00-06', '06-12', '12-18', '18-24'].map((period, i) => {
              const periodNames = ['深夜', '上午', '下午', '晚上'];
              const percentage = [15, 25, 35, 25][i]; // Mock data
              return (
                <div key={period} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-gray-500">{periodNames[i]}</div>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-12 text-right text-sm font-medium">{percentage}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Days */}
        <div className="bg-white rounded-2xl p-6 border">
          <h2 className="text-lg font-semibold mb-6">最高产的日子 TOP 10</h2>
          <div className="space-y-3">
            {data
              .filter(d => d.words > 0)
              .sort((a, b) => b.words - a.words)
              .slice(0, 10)
              .map((day, i) => (
                <div key={day.date} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className="text-lg font-bold text-gray-400 w-8">#{i + 1}</div>
                  <div className="flex-1">
                    <div className="font-medium">{new Date(day.date).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      weekday: 'long',
                    })}</div>
                    <div className="text-sm text-gray-500">{day.count} 篇日记</div>
                  </div>
                  <div className="text-xl font-bold text-green-600">{day.words.toLocaleString()} 字</div>
                </div>
              ))}
          </div>
        </div>
      </main>

      {/* Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none"
          style={{
            left: hoverPosition.x + 10,
            top: hoverPosition.y - 40,
          }}
        >
          <div className="font-medium">{new Date(hoveredDay.date).toLocaleDateString('zh-CN')}</div>
          <div className="text-gray-300">
            {hoveredDay.words.toLocaleString()} 字 · {hoveredDay.count} 篇
          </div>
        </div>
      )}
    </div>
  );
}