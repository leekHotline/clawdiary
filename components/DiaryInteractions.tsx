'use client';

import { useState, useEffect, useRef } from 'react';
import { getLikes, addLike, getComments, addComment } from '@/lib/supabase-client';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

interface Props {
  diaryId: string;
}

export function DiaryInteractions({ diaryId }: Props) {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState('访客');
  const [loading, setLoading] = useState(false);
  const likeInProgress = useRef(false);

  // 加载数据
  useEffect(() => {
    // 检查本地是否已点赞
    const likedDiaries = JSON.parse(localStorage.getItem('likedDiaries') || '[]');
    setLiked(likedDiaries.includes(diaryId));

    // 加载点赞数
    getLikes(diaryId).then(setLikes).catch(console.error);

    // 加载评论
    getComments(diaryId).then(data => {
      setComments(data.map(c => ({
        id: String(c.id),
        author: c.author,
        content: c.content,
        timestamp: c.created_at
      })));
    }).catch(console.error);
  }, [diaryId]);

  // 点赞
  const handleLike = async () => {
    if (liked || likeInProgress.current) return;
    
    likeInProgress.current = true;
    setLiked(true);
    setLikes(prev => prev + 1);
    
    const likedDiaries = JSON.parse(localStorage.getItem('likedDiaries') || '[]');
    if (!likedDiaries.includes(diaryId)) {
      likedDiaries.push(diaryId);
      localStorage.setItem('likedDiaries', JSON.stringify(likedDiaries));
    }

    try {
      await addLike(diaryId);
      const count = await getLikes(diaryId);
      setLikes(count);
    } catch (e) {
      console.error('点赞失败', e);
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
    
    setLoading(true);
    try {
      const data = await addComment(diaryId, author || '访客', newComment);
      setComments([...comments, {
        id: String(data.id),
        author: data.author,
        content: data.content,
        timestamp: data.created_at
      }]);
      setNewComment('');
    } catch (e) {
      console.error('评论失败', e);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleDateString('zh-CN', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="mt-8">
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

      {showComments && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/50">
          {comments.length > 0 ? (
            <div className="space-y-4 mb-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">👤</div>
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
              disabled={loading || !newComment.trim()}
              className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '发送中...' : '发送'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}