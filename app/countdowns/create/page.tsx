'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const TYPE_OPTIONS = [
  { value: 'birthday', icon: '🎂', label: '生日', color: 'pink' },
  { value: 'anniversary', icon: '💕', label: '纪念日', color: 'red' },
  { value: 'holiday', icon: '🎉', label: '节日', color: 'purple' },
  { value: 'reminder', icon: '⏰', label: '提醒', color: 'orange' },
  { value: 'custom', icon: '📅', label: '自定义', color: 'blue' },
];

const COLOR_OPTIONS = [
  { value: 'pink', label: '粉色', class: 'from-pink-400 to-rose-500' },
  { value: 'red', label: '红色', class: 'from-red-400 to-rose-600' },
  { value: 'purple', label: '紫色', class: 'from-purple-400 to-indigo-500' },
  { value: 'blue', label: '蓝色', class: 'from-blue-400 to-cyan-500' },
  { value: 'orange', label: '橙色', class: 'from-orange-400 to-amber-500' },
  { value: 'green', label: '绿色', class: 'from-green-400 to-emerald-500' },
];

const REPEAT_OPTIONS = [
  { value: 'none', label: '不重复' },
  { value: 'yearly', label: '每年重复' },
  { value: 'monthly', label: '每月重复' },
  { value: 'weekly', label: '每周重复' },
];

export default function CreateCountdownPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetDate: '',
    type: 'custom',
    icon: '',
    color: 'purple',
    repeat: 'none',
    isPrivate: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.targetDate) {
      alert('请填写标题和目标日期');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/countdowns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push('/countdowns');
      } else {
        const error = await res.json();
        alert(error.error || '创建失败');
      }
    } catch (_error) {
      console.error('Failed to create countdown:', _error);
      alert('创建失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const selectedType = TYPE_OPTIONS.find(t => t.value === formData.type);
  const selectedColor = COLOR_OPTIONS.find(c => c.value === formData.color);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/countdowns"
              className="p-2 hover:bg-purple-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-purple-800">新建倒计时</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Preview Card */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${selectedColor?.class}`} />
            <div className="p-6 text-center">
              <div className="text-4xl mb-3">
                {formData.icon || selectedType?.icon || '📅'}
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                {formData.title || '倒计时标题'}
              </h3>
              {formData.targetDate && (
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(formData.targetDate).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span>📝</span> 基本信息
            </h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="例如：结婚纪念日"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                maxLength={50}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                描述
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="添加一些备注..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={3}
                maxLength={200}
              />
            </div>

            {/* Target Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                目标日期 <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Type & Style */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span>🎨</span> 类型与样式
            </h2>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                类型
              </label>
              <div className="grid grid-cols-5 gap-2">
                {TYPE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: option.value })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.type === option.value
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{option.icon}</div>
                    <div className="text-xs text-gray-600">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                自定义图标
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="输入 emoji，如 🎁 🎊 🏠"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                maxLength={4}
              />
              <p className="text-xs text-gray-400 mt-1">留空则使用类型默认图标</p>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                颜色主题
              </label>
              <div className="flex gap-2 flex-wrap">
                {COLOR_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, color: option.value })}
                    className={`w-10 h-10 rounded-full bg-gradient-to-r ${option.class} ${
                      formData.color === option.value
                        ? 'ring-2 ring-offset-2 ring-purple-500'
                        : ''
                    }`}
                    title={option.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <span>⚙️</span> 高级选项
            </h2>

            {/* Repeat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                重复周期
              </label>
              <select
                value={formData.repeat}
                onChange={(e) => setFormData({ ...formData, repeat: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {REPEAT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Privacy */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-700">私密倒计时</div>
                <div className="text-xs text-gray-400">开启后只有自己可见</div>
              </div>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, isPrivate: !formData.isPrivate })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  formData.isPrivate ? 'bg-purple-500' : 'bg-gray-200'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                    formData.isPrivate ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.title.trim() || !formData.targetDate}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? '创建中...' : '创建倒计时'}
          </button>
        </form>
      </main>
    </div>
  );
}