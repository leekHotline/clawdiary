'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Capsule {
  id: string;
  title: string;
  content: string;
  unlockAt: string;
  mood: string;
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  isLocked: boolean;
  openedAt?: string;
  daysWaited?: number;
  remainingTime?: number;
}

export default function TimeCapsuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [capsule, setCapsule] = useState<Capsule | null>(null);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    fetchCapsule();
  }, [params.id]);

  const fetchCapsule = async () => {
    try {
      const response = await fetch(`/api/time-capsule/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCapsule(data);
      }
    } catch (_error) {
      console.error('Failed to fetch capsule:', _error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = async () => {
    setOpening(true);
    try {
      const response = await fetch(`/api/time-capsule/${params.id}/open`, {
        method: 'POST',
      });
      if (response.ok) {
        const data = await response.json();
        setCapsule(data.capsule);
      } else {
        const error = await response.json();
        alert(error.error || '解锁失败');
      }
    } catch (_error) {
      console.error('Failed to open capsule:', _error);
    } finally {
      setOpening(false);
    }
  };

  const formatRemainingTime = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} 天 ${hours} 小时`;
    if (hours > 0) return `${hours} 小时 ${minutes} 分钟`;
    return `${minutes} 分钟`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">加载中...</div>
      </div>
    );
  }

  if (!capsule) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            胶囊不存在
          </h2>
          <Link href="/time-capsule" className="text-purple-500 hover:underline">
            返回时光胶囊
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-purple-900">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link 
            href="/time-capsule" 
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <span className="mr-2">←</span>
            返回时光胶囊
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 text-white">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-3xl">{capsule.mood}</span>
              <h1 className="text-2xl font-bold">{capsule.title}</h1>
            </div>
            <div className="flex items-center space-x-4 text-purple-100">
              <span>创建于 {new Date(capsule.createdAt).toLocaleDateString('zh-CN')}</span>
              {capsule.isPublic && (
                <span className="px-2 py-1 bg-white/20 rounded text-xs">公开</span>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            {capsule.isLocked ? (
              <div className="text-center py-12">
                <div className="text-8xl mb-4">🔒</div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  这个胶囊尚未解锁
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  解锁时间：{new Date(capsule.unlockAt).toLocaleString('zh-CN')}
                </p>
                {capsule.remainingTime && (
                  <div className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
                    剩余 {formatRemainingTime(capsule.remainingTime)}
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="prose dark:prose-invert max-w-none mb-6">
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                    {capsule.content}
                  </p>
                </div>

                {/* Tags */}
                {capsule.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {capsule.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {capsule.daysWaited || 0}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">等待天数</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {new Date(capsule.createdAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">创建日期</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                        {capsule.openedAt ? new Date(capsule.openedAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) : '-'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">解锁日期</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-gray-100 dark:border-gray-700 p-6">
            {capsule.isLocked ? (
              <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
                💡 提示：胶囊将在设定时间自动解锁，请耐心等待
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/time-capsule/create')}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium rounded-full hover:from-purple-600 hover:to-indigo-600 transition-all"
                >
                  ✨ 创建新胶囊
                </button>
                <Link
                  href="/time-capsule"
                  className="py-3 px-6 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  返回列表
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Related Info */}
        {!capsule.isLocked && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">💌 给未来的你</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              这封来自过去的信，承载着 {(capsule.daysWaited || 0)} 天前的记忆与期望。
              时间是最珍贵的礼物，愿这段回忆能给你带来温暖和力量。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}