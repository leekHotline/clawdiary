'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SleepRecord {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
  quality: number;
  mood: string;
  notes: string;
  factors: string[];
}

export default function SleepPage() {
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    bedtime: '23:00',
    wakeTime: '07:00',
    quality: 3,
    mood: 'good',
    notes: '',
    factors: [] as string[],
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await fetch('/api/sleep/log');
      const data = await res.json();
      setRecords(data.records || []);
    } catch (error) {
      console.error('Failed to fetch sleep records:', error);
      // Demo data
      setRecords([
        {
          id: '1',
          date: '2026-03-12',
          bedtime: '23:30',
          wakeTime: '07:00',
          duration: 7.5,
          quality: 4,
          mood: 'refreshed',
          notes: '睡得不错，梦见在太空漫步',
          factors: ['冥想', '温水澡'],
        },
        {
          id: '2',
          date: '2026-03-11',
          bedtime: '00:15',
          wakeTime: '07:30',
          duration: 7.25,
          quality: 3,
          mood: 'okay',
          notes: '睡前看了手机，有点难入睡',
          factors: ['手机'],
        },
        {
          id: '3',
          date: '2026-03-10',
          bedtime: '22:45',
          wakeTime: '06:30',
          duration: 7.75,
          quality: 5,
          mood: 'great',
          notes: '完美的一天！',
          factors: ['冥想', '运动', '早睡'],
        },
        {
          id: '4',
          date: '2026-03-09',
          bedtime: '01:00',
          wakeTime: '08:00',
          duration: 7,
          quality: 2,
          mood: 'tired',
          notes: '熬夜了，精神不好',
          factors: ['咖啡', '晚班'],
        },
        {
          id: '5',
          date: '2026-03-08',
          bedtime: '23:00',
          wakeTime: '06:45',
          duration: 7.75,
          quality: 4,
          mood: 'good',
          notes: '规律作息的感觉真好',
          factors: ['冥想'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const calculateDuration = (bedtime: string, wakeTime: string): number => {
    const [bedH, bedM] = bedtime.split(':').map(Number);
    const [wakeH, wakeM] = wakeTime.split(':').map(Number);
    
    let hours = wakeH - bedH;
    let mins = wakeM - bedM;
    
    if (hours < 0) hours += 24;
    if (mins < 0) {
      mins += 60;
      hours -= 1;
    }
    
    return Math.round((hours + mins / 60) * 100) / 100;
  };

  const addRecord = async () => {
    const duration = calculateDuration(newRecord.bedtime, newRecord.wakeTime);
    
    const record: SleepRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...newRecord,
      duration,
    };
    
    setRecords([record, ...records]);
    setShowLogModal(false);
    
    try {
      await fetch('/api/sleep/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
    } catch (error) {
      console.error('Failed to save sleep record:', error);
    }
  };

  const toggleFactor = (factor: string) => {
    const factors = newRecord.factors.includes(factor)
      ? newRecord.factors.filter(f => f !== factor)
      : [...newRecord.factors, factor];
    setNewRecord({ ...newRecord, factors });
  };

  const moodOptions = [
    { value: 'great', label: '精力充沛', emoji: '🌟' },
    { value: 'refreshed', label: '精神焕发', emoji: '✨' },
    { value: 'good', label: '不错', emoji: '😊' },
    { value: 'okay', label: '一般', emoji: '😐' },
    { value: 'tired', label: '有点累', emoji: '😴' },
    { value: 'exhausted', label: '很累', emoji: '😵' },
  ];

  const factorOptions = ['冥想', '运动', '温水澡', '阅读', '早睡', '手机', '咖啡', '晚班', '压力', '噪音'];

  const avgDuration = records.length > 0
    ? (records.reduce((sum, r) => sum + r.duration, 0) / records.length).toFixed(1)
    : '0';
  const avgQuality = records.length > 0
    ? (records.reduce((sum, r) => sum + r.quality, 0) / records.length).toFixed(1)
    : '0';

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center">
        <div className="text-2xl text-white">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🌙 睡眠追踪</h1>
          <p className="text-indigo-200">记录你的睡眠，了解你的身体</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5">
            <div className="text-3xl font-bold text-white">{avgDuration}h</div>
            <div className="text-sm text-indigo-200">平均睡眠时长</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5">
            <div className="text-3xl font-bold text-yellow-300">{avgQuality}/5</div>
            <div className="text-sm text-indigo-200">平均睡眠质量</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5">
            <div className="text-3xl font-bold text-green-300">{records.length}</div>
            <div className="text-sm text-indigo-200">记录天数</div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex gap-3 mb-6">
          <Link
            href="/sleep/stats"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-xl hover:bg-white/20 transition text-white"
          >
            📊 睡眠统计
          </Link>
          <Link
            href="/sleep/history"
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-xl hover:bg-white/20 transition text-white"
          >
            📅 历史记录
          </Link>
        </div>

        {/* Recent Records */}
        <div className="space-y-3">
          {records.map((record) => (
            <div
              key={record.id}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 hover:bg-white/15 transition cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {moodOptions.find(m => m.value === record.mood)?.emoji || '😴'}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{record.date}</div>
                    <div className="text-sm text-indigo-200">
                      {record.bedtime} → {record.wakeTime}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{record.duration}h</div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < record.quality ? 'text-yellow-300' : 'text-gray-500'}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {record.notes && (
                <div className="text-sm text-indigo-200 mb-2">{record.notes}</div>
              )}
              
              {record.factors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {record.factors.map((factor, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-white/10 rounded-full text-xs text-indigo-200"
                    >
                      {factor}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowLogModal(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 transition text-2xl"
        >
          +
        </button>

        {/* Log Modal */}
        {showLogModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">🌙 记录昨晚睡眠</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">入睡时间</label>
                    <input
                      type="time"
                      value={newRecord.bedtime}
                      onChange={(e) => setNewRecord({ ...newRecord, bedtime: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">醒来时间</label>
                    <input
                      type="time"
                      value={newRecord.wakeTime}
                      onChange={(e) => setNewRecord({ ...newRecord, wakeTime: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">睡眠质量</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((q) => (
                      <button
                        key={q}
                        onClick={() => setNewRecord({ ...newRecord, quality: q })}
                        className={`flex-1 py-2 rounded-lg ${
                          newRecord.quality === q ? 'bg-yellow-400 text-white' : 'bg-gray-100'
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">醒来感觉</label>
                  <div className="grid grid-cols-3 gap-2">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.value}
                        onClick={() => setNewRecord({ ...newRecord, mood: mood.value })}
                        className={`py-2 px-3 rounded-lg text-sm flex items-center justify-center gap-1 ${
                          newRecord.mood === mood.value ? 'bg-indigo-100 ring-2 ring-indigo-500' : 'bg-gray-100'
                        }`}
                      >
                        <span>{mood.emoji}</span>
                        <span>{mood.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">影响因素</label>
                  <div className="flex flex-wrap gap-2">
                    {factorOptions.map((factor) => (
                      <button
                        key={factor}
                        onClick={() => toggleFactor(factor)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          newRecord.factors.includes(factor)
                            ? 'bg-indigo-500 text-white'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {factor}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                  <textarea
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                    placeholder="做了什么梦？有什么特别的感受？"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowLogModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={addRecord}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}