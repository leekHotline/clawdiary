'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ReadingRecord {
  id: string;
  diaryId: string;
  diaryTitle: string;
  readAt: string;
  duration: number;
  progress: number;
  isCompleted: boolean;
  device: string;
}

interface ReadingStats {
  totalDiariesRead: number;
  totalReadingTime: number;
  avgReadingTime: number;
  completionRate: number;
  streakDays: number;
  longestStreak: number;
  favoriteTags: Array<{ tag: string; count: number }>;
  weeklyData: Array<{ day: string; minutes: number }>;
  topDiaries: Array<{ id: string; title: string; views: number }>;
}

export default function ReadingHistoryPage() {
  const [records, setRecords] = useState<ReadingRecord[]>([]);
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'stats'>('list');

  useEffect(() => {
    fetchRecords();
    fetchStats();
  }, [filter]);

  const fetchRecords = async () => {
    try {
      const params = new URLSearchParams();
      if (filter === 'completed') params.set('completed', 'true');
      if (filter === 'incomplete') params.set('completed', 'false');
      
      const res = await fetch(`/api/reading-history?${params}`);
      if (res.ok) {
        const data = await res.json();
        setRecords(data.records || []);
      }
    } catch (_error) {
      console.error('Failed to fetch records:', _error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/reading-history/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (_error) {
      console.error('Failed to fetch stats:', _error);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('确定要清空所有阅读记录吗？此操作不可恢复。')) return;
    
    try {
      const res = await fetch('/api/reading-history', { method: 'DELETE' });
      if (res.ok) {
        setRecords([]);
        fetchStats();
      }
    } catch (_error) {
      console.error('Failed to clear history:', _error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (minutes === 0) return `${secs}秒`;
    if (secs === 0) return `${minutes}分钟`;
    return `${minutes}分${secs}秒`;
  };

  const formatTotalTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}分钟`;
    if (mins === 0) return `${hours}小时`;
    return `${hours}小时${mins}分钟`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-xl text-emerald-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📖</span>
              <div>
                <h1 className="text-2xl font-bold text-emerald-800">阅读记录</h1>
                <p className="text-sm text-emerald-600">追踪你的阅读足迹</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                📋 记录列表
              </button>
              <button
                onClick={() => setViewMode('stats')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'stats'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                📊 阅读统计
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {viewMode === 'stats' && stats ? (
          /* Stats View */
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="text-4xl font-bold text-emerald-600">{stats.totalDiariesRead}</div>
                <div className="text-sm text-gray-500 mt-1">已读日记</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="text-4xl font-bold text-blue-600">{formatTotalTime(stats.totalReadingTime)}</div>
                <div className="text-sm text-gray-500 mt-1">总阅读时长</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="text-4xl font-bold text-orange-600">{stats.avgReadingTime}分钟</div>
                <div className="text-sm text-gray-500 mt-1">平均阅读</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="text-4xl font-bold text-purple-600">{stats.completionRate}%</div>
                <div className="text-sm text-gray-500 mt-1">完成率</div>
              </div>
            </div>

            {/* Streak */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">🔥 阅读连续性</h2>
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <div className="text-5xl font-bold text-orange-500">{stats.streakDays}</div>
                  <div className="text-sm text-gray-500 mt-1">当前连续天数</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-gray-400">{stats.longestStreak}</div>
                  <div className="text-sm text-gray-500 mt-1">最长连续天数</div>
                </div>
              </div>
            </div>

            {/* Weekly Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">📈 本周阅读时长</h2>
              <div className="flex items-end justify-around h-48 gap-2">
                {stats.weeklyData.map((day) => {
                  const maxMinutes = Math.max(...stats.weeklyData.map(d => d.minutes));
                  const height = (day.minutes / maxMinutes) * 100;
                  
                  return (
                    <div key={day.day} className="flex flex-col items-center gap-2 flex-1">
                      <div className="text-sm text-gray-500">{day.minutes}分钟</div>
                      <div 
                        className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-lg transition-all"
                        style={{ height: `${height}%`, minHeight: '10px' }}
                      />
                      <div className="text-sm text-gray-600">{day.day}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Favorite Tags */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">🏷️ 最常阅读的标签</h2>
              <div className="flex flex-wrap gap-3">
                {stats.favoriteTags.map((tag, index) => {
                  const sizes = ['text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-sm'];
                  const colors = [
                    'bg-emerald-100 text-emerald-700',
                    'bg-blue-100 text-blue-700',
                    'bg-purple-100 text-purple-700',
                    'bg-orange-100 text-orange-700',
                    'bg-pink-100 text-pink-700',
                  ];
                  
                  return (
                    <span
                      key={tag.tag}
                      className={`px-4 py-2 rounded-full ${sizes[index]} ${colors[index]} font-medium`}
                    >
                      {tag.tag} ({tag.count})
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Top Diaries */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">🏆 阅读最多的日记</h2>
              <div className="space-y-3">
                {stats.topDiaries.map((diary, index) => (
                  <Link
                    key={diary.id}
                    href={`/diary/${diary.id}`}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </span>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{diary.title}</div>
                      <div className="text-sm text-gray-500">{diary.views} 次阅读</div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* List View */
          <>
            {/* Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
              <div className="flex gap-2">
                {[
                  { value: 'all', label: '全部' },
                  { value: 'completed', label: '已完成' },
                  { value: 'incomplete', label: '未完成' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value as typeof filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === option.value
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                清空记录
              </button>
            </div>

            {/* Records List */}
            {records.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">📖</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">暂无阅读记录</h3>
                <p className="text-gray-500">开始阅读日记，记录你的阅读足迹</p>
                <Link
                  href="/"
                  className="inline-block mt-4 px-6 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors"
                >
                  浏览日记
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      {/* Status Icon */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        record.isCompleted 
                          ? 'bg-green-100' 
                          : 'bg-yellow-100'
                      }`}>
                        {record.isCompleted ? '✅' : '📖'}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <Link
                          href={`/diary/${record.diaryId}`}
                          className="font-medium text-gray-800 hover:text-emerald-600 transition-colors"
                        >
                          {record.diaryTitle}
                        </Link>
                        
                        {/* Progress Bar */}
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                            <span>阅读进度</span>
                            <span>{record.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                record.isCompleted
                                  ? 'bg-green-500'
                                  : 'bg-emerald-400'
                              }`}
                              style={{ width: `${record.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                          <span>⏱️ {formatDuration(record.duration)}</span>
                          <span>📱 {record.device}</span>
                          <span>📅 {formatDate(record.readAt)}</span>
                        </div>
                      </div>

                      {/* Continue Reading */}
                      {!record.isCompleted && (
                        <Link
                          href={`/diary/${record.diaryId}`}
                          className="self-center px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 transition-colors whitespace-nowrap"
                        >
                          继续阅读
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}