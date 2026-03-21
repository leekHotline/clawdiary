'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Diary {
  id: string;
  title: string;
  date: string;
  mood?: string;
  wordCount?: number;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  hasDiary: boolean;
  diary?: Diary;
  isToday: boolean;
}

interface Stats {
  totalDiaries: number;
  currentStreak: number;
  longestStreak: number;
  thisMonth: number;
  thisWeek: number;
}

export default function WritingCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [calendar, setCalendar] = useState<CalendarDay[][]>([]);
  const [stats, setStats] = useState<Stats>({
    totalDiaries: 0,
    currentStreak: 0,
    longestStreak: 0,
    thisMonth: 0,
    thisWeek: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  useEffect(() => {
    fetchDiaries();
  }, []);

  useEffect(() => {
    if (diaries.length > 0) {
      generateCalendar();
      calculateStats();
    }
  }, [diaries, currentDate]);

  const fetchDiaries = async () => {
    try {
      const res = await fetch('/api/diaries');
      const data = await res.json();
      setDiaries(data);
    } catch (error) {
      console.error('Failed to fetch diaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days: CalendarDay[] = [];
    
    // 上个月的填充天数
    const firstDayOfWeek = firstDay.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      const dateStr = date.toISOString().split('T')[0];
      const diary = diaries.find(d => d.date === dateStr);
      days.push({
        date,
        isCurrentMonth: false,
        hasDiary: !!diary,
        diary,
        isToday: date.getTime() === today.getTime(),
      });
    }

    // 当前月的天数
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const diary = diaries.find(d => d.date === dateStr);
      days.push({
        date,
        isCurrentMonth: true,
        hasDiary: !!diary,
        diary,
        isToday: date.getTime() === today.getTime(),
      });
    }

    // 下个月的填充天数
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      const dateStr = date.toISOString().split('T')[0];
      const diary = diaries.find(d => d.date === dateStr);
      days.push({
        date,
        isCurrentMonth: false,
        hasDiary: !!diary,
        diary,
        isToday: date.getTime() === today.getTime(),
      });
    }

    // 分成周
    const weeks: CalendarDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    setCalendar(weeks);
  };

  const calculateStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // 本月日记数
    const thisMonth = diaries.filter(d => {
      const date = new Date(d.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;

    // 本周日记数
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const thisWeek = diaries.filter(d => {
      const date = new Date(d.date);
      return date >= weekStart && date <= today;
    }).length;

    // 计算连续天数
    const sortedDates = diaries
      .map(d => d.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // 当前连续天数
    const checkDate = new Date(today);
    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (sortedDates.includes(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (i === 0) {
        // 今天没写，检查昨天
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // 最长连续天数
    const dateSet = new Set(sortedDates);
    const allDates: Date[] = [];
    const minDate = sortedDates.length > 0 ? new Date(sortedDates[sortedDates.length - 1]) : today;
    const maxDate = sortedDates.length > 0 ? new Date(sortedDates[0]) : today;
    
    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
      allDates.push(new Date(d));
    }

    tempStreak = 0;
    for (const date of allDates) {
      const dateStr = date.toISOString().split('T')[0];
      if (dateSet.has(dateStr)) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    setStats({
      totalDiaries: diaries.length,
      currentStreak,
      longestStreak,
      thisMonth,
      thisWeek,
    });
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getMoodEmoji = (mood?: string) => {
    const moodMap: Record<string, string> = {
      happy: '😊',
      excited: '🤩',
      calm: '😌',
      sad: '😢',
      angry: '😠',
      anxious: '😰',
      grateful: '🙏',
      tired: '😴',
    };
    return mood ? moodMap[mood] || '📝' : '📝';
  };

  const getStreakMessage = () => {
    if (stats.currentStreak === 0) return '今天还没写日记哦～';
    if (stats.currentStreak === 1) return '好的开始！继续保持！';
    if (stats.currentStreak < 7) return `${stats.currentStreak}天了！坚持就是胜利！`;
    if (stats.currentStreak < 30) return `太棒了！${stats.currentStreak}天连续写作！`;
    if (stats.currentStreak < 100) return `厉害！${stats.currentStreak}天！你是写作高手！`;
    return `传奇！${stats.currentStreak}天！你是写作大师！`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">加载日历...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-10 w-40 h-40 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-5xl mx-auto px-4 py-8">
        {/* 头部 */}
        <header className="mb-8">
          <Link href="/" className="text-indigo-600 hover:text-indigo-700 text-sm mb-4 inline-block">
            ← 返回首页
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📅 写作打卡日历</h1>
              <p className="text-gray-500 mt-1">记录每一天的写作足迹</p>
            </div>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              今天
            </button>
          </div>
        </header>

        {/* 打卡统计 */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm border border-white/50">
            <div className="text-4xl font-bold text-indigo-600">{stats.currentStreak}</div>
            <div className="text-sm text-gray-500 mt-1">🔥 连续打卡</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm border border-white/50">
            <div className="text-4xl font-bold text-purple-600">{stats.longestStreak}</div>
            <div className="text-sm text-gray-500 mt-1">🏆 最长记录</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm border border-white/50">
            <div className="text-4xl font-bold text-blue-600">{stats.thisMonth}</div>
            <div className="text-sm text-gray-500 mt-1">📚 本月日记</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm border border-white/50">
            <div className="text-4xl font-bold text-green-600">{stats.thisWeek}</div>
            <div className="text-sm text-gray-500 mt-1">✍️ 本周日记</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm border border-white/50 col-span-2 md:col-span-1">
            <div className="text-4xl font-bold text-orange-600">{stats.totalDiaries}</div>
            <div className="text-sm text-gray-500 mt-1">📝 总日记数</div>
          </div>
        </div>

        {/* 激励消息 */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl p-4 mb-8 text-white text-center">
          <p className="text-lg font-medium">{getStreakMessage()}</p>
        </div>

        {/* 日历 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 overflow-hidden mb-8">
          {/* 月份导航 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ← 上月
            </button>
            <h2 className="text-xl font-bold text-gray-900">
              {currentDate.getFullYear()} 年 {currentDate.getMonth() + 1} 月
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              下月 →
            </button>
          </div>

          {/* 星期标题 */}
          <div className="grid grid-cols-7 bg-gray-50">
            {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
              <div key={day} className="py-3 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* 日历格子 */}
          <div className="grid grid-cols-7">
            {calendar.flat().map((day, index) => (
              <div
                key={index}
                onClick={() => day.hasDiary && setSelectedDay(day)}
                className={`
                  min-h-[80px] p-2 border-b border-r border-gray-100 cursor-pointer transition-all
                  ${!day.isCurrentMonth ? 'bg-gray-50/50' : ''}
                  ${day.isToday ? 'bg-indigo-50 ring-2 ring-indigo-500 ring-inset' : ''}
                  ${day.hasDiary ? 'hover:bg-indigo-50' : 'hover:bg-gray-50'}
                `}
              >
                <div className={`
                  text-sm font-medium mb-1
                  ${day.isToday ? 'text-indigo-600' : day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                `}>
                  {day.date.getDate()}
                </div>
                {day.hasDiary && (
                  <div className="flex flex-col items-center">
                    <span className="text-2xl">{getMoodEmoji(day.diary?.mood)}</span>
                    <span className="text-xs text-gray-500 truncate w-full text-center">
                      {day.diary?.wordCount || 0}字
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 图例 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/50 mb-8">
          <h3 className="font-medium text-gray-700 mb-3">📊 图例说明</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-indigo-50 ring-2 ring-indigo-500 rounded"></div>
              <span className="text-gray-600">今天</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📝</span>
              <span className="text-gray-600">已写日记</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">😊</span>
              <span className="text-gray-600">心情标记</span>
            </div>
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/write"
            className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-2xl p-5 text-center hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl mb-2">✍️</div>
            <div className="font-medium">写日记</div>
          </Link>
          <Link
            href="/stats"
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm border border-white/50 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">📊</div>
            <div className="font-medium text-gray-700">数据统计</div>
          </Link>
          <Link
            href="/achievements"
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm border border-white/50 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">🏆</div>
            <div className="font-medium text-gray-700">成就系统</div>
          </Link>
          <Link
            href="/habits"
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm border border-white/50 hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">🎯</div>
            <div className="font-medium text-gray-700">习惯追踪</div>
          </Link>
        </div>
      </main>

      {/* 日记详情弹窗 */}
      {selectedDay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedDay.date.toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>
              <button
                onClick={() => setSelectedDay(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            {selectedDay.diary && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-700">{selectedDay.diary.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedDay.diary.wordCount || 0} 字
                  </p>
                </div>
                <Link
                  href={`/diary/${selectedDay.diary.id}`}
                  className="block w-full py-3 bg-indigo-600 text-white text-center rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  查看详情 →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}