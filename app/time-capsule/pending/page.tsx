'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TimeCapsule {
  id: string;
  title: string;
  content: string;
  unlockAt: string;
  mood: string;
  tags: string[];
  createdAt: string;
  isLocked: boolean;
}

export default function PendingCapsulesPage() {
  const [capsules, setCapsules] = useState<TimeCapsule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCapsules();
  }, []);

  const fetchCapsules = async () => {
    try {
      const response = await fetch('/api/time-capsule?status=pending');
      if (response.ok) {
        const data = await response.json();
        setCapsules(data.capsules || []);
      }
    } catch (_error) {
      console.error('Failed to fetch capsules:', _error);
    } finally {
      setLoading(false);
    }
  };

  const getRemainingTime = (unlockAt: string) => {
    const now = new Date();
    const unlock = new Date(unlockAt);
    const diff = unlock.getTime() - now.getTime();
    
    if (diff <= 0) return { text: '可以解锁', urgent: true };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 365) {
      const years = Math.floor(days / 365);
      return { text: `约 ${years} 年`, urgent: false };
    }
    if (days > 30) {
      const months = Math.floor(days / 30);
      return { text: `约 ${months} 个月`, urgent: false };
    }
    if (days > 0) {
      return { text: `${days} 天 ${hours} 小时`, urgent: days <= 7 };
    }
    if (hours > 0) {
      return { text: `${hours} 小时 ${minutes} 分钟`, urgent: true };
    }
    return { text: `${minutes} 分钟`, urgent: true };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/time-capsule" 
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <span className="mr-2">←</span>
            返回时光胶囊
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <span className="mr-2">🔒</span>
                待解锁胶囊
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                等待时间的礼物
              </p>
            </div>
            <Link
              href="/time-capsule/create"
              className="px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
            >
              + 创建胶囊
            </Link>
          </div>
        </div>

        {/* Capsules List */}
        {capsules.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              还没有待解锁的胶囊
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              创建第一个时光胶囊，给未来的自己写封信吧
            </p>
            <Link
              href="/time-capsule/create"
              className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
            >
              <span className="mr-2">✨</span>
              创建时光胶囊
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {capsules.map((capsule) => {
              const remaining = getRemainingTime(capsule.unlockAt);
              return (
                <div
                  key={capsule.id}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">{capsule.mood}</span>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {capsule.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {capsule.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span>🕐 {new Date(capsule.unlockAt).toLocaleString('zh-CN')}</span>
                        <span>•</span>
                        <span>创建于 {new Date(capsule.createdAt).toLocaleDateString('zh-CN')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${remaining.urgent ? 'text-orange-500' : 'text-purple-500'}`}>
                        {remaining.text}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        后解锁
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Timeline */}
        {capsules.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📅 解锁时间线</h2>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 via-indigo-400 to-blue-400"></div>
              <div className="space-y-6 pl-10">
                {capsules.slice(0, 5).map((capsule, index) => (
                  <div key={capsule.id} className="relative">
                    <div className={`absolute -left-8 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                      index === 0 ? 'bg-purple-500' : 'bg-purple-300 dark:bg-purple-700'
                    }`}></div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {capsule.title}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(capsule.unlockAt).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}