'use client';

import { useState, useEffect, useRef } from 'react';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

interface Props {
  diaryId: string;
  initialLikes?: number;
  initialComments?: Comment[];
}

export function DiaryInteractions({ diaryId, initialLikes = 0, initialComments = [] }: Props) {
  const [likes, setLikes] = useState(initialLikes);
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('访客');
  const likeInProgress = useRef(false);

  // 检查本地是否已点赞
  useEffect(() => {
    const likedDiaries = JSON.parse(localStorage.getItem('likedDiaries') || '[]');
    setLiked(likedDiaries.includes(diaryId));
  }, [diaryId]);

  // 点赞 - 防止重复点击
  const handleLike = async () => {
    // 双重检查：已点赞或请求进行中
    if (liked || likeInProgress.current) return;
    
    // 立即标记，防止重复
    likeInProgress.current = true;
    
    // 先更新 UI（乐观更新）
    setLiked(true);
    setLikes(prev => prev + 1);
    
    // 保存到本地
    const likedDiaries = JSON.parse(localStorage.getItem('likedDiaries') || '[]');
    if (!likedDiaries.includes(diaryId)) {
      likedDiaries.push(diaryId);
      localStorage.setItem('likedDiaries', JSON.stringify(likedDiaries));
    }

    try {
      const res = await fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like', diaryId }),
      });
      const data = await res.json();
      if (data.success) {
        setLikes(data.likes);
      }
    } catch (e) {
      console.error('点赞失败', e);
      // 失败时回滚
      setLiked(false);
      setLikes(prev => prev - 1);
    } finally {
      likeInProgress.current = false;
    }
  };

  // 发送评论
  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      const res = await fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'comment', 
          diaryId, 
          author: author || '访客',
          content: newComment 
        }),
      });
      const data = await res.json();
      if (data.success) {
        setComments([...comments, data.comment]);
        setNewComment('');
      }
    } catch (e) {
      console.error('评论失败', e);
    }
  };

  // 格式化时间
  const formatTime = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleDateString('zh-CN', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mt-8">
      {/* 点赞和评论按钮 */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleLike}
          disabled={liked}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            liked 
              ? 'bg-red-100 text-red-500 cursor-default' 
              : 'text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer'
          }`}
        >
          <span>{liked ? '❤️' : '🤍'}</span>
          <span className="text-sm font-medium">{likes}</span>
        </button>
        
        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
            showComments 
              ? 'bg-blue-100 text-blue-500' 
              : 'text-gray-400 hover:text-blue-500 hover:bg-blue-50'
          }`}
        >
          <span>💬</span>
          <span className="text-sm font-medium">{comments.length}</span>
        </button>
      </div>

      {/* 评论区 */}
      {showComments && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
          {/* 评论列表 */}
          {comments.length > 0 ? (
            <div className="space-y-4 mb-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
                    👤
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-700 text-sm">{comment.author}</span>
                      <span className="text-xs text-gray-400">{formatTime(comment.timestamp)}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm mb-6">还没有评论，来写第一条吧 ✨</p>
          )}

          {/* 评论表单 */}
          <form onSubmit={handleComment} className="flex gap-3">
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="你的名字"
              className="w-24 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-300"
            />
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="写下你的想法..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-orange-300"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              发送
            </button>
          </form>
        </div>
      )}
    </div>
  );
}