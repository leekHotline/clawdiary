"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "online" | "requests">("all");

  const friends = [
    { id: "u1", name: "星辰", avatar: "⭐", bio: "追逐星空的人", status: "online", mutualFriends: 5, diariesCount: 128 },
    { id: "u2", name: "月光", avatar: "🌙", bio: "夜猫子日记", status: "away", mutualFriends: 3, diariesCount: 89 },
    { id: "u3", name: "彩虹", avatar: "🌈", bio: "生活多彩多姿", status: "offline", mutualFriends: 8, diariesCount: 256 },
    { id: "u4", name: "小溪", avatar: "🌊", bio: "细水长流的生活", status: "online", mutualFriends: 2, diariesCount: 67 },
  ];

  const requests = [
    { id: "fr1", name: "晨曦", avatar: "🌅", bio: "早起的鸟儿有虫吃", message: "看了你的日记，感觉很有共鸣！", mutualFriends: 4, time: "2小时前" },
    { id: "fr2", name: "落叶", avatar: "🍂", bio: "秋天的故事", message: "你好，我是落叶，想和你成为朋友", mutualFriends: 1, time: "1天前" },
  ];

  const suggestions = [
    { id: "u7", name: "云朵", avatar: "☁️", bio: "随云飘荡", mutualFriends: 6, matchScore: 92 },
    { id: "u8", name: "森林", avatar: "🌲", bio: "热爱大自然", mutualFriends: 4, matchScore: 85 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      default: return "bg-gray-300";
    }
  };

  const filteredFriends = activeTab === "online" 
    ? friends.filter(f => f.status === "online") 
    : friends;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <section className="pt-16 pb-6 px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <span>👥</span> 好友
              </h1>
              <p className="text-gray-500 mt-1">与志同道合的朋友分享生活</p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/messages"
                className="bg-white px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                💬 私信
              </Link>
            </div>
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
              <div className="text-2xl font-bold text-blue-600">{friends.length}</div>
              <div className="text-xs text-gray-500">好友</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-green-600">{friends.filter(f => f.status === "online").length}</div>
              <div className="text-xs text-gray-500">在线</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-orange-600">{requests.length}</div>
              <div className="text-xs text-gray-500">请求</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-purple-600">12</div>
              <div className="text-xs text-gray-500">互关</div>
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
              { key: "all", label: "全部好友", count: friends.length },
              { key: "online", label: "在线", count: friends.filter(f => f.status === "online").length },
              { key: "requests", label: "好友请求", count: requests.length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                    activeTab === tab.key ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-600"
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
          transition={{ delay: 0.3 }}
        >
          {activeTab === "requests" ? (
            /* 好友请求 */
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">好友请求</h2>
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{request.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{request.name}</h3>
                        <span className="text-xs text-gray-400">{request.time}</span>
                      </div>
                      <p className="text-sm text-gray-500">{request.bio}</p>
                      <p className="text-sm text-gray-700 mt-2 bg-gray-50 rounded-lg p-2">
                        "{request.message}"
                      </p>
                      <div className="text-xs text-gray-400 mt-2">
                        {request.mutualFriends} 位共同好友
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                        接受
                      </button>
                      <button className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                        拒绝
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* 好友列表 */
            <div className="space-y-3">
              {filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <span className="text-3xl">{friend.avatar}</span>
                      <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(friend.status)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{friend.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{friend.bio}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                        <span>📝 {friend.diariesCount} 篇日记</span>
                        <span>👥 {friend.mutualFriends} 位共同好友</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/messages?to=${friend.id}`}
                        className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                      >
                        💬 私信
                      </Link>
                      <Link
                        href={`/user/${friend.id}`}
                        className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                      >
                        主页
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 推荐好友 */}
          {activeTab === "all" && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">💡 可能认识的人</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{suggestion.avatar}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{suggestion.name}</h3>
                        <p className="text-sm text-gray-500">{suggestion.bio}</p>
                        <div className="text-xs text-blue-600 mt-1">
                          {suggestion.mutualFriends} 位共同好友 · 匹配度 {suggestion.matchScore}%
                        </div>
                      </div>
                      <button className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                        添加
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