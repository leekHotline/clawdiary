'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ReadingProgress {
  diaryId: number;
  title: string;
  progress: number;
  lastRead: string;
  timeSpent: number;
  estimatedTimeLeft: number;
}

export default function ReadingProgressPage() {
  const [progress, setProgress] = useState<ReadingProgress[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reading-progress');
      const data = await res.json();
      setProgress(data.progress || []);
      setStats(data.stats || null);
    } catch (_error) {
      console.error('Failed to fetch progress:', _error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearProgress = async (diaryId?: number) => {
    try {
      const url = diaryId 
        ? `/api/reading-progress/${diaryId}`
        : '/api/reading-progress/clear';
      await fetch(url, { method: 'DELETE' });
      fetchProgress();
    } catch (_error) {
      console.error('Failed to clear progress:', _error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <Link href="/" className="text-amber-600 hover:underline mb-2 inline-block">
            ← 返回首页
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
            📖 阅读进度追踪
          </h1>
          <p className="text-gray-600">追踪你的日记阅读进度，不错过每一篇精彩内容</p>
        </div>

        {/* 统计卡片 */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-amber-600">{stats.totalStarted}</div>
              <div className="text-sm text-gray-500">开始阅读</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-orange-600">{stats.totalCompleted}</div>
              <div className="text-sm text-gray-500">已读完</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-yellow-600">{stats.totalTimeSpent}min</div>
              <div className="text-sm text-gray-500">阅读时长</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-red-600">{stats.avgProgress}%</div>
              <div className="text-sm text-gray-500">平均进度</div>
            </div>
          </div>
        )}

        {/* 进度列表 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <h2 className="font-medium text-gray-700">📚 阅读中的日记</h2>
            {progress.length > 0 && (
              <button
                onClick={() => handleClearProgress()}
                className="text-sm text-red-500 hover:text-red-600"
              >
                清空全部
              </button>
            )}
          </div>

          {progress.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <div className="text-4xl mb-2">📖</div>
              <p>暂无阅读进度</p>
              <Link href="/explore" className="text-amber-600 hover:underline">
                去探索更多日记 →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {progress.map((p) => (
                <div key={p.diaryId} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <Link
                      href={`/diary/${p.diaryId}`}
                      className="font-medium text-gray-700 hover:text-amber-600"
                    >
                      {p.title}
                    </Link>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {new Date(p.lastRead).toLocaleDateString('zh-CN')}
                      </span>
                      <button
                        onClick={() => handleClearProgress(p.diaryId)}
                        className="text-xs text-gray-400 hover:text-red-500"
                      >
                        删除
                      </button>
                    </div>
                  </div>

                  {/* 进度条 */}
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div
                      className={`absolute left-0 top-0 h-full rounded-full transition-all ${
                        p.progress >= 100
                          ? 'bg-green-500'
                          : p.progress >= 50
                            ? 'bg-amber-500'
                            : 'bg-orange-400'
                      }`}
                      style={{ width: `${p.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>已读 {p.progress}%</span>
                      <span>阅读 {p.timeSpent} 分钟</span>
                      {p.progress < 100 && p.estimatedTimeLeft > 0 && (
                        <span>预计剩余 {p.estimatedTimeLeft} 分钟</span>
                      )}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      p.progress >= 100
                        ? 'bg-green-100 text-green-600'
                        : p.progress >= 50
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-gray-100 text-gray-600'
                    }`}>
                      {p.progress >= 100 ? '已读完' : '阅读中'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 继续阅读推荐 */}
        {progress.filter(p => p.progress < 100).length > 0 && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">📖 继续阅读</h3>
                <p className="text-white/80">你有 {progress.filter(p => p.progress < 100).length} 篇日记还没读完</p>
              </div>
              <Link
                href={`/diary/${progress.find(p => p.progress < 100)?.diaryId}`}
                className="px-6 py-2 bg-white text-amber-600 rounded-lg font-medium hover:shadow-lg transition-all"
              >
                继续阅读
              </Link>
            </div>
          </div>
        )}

        {/* 功能说明 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-medium text-gray-700 mb-4">✨ 功能说明</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="text-amber-500 text-lg">📊</span>
              <div>
                <div className="font-medium text-gray-700">自动记录</div>
                <div>阅读日记时自动记录进度</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-500 text-lg">⏱️</span>
              <div>
                <div className="font-medium text-gray-700">时间统计</div>
                <div>统计每篇日记的阅读时间</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-500 text-lg">🎯</span>
              <div>
                <div className="font-medium text-gray-700">智能提醒</div>
                <div>提醒你完成未读完的日记</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}