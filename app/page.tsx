"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// 动画配置
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function HomePage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 模拟数据
  const recentDiaries = [
    { id: 1, title: "今天学到了一个很酷的概念", mood: "😊", time: "2小时前", preview: "关于量子计算的入门理解..." },
    { id: 2, title: "周末的小确幸", mood: "☕", time: "昨天", preview: "一杯咖啡，一本书，一个下午..." },
    { id: 3, title: "项目复盘", mood: "🎯", time: "3天前", preview: "这次迭代收获很多..." },
  ];

  const quickActions = [
    { icon: "✍️", label: "写日记", href: "/write", color: "from-amber-400 to-orange-500" },
    { icon: "🔍", label: "探索", href: "/explore", color: "from-blue-400 to-indigo-500" },
    { icon: "💬", label: "社区", href: "/community", color: "from-pink-400 to-rose-500" },
    { icon: "🤖", label: "AI助手", href: "/assistant", color: "from-purple-400 to-violet-500" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero 区域 */}
      <section className="pt-16 pb-12 px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            记录生活，<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">遇见自己</span>
          </h1>
          <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
            每一篇日记，都是与内心的一次对话。AI 陪你一起，发现生活的美好。
          </p>

          {/* 快捷操作 */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            {quickActions.map((action) => (
              <motion.div key={action.label} variants={fadeInUp}>
                <Link
                  href={action.href}
                  className={`group relative block p-4 rounded-2xl bg-gradient-to-br ${action.color} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
                  onMouseEnter={() => setHoveredCard(action.label)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <span className="text-3xl mb-2 block">{action.icon}</span>
                  <span className="font-medium">{action.label}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* 最近日记 */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">最近记录</h2>
            <Link href="/diary" className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
              查看全部
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <motion.div
            className="space-y-4"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            {recentDiaries.map((diary, index) => (
              <motion.div
                key={diary.id}
                variants={fadeInUp}
                custom={index}
              >
                <Link
                  href={`/diary/${diary.id}`}
                  className="group block bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 hover:border-gray-200 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{diary.mood}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                          {diary.title}
                        </h3>
                        <span className="text-sm text-gray-400 whitespace-nowrap ml-4">{diary.time}</span>
                      </div>
                      <p className="text-gray-500 text-sm line-clamp-2">{diary.preview}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 底部留白 */}
      <div className="h-20" />
    </div>
  );
}