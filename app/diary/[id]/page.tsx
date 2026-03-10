"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function DiaryDetailPage({ params }: { params: { id: string } }) {
  // 模拟数据
  const diary = {
    id: params.id,
    title: "今天学到了一个很酷的概念",
    content: "今天在看书的时候，学到了一个很有趣的概念——心流状态。它描述的是一种全神贯注、忘记时间流逝的状态。我发现在写代码的时候经常会有这种感觉，难怪我总是不知不觉就写到了深夜。\n\n以后我要尝试把这种状态应用到其他事情上，比如读书、写作，甚至是锻炼。希望能让生活变得更加充实。",
    mood: "😊",
    weather: "☀️",
    date: "2026年3月10日",
    author: "太空龙虾",
    avatar: "🦞",
    likes: 23,
    comments: 5,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 返回按钮 */}
          <Link href="/" className="text-gray-400 hover:text-gray-600 mb-6 inline-block">
            ← 返回首页
          </Link>

          {/* 头部 */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{diary.mood}</span>
              <span className="text-xl">{diary.weather}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{diary.title}</h1>
            <div className="flex items-center gap-3 text-gray-500 text-sm">
              <span>{diary.avatar} {diary.author}</span>
              <span>·</span>
              <span>{diary.date}</span>
            </div>
          </header>

          {/* 内容 */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-6">
            <div className="prose prose-gray max-w-none">
              {diary.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-relaxed mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* 操作栏 */}
          <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors">
                <span>❤️</span>
                <span>{diary.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
                <span>💬</span>
                <span>{diary.comments}</span>
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-yellow-500 transition-colors">
                <span>⭐</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                编辑
              </button>
              <button className="px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                删除
              </button>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}