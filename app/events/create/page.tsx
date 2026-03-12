'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    endTime: '',
    location: '',
    repeat: 'none',
    reminder: '30',
    participants: '',
    color: 'blue',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    router.push('/events');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            ✨ 创建活动
          </h1>
          <p className="text-gray-600 mt-1">填写活动信息，开始组织您的活动</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              活动标题 *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="输入活动标题"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                开始时间 *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                时间 *
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📍 地点
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              placeholder="活动地点或线上链接"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📝 活动描述
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              placeholder="描述活动内容和安排"
            />
          </div>

          {/* Repeat */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔄 重复
            </label>
            <select
              value={formData.repeat}
              onChange={(e) => setFormData({ ...formData, repeat: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
            >
              <option value="none">不重复</option>
              <option value="daily">每天</option>
              <option value="weekly">每周</option>
              <option value="monthly">每月</option>
              <option value="yearly">每年</option>
            </select>
          </div>

          {/* Reminder */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ⏰ 提醒时间
            </label>
            <select
              value={formData.reminder}
              onChange={(e) => setFormData({ ...formData, reminder: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
            >
              <option value="5">5 分钟前</option>
              <option value="15">15 分钟前</option>
              <option value="30">30 分钟前</option>
              <option value="60">1 小时前</option>
              <option value="1440">1 天前</option>
            </select>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🎨 颜色标签
            </label>
            <div className="flex gap-3">
              {[
                { value: 'blue', color: 'bg-blue-500' },
                { value: 'green', color: 'bg-green-500' },
                { value: 'purple', color: 'bg-purple-500' },
                { value: 'orange', color: 'bg-orange-500' },
                { value: 'pink', color: 'bg-pink-500' },
                { value: 'red', color: 'bg-red-500' },
              ].map(({ value, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: value })}
                  className={`w-8 h-8 rounded-full ${color} ${
                    formData.color === value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Participants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              👥 参与者（用逗号分隔邮箱）
            </label>
            <textarea
              rows={2}
              value={formData.participants}
              onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500"
              placeholder="email1@example.com, email2@example.com"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-4 py-3 border rounded-xl hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? '创建中...' : '创建活动'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}