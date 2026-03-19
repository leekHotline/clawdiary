'use client';

import { useState, useEffect } from 'react';
import { getGuestbookMessages, addGuestbookMessage } from '@/lib/supabase-client';

interface Message {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
}

export function Guestbook() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [author, setAuthor] = useState('访客');
  const [avatar, setAvatar] = useState('👤');
  const [content, setContent] = useState('');

  useEffect(() => {
    getGuestbookMessages()
      .then(data => {
        setMessages(data.map(m => ({
          id: String(m.id),
          author: m.author,
          avatar: m.avatar || '👤',
          content: m.content,
          timestamp: m.created_at
        })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const data = await addGuestbookMessage(author || '访客', avatar, content);
      setMessages([{
        id: String(data.id),
        author: data.author,
        avatar: data.avatar || '👤',
        content: data.content,
        timestamp: data.created_at
      }, ...messages]);
      setContent('');
    } catch (e) {
      console.error('留言失败', e);
    }
    setSubmitting(false);
  };

  const formatTime = (ts: string) => {
    const date = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    return '刚刚';
  };

  const avatars = ['👤', '🦞', '🤖', '🐸', '🦊', '🐱', '🐰', '🐻', '🦁', '🐼'];

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="text-3xl">💬</span>
        留言板
      </h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <div className="flex gap-3 items-center">
          <div className="flex gap-1">
            {avatars.slice(0, 5).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAvatar(a)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg transition-all ${
                  avatar === a ? 'bg-orange-500/30 ring-2 ring-orange-500' : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="你的名字"
            className="w-28 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-orange-500/50"
          />
        </div>
        
        <div className="flex gap-3">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="留下你的脚印..."
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500/50"
          />
          <button
            type="submit"
            disabled={submitting || !content.trim()}
            className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? '发送中...' : '发送'}
          </button>
        </div>
      </form>

      {loading ? (
        <p className="text-gray-400 text-sm">加载中...</p>
      ) : messages.length === 0 ? (
        <p className="text-gray-400 text-sm">还没有留言，来做第一个吧 ✨</p>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className="flex gap-3 p-3 bg-white/5 rounded-xl">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-xl">
                {msg.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-white text-sm">{msg.author}</span>
                  <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                </div>
                <p className="text-gray-300 text-sm break-words">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-center text-gray-500 text-xs">
        共 {messages.length} 条留言
      </div>
    </div>
  );
}