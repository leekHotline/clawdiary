'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Comment {
  id: string;
  diaryId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  likes: number;
  replies: number;
  isLiked: boolean;
}

interface CommentStats {
  total: number;
  today: number;
  topCommenters: Array<{
    userId: string;
    userName: string;
    count: number;
  }>;
}

export default function DiaryCommentsPage() {
  const params = useParams();
  const router = useRouter();
  const diaryId = params.id as string;
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<CommentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest');
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const [showReplies, setShowReplies] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchComments();
    fetchStats();
  }, [diaryId, sortBy]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/diaries/${diaryId}/comments?sort=${sortBy}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (_error) {
      console.error('Failed to fetch comments:', _error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`/api/comments/stats?diaryId=${diaryId}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (_error) {
      console.error('Failed to fetch stats:', _error);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      const res = await fetch(`/api/likes/comment/${commentId}`, {
        method: 'POST',
      });
      if (res.ok) {
        setComments(comments.map(c => 
          c.id === commentId 
            ? { ...c, isLiked: !c.isLiked, likes: c.isLiked ? c.likes - 1 : c.likes + 1 }
            : c
        ));
      }
    } catch (_error) {
      console.error('Failed to like comment:', _error);
    }
  };

  const handleReply = async (commentId: string) => {
    const content = replyContent[commentId];
    if (!content?.trim()) return;

    try {
      const res = await fetch(`/api/comments/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        setReplyContent({ ...replyContent, [commentId]: '' });
        fetchComments();
      }
    } catch (_error) {
      console.error('Failed to reply:', _error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center">
        <div className="text-xl text-amber-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-amber-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-amber-800">评论区</h1>
              <p className="text-sm text-amber-600">日记 ID: {diaryId}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Card */}
        {stats && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">📊 评论统计</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-amber-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-amber-600">{stats.total}</div>
                <div className="text-sm text-amber-600">总评论数</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600">{stats.today}</div>
                <div className="text-sm text-green-600">今日新增</div>
              </div>
            </div>
            {stats.topCommenters.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">活跃评论者</h3>
                <div className="flex gap-2 flex-wrap">
                  {stats.topCommenters.slice(0, 5).map((commenter, index) => (
                    <div
                      key={commenter.userId}
                      className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1"
                    >
                      <span className="text-sm">
                        {index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : '💬'}
                      </span>
                      <span className="text-sm font-medium">{commenter.userName}</span>
                      <span className="text-xs text-gray-500">{commenter.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sort Options */}
        <div className="flex gap-2 flex-wrap">
          {[
            { value: 'newest', label: '最新' },
            { value: 'oldest', label: '最早' },
            { value: 'popular', label: '最热' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setSortBy(option.value as typeof sortBy)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                sortBy === option.value
                  ? 'bg-amber-500 text-white'
                  : 'bg-white text-amber-600 hover:bg-amber-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="text-6xl mb-4">💭</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">暂无评论</h3>
              <p className="text-gray-500">成为第一个评论的人吧！</p>
              <Link
                href={`/diary/${diaryId}`}
                className="inline-block mt-4 px-6 py-2 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
              >
                查看日记
              </Link>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                    {comment.userName.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800">{comment.userName}</span>
                      <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                      {comment.updatedAt && (
                        <span className="text-xs text-gray-400">(已编辑)</span>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-3">{comment.content}</p>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(comment.id)}
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          comment.isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <span>{comment.isLiked ? '❤️' : '🤍'}</span>
                        <span>{comment.likes}</span>
                      </button>
                      
                      <button
                        onClick={() => setShowReplies({ 
                          ...showReplies, 
                          [comment.id]: !showReplies[comment.id] 
                        })}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-amber-600 transition-colors"
                      >
                        <span>💬</span>
                        <span>{comment.replies} 回复</span>
                      </button>
                    </div>

                    {/* Reply Input */}
                    {showReplies[comment.id] && (
                      <div className="mt-4 pl-4 border-l-2 border-amber-200">
                        <textarea
                          value={replyContent[comment.id] || ''}
                          onChange={(e) => setReplyContent({
                            ...replyContent,
                            [comment.id]: e.target.value
                          })}
                          placeholder="写下你的回复..."
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                          rows={2}
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => handleReply(comment.id)}
                            disabled={!replyContent[comment.id]?.trim()}
                            className="px-4 py-1 bg-amber-500 text-white rounded-full text-sm hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            回复
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Back to Diary */}
        <div className="flex justify-center pt-6">
          <Link
            href={`/diary/${diaryId}`}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 transition-colors"
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