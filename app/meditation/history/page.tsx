'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Meditation {
  id: string;
  title: string;
  type: string;
  duration: number;
  date: string;
  mood: string;
  notes: string;
  focus_level: number;
  techniques: string[];
  created_at: string;
}

const meditationTypes = [
  { value: 'breathing', label: '呼吸冥想', icon: '🌬️' },
  { value: 'mindfulness', label: '正念冥想', icon: '🧘' },
  { value: 'guided', label: '引导冥想', icon: '🎧' },
  { value: 'body-scan', label: '身体扫描', icon: '👁️' },
  { value: 'loving-kindness', label: '慈心冥想', icon: '💚' },
  { value: 'walking', label: '行走冥想', icon: '🚶' },
  { value: 'transcendental', label: '超验冥想', icon: '✨' },
  { value: 'visualization', label: '可视化冥想', icon: '🌅' },
  { value: 'chanting', label: '唱诵冥想', icon: '🎵' },
  { value: 'zen', label: '禅修', icon: '⛩️' },
];

const moodOptions = [
  { value: 'calm', label: '平静', emoji: '😌' },
  { value: 'refreshed', label: '焕然一新', emoji: '✨' },
  { value: 'focused', label: '专注', emoji: '🎯' },
  { value: 'relaxed', label: '放松', emoji: '😊' },
  { value: 'peaceful', label: '宁静', emoji: '🕊️' },
  { value: 'energized', label: '充满能量', emoji: '⚡' },
  { value: 'grateful', label: '感恩', emoji: '🙏' },
  { value: 'neutral', label: '一般', emoji: '😐' },
];

export default function MeditationHistoryPage() {
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: '',
    mood: '',
    startDate: '',
    endDate: ''
  });
  const [groupBy, setGroupBy] = useState<'date' | 'type' | 'none'>('date');

  useEffect(() => {
    fetchHistory();
  }, [filter]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.type) params.append('type', filter.type);
      if (filter.mood) params.append('mood', filter.mood);
      if (filter.startDate) params.append('startDate', filter.startDate);
      if (filter.endDate) params.append('endDate', filter.endDate);
      
      const res = await fetch(`/api/meditation/history?${params.toString()}`);
      const data = await res.json();
      setMeditations(data.meditations || []);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条冥想记录吗？')) return;
    try {
      await fetch(`/api/meditation/${id}`, { method: 'DELETE' });
      fetchHistory();
    } catch (error) {
      console.error('Failed to delete meditation:', error);
    }
  };

  const getTypeInfo = (type: string) => {
    return meditationTypes.find(t => t.value === type) || meditationTypes[0];
  };

  const getMoodInfo = (mood: string) => {
    return moodOptions.find(m => m.value === mood) || moodOptions[0];
  };

  // Group meditations
  const groupedMeditations: Record<string, Meditation[]> = {};
  if (groupBy === 'date') {
    meditations.forEach(m => {
      const key = m.date;
      if (!groupedMeditations[key]) groupedMeditations[key] = [];
      groupedMeditations[key].push(m);
    });
  } else if (groupBy === 'type') {
    meditations.forEach(m => {
      const key = m.type;
      if (!groupedMeditations[key]) groupedMeditations[key] = [];
      groupedMeditations[key].push(m);
    });
  } else {
    groupedMeditations['all'] = meditations;
  }

  // Calculate totals
  const totalMinutes = meditations.reduce((sum, m) => sum + m.duration, 0);
  const avgDuration = meditations.length > 0 ? Math.round(totalMinutes / meditations.length) : 0;
  const avgFocus = meditations.length > 0 
    ? (meditations.reduce((sum, m) => sum + m.focus_level, 0) / meditations.length).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/meditation" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 mb-4 inline-block">
            ← 返回冥想
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            📜 冥想历史
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            回顾你的冥想旅程
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md text-center">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{meditations.length}</div>
            <div className="text-sm text-gray-500">总记录</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{totalMinutes}</div>
            <div className="text-sm text-gray-500">总分钟</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md text-center">
            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">{avgDuration}</div>
            <div className="text-sm text-gray-500">平均分钟</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{avgFocus}</div>
            <div className="text-sm text-gray-500">平均专注度</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-6">
          <div className="grid md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm text-gray-500 mb-1">冥想类型</label>
              <select
                value={filter.type}
                onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">全部类型</option>
                {meditationTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">心情</label>
              <select
                value={filter.mood}
                onChange={(e) => setFilter({ ...filter, mood: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">全部心情</option>
                {moodOptions.map(m => (
                  <option key={m.value} value={m.value}>{m.emoji} {m.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">开始日期</label>
              <input
                type="date"
                value={filter.startDate}
                onChange={(e) => setFilter({ ...filter, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">结束日期</label>
              <input
                type="date"
                value={filter.endDate}
                onChange={(e) => setFilter({ ...filter, endDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">分组方式</label>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="date">按日期</option>
                <option value="type">按类型</option>
                <option value="none">不分组</option>
              </select>
            </div>
          </div>
        </div>

        {/* History List */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">加载中...</div>
        ) : meditations.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 dark:text-gray-400">没有找到符合条件的记录</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedMeditations).map(([group, items]) => (
              <div key={group}>
                {groupBy !== 'none' && (
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 px-2">
                    {groupBy === 'date' ? `📅 ${group}` : `${getTypeInfo(group).icon} ${getTypeInfo(group).label}`}
                    <span className="text-sm font-normal text-gray-400 ml-2">
                      {items.length} 次冥想 · {items.reduce((sum, m) => sum + m.duration, 0)} 分钟
                    </span>
                  </h3>
                )}
                <div className="space-y-3">
                  {items.map((meditation) => {
                    const typeInfo = getTypeInfo(meditation.type);
                    const moodInfo = getMoodInfo(meditation.mood);
                    return (
                      <div
                        key={meditation.id}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl">{typeInfo.icon}</span>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  {meditation.title || typeInfo.label}
                                </h4>
                                <div className="flex items-center gap-3 text-sm text-gray-500">
                                  <span>{meditation.date}</span>
                                  <span>⏱️ {meditation.duration} 分钟</span>
                                  <span>🎯 专注度 {meditation.focus_level}/10</span>
                                  <span>{moodInfo.emoji} {moodInfo.label}</span>
                                </div>
                              </div>
                            </div>
                            {meditation.notes && (
                              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm pl-9">
                                {meditation.notes}
                              </p>
                            )}
                            {meditation.techniques.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2 pl-9">
                                {meditation.techniques.map(t => (
                                  <span key={t} className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleDelete(meditation.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors ml-4"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}