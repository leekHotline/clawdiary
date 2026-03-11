"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, use } from "react";

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState<"diaries" | "members" | "about">("diaries");

  const group = {
    id: resolvedParams.id,
    name: "写作爱好者联盟",
    description: "热爱写作的朋友们的聚集地，分享创作心得，互相激励成长",
    avatar: "📝",
    memberCount: 128,
    diaryCount: 1567,
    isPublic: true,
    isAdmin: false,
    tags: ["写作", "创作", "文学"],
    createdAt: "2025-06-15",
    rules: [
      "友善交流，尊重每一位成员",
      "鼓励原创，拒绝抄袭",
      "积极互动，给予建设性反馈",
      "保持话题相关性",
    ],
  };

  const diaries = [
    { id: "gd1", title: "今天的写作灵感", content: "清晨醒来，脑海中浮现出无数灵感...", author: { id: "u1", name: "星辰", avatar: "⭐" }, likes: 12, comments: 5, reactions: { "❤️": 8, "👍": 4 }, createdAt: "2小时前", isPinned: true },
    { id: "gd2", title: "分享一个写作技巧", content: "最近发现一个提高写作效率的方法...", author: { id: "u2", name: "月光", avatar: "🌙" }, likes: 8, comments: 3, reactions: { "❤️": 5, "🔥": 3 }, createdAt: "5小时前", isPinned: false },
    { id: "gd3", title: "本月写作目标完成情况", content: "这个月我完成了20篇日记...", author: { id: "u3", name: "彩虹", avatar: "🌈" }, likes: 15, comments: 8, reactions: { "🎉": 10, "💪": 5 }, createdAt: "昨天", isPinned: false },
  ];

  const members = [
    { id: "m1", userId: "u1", name: "星辰", avatar: "⭐", role: "admin", diaryCount: 45, lastActive: "刚刚" },
    { id: "m2", userId: "u2", name: "月光", avatar: "🌙", role: "moderator", diaryCount: 38, lastActive: "1小时前" },
    { id: "m3", userId: "u3", name: "彩虹", avatar: "🌈", role: "member", diaryCount: 22, lastActive: "3小时前" },
    { id: "m4", userId: "u4", name: "小溪", avatar: "🌊", role: "member", diaryCount: 15, lastActive: "昨天" },
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin": return { text: "创建者", color: "bg-purple-100 text-purple-600" };
      case "moderator": return { text: "管理员", color: "bg-blue-100 text-blue-600" };
      default: return { text: "成员", color: "bg-gray-100 text-gray-600" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
      {/* Header */}
      <section className="pt-16 pb-6 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link href="/groups" className="inline-flex items-center gap-1 text-white/80 hover:text-white mb-4 transition-colors">
            ← 返回群组列表
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl backdrop-blur-sm">
              {group.avatar}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {group.name}
                {!group.isPublic && <span className="text-lg">🔒</span>}
              </h1>
              <p className="text-white/80 mt-1">{group.description}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-white/80">
                <span>👥 {group.memberCount} 成员</span>
                <span>📝 {group.diaryCount} 日记</span>
                <span>📅 创建于 {group.createdAt}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {group.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full backdrop-blur-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors">
                写日记
              </button>
              <button className="bg-white/20 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors backdrop-blur-sm">
                ⋯
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Tabs */}
      <section className="px-6 mt-6 mb-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            {[
              { key: "diaries", label: "群组日记", count: group.diaryCount },
              { key: "members", label: "成员", count: group.memberCount },
              { key: "about", label: "关于", count: 0 },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                    activeTab === tab.key ? "bg-purple-100 text-purple-600" : "bg-gray-200 text-gray-600"
                  }`}>
                    {tab.count}
                  </span>
                )}
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
          transition={{ delay: 0.2 }}
        >
          {activeTab === "diaries" && (
            <div className="space-y-4">
              {diaries.map((diary) => (
                <div
                  key={diary.id}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  {diary.isPinned && (
                    <div className="text-xs text-purple-600 mb-2 flex items-center gap-1">
                      📌 置顶
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{diary.author.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{diary.author.name}</h3>
                        <span className="text-xs text-gray-400">{diary.createdAt}</span>
                      </div>
                      <h4 className="font-medium text-gray-800 mt-1">{diary.title}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{diary.content}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          {Object.entries(diary.reactions).map(([emoji, count]) => (
                            <span key={emoji}>{emoji} {count}</span>
                          ))}
                        </span>
                        <span>💬 {diary.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "members" && (
            <div className="grid md:grid-cols-2 gap-4">
              {members.map((member) => {
                const badge = getRoleBadge(member.role);
                return (
                  <div
                    key={member.id}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3"
                  >
                    <span className="text-3xl">{member.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${badge.color}`}>
                          {badge.text}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                        <span>📝 {member.diaryCount} 日记</span>
                        <span>🕐 {member.lastActive}</span>
                      </div>
                    </div>
                    <Link
                      href={`/user/${member.userId}`}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "about" && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">群组规则</h3>
              <ul className="space-y-3">
                {group.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600">
                    <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    {rule}
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-3">群组统计</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{group.memberCount}</div>
                    <div className="text-sm text-gray-500">成员</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">{group.diaryCount}</div>
                    <div className="text-sm text-gray-500">日记</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">28</div>
                    <div className="text-sm text-gray-500">今日活跃</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}