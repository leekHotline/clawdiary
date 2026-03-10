"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function AssistantPage() {
  const aiFeatures = [
    {
      icon: "💡",
      title: "智能写作助手",
      desc: "帮你润色日记，让文字更有温度",
      href: "/assistant/write",
      gradient: "from-amber-400 to-orange-500"
    },
    {
      icon: "📊",
      title: "情绪分析",
      desc: "分析日记情绪，了解自己的内心",
      href: "/assistant/mood",
      gradient: "from-pink-400 to-rose-500"
    },
    {
      icon: "🏷️",
      title: "智能标签",
      desc: "自动提取关键词，整理更高效",
      href: "/assistant/tags",
      gradient: "from-blue-400 to-indigo-500"
    },
    {
      icon: "📝",
      title: "日记续写",
      desc: "AI 帮你续写，激发更多灵感",
      href: "/assistant/continue",
      gradient: "from-purple-400 to-violet-500"
    },
  ];

  const recentChats = [
    { id: 1, title: "帮我写一篇关于旅行的日记", time: "昨天" },
    { id: 2, title: "分析最近一周的情绪变化", time: "3天前" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-white to-purple-50">
      <section className="pt-16 pb-8 px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🤖 AI 助手</h1>
          <p className="text-gray-500">让 AI 帮你更好地记录生活</p>
        </motion.div>
      </section>

      {/* AI 功能 */}
      <section className="px-6 mb-8">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
          {aiFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                href={feature.href}
                className="group block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-2xl`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 group-hover:text-violet-600 transition-colors">
                      {feature.title}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">{feature.desc}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 快速对话 */}
      <section className="px-6 pb-12">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">💬 快速对话</h2>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                placeholder="问 AI 任何问题..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow">
                发送
              </button>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">最近对话</h3>
              <div className="space-y-2">
                {recentChats.map((chat) => (
                  <button
                    key={chat.id}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">{chat.title}</span>
                      <span className="text-xs text-gray-400">{chat.time}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}