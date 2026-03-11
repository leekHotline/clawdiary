'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Like {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
}

interface LikeStats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export default function DiaryLikesPage() {
  const params = useParams();
  const router = useRouter();
  const diaryId = params.id as string;
  
  const [likes, setLikes] = useState<Like[]>([]);
  const [stats, setStats] = useState<LikeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  useEffect(() => {
    fetchLikes();
    fetchStats();
  }, [diaryId]);

  const fetchLikes = async () => {
    try {
      const res = await fetch(`/api/diaries/${diaryId}/likes`);
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes || []);
      }
    } catch (error) {
      console.error('Failed to fetch likes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/likes/stats?diaryId=${diaryId}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-xl text-red-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-pink-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-pink-800">❤️ 点赞列表</h1>
                <p className="text-sm text-pink-600">日记 ID: {diaryId}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-pink-500 text-white' : 'bg-pink-100 text-pink-600'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Card */}
        {stats && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">❤️ 点赞统计</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-pink-600">{stats.total}</div>
                <div className="text-sm text-pink-600">总点赞</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{stats.today}</div>
                <div className="text-sm text-green-600">今日新增</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{stats.thisWeek}</div>
                <div className="text-sm text-blue-600">本周</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple-600">{stats.thisMonth}</div>
                <div className="text-sm text-purple-600">本月</div>
              </div>
            </div>
          </div>
        )}

        {/* Likes List/Grid */}
        {likes.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">🤍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">还没有人点赞</h3>
            <p className="text-gray-500">成为第一个点赞的人吧！</p>
            <Link
              href={`/diary/${diaryId}`}
              className="inline-block mt-4 px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
            >
              查看日记
            </Link>
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-2">
            {likes.map((like, index) => (
              <div
                key={like.id}
                className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center text-white font-bold text-lg">
                      {like.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs">
                      ❤️
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-800">{like.userName}</span>
                      <span className="text-xs px-2 py-0.5 bg-pink-100 text-pink-600 rounded-full">
                        #{index + 1}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500" title={formatFullDate(like.createdAt)}>
                      {formatDate(like.createdAt)} 点赞
                    </p>
                  </div>
                  <Link
                    href={`/user/${like.userId}`}
                    className="px-3 py-1 text-sm text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
                  >
                    查看主页
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {likes.map((like, index) => (
              <div
                key={like.id}
                className="bg-white rounded-xl shadow-sm p-4 text-center hover:shadow-md transition-shadow"
              >
                <div className="relative inline-block mb-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center text-white font-bold text-xl">
                    {like.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white">
                    ❤️
                  </div>
                </div>
                <div className="font-medium text-gray-800 truncate">{like.userName}</div>
                <div className="text-xs text-gray-400 mt-1">
                  #{index + 1} · {formatDate(like.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Appreciation Section */}
        {likes.length > 0 && (
          <div className="bg-gradient-to-r from-pink-500 to-red-500 rounded-xl p-6 text-white text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-lg font-semibold mb-1">
              这篇日记收到了 {likes.length} 个赞！
            </h3>
            <p className="text-pink-100 text-sm">
              感谢每一位读者的喜爱与支持
            </p>
          </div>
        )}

        {/* Back to Diary */}
        <div className="flex justify-center pt-6">
          <Link
            href={`/diary/${diaryId}`}
            className="flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            返回日记
          </Link>
        </div>
      </main>
    </div>
  );
}