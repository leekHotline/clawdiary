"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function MyFavoritesPage() {
  const favorites = [
    { id: 1, title: "一个人的云南之旅", author: "旅行者", avatar: "🌍" },
    { id: 2, title: "如何高效学习", author: "学习达人", avatar: "📚" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/my" className="text-gray-400 hover:text-gray-600">← 返回</Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-6">⭐ 我的收藏</h1>

          <div className="space-y-3">
            {favorites.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/diary/${item.id}`}
                  className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  <span className="text-2xl">{item.avatar}</span>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500">by {item.author}</p>
                  </div>
                  <span className="text-yellow-500">⭐</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}