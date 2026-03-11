'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Countdown {
  id: string;
  title: string;
  description?: string;
  targetDate: string;
  type: 'birthday' | 'anniversary' | 'holiday' | 'custom' | 'reminder';
  icon: string;
  color: string;
  repeat: 'none' | 'yearly' | 'monthly' | 'weekly';
  isPrivate: boolean;
  createdAt: string;
}

interface CountdownStats {
  total: number;
  upcoming: number;
  passed: number;
  nearestDays: number | null;
}

const TYPE_CONFIG = {
  birthday: { icon: '🎂', color: 'pink', label: '生日' },
  anniversary: { icon: '💕', color: 'red', label: '纪念日' },
  holiday: { icon: '🎉', color: 'purple', label: '节日' },
  custom: { icon: '📅', color: 'blue', label: '自定义' },
  reminder: { icon: '⏰', color: 'orange', label: '提醒' },
};

const COLOR_CLASSES = {
  pink: 'from-pink-400 to-rose-500',
  red: 'from-red-400 to-rose-600',
  purple: 'from-purple-400 to-indigo-500',
  blue: 'from-blue-400 to-cyan-500',
  orange: 'from-orange-400 to-amber-500',
  green: 'from-green-400 to-emerald-500',
};

export default function CountdownsPage() {
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [stats, setStats] = useState<CountdownStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'passed'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    fetchCountdowns();
    fetchStats();
    
    // Update time every second for live countdown
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchCountdowns = async () => {
    try {
      const res = await fetch('/api/countdowns');
      if (res.ok) {
        const data = await res.json();
        setCountdowns(data.countdowns || []);
      }
    } catch (error) {
      console.error('Failed to fetch countdowns:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/countdowns/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个倒计时吗？')) return;
    
    try {
      const res = await fetch(`/api/countdowns/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCountdowns(countdowns.filter(c => c.id !== id));
        fetchStats();
      }
    } catch (error) {
      console.error('Failed to delete countdown:', error);
    }
  };

  const calculateCountdown = (targetDate: string) => {
    const target = new Date(targetDate);
    const diff = target.getTime() - now.getTime();
    
    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds, passed: false };
  };

  const filteredCountdowns = countdowns.filter(c => {
    // Time filter
    const countdown = calculateCountdown(c.targetDate);
    if (filter === 'upcoming' && countdown.passed) return false;
    if (filter === 'passed' && !countdown.passed) return false;
    
    // Type filter
    if (typeFilter !== 'all' && c.type !== typeFilter) return false;
    
    // Search filter
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  const sortedCountdowns = [...filteredCountdowns].sort((a, b) => {
    const aCountdown = calculateCountdown(a.targetDate);
    const bCountdown = calculateCountdown(b.targetDate);
    
    // Passed items go to the end
    if (aCountdown.passed !== bCountdown.passed) {
      return aCountdown.passed ? 1 : -1;
    }
    
    // Sort by remaining time
    const aDiff = new Date(a.targetDate).getTime() - now.getTime();
    const bDiff = new Date(b.targetDate).getTime() - now.getTime();
    return aDiff - bDiff;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-xl text-purple-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⏰</span>
              <div>
                <h1 className="text-2xl font-bold text-purple-800">倒计时</h1>
                <p className="text-sm text-purple-600">铭记每一个重要时刻</p>
              </div>
            </div>
            <Link
              href="/countdowns/create"
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新建倒计时
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.total}</div>
              <div className="text-sm text-gray-500">总倒计时</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <div className="text-3xl font-bold text-green-600">{stats.upcoming}</div>
              <div className="text-sm text-gray-500">进行中</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <div className="text-3xl font-bold text-gray-400">{stats.passed}</div>
              <div className="text-sm text-gray-500">已到期</div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-4 text-center">
              <div className="text-3xl font-bold text-pink-600">
                {stats.nearestDays !== null ? `${stats.nearestDays}天` : '-'}
              </div>
              <div className="text-sm text-gray-500">最近倒计时</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="搜索倒计时..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Status Filter */}
            {['all', 'upcoming', 'passed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as typeof filter)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  filter === f
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? '全部' : f === 'upcoming' ? '进行中' : '已到期'}
              </button>
            ))}

            {/* Divider */}
            <div className="w-px bg-gray-200 mx-2" />

            {/* Type Filter */}
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                typeFilter === 'all'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              全部类型
            </button>
            {Object.entries(TYPE_CONFIG).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setTypeFilter(key)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  typeFilter === key
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {config.icon} {config.label}
              </button>
            ))}
          </div>
        </div>

        {/* Countdown Grid */}
        {sortedCountdowns.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">⏰</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {countdowns.length === 0 ? '还没有倒计时' : '没有匹配的倒计时'}
            </h3>
            <p className="text-gray-500 mb-4">
              {countdowns.length === 0 
                ? '创建你的第一个倒计时，记录重要时刻' 
                : '试试其他筛选条件'}
            </p>
            {countdowns.length === 0 && (
              <Link
                href="/countdowns/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                创建倒计时
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {sortedCountdowns.map((countdown) => {
              const typeConfig = TYPE_CONFIG[countdown.type];
              const { days, hours, minutes, seconds, passed } = calculateCountdown(countdown.targetDate);
              
              return (
                <div
                  key={countdown.id}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                    passed ? 'opacity-60' : ''
                  }`}
                >
                  {/* Color Bar */}
                  <div className={`h-2 bg-gradient-to-r ${COLOR_CLASSES[countdown.color as keyof typeof COLOR_CLASSES]}`} />
                  
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{countdown.icon || typeConfig.icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-800">{countdown.title}</h3>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-500">
                            {typeConfig.label}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(countdown.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Countdown Display */}
                    {passed ? (
                      <div className="text-center py-4">
                        <div className="text-2xl font-bold text-gray-400">已到期</div>
                        <div className="text-sm text-gray-400 mt-1">{formatDate(countdown.targetDate)}</div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3">
                          <div className="text-2xl font-bold text-purple-600">{days}</div>
                          <div className="text-xs text-gray-500">天</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3">
                          <div className="text-2xl font-bold text-purple-600">{hours}</div>
                          <div className="text-xs text-gray-500">时</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3">
                          <div className="text-2xl font-bold text-purple-600">{minutes}</div>
                          <div className="text-xs text-gray-500">分</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3">
                          <div className="text-2xl font-bold text-purple-600">{seconds}</div>
                          <div className="text-xs text-gray-500">秒</div>
                        </div>
                      </div>
                    )}

                    {/* Target Date */}
                    <div className="mt-4 text-sm text-gray-500">
                      📅 {formatDate(countdown.targetDate)}
                    </div>

                    {/* Description */}
                    {countdown.description && (
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                        {countdown.description}
                      </p>
                    )}

                    {/* Repeat Badge */}
                    {countdown.repeat !== 'none' && (
                      <div className="mt-3 text-xs text-purple-500 flex items-center gap-1">
                        🔄 {countdown.repeat === 'yearly' ? '每年重复' : countdown.repeat === 'monthly' ? '每月重复' : '每周重复'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}