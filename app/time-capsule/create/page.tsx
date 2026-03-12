'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateTimeCapsulePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    unlockDate: '',
    unlockTime: '12:00',
    mood: '😊',
    tags: '',
    isPublic: false,
    allowShared: false,
  });

  const moods = ['😊', '😢', '😤', '🥰', '😴', '🤔', '😄', '😎', '🥺', '😅'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const unlockAt = new Date(`${formData.unlockDate}T${formData.unlockTime}`);
      
      const response = await fetch('/api/time-capsule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          unlockAt: unlockAt.toISOString(),
          mood: formData.mood,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
          isPublic: formData.isPublic,
          allowShared: formData.allowShared,
        }),
      });

      if (response.ok) {
        router.push('/time-capsule/pending');
      }
    } catch (error) {
      console.error('Failed to create time capsule:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 计算最小日期（明天）
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // 计算最大日期（10年后）
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 10);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-900">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/time-capsule" 
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <span className="mr-2">←</span>
            返回时光胶囊
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <span className="mr-2">📮</span>
            创建时光胶囊
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            写一封给未来的信，设定解锁时间
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              胶囊标题 *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="给未来的自己"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            />
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              写给未来 *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="写下你想对未来的自己说的话..."
              rows={8}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              required
            />
            <div className="text-right text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formData.content.length} 字
            </div>
          </div>

          {/* Unlock Time */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              📅 解锁时间 *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">日期</label>
                <input
                  type="date"
                  value={formData.unlockDate}
                  onChange={(e) => setFormData({ ...formData, unlockDate: e.target.value })}
                  min={minDate}
                  max={maxDate.toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">时间</label>
                <input
                  type="time"
                  value={formData.unlockTime}
                  onChange={(e) => setFormData({ ...formData, unlockTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            {formData.unlockDate && (
              <div className="mt-3 text-sm text-purple-600 dark:text-purple-400">
                🔒 将于 {new Date(`${formData.unlockDate}T${formData.unlockTime}`).toLocaleString('zh-CN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })} 解锁
              </div>
            )}
          </div>

          {/* Mood */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              😊 当前心情
            </label>
            <div className="flex flex-wrap gap-2">
              {moods.map((mood) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setFormData({ ...formData, mood })}
                  className={`w-10 h-10 rounded-full text-xl transition-all ${
                    formData.mood === mood
                      ? 'bg-purple-100 dark:bg-purple-900/50 ring-2 ring-purple-500 scale-110'
                      : 'bg-gray-100 dark:bg-gray-700 hover:scale-105'
                  }`}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              🏷️ 标签
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="用逗号分隔，如：生日, 目标, 愿望"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Options */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">⚙️ 选项</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="w-5 h-5 rounded text-purple-500 focus:ring-purple-500"
                />
                <span className="text-gray-700 dark:text-gray-300">公开胶囊（解锁后所有人可见）</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.allowShared}
                  onChange={(e) => setFormData({ ...formData, allowShared: e.target.checked })}
                  className="w-5 h-5 rounded text-purple-500 focus:ring-purple-500"
                />
                <span className="text-gray-700 dark:text-gray-300">允许共创（邀请好友一起写）</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Link
              href="/time-capsule"
              className="flex-1 py-3 px-4 text-center border border-gray-200 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title || !formData.content || !formData.unlockDate}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium rounded-full hover:from-purple-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '创建中...' : '🔒 封存胶囊'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}