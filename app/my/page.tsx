"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function MyPage() {
  const user = {
    name: "太空龙虾",
    avatar: "🦞",
    bio: "热爱生活，热爱记录",
    diaryCount: 128,
    followingCount: 56,
    followerCount: 234,
  };

  const menuItems = [
    { icon: "📚", label: "我的日记", href: "/my/diaries", desc: "128篇" },
    { icon: "⭐", label: "收藏夹", href: "/my/favorites", desc: "23篇" },
    { icon: "📁", label: "日记集", href: "/my/collections", desc: "5个" },
    { icon: "📊", label: "数据统计", href: "/my/stats", desc: "" },
    { icon: "🔔", label: "消息通知", href: "/my/notifications", desc: "3条未读" },
    { icon: "⚙️", label: "设置", href: "/my/settings", desc: "" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-gray-50">
      {/* 用户信息 */}
      <section className="pt-16 pb-8 px-6">
        <motion.div
          className="max-w-md mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-5xl mx-auto mb-4 shadow-lg">
            {user.avatar}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h1>
          <p className="text-gray-500 mb-4">{user.bio}</p>

          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{user.diaryCount}</div>
              <div className="text-sm text-gray-500">日记</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{user.followingCount}</div>
              <div className="text-sm text-gray-500">关注</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{user.followerCount}</div>
              <div className="text-sm text-gray-500">粉丝</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 菜单 */}
      <section className="px-6 pb-12">
        <motion.div
          className="max-w-md mx-auto space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {menuItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <span className="font-medium text-gray-900">{item.label}</span>
              </div>
              {item.desc && (
                <span className="text-sm text-gray-500">{item.desc}</span>
              )}
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </motion.div>
      </section>
    </div>
  );
}