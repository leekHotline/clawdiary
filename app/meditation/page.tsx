'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

const techniqueOptions = [
  '深呼吸', '数息法', '观呼吸', '身体觉察', '声音觉察',
  '念头观察', '慈悲观', '四念处', '内观', '止观双运',
  '持咒', '观想', '脉轮冥想', '太极', '瑜伽'
];

export default function MeditationPage() {
  const router = useRouter();
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    avgDuration: 0,
    streak: 0,
    thisWeek: 0,
    thisMonth: 0
  });

  const [formData, setFormData] = useState({
    title: '',
    type: 'mindfulness',
    duration: 15,
    date: new Date().toISOString().split('T')[0],
    mood: 'calm',
    notes: '',
    focus_level: 7,
    techniques: [] as string[]
  });

  useEffect(() => {
    fetchMeditations();
    fetchStats();
  }, []);

  const fetchMeditations = async () => {
    try {
      const res = await fetch('/api/meditation');
      const data = await res.json();
      setMeditations(data.meditations || []);
    } catch (_error) {
      console.error('Failed to fetch meditations:', _error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/meditation/stats');
      const data = await res.json();
      setStats(data.stats || stats);
    } catch (_error) {
      console.error('Failed to fetch stats:', _error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/meditation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setShowForm(false);
        setFormData({
          title: '',
          type: 'mindfulness',
          duration: 15,
          date: new Date().toISOString().split('T')[0],
          mood: 'calm',
          notes: '',
          focus_level: 7,
          techniques: []
        });
        fetchMeditations();
        fetchStats();
      }
    } catch (_error) {
      console.error('Failed to create meditation:', _error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这条冥想记录吗？')) return;
    try {
      await fetch(`/api/meditation/${id}`, { method: 'DELETE' });
      fetchMeditations();
      fetchStats();
    } catch (_error) {
      console.error('Failed to delete meditation:', _error);
    }
  };

  const toggleTechnique = (technique: string) => {
    setFormData(prev => ({
      ...prev,
      techniques: prev.techniques.includes(technique)
        ? prev.techniques.filter(t => t !== technique)
        : [...prev.techniques, technique]
    }));
  };

  const getTypeInfo = (type: string) => {
    return meditationTypes.find(t => t.value === type) || meditationTypes[0];
  };

  const getMoodInfo = (mood: string) => {
    return moodOptions.find(m => m.value === mood) || moodOptions[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                🧘 冥想记录
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                记录你的冥想之旅，培养内心的平静
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              开始冥想
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <div className="text-2xl mb-1">🧘</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.totalSessions}</div>
            <div className="text-sm text-gray-500">总次数</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <div className="text-2xl mb-1">⏱️</div>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalMinutes}</div>
            <div className="text-sm text-gray-500">总分钟</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{stats.avgDuration}</div>
            <div className="text-sm text-gray-500">平均分钟</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.streak}</div>
            <div className="text-sm text-gray-500">连续天数</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <div className="text-2xl mb-1">📅</div>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.thisWeek}</div>
            <div className="text-sm text-gray-500">本周</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
            <div className="text-2xl mb-1">🗓️</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.thisMonth}</div>
            <div className="text-sm text-gray-500">本月</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-6">
          <Link href="/meditation/history" className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all text-gray-700 dark:text-gray-300 flex items-center gap-2">
            📜 历史记录
          </Link>
          <Link href="/meditation/stats" className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-all text-gray-700 dark:text-gray-300 flex items-center gap-2">
            📊 详细统计
          </Link>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">记录冥想</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">标题</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="给这次冥想起个名字..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">日期</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">冥想类型</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {meditationTypes.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: type.value })}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        formData.type === type.value
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {type.icon} {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    时长（分钟）: {formData.duration}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="120"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1分钟</span>
                    <span>60分钟</span>
                    <span>120分钟</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    专注度: {formData.focus_level}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.focus_level}
                    onChange={(e) => setFormData({ ...formData, focus_level: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>分心</span>
                    <span>专注</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">冥想后心情</label>
                <div className="flex flex-wrap gap-2">
                  {moodOptions.map(mood => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, mood: mood.value })}
                      className={`px-3 py-2 rounded-lg text-sm transition-all ${
                        formData.mood === mood.value
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {mood.emoji} {mood.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">使用的技巧</label>
                <div className="flex flex-wrap gap-2">
                  {techniqueOptions.map(technique => (
                    <button
                      key={technique}
                      type="button"
                      onClick={() => toggleTechnique(technique)}
                      className={`px-3 py-1 rounded-full text-sm transition-all ${
                        formData.techniques.includes(technique)
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {technique}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">笔记</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white min-h-[100px]"
                  placeholder="记录这次冥想的感受、想法..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all font-medium"
                >
                  保存记录
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Recent Meditations */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">最近的冥想</h2>
          {loading ? (
            <div className="text-center py-8 text-gray-500">加载中...</div>
          ) : meditations.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🧘</div>
              <p className="text-gray-500 dark:text-gray-400 mb-4">还没有冥想记录</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all"
              >
                开始第一次冥想
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {meditations.slice(0, 10).map((meditation) => {
                const typeInfo = getTypeInfo(meditation.type);
                const moodInfo = getMoodInfo(meditation.mood);
                return (
                  <div
                    key={meditation.id}
                    className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{typeInfo.icon}</span>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {meditation.title || typeInfo.label}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {meditation.duration} 分钟
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>{meditation.date}</span>
                          <span>专注度: {meditation.focus_level}/10</span>
                          <span>{moodInfo.emoji} {moodInfo.label}</span>
                        </div>
                        {meditation.notes && (
                          <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm line-clamp-2">
                            {meditation.notes}
                          </p>
                        )}
                        {meditation.techniques.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
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
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}