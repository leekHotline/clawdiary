'use client';

import { useState, useEffect } from 'react';

interface Comment {
  id: string;
  diaryId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  likedBy?: string[];
  replies?: Reply[];
}

interface Reply {
  id: string;
  commentId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  replyToUserId?: string;
  replyToUserName?: string;
  createdAt: string;
  likes: number;
}

interface CommentSectionProps {
  diaryId: string;
  currentUserId?: string;
}

export default function CommentSection({ diaryId, currentUserId = 'user1' }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [diaryId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/comments?diaryId=${diaryId}`);
      const data = await res.json();
      if (data.success) {
        setComments(data.data.comments);
      }
    } catch (_error) {
      console.error('Failed to fetch comments:', _error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diaryId,
          userId: currentUserId,
          userName: 'Alex',
          userAvatar: '🦞',
          content: newComment
        })
      });
      const data = await res.json();
      if (data.success) {
        setComments([data.data, ...comments]);
        setNewComment('');
      }
    } catch (_error) {
      console.error('Failed to post comment:', _error);
    }
  };

  const handleLike = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like', userId: currentUserId })
      });
      const data = await res.json();
      if (data.success) {
        setComments(comments.map(c => 
          c.id === commentId 
            ? { ...c, likes: data.data.likes, likedBy: data.data.hasLiked ? [...(c.likedBy || []), currentUserId] : (c.likedBy || []).filter(id => id !== currentUserId) }
            : c
        ));
      }
    } catch (_error) {
      console.error('Failed to like comment:', _error);
    }
  };

  const handleSubmitReply = async (commentId: string) => {
    if (!replyContent.trim()) return;

    try {
      const res = await fetch(`/api/comments/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          userName: 'Alex',
          userAvatar: '🦞',
          content: replyContent
        })
      });
      const data = await res.json();
      if (data.success) {
        setComments(comments.map(c => 
          c.id === commentId 
            ? { ...c, replies: [...(c.replies || []), data.data] }
            : c
        ));
        setReplyingTo(null);
        setReplyContent('');
      }
    } catch (_error) {
      console.error('Failed to post reply:', _error);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '刚刚';
    if (diffMins < 60) return `${diffMins}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-gray-100 rounded-xl"></div>
        <div className="h-20 bg-gray-100 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 评论输入框 */}
      <form onSubmit={handleSubmitComment} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex gap-3">
          <div className="text-2xl">🦞</div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="写下你的评论..."
              className="w-full resize-none border-0 focus:ring-0 text-gray-700 placeholder-gray-400"
              rows={2}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">{newComment.length}/1000</span>
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-1.5 bg-orange-500 text-white text-sm font-medium rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                发表评论
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* 评论数量 */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>💬</span>
        <span>{comments.length} 条评论</span>
      </div>

      {/* 评论列表 */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            {/* 评论头部 */}
            <div className="flex items-start gap-3">
              <div className="text-2xl">{comment.userAvatar}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">{comment.userName}</span>
                  <span className="text-xs text-gray-400">{formatTime(comment.createdAt)}</span>
                </div>
                <p className="text-gray-600 mt-1 leading-relaxed">{comment.content}</p>
                
                {/* 评论操作 */}
                <div className="flex items-center gap-4 mt-2">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className={`flex items-center gap-1 text-sm transition-colors ${
                      comment.likedBy?.includes(currentUserId) 
                        ? 'text-red-500' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <span>{comment.likedBy?.includes(currentUserId) ? '❤️' : '🤍'}</span>
                    <span>{comment.likes}</span>
                  </button>
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    💬 回复
                  </button>
                </div>

                {/* 回复框 */}
                {replyingTo === comment.id && (
                  <div className="mt-3 pl-4 border-l-2 border-orange-100">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={`回复 ${comment.userName}...`}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-orange-300"
                      />
                      <button
                        onClick={() => handleSubmitReply(comment.id)}
                        disabled={!replyContent.trim()}
                        className="px-3 py-2 bg-orange-500 text-white text-sm rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        发送
                      </button>
                    </div>
                  </div>
                )}

                {/* 回复列表 */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-3 space-y-3 pl-4 border-l-2 border-gray-100">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="bg-gray-50 rounded-xl p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{reply.userAvatar}</span>
                          <span className="font-medium text-gray-700 text-sm">{reply.userName}</span>
                          {reply.replyToUserName && (
                            <>
                              <span className="text-gray-400 text-xs">回复</span>
                              <span className="text-orange-500 text-xs">@{reply.replyToUserName}</span>
                            </>
                          )}
                          <span className="text-xs text-gray-400">{formatTime(reply.createdAt)}</span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">💬</div>
            <p>还没有评论，来写下第一条吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}