"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';

// 心情配置
const moodConfig: Record<string, { emoji: string; color: string; bg: string; name: string }> = {
  happy: { emoji: '😊', color: 'from-yellow-400 to-amber-500', bg: 'bg-yellow-100', name: '开心' },
  calm: { emoji: '😌', color: 'from-green-400 to-emerald-500', bg: 'bg-green-100', name: '平静' },
  excited: { emoji: '🎉', color: 'from-pink-400 to-rose-500', bg: 'bg-pink-100', name: '兴奋' },
  grateful: { emoji: '🙏', color: 'from-amber-400 to-orange-500', bg: 'bg-amber-100', name: '感恩' },
  sad: { emoji: '😢', color: 'from-blue-400 to-indigo-500', bg: 'bg-blue-100', name: '难过' },
  anxious: { emoji: '😰', color: 'from-purple-400 to-violet-500', bg: 'bg-purple-100', name: '焦虑' },
  angry: { emoji: '😤', color: 'from-red-400 to-rose-500', bg: 'bg-red-100', name: '愤怒' },
  tired: { emoji: '😴', color: 'from-gray-400 to-slate-500', bg: 'bg-gray-100', name: '疲惫' },
};

const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

// 生成模拟的每日心情数据
function generateMoodData(year: number, month: number): Record<number, string> {
  const moods = Object.keys(moodConfig);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const data: Record<number, string> = {};
  
  for (let day = 1; day <= daysInMonth; day++) {
    // 70% 概率有心情记录
    if (Math.random() > 0.3) {
      data[day] = moods[Math.floor(Math.random() * moods.length)];
    }
  }
  
  return data;
}

// 计算统计数据
function calculateStats(moodData: Record<number, string>) {
  const counts: Record<string, number> = {};
  Object.values(moodData).forEach(mood => {
    counts[mood] = (counts[mood] || 0) + 1;
  });
  
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  
  return { counts, sorted, total, topMood: sorted[0]?.[0] };
}

export default function MoodCalendarPage() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  // 生成当月心情数据
  const moodData = useMemo(() => generateMoodData(currentYear, currentMonth), [currentYear, currentMonth]);
  const stats = useMemo(() => calculateStats(moodData), [moodData]);
  
  // 获取月份信息
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // 生成日历格子
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  
  // 上/下月导航
  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear(y => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };
  
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear(y => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };
  
  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setSelectedDay(today.getDate());
  };
  
  const isToday = (day: number) => 
    day === today.getDate() && 
    currentMonth === today.getMonth() && 
    currentYear === today.getFullYear();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl" />
      </div>
      
      <main className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-purple-600 inline-flex items-center gap-1">
            ← 返回首页
          </Link>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-white/70 text-purple-600 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
          >
            今天
          </button>
        </div>
        
        {/* 标题 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-purple-600 mb-4">
            <span>📅</span>
            <span>情绪日历</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {months[currentMonth]} {currentYear}
          </h1>
          <p className="text-gray-500">可视化你的情绪变化，发现内心规律</p>
        </div>
        
        {/* 月份导航 */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <button
            onClick={goToPrevMonth}
            className="p-3 bg-white/70 backdrop-blur-sm rounded-xl hover:bg-white/90 transition-colors shadow-sm"
          >
            ←
          </button>
          <div className="px-6 py-2 bg-white/70 backdrop-blur-sm rounded-xl font-semibold text-gray-800 min-w-[160px] text-center">
            {currentYear}年{currentMonth + 1}月
          </div>
          <button
            onClick={goToNextMonth}
            className="p-3 bg-white/70 backdrop-blur-sm rounded-xl hover:bg-white/90 transition-colors shadow-sm"
          >
            →
          </button>
        </div>
        
        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-white/50">
            <div className="text-2xl font-bold text-purple-600">{stats.total}</div>
            <div className="text-xs text-gray-500">记录天数</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-white/50">
            <div className="text-2xl font-bold text-pink-600">{stats.sorted.length}</div>
            <div className="text-xs text-gray-500">情绪种类</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-white/50">
            <div className="text-2xl">
              {stats.topMood ? moodConfig[stats.topMood]?.emoji : '❓'}
            </div>
            <div className="text-xs text-gray-500">主要心情</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-white/50">
            <div className="text-2xl font-bold text-green-600">
              {Math.round((stats.total / daysInMonth) * 100)}%
            </div>
            <div className="text-xs text-gray-500">记录率</div>
          </div>
        </div>
        
        {/* 日历主体 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 mb-8">
          {/* 星期头部 */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {weekdays.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* 日期格子 */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }
              
              const mood = moodData[day];
              const moodInfo = mood ? moodConfig[mood] : null;
              const isSelected = selectedDay === day;
              const todayClass = isToday(day) ? 'ring-2 ring-purple-400 ring-offset-2' : '';
              
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`
                    aspect-square rounded-xl flex flex-col items-center justify-center gap-1
                    transition-all hover:scale-105 cursor-pointer
                    ${moodInfo ? `bg-gradient-to-br ${moodInfo.color} text-white shadow-md` : 'bg-gray-50 hover:bg-gray-100'}
                    ${isSelected ? 'ring-2 ring-purple-500 ring-offset-2 scale-105' : ''}
                    ${todayClass}
                  `}
                >
                  <span className="text-xs font-medium">{day}</span>
                  {moodInfo && <span className="text-lg">{moodInfo.emoji}</span>}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* 选中日期详情 */}
        {selectedDay && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">
                {currentMonth + 1}月{selectedDay}日
              </h3>
              {moodData[selectedDay] && (
                <span className={`px-3 py-1 rounded-full text-sm ${moodConfig[moodData[selectedDay]]?.bg}`}>
                  {moodConfig[moodData[selectedDay]]?.emoji} {moodConfig[moodData[selectedDay]]?.name}
                </span>
              )}
            </div>
            
            {moodData[selectedDay] ? (
              <div className="space-y-3">
                <p className="text-gray-600">
                  这一天你感到{moodConfig[moodData[selectedDay]]?.name}，心情指数不错！
                </p>
                <Link
                  href={`/diary/${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`}
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700"
                >
                  查看当天日记 →
                </Link>
              </div>
            ) : (
              <p className="text-gray-400">这一天没有心情记录</p>
            )}
          </div>
        )}
        
        {/* 心情图例 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
          <h3 className="font-semibold text-gray-800 mb-4">🎨 心情图例</h3>
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(moodConfig).map(([key, info]) => {
              const count = stats.counts[key] || 0;
              return (
                <div
                  key={key}
                  className={`flex items-center gap-2 p-3 rounded-xl ${info.bg} transition-all hover:scale-105`}
                >
                  <span className="text-2xl">{info.emoji}</span>
                  <div>
                    <div className="font-medium text-gray-800">{info.name}</div>
                    <div className="text-xs text-gray-500">{count} 次</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* 洞察卡片 */}
        <div className="mt-8 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-amber-500/10 rounded-2xl p-6 border border-white/50">
          <div className="flex items-start gap-4">
            <div className="text-3xl">💡</div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">本月洞察</h3>
              <p className="text-gray-600">
                {stats.topMood ? (
                  <>
                    这个月你的主要心情是 <strong>{moodConfig[stats.topMood]?.name}</strong>，
                    共记录了 <strong>{stats.total}</strong> 天，
                    记录率 <strong>{Math.round((stats.total / daysInMonth) * 100)}%</strong>。
                    {stats.total >= 20 ? ' 很棒！坚持记录让你更了解自己。' : ' 继续加油，每天记录一点，发现更多自己。'}
                  </>
                ) : (
                  '这个月还没有心情记录，开始记录吧！'
                )}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}