'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function EventsPage() {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const events = [
    { id: '1', title: '团队周会', date: '2026-03-15', time: '10:00', color: 'blue', participants: 8 },
    { id: '2', title: '产品评审', date: '2026-03-16', time: '14:00', color: 'green', participants: 5 },
    { id: '3', title: '生日派对', date: '2026-03-18', time: '18:00', color: 'purple', participants: 20 },
    { id: '4', title: '写作马拉松', date: '2026-03-20', time: '09:00', color: 'orange', participants: 15 },
    { id: '5', title: '读书分享会', date: '2026-03-22', time: '15:00', color: 'pink', participants: 10 },
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
  const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    green: 'bg-green-100 text-green-800 border-green-300',
    purple: 'bg-purple-100 text-purple-800 border-purple-300',
    orange: 'bg-orange-100 text-orange-800 border-orange-300',
    pink: 'bg-pink-100 text-pink-800 border-pink-300',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              📅 活动日历
            </h1>
            <p className="text-gray-600 mt-1">管理您的日程和活动</p>
          </div>
          <Link
            href="/events/create"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <span>➕</span>
            <span>创建活动</span>
          </Link>
        </div>

        {/* View Switcher */}
        <div className="flex gap-2 mb-6">
          {(['month', 'week', 'day'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                view === v
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border'
              }`}
            >
              {v === 'month' ? '月视图' : v === 'week' ? '周视图' : '日视图'}
            </button>
          ))}
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Month Navigation */}
          <div className="flex items-center justify-between p-4 border-b">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
              ◀
            </button>
            <h2 className="text-xl font-semibold">
              {currentDate.getFullYear()}年 {monthNames[currentDate.getMonth()]}
            </h2>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
              ▶
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 border-b">
            {dayNames.map((day) => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 bg-gray-50">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {/* Empty cells for days before first day of month */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-[100px] border-b border-r bg-gray-50"></div>
            ))}
            
            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);
              const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
              
              return (
                <div key={day} className={`min-h-[100px] border-b border-r p-2 ${isToday ? 'bg-indigo-50' : ''}`}>
                  <div className={`text-sm font-medium mb-1 ${isToday ? 'text-indigo-600' : 'text-gray-900'}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <Link
                        key={event.id}
                        href={`/events/${event.id}`}
                        className={`block text-xs p-1 rounded truncate ${colorClasses[event.color]}`}
                      >
                        {event.time} {event.title}
                      </Link>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500">+{dayEvents.length - 2} 更多</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">📌 即将到来的活动</h2>
          <div className="space-y-3">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="flex items-center justify-between p-4 rounded-xl border hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    event.color === 'blue' ? 'bg-blue-500' :
                    event.color === 'green' ? 'bg-green-500' :
                    event.color === 'purple' ? 'bg-purple-500' :
                    event.color === 'orange' ? 'bg-orange-500' :
                    'bg-pink-500'
                  }`} />
                  <div>
                    <div className="font-medium">{event.title}</div>
                    <div className="text-sm text-gray-500">{event.date} {event.time}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span>👥</span>
                  <span>{event.participants}人</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-2xl mb-2">📅</div>
            <div className="text-2xl font-bold">{events.length}</div>
            <div className="text-sm text-gray-500">本月活动</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-2xl mb-2">✅</div>
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-gray-500">已确认参加</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-2xl mb-2">⏰</div>
            <div className="text-2xl font-bold">1</div>
            <div className="text-sm text-gray-500">今日活动</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-2xl mb-2">🔄</div>
            <div className="text-2xl font-bold">2</div>
            <div className="text-sm text-gray-500">重复活动</div>
          </div>
        </div>
      </div>
    </div>
  );
}