'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [rsvpStatus, setRsvpStatus] = useState<'pending' | 'going' | 'maybe' | 'not-going'>('pending');

  const event = {
    id: params.id as string,
    title: '团队周会',
    date: '2026-03-15',
    time: '10:00',
    endTime: '11:30',
    location: '会议室 A / Zoom 线上',
    description: `议程：
1. 上周工作回顾
2. 本周工作计划
3. 项目进度更新
4. 问题讨论`,
    color: 'blue',
    repeat: 'weekly',
    reminder: '30',
    organizer: {
      name: 'Alex',
      avatar: '🦞',
    },
    participants: [
      { id: '1', name: '张三', avatar: '👨', status: 'going' },
      { id: '2', name: '李四', avatar: '👩', status: 'going' },
      { id: '3', name: '王五', avatar: '👦', status: 'maybe' },
      { id: '4', name: '赵六', avatar: '👧', status: 'pending' },
      { id: '5', name: '钱七', avatar: '🧑', status: 'not-going' },
    ],
    relatedDiaries: [
      { id: 'd1', title: '会议笔记：产品迭代方向', date: '2026-03-08' },
      { id: 'd2', title: '团队协作心得', date: '2026-03-01' },
    ],
  };

  const handleRsvp = async (status: 'going' | 'maybe' | 'not-going') => {
    setRsvpStatus(status);
  };

  const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
    going: { label: '参加', color: 'bg-green-100 text-green-800', icon: '✅' },
    maybe: { label: '可能', color: 'bg-yellow-100 text-yellow-800', icon: '🤔' },
    'not-going': { label: '不参加', color: 'bg-red-100 text-red-800', icon: '❌' },
    pending: { label: '待定', color: 'bg-gray-100 text-gray-800', icon: '⏳' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          ← 返回日历
        </button>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-4 h-4 rounded-full bg-blue-500" />
                <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <span>📅 {event.date}</span>
                <span>🕐 {event.time} - {event.endTime}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                ✏️ 编辑
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-red-50 text-red-600">
                🗑️ 删除
              </button>
            </div>
          </div>

          {/* Location */}
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 text-gray-700">
              <span className="text-xl">📍</span>
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        {/* RSVP Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">我的状态</h2>
          <div className="flex gap-3">
            {(['going', 'maybe', 'not-going'] as const).map((status) => (
              <button
                key={status}
                onClick={() => handleRsvp(status)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                  rsvpStatus === status
                    ? `${statusConfig[status].color} ring-2 ring-offset-2`
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <span>{statusConfig[status].icon}</span>
                <span>{statusConfig[status].label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📝 活动描述</h2>
          <div className="prose prose-gray">
            <pre className="whitespace-pre-wrap font-sans text-gray-700">{event.description}</pre>
          </div>
        </div>

        {/* Participants */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            👥 参与者 ({event.participants.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {event.participants.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.avatar}</span>
                  <span className="font-medium">{p.name}</span>
                </div>
                <span className={`text-sm px-2 py-1 rounded ${statusConfig[p.status].color}`}>
                  {statusConfig[p.status].icon}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Diaries */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">📖 相关日记</h2>
          <div className="space-y-3">
            {event.relatedDiaries.map((diary) => (
              <a
                key={diary.id}
                href={`/diary/${diary.id}`}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium">{diary.title}</span>
                <span className="text-sm text-gray-500">{diary.date}</span>
              </a>
            ))}
          </div>
          <button className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition-colors">
            + 添加相关日记
          </button>
        </div>
      </div>
    </div>
  );
}