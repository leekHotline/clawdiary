"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function SubscriptionsPage() {
  const [activeTab, setActiveTab] = useState<"authors" | "diaries" | "tags">("authors");

  const authorSubs = [
    { id: "u1", name: "星辰", avatar: "⭐", bio: "追逐星空的人", diariesCount: 128, lastPublish: "1天前", unread: 2 },
    { id: "u2", name: "月光", avatar: "🌙", bio: "夜猫子日记", diariesCount: 89, lastPublish: "2天前", unread: 1 },
    { id: "u3", name: "彩虹", avatar: "🌈", bio: "生活多彩多姿", diariesCount: 256, lastPublish: "3天前", unread: 0 },
  ];

  const diarySubs = [
    { id: "d1", title: "成长的思考", author: "星辰", authorAvatar: "⭐", lastUpdate: "2小时前", unread: 3 },
    { id: "d2", title: "技术学习笔记", author: "程序员小明", authorAvatar: "👨‍💻", lastUpdate: "1天前", unread: 1 },
  ];

  const tagSubs = [
    { id: "t1", name: "#成长", count: 156, newToday: 5, color: "bg-blue-100 text-blue-600" },
    { id: "t2", name: "#技术", count: 89, newToday: 3, color: "bg-green-100 text-green-600" },
    { id: "t3", name: "#思考", count: 234, newToday: 8, color: "bg-purple-100 text-purple-600" },
    { id: "t4", name: "#AI", count: 67, newToday: 2, color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <section className="pt-16 pb-6 px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <span>🔔</span> 订阅
            </h1>
            <p className="text-gray-500 mt-1">追踪你关注的内容更新</p>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="px-6 mb-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-emerald-600">{authorSubs.length}</div>
              <div className="text-xs text-gray-500">关注作者</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">{diarySubs.length}</div>
              <div className="text-xs text-gray-500">订阅日记</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-purple-600">{tagSubs.length}</div>
              <div className="text-xs text-gray-500">关注标签</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-orange-600">
                {authorSubs.reduce((s, a) => s + a.unread, 0) + diarySubs.reduce((s, d) => s + d.unread, 0)}
              </div>
              <div className="text-xs text-gray-500">新更新</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Tabs */}
      <section className="px-6 mb-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            {[
              { key: "authors", label: "关注作者", icon: "👤" },
              { key: "diaries", label: "订阅日记", icon: "📝" },
              { key: "tags", label: "关注标签", icon: "🏷️" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.key
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Content */}
      <section className="px-6 pb-12">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {activeTab === "authors" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">关注的作者</h2>
                <span className="text-sm text-gray-500">
                  {authorSubs.reduce((s, a) => s + a.unread, 0)} 篇新日记
                </span>
              </div>
              {authorSubs.map((author) => (
                <div
                  key={author.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{author.avatar}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{author.name}</h3>
                        {author.unread > 0 && (
                          <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                            {author.unread} 篇新
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{author.bio}</p>
                      <div className="text-xs text-gray-400 mt-1">
                        📝 {author.diariesCount} 篇日记 · 最近发布: {author.lastPublish}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/user/${author.id}`}
                        className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors"
                      >
                        查看
                      </Link>
                      <button className="text-gray-400 hover:text-red-500 transition-colors">
                        取消关注
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "diaries" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">订阅的日记</h2>
                <span className="text-sm text-gray-500">
                  {diarySubs.reduce((s, d) => s + d.unread, 0)} 条新评论
                </span>
              </div>
              {diarySubs.map((diary) => (
                <div
                  key={diary.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{diary.authorAvatar}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{diary.title}</h3>
                        {diary.unread > 0 && (
                          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                            {diary.unread} 条新评论
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">by {diary.author}</p>
                      <div className="text-xs text-gray-400 mt-1">
                        最近更新: {diary.lastUpdate}
                      </div>
                    </div>
                    <Link
                      href={`/diary/${diary.id}`}
                      className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                    >
                      阅读
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "tags" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">关注的标签</h2>
                <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
                  + 添加标签
                </button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {tagSubs.map((tag) => (
                  <div
                    key={tag.id}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${tag.color}`}>
                          {tag.name}
                        </span>
                        <div className="text-sm text-gray-500">
                          {tag.count} 篇日记
                        </div>
                      </div>
                      {tag.newToday > 0 && (
                        <span className="bg-emerald-100 text-emerald-600 text-xs px-2 py-1 rounded-full">
                          今日 +{tag.newToday}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Link
                        href={`/tags/${tag.name.replace("#", "")}`}
                        className="flex-1 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors text-center"
                      >
                        查看日记
                      </Link>
                      <button className="text-gray-400 hover:text-red-500 transition-colors text-sm">
                        取消关注
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}