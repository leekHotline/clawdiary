"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface HeatmapDay {
  date: string;
  count: number;
  words: number;
  mood: string;
}

interface Stats {
  totalDays: number;
  totalEntries: number;
  totalWords: number;
  avgWordsPerDay: number;
  longestStreak: number;
  currentStreak: number;
  bestDay: { date: string; words: number } | null;
  busiestMonth: { month: number; count: number } | null;
}

const moodColors: Record<string, string> = {
  happy: "bg-yellow-400",
  sad: "bg-blue-400",
  peaceful: "bg-green-400",
  excited: "bg-pink-400",
  anxious: "bg-purple-400",
  grateful: "bg-amber-400",
  neutral: "bg-gray-400",
};

const moodEmojis: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  peaceful: "😌",
  excited: "🎉",
  anxious: "😰",
  grateful: "🙏",
  neutral: "😐",
};

const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

export default function HeatmapPage() {
  const [year] = useState(new Date().getFullYear());
  const [heatmapData, setHeatmapData] = useState<HeatmapDay[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<HeatmapDay | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetchHeatmap();
  }, [year]);

  const fetchHeatmap = async () => {
    try {
      const res = await fetch(`/api/stats/heatmap?year=${year}`);
      const data = await res.json();
      setHeatmapData(data.heatmap || []);
      setStats(data.stats);
    } catch (err) {
      console.error("获取热力图数据失败:", err);
    } finally {
      setLoading(false);
    }
  };

  const getIntensity = (day: HeatmapDay | undefined) => {
    if (!day) return "bg-gray-100";
    if (day.count >= 4) return "bg-green-600";
    if (day.count >= 3) return "bg-green-500";
    if (day.count >= 2) return "bg-green-400";
    return "bg-green-300";
  };

  const generateCalendar = () => {
    const weeks: (HeatmapDay | null)[][] = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    // 找到第一周的开始（周日）
    let currentWeek: (HeatmapDay | null)[] = new Array(startDate.getDay()).fill(null);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      const dayData = heatmapData.find(h => h.date === dateStr) || {
        date: dateStr,
        count: 0,
        words: 0,
        mood: "neutral",
      };
      
      currentWeek.push(dayData);
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    // 填充最后一周
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  const handleMouseEnter = (day: HeatmapDay | null, e: React.MouseEvent) => {
    if (day && day.count > 0) {
      setHoveredDay(day);
      setTooltipPos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const weeks = generateCalendar();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* 头部 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-green-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/stats"
                className="p-2 hover:bg-green-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">写作热力图</h1>
                <p className="text-sm text-gray-500">{year} 年的写作活动记录</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">少</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded bg-gray-100" />
                <div className="w-3 h-3 rounded bg-green-300" />
                <div className="w-3 h-3 rounded bg-green-400" />
                <div className="w-3 h-3 rounded bg-green-500" />
                <div className="w-3 h-3 rounded bg-green-600" />
              </div>
              <span className="text-sm text-gray-500">多</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* 统计卡片 */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-green-600">{stats.currentStreak}</div>
              <div className="text-sm text-gray-500">当前连续天数</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-emerald-600">{stats.longestStreak}</div>
              <div className="text-sm text-gray-500">最长连续天数</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-teal-600">{stats.totalDays}</div>
              <div className="text-sm text-gray-500">写作天数</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-cyan-600">{stats.totalWords.toLocaleString()}</div>
              <div className="text-sm text-gray-500">总字数</div>
            </div>
          </motion.div>
        )}

        {/* 热力图 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg overflow-x-auto"
        >
          <div className="inline-block min-w-full">
            {/* 月份标签 */}
            <div className="flex mb-2 pl-8">
              {monthNames.map((month, i) => (
                <div
                  key={month}
                  className="text-xs text-gray-500"
                  style={{ width: `${100 / 12}%`, textAlign: "left" }}
                >
                  {i % 2 === 0 ? month.slice(0, 2) : ""}
                </div>
              ))}
            </div>

            <div className="flex">
              {/* 星期标签 */}
              <div className="flex flex-col gap-1 mr-2">
                {weekDays.map((day, i) => (
                  <div
                    key={day}
                    className="h-3 text-xs text-gray-400 flex items-center justify-end pr-2"
                    style={{ height: "12px" }}
                  >
                    {i % 2 === 1 ? day : ""}
                  </div>
                ))}
              </div>

              {/* 热力图格子 */}
              <div className="flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((day, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`w-3 h-3 rounded-sm cursor-pointer transition-transform hover:scale-125 ${getIntensity(
                          day
                        )} ${day?.count ? "ring-1 ring-transparent hover:ring-green-300" : ""}`}
                        onMouseEnter={(e) => handleMouseEnter(day, e)}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 最佳记录 */}
        {stats && stats.bestDay && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 bg-white rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📝 最佳记录</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg">
                <span className="text-3xl">🏆</span>
                <div>
                  <div className="text-sm text-gray-500">写作最多的一天</div>
                  <div className="font-semibold text-gray-800">
                    {new Date(stats.bestDay.date).toLocaleDateString("zh-CN")}
                  </div>
                  <div className="text-amber-600 font-medium">
                    {stats.bestDay.words.toLocaleString()} 字
                  </div>
                </div>
              </div>
              {stats.busiestMonth && (
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <span className="text-3xl">📅</span>
                  <div>
                    <div className="text-sm text-gray-500">最活跃的月份</div>
                    <div className="font-semibold text-gray-800">
                      {monthNames[stats.busiestMonth.month - 1]}
                    </div>
                    <div className="text-green-600 font-medium">
                      {stats.busiestMonth.count} 篇日记
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* 年度概览 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 年度概览</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">
                {stats?.totalEntries || 0}
              </div>
              <div className="text-sm text-gray-500">总日记数</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">
                {stats?.avgWordsPerDay || 0}
              </div>
              <div className="text-sm text-gray-500">日均字数</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">
                {Math.round((stats?.totalDays || 0) / 365 * 100)}%
              </div>
              <div className="text-sm text-gray-500">年度覆盖率</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-800">
                {Math.round((stats?.totalDays || 0) / 7)}
              </div>
              <div className="text-sm text-gray-500">写作周数</div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* 悬浮提示 */}
      {hoveredDay && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-sm rounded-lg px-3 py-2 pointer-events-none shadow-lg"
          style={{
            left: tooltipPos.x + 10,
            top: tooltipPos.y - 40,
          }}
        >
          <div className="font-medium">
            {new Date(hoveredDay.date).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div className="text-gray-300">
            {moodEmojis[hoveredDay.mood]} {hoveredDay.count} 篇 · {hoveredDay.words} 字
          </div>
        </div>
      )}
    </div>
  );
}