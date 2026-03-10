"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CommunityPage() {
  const stats = [
    { label: "活跃用户", value: "1,234", icon: "👥" },
    { label: "今日留言", value: "89", icon: "💬" },
    { label: "热门话题", value: "23", icon: "🔥" },
  ];

  const recentActivities = [
    { user: "小明", avatar: "🐱", action: "发布了新日记", target: "今天学到了一个很酷的概念", time: "5分钟前" },
    { user: "学习达人", avatar: "📚", action: "评论了", target: "如何高效学习", time: "15分钟前" },
    { user: "旅行者", avatar: "🌍", action: "点赞了", target: "一个人的云南之旅", time: "1小时前" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      <section className="pt-16 pb-8 px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">💬 社区</h1>
          <p className="text-gray-500">和志同道合的朋友交流</p>
        </motion.div>
      </section>

      {/* 统计 */}
      <section className="px-6 mb-8">
        <motion.div
          className="max-w-4xl mx-auto grid grid-cols-3 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100">
              <span className="text-2xl">{stat.icon}</span>
              <div className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* 快捷入口 */}
      <section className="px-6 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/community/guestbook"
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">💬</span>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">留言大厅</h2>
                  <p className="text-sm text-gray-500">和大家聊聊</p>
                </div>
              </div>
            </Link>

            <Link
              href="/community/discussions"
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">💭</span>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">话题讨论</h2>
                  <p className="text-sm text-gray-500">参与热门话题</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 最新动态 */}
      <section className="px-6 pb-12">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">📢 最新动态</h2>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3"
              >
                <span className="text-2xl">{activity.avatar}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-gray-500"> {activity.action} </span>
                    <span className="font-medium text-purple-600">{activity.target}</span>
                  </p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}