"use client";

import { motion } from "framer-motion";

export default function MyStatsPage() {
  const stats = {
    totalDiaries: 128,
    totalWords: 34560,
    totalLikes: 892,
    totalComments: 234,
    avgWordsPerDiary: 270,
    mostActiveDay: "周三",
    favoriteMood: "😊",
  };

  const monthlyData = [
    { month: "1月", count: 20 },
    { month: "2月", count: 15 },
    { month: "3月", count: 28 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-6">📊 数据统计</h1>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-indigo-600">{stats.totalDiaries}</div>
              <div className="text-gray-500 text-sm">篇日记</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-purple-600">{stats.totalWords.toLocaleString()}</div>
              <div className="text-gray-500 text-sm">总字数</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-pink-600">{stats.totalLikes}</div>
              <div className="text-gray-500 text-sm">获赞</div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="text-3xl font-bold text-orange-600">{stats.totalComments}</div>
              <div className="text-gray-500 text-sm">评论</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">月度统计</h2>
            <div className="flex items-end gap-4 h-32">
              {monthlyData.map((item) => (
                <div key={item.month} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-indigo-500 to-purple-400 rounded-t"
                    style={{ height: `${(item.count / 30) * 100}%` }}
                  />
                  <span className="text-sm text-gray-500 mt-2">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}