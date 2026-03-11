"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

interface GroupItem {
  id: string;
  name: string;
  avatar: string;
  memberCount: number;
  diaryCount: number;
  isPublic: boolean;
  isAdmin: boolean;
  tags: string[];
  description: string;
  lastActivity?: string;
}

export default function GroupsPage() {
  const [activeTab, setActiveTab] = useState<"my" | "discover" | "create">("my");
  const [searchQuery, setSearchQuery] = useState("");

  const myGroups: GroupItem[] = [
    { id: "g1", name: "写作爱好者联盟", avatar: "📝", memberCount: 128, diaryCount: 1567, isPublic: true, isAdmin: false, tags: ["写作", "创作", "文学"], lastActivity: "30分钟前", description: "热爱写作的朋友们的聚集地" },
    { id: "g2", name: "晨间日记俱乐部", avatar: "🌅", memberCount: 89, diaryCount: 2341, isPublic: true, isAdmin: true, tags: ["早起", "习惯", "成长"], lastActivity: "2小时前", description: "每天早起写日记，养成好习惯" },
    { id: "g5", name: "私密读书会", avatar: "📚", memberCount: 15, diaryCount: 234, isPublic: false, isAdmin: false, tags: ["读书", "分享", "成长"], lastActivity: "12小时前", description: "小而精的读书分享圈子" },
  ];

  const discoverGroups: GroupItem[] = [
    { id: "g3", name: "美食记录家", avatar: "🍳", memberCount: 256, diaryCount: 3890, isPublic: true, isAdmin: false, tags: ["美食", "烹饪", "生活"], description: "记录生活中的每一道美食" },
    { id: "g4", name: "旅行见闻录", avatar: "✈️", memberCount: 178, diaryCount: 2156, isPublic: true, isAdmin: false, tags: ["旅行", "探索", "风景"], description: "用文字记录旅途中的点点滴滴" },
    { id: "g6", name: "摄影日记", avatar: "📷", memberCount: 345, diaryCount: 4521, isPublic: true, isAdmin: false, tags: ["摄影", "记录", "艺术"], description: "用镜头和文字记录生活之美" },
    { id: "g7", name: "健身打卡群", avatar: "💪", memberCount: 567, diaryCount: 8934, isPublic: true, isAdmin: false, tags: ["健身", "打卡", "健康"], description: "坚持健身，每天进步一点点" },
  ];

  const filteredGroups = activeTab === "my" ? myGroups : discoverGroups.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50">
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
                <span>👥</span> 群组
              </h1>
              <p className="text-gray-500 mt-1">加入兴趣群组，与志同道合的朋友交流</p>
            </div>
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/25">
              ✨ 创建群组
            </button>
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
              <div className="text-2xl font-bold text-purple-600">{myGroups.length}</div>
              <div className="text-xs text-gray-500">我的群组</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-pink-600">3</div>
              <div className="text-xs text-gray-500">管理中</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-blue-600">128</div>
              <div className="text-xs text-gray-500">总成员</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-green-600">4142</div>
              <div className="text-xs text-gray-500">总日记</div>
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
              { key: "my", label: "我的群组", count: myGroups.length },
              { key: "discover", label: "发现群组", count: discoverGroups.length },
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
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === tab.key ? "bg-purple-100 text-purple-600" : "bg-gray-200 text-gray-600"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Search */}
      {activeTab === "discover" && (
        <section className="px-6 mb-6">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <input
              type="text"
              placeholder="搜索群组名称或标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
            />
          </motion.div>
        </section>
      )}

      {/* Groups List */}
      <section className="px-6 pb-12">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="space-y-4">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center text-2xl">
                    {group.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{group.name}</h3>
                      {!group.isPublic && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">🔒 私密</span>
                      )}
                      {group.isAdmin && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full">👑 管理员</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{group.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>👥 {group.memberCount} 成员</span>
                      <span>📝 {group.diaryCount} 日记</span>
                      {group.lastActivity && <span>🕐 {group.lastActivity}</span>}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {group.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {activeTab === "my" ? (
                      <>
                        <Link
                          href={`/groups/${group.id}`}
                          className="bg-purple-50 text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"
                        >
                          进入
                        </Link>
                        <button className="bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                          ⚙️
                        </button>
                      </>
                    ) : (
                      <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                        加入
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {activeTab === "discover" && filteredGroups.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-gray-500">没有找到匹配的群组</p>
            </div>
          )}
        </motion.div>
      </section>
    </div>
  );
}