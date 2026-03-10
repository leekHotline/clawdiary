"use client";

import { useState } from "react";
import Link from "next/link";

interface Follower {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  followedAt: string;
  isFollowing: boolean;
}

export default function FollowersPage() {
  const [activeTab, setActiveTab] = useState<"followers" | "following">("followers");
  const [followers, setFollowers] = useState<Follower[]>([
    { id: "1", name: "星辰", avatar: "⭐", bio: "追逐星空的人", followedAt: "2024-03-10", isFollowing: true },
    { id: "2", name: "月光", avatar: "🌙", bio: "夜猫子日记", followedAt: "2024-03-09", isFollowing: false },
    { id: "3", name: "彩虹", avatar: "🌈", bio: "生活多彩多姿", followedAt: "2024-03-08", isFollowing: true },
    { id: "4", name: "森林", avatar: "🌲", bio: "自然主义者", followedAt: "2024-03-07", isFollowing: true },
    { id: "5", name: "海洋", avatar: "🌊", bio: "深邃如海", followedAt: "2024-03-06", isFollowing: false },
  ]);

  const [following, setFollowing] = useState<Follower[]>([
    { id: "6", name: "猫咪", avatar: "🐱", bio: "慵懒的猫生", followedAt: "2024-03-10", isFollowing: true },
    { id: "7", name: "向日葵", avatar: "🌻", bio: "永远向阳", followedAt: "2024-03-09", isFollowing: true },
    { id: "8", name: "火箭", avatar: "🚀", bio: "冲向星辰大海", followedAt: "2024-03-08", isFollowing: true },
  ]);

  const toggleFollow = (id: string, list: "followers" | "following") => {
    const updateList = (items: Follower[]) =>
      items.map((item) =>
        item.id === id ? { ...item, isFollowing: !item.isFollowing } : item
      );

    if (list === "followers") {
      setFollowers(updateList(followers));
    } else {
      setFollowing(updateList(following));
    }
  };

  const currentList = activeTab === "followers" ? followers : following;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-gray-50">
      {/* 头部 */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-10">
        <div className="max-w-md mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link href="/my" className="text-gray-400 hover:text-gray-600">
              ← 返回
            </Link>
            <h1 className="text-lg font-bold text-gray-800">关注</h1>
            <div className="w-12"></div>
          </div>

          {/* 标签切换 */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("followers")}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                activeTab === "followers"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              粉丝 · 234
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                activeTab === "following"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              关注 · 56
            </button>
          </div>
        </div>
      </header>

      {/* 列表 */}
      <main className="max-w-md mx-auto px-6 py-4">
        <div className="space-y-3">
          {currentList.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm"
            >
              {/* 头像 */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center text-2xl">
                {user.avatar}
              </div>

              {/* 信息 */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
                <p className="text-sm text-gray-500 truncate">{user.bio}</p>
              </div>

              {/* 关注按钮 */}
              <button
                onClick={() => toggleFollow(user.id, activeTab)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  user.isFollowing
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
              >
                {user.isFollowing ? "已关注" : "关注"}
              </button>
            </div>
          ))}
        </div>

        {/* 空状态 */}
        {currentList.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500">
              {activeTab === "followers" ? "还没有粉丝" : "还没有关注任何人"}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}