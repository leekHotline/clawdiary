"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function RankingsPage() {
  const userRankings = [
    { rank: 1, id: "u1", name: "星辰", avatar: "⭐", level: 28, diaries: 128, likes: 2856, badges: 15 },
    { rank: 2, id: "u2", name: "彩虹", avatar: "🌈", level: 25, diaries: 256, likes: 2345, badges: 12 },
    { rank: 3, id: "u3", name: "月光", avatar: "🌙", level: 22, diaries: 89, likes: 1876, badges: 10 },
    { rank: 4, id: "u4", name: "小溪", avatar: "🌊", level: 20, diaries: 67, likes: 1523, badges: 8 },
    { rank: 5, id: "u5", name: "晨曦", avatar: "🌅", level: 18, diaries: 45, likes: 1234, badges: 7 },
    { rank: 6, id: "u6", name: "落叶", avatar: "🍂", level: 16, diaries: 23, likes: 987, badges: 5 },
    { rank: 7, id: "u7", name: "云朵", avatar: "☁️", level: 15, diaries: 34, likes: 876, badges: 4 },
    { rank: 8, id: "u8", name: "森林", avatar: "🌲", level: 14, diaries: 28, likes: 765, badges: 4 },
  ];

  const diaryRankings = [
    { rank: 1, id: "d1", title: "成长的思考", author: "星辰", authorAvatar: "⭐", views: 1256, likes: 89, comments: 23 },
    { rank: 2, id: "d2", title: "一个人的云南之旅", author: "彩虹", authorAvatar: "🌈", views: 987, likes: 76, comments: 18 },
    { rank: 3, id: "d3", title: "技术学习笔记", author: "程序员小明", authorAvatar: "👨‍💻", views: 876, likes: 65, comments: 15 },
    { rank: 4, id: "d4", title: "晨间日记的力量", author: "月光", authorAvatar: "🌙", views: 765, likes: 54, comments: 12 },
    { rank: 5, id: "d5", title: "关于人生的思考", author: "小溪", authorAvatar: "🌊", views: 654, likes: 43, comments: 10 },
  ];

  const tagRankings = [
    { rank: 1, name: "成长", count: 456, trend: "up" },
    { rank: 2, name: "技术", count: 389, trend: "up" },
    { rank: 3, name: "思考", count: 345, trend: "stable" },
    { rank: 4, name: "生活", count: 298, trend: "down" },
    { rank: 5, name: "AI", count: 267, trend: "up" },
    { rank: 6, name: "读书", count: 234, trend: "stable" },
    { rank: 7, name: "旅行", count: 198, trend: "up" },
    { rank: 8, name: "写作", count: 176, trend: "stable" },
  ];

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return "📈";
    if (trend === "down") return "📉";
    return "➡️";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-amber-50">
      {/* Header */}
      <section className="pt-16 pb-6 px-6">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <span>🏆</span> 社区排行榜
          </h1>
          <p className="text-gray-500 mt-1">看看谁是社区最活跃的成员</p>
        </motion.div>
      </section>

      {/* Content */}
      <section className="px-6 pb-12">
        <motion.div
          className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* 用户排行 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>👥</span> 用户排行
            </h2>
            <div className="space-y-3">
              {userRankings.map((user) => (
                <Link
                  key={user.id}
                  href={`/user/${user.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="w-6 text-center font-bold text-gray-500">
                    {getRankBadge(user.rank)}
                  </span>
                  <span className="text-2xl">{user.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>Lv.{user.level}</span>
                      <span>📝 {user.diaries}</span>
                      <span>❤️ {user.likes}</span>
                    </div>
                  </div>
                  {user.rank <= 3 && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                      TOP {user.rank}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* 日记排行 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>📝</span> 热门日记
            </h2>
            <div className="space-y-3">
              {diaryRankings.map((diary) => (
                <Link
                  key={diary.id}
                  href={`/diary/${diary.id}`}
                  className="block p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <span className="w-6 text-center font-bold text-gray-500 shrink-0">
                      {getRankBadge(diary.rank)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{diary.title}</h3>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                        <span>{diary.authorAvatar}</span>
                        <span>{diary.author}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span>👁️ {diary.views}</span>
                        <span>❤️ {diary.likes}</span>
                        <span>💬 {diary.comments}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 标签排行 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>🏷️</span> 热门标签
            </h2>
            <div className="space-y-2">
              {tagRankings.map((tag) => (
                <Link
                  key={tag.name}
                  href={`/tags/${tag.name}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <span className="w-6 text-center font-bold text-gray-500">
                    {getRankBadge(tag.rank)}
                  </span>
                  <span className="flex-1 font-medium text-blue-600">#{tag.name}</span>
                  <span className="text-sm text-gray-400">{tag.count}</span>
                  <span className="text-xs">{getTrendIcon(tag.trend)}</span>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}