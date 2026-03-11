"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

interface SharedDiary {
  id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  createdAt: string;
  author: {
    name: string;
    avatar: string | null;
  };
  allowComments: boolean;
  views: number;
}

const moodEmojis: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  peaceful: "😌",
  excited: "🎉",
  anxious: "😰",
  grateful: "🙏",
  neutral: "😐",
  love: "❤️",
};

const moodColors: Record<string, string> = {
  happy: "from-yellow-400 to-orange-400",
  sad: "from-blue-400 to-blue-600",
  peaceful: "from-green-400 to-teal-400",
  excited: "from-pink-400 to-purple-400",
  anxious: "from-purple-400 to-indigo-400",
  neutral: "from-gray-400 to-gray-500",
  love: "from-pink-400 to-red-400",
  grateful: "from-amber-400 to-orange-400",
};

export default function SharedDiaryPage() {
  const params = useParams();
  const token = params.token as string;
  
  const [diary, setDiary] = useState<SharedDiary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchSharedDiary();
  }, [token]);

  const fetchSharedDiary = async () => {
    try {
      const res = await fetch(`/api/share/${token}`);
      const data = await res.json();
      
      if (data.success) {
        setDiary(data.diary);
      } else {
        setError(data.error || "分享链接无效");
      }
    } catch (err) {
      console.error("获取分享日记失败:", err);
      setError("加载失败");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">无法访问</h1>
          <p className="text-gray-500">{error}</p>
          <p className="text-sm text-gray-400 mt-4">
            该分享可能已过期或被取消
          </p>
        </motion.div>
      </div>
    );
  }

  if (!diary) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* 背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-200/30 to-amber-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-3xl mx-auto px-6 py-12">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <span className="text-4xl mb-4 block">
            {moodEmojis[diary.mood] || "📝"}
          </span>
          <h1 className="text-3xl font-bold text-gray-800">{diary.title}</h1>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
            <span>作者：{diary.author.name}</span>
            <span>·</span>
            <span>{formatDate(diary.createdAt)}</span>
            <span>·</span>
            <span>{diary.views} 次浏览</span>
          </div>
        </motion.div>

        {/* 内容卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`bg-gradient-to-br ${moodColors[diary.mood] || "from-gray-400 to-gray-500"} p-1 rounded-3xl shadow-xl`}
        >
          <div className="bg-white rounded-3xl p-8">
            {/* 标签 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {diary.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* 内容 */}
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {diary.content}
            </div>
          </div>
        </motion.div>

        {/* 评论区 */}
        {diary.allowComments && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 bg-white rounded-2xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">💬 评论</h3>
            
            <div className="flex gap-3">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="写下你的想法..."
                className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-300 focus:border-transparent outline-none"
              />
              <button
                disabled={!comment.trim()}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow disabled:opacity-50"
              >
                发送
              </button>
            </div>

            <p className="text-sm text-gray-400 mt-4 text-center">
              成为第一个评论的人
            </p>
          </motion.div>
        )}

        {/* 底部 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center text-sm text-gray-400"
        >
          <p>🦞 Claw Diary - 记录生活的美好瞬间</p>
        </motion.div>
      </main>
    </div>
  );
}