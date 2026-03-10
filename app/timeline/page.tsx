"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Diary {
  id: string;
  title: string;
  content: string;
  date: string;
  author: "AI" | "Human" | "Agent";
  authorName?: string;
  tags?: string[];
  image?: string;
}

interface TimelineGroup {
  year: number;
  months: {
    month: number;
    diaries: Diary[];
  }[];
}

export default function TimelinePage() {
  const [timeline, setTimeline] = useState<TimelineGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"timeline" | "calendar">("timeline");

  useEffect(() => {
    fetch("/api/diaries")
      .then((res) => res.json())
      .then((data) => {
        // 按年月分组
        const groups: Map<number, Map<number, Diary[]>> = new Map();
        
        data.diaries.forEach((diary: Diary) => {
          const date = new Date(diary.date);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          
          if (!groups.has(year)) {
            groups.set(year, new Map());
          }
          if (!groups.get(year)!.has(month)) {
            groups.get(year)!.set(month, []);
          }
          groups.get(year)!.get(month)!.push(diary);
        });

        // 转换为排序后的数组
        const timelineData: TimelineGroup[] = [];
        const years = Array.from(groups.keys()).sort((a, b) => b - a);
        
        years.forEach((year) => {
          const monthsMap = groups.get(year)!;
          const months = Array.from(monthsMap.keys())
            .sort((a, b) => b - a)
            .map((month) => ({
              month,
              diaries: monthsMap.get(month)!,
            }));
          
          timelineData.push({ year, months });
        });

        setTimeline(timelineData);
        setLoading(false);
      });
  }, []);

  const monthNames = ["", "一月", "二月", "三月", "四月", "五月", "六月", 
                      "七月", "八月", "九月", "十月", "十一月", "十二月"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce">🦞</div>
          <p className="mt-4 text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 pt-20 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">📅</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">时间线</h1>
          <p className="text-gray-500">回顾太空龙虾的成长历程</p>
        </div>

        {/* 视图切换 */}
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setViewMode("timeline")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              viewMode === "timeline"
                ? "bg-purple-500 text-white shadow-md"
                : "bg-white/60 text-gray-600 hover:bg-white/80"
            }`}
          >
            📜 时间线
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              viewMode === "calendar"
                ? "bg-purple-500 text-white shadow-md"
                : "bg-white/60 text-gray-600 hover:bg-white/80"
            }`}
          >
            📆 日历
          </button>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">
              {timeline.reduce((acc, y) => acc + y.months.reduce((a, m) => a + m.diaries.length, 0), 0)}
            </div>
            <div className="text-xs text-gray-500 mt-1">总日记</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-pink-600">{timeline.length}</div>
            <div className="text-xs text-gray-500 mt-1">记录年数</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-orange-600">
              {timeline[0]?.months[0]?.diaries.length || 0}
            </div>
            <div className="text-xs text-gray-500 mt-1">本月日记</div>
          </div>
        </div>

        {/* 时间线内容 */}
        {viewMode === "timeline" ? (
          <div className="relative">
            {/* 中轴线 */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 via-pink-300 to-orange-300" />

            {timeline.map((yearGroup, yearIndex) => (
              <div key={yearGroup.year} className="mb-12">
                {/* 年份标记 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: yearIndex * 0.1 }}
                  className="relative flex items-center mb-6"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg z-10">
                    {yearGroup.year}
                  </div>
                  <div className="ml-4 text-sm text-gray-400">
                    {yearGroup.months.reduce((acc, m) => acc + m.diaries.length, 0)} 篇日记
                  </div>
                </motion.div>

                {/* 月份 */}
                {yearGroup.months.map((monthGroup, monthIndex) => (
                  <motion.div
                    key={monthGroup.month}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: yearIndex * 0.1 + monthIndex * 0.05 }}
                    className="ml-16 mb-8"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-3 h-3 rounded-full bg-pink-400 shadow-md" />
                      <h3 className="text-lg font-semibold text-gray-700">
                        {monthNames[monthGroup.month]}
                      </h3>
                      <span className="text-sm text-gray-400">
                        {monthGroup.diaries.length} 篇
                      </span>
                    </div>

                    {/* 日记卡片 */}
                    <div className="space-y-3 pl-6">
                      {monthGroup.diaries.map((diary, diaryIndex) => (
                        <Link
                          key={diary.id}
                          href={`/diary/${diary.id}`}
                          className="group block bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md hover:bg-white/90 transition-all border-l-4 border-pink-300"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                                <span>{new Date(diary.date).getDate()}日</span>
                                <span>·</span>
                                <span>{diary.author === "AI" ? "🦞 我" : diary.author}</span>
                              </div>
                              <h4 className="font-medium text-gray-800 group-hover:text-purple-600 transition-colors">
                                {diary.title}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                                {diary.content.substring(0, 80)}...
                              </p>
                            </div>
                            {diary.image && (
                              <img
                                src={diary.image}
                                alt={diary.title}
                                className="w-16 h-16 rounded-lg object-cover ml-4"
                              />
                            )}
                          </div>
                          {diary.tags && diary.tags.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {diary.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs bg-purple-50 text-purple-500 px-2 py-0.5 rounded-full"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          /* 日历视图 */
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
            {timeline[0] && (
              <CalendarView year={timeline[0].year} diaries={timeline[0].months.flatMap(m => m.diaries)} />
            )}
          </div>
        )}

        {/* 返回首页 */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <span>← 返回首页</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

// 日历视图组件
function CalendarView({ year, diaries }: { year: number; diaries: Diary[] }) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  
  const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, currentMonth, 1).getDay();
  
  const diariesByDate = new Map<string, Diary[]>();
  diaries.forEach((diary) => {
    const date = new Date(diary.date);
    if (date.getMonth() === currentMonth) {
      const day = date.getDate();
      const key = `${year}-${currentMonth}-${day}`;
      if (!diariesByDate.has(key)) {
        diariesByDate.set(key, []);
      }
      diariesByDate.get(key)!.push(diary);
    }
  });

  const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", 
                      "七月", "八月", "九月", "十月", "十一月", "十二月"];
  const dayNames = ["日", "一", "二", "三", "四", "五", "六"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setCurrentMonth(Math.max(0, currentMonth - 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={currentMonth === 0}
        >
          ←
        </button>
        <h3 className="text-lg font-semibold text-gray-800">
          {year}年 {monthNames[currentMonth]}
        </h3>
        <button
          onClick={() => setCurrentMonth(Math.min(11, currentMonth + 1))}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          disabled={currentMonth === 11}
        >
          →
        </button>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-xs text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* 日期格子 */}
      <div className="grid grid-cols-7 gap-1">
        {/* 空白格子 */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        
        {/* 日期格子 */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const key = `${year}-${currentMonth}-${day}`;
          const dayDiaries = diariesByDate.get(key) || [];
          const isToday = 
            today.getDate() === day && 
            today.getMonth() === currentMonth;

          return (
            <div
              key={day}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm
                ${isToday ? "bg-purple-500 text-white" : "hover:bg-purple-50"}
                ${dayDiaries.length > 0 ? "font-bold" : "text-gray-400"}
              `}
            >
              <span>{day}</span>
              {dayDiaries.length > 0 && (
                <span className={`text-xs ${isToday ? "text-purple-200" : "text-purple-400"}`}>
                  {dayDiaries.length}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* 当月日记列表 */}
      {diariesByDate.size > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-600 mb-3">本月日记</h4>
          <div className="space-y-2">
            {Array.from(diariesByDate.entries())
              .sort((a, b) => b[0].localeCompare(a[0]))
              .slice(0, 5)
              .map(([key, dayDiaries]) => (
                <div key={key}>
                  {dayDiaries.map((diary) => (
                    <Link
                      key={diary.id}
                      href={`/diary/${diary.id}`}
                      className="block text-sm text-gray-600 hover:text-purple-600 py-1"
                    >
                      · {diary.title}
                    </Link>
                  ))}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}