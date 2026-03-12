'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OpenedCapsule {
  id: string;
  title: string;
  content: string;
  unlockAt: string;
  openedAt: string;
  mood: string;
  tags: string[];
  createdAt: string;
  daysWaited: number;
}

export default function OpenedCapsulesPage() {
  const [capsules, setCapsules] = useState<OpenedCapsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCapsule, setSelectedCapsule] = useState<OpenedCapsule | null>(null);

  useEffect(() => {
    fetchCapsules();
  }, []);

  const fetchCapsules = async () => {
    try {
      const response = await fetch('/api/time-capsule?status=opened');
      if (response.ok) {
        const data = await response.json();
        setCapsules(data.capsules || []);
      }
    } catch (error) {
      console.error('Failed to fetch capsules:', error);
    } finally {
      setLoading(false);
    }
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
                <span className="mr-2">🎁</span>
                已解锁胶囊
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                回顾过去的时光礼物
              </p>
            </div>
            {capsules.length > 0 && (
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {capsules.length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  已开启
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Capsules Grid */}
        {capsules.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              还没有已解锁的胶囊
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              等待你创建的时光胶囊解锁吧
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {capsules.map((capsule) => (
              <div
                key={capsule.id}
                onClick={() => setSelectedCapsule(capsule)}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-2xl">{capsule.mood}</span>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {capsule.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {capsule.content.substring(0, 100)}...
                </p>
                
                <div className="flex flex-wrap gap-2 mb-3">
                  {capsule.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>🕐 {new Date(capsule.openedAt).toLocaleDateString('zh-CN')}</span>
                  <span className="text-purple-500 dark:text-purple-400 font-medium">
                    等待了 {capsule.daysWaited} 天
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Insights */}
        {capsules.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                {capsules.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">总胶囊数</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                {Math.round(capsules.reduce((sum, c) => sum + c.daysWaited, 0) / capsules.length)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">平均等待天数</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 text-center">
              <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-1">
                {capsules.reduce((sum, c) => sum + c.daysWaited, 0)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">累计等待天数</div>
            </div>
          </div>
        )}

        {/* Modal */}
        {selectedCapsule && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCapsule(null)}
          >
            <div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{selectedCapsule.mood}</span>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedCapsule.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedCapsule(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCapsule.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              <div className="prose dark:prose-invert max-w-none mb-6">
                <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {selectedCapsule.content}
                </p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">创建时间</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {new Date(selectedCapsule.createdAt).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">解锁时间</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {new Date(selectedCapsule.openedAt).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">等待时长</div>
                    <div className="font-medium text-purple-600 dark:text-purple-400">
                      {selectedCapsule.daysWaited} 天
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 dark:text-gray-400">当时心情</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {selectedCapsule.mood} 
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Link
                  href={`/time-capsule/${selectedCapsule.id}`}
                  className="flex-1 py-3 px-4 bg-purple-500 text-white text-center font-medium rounded-full hover:bg-purple-600 transition-colors"
                >
                  查看详情
                </Link>
                <button
                  onClick={() => setSelectedCapsule(null)}
                  className="py-3 px-6 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}