"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function MyDiariesPage() {
  const diaries = [
    { id: 1, title: "今天学到了一个很酷的概念", date: "2026-03-10", mood: "😊", likes: 12 },
    { id: 2, title: "周末的小确幸", date: "2026-03-08", mood: "☕", likes: 8 },
    { id: 3, title: "项目复盘", date: "2026-03-05", mood: "🎯", likes: 15 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/my" className="text-gray-400 hover:text-gray-600">←返回</Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-6">📚 我的日记</h1>

          <div className="space-y-3">
            {diaries.map((diary, index) => (
              <motion.div
                key={diary.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={`/diary/${diary.id}`}
                  className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{diary.mood}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{diary.title}</h3>
                      <p className="text-sm text-gray-500">{diary.date}</p>
                    </div>
                    <div className="text-sm text-gray-400">❤️ {diary.likes}</div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}