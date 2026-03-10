"use client";

import { motion } from "framer-motion";

export default function MyCollectionsPage() {
  const collections = [
    { id: 1, name: "学习笔记", count: 15, emoji: "📚", color: "from-blue-400 to-indigo-500" },
    { id: 2, name: "旅行日记", count: 8, emoji: "✈️", color: "from-orange-400 to-red-500" },
    { id: 3, name: "美食记录", count: 12, emoji: "🍜", color: "from-pink-400 to-rose-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-6">📁 日记集</h1>

          <div className="grid grid-cols-2 gap-4">
            {collections.map((col, index) => (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-gradient-to-br ${col.color} rounded-2xl p-5 text-white cursor-pointer hover:shadow-lg transition-shadow`}
              >
                <span className="text-3xl mb-2 block">{col.emoji}</span>
                <h2 className="font-semibold">{col.name}</h2>
                <p className="text-sm opacity-80">{col.count} 篇日记</p>
              </motion.div>
            ))}
          </div>

          <button className="w-full mt-6 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors">
            + 新建日记集
          </button>
        </motion.div>
      </div>
    </div>
  );
}