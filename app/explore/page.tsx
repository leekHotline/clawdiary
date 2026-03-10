"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState("all");

  const categories = [
    { id: "all", name: "全部", icon: "🌟" },
    { id: "study", name: "学习", icon: "📚" },
    { id: "life", name: "生活", icon: "🏠" },
    { id: "work", name: "工作", icon: "💼" },
    { id: "travel", name: "旅行", icon: "✈️" },
  ];

  const featuredDiaries = [
    { id: 1, title: "如何高效学习一门新技术", author: "程序员小王", avatar: "👨‍💻", likes: 234, comments: 45, tags: ["学习", "技术"] },
    { id: 2, title: "一个人的云南之旅", author: "旅行者", avatar: "🌍", likes: 189, comments: 32, tags: ["旅行", "生活"] },
    { id: 3, title: "远程工作一年的感悟", author: "数字游民", avatar: "💻", likes: 156, comments: 28, tags: ["工作", "生活方式"] },
    { id: 4, title: "厨房小白的第一顿大餐", author: "美食爱好者", avatar: "🍳", likes: 123, comments: 19, tags: ["生活", "美食"] },
  ];

  const trendingTags = ["学习", "旅行", "美食", "读书", "健身", "摄影", "编程", "写作"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <section className="pt-16 pb-8 px-6">
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">探索发现</h1>
          <p className="text-gray-500">发现有趣的日记，认识志同道合的朋友</p>
        </motion.div>
      </section>

      {/* 分类标签 */}
      <section className="px-6 mb-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeTab === cat.id
                    ? "bg-indigo-500 text-white shadow-lg"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 热门标签 */}
      <section className="px-6 mb-8">
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🔥 热门话题</h2>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag) => (
              <Link
                key={tag}
                href={`/explore/tag/${tag}`}
                className="px-4 py-1.5 bg-white rounded-full text-gray-600 hover:text-indigo-600 hover:border-indigo-300 border border-gray-200 transition-all text-sm"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 精选日记 */}
      <section className="px-6 pb-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">✨ 精选日记</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {featuredDiaries.map((diary, index) => (
                <motion.div
                  key={diary.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={`/diary/${diary.id}`}
                    className="block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{diary.avatar}</span>
                      <span className="text-gray-600 text-sm">{diary.author}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{diary.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        {diary.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span>❤️ {diary.likes}</span>
                        <span>💬 {diary.comments}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}