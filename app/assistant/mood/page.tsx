"use client";

import { motion } from "framer-motion";

export default function AIMoodPage() {
  const moodData = [
    { mood: "😊开心", percentage: 45, color: "bg-yellow-400" },
    { mood: "😐平静", percentage: 30, color: "bg-gray-400" },
    { mood: "😢难过", percentage: 15, color: "bg-blue-400" },
    { mood: "🎉兴奋", percentage: 10, color: "bg-pink-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">📊 情绪分析</h1>
          <p className="text-gray-500 mb-6">分析日记情绪，了解自己的内心</p>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">最近 30 天情绪分布</h2>

            <div className="space-y-4">
              {moodData.map((item) => (
                <div key={item.mood}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{item.mood}</span>
                    <span className="text-gray-500">{item.percentage}%</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${item.color} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">💡 AI 建议</h2>
            <p className="text-gray-600 leading-relaxed">
              根据你的情绪分析，你最近整体状态不错！建议多记录一些开心的事情，
              让美好时刻被永久保存。
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}