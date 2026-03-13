"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface PublicUser {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  joinedAt: string;
  stats: {
    diaries: number;
    followers: number;
    following: number;
    likes: number;
    achievements: number;
  };
  badges: string[];
  recentDiaries: {
    id: string;
    title: string;
    date: string;
    likes: number;
  }[];
}

export default function UserProfilePage() {
  const params = useParams();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"diaries" | "achievements" | "following">("diaries");

  useEffect(() => {
    fetchUser();
  }, [params.id]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${params.id}/public`);
      const data = await res.json();
      setUser(data.user);
      setIsFollowing(data.isFollowing);
    } catch (_error) {
      console.error("Failed to fetch user:", _error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFollow = async () => {
    try {
      const res = await fetch("/api/follows", {
        method: isFollowing ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetId: params.id }),
      });
      if (res.ok) {
        setIsFollowing(!isFollowing);
      }
    } catch (_error) {
      console.error("Failed to toggle follow:", _error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <div className="text-gray-500">用户不存在</div>
          <Link href="/" className="text-blue-500 mt-4 inline-block">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50">
      {/* 封面 */}
      <div className="h-48 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 relative">
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* 头像和基本信息 */}
        <div className="relative -mt-16 mb-6">
          <div className="flex items-end gap-6">
            {/* 头像 */}
            <div className="w-32 h-32 rounded-2xl bg-white shadow-lg flex items-center justify-center text-6xl border-4 border-white">
              {user.avatar || "👤"}
            </div>

            {/* 名称和关注按钮 */}
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-500 text-sm mt-1">
                加入于 {new Date(user.joinedAt).toLocaleDateString("zh-CN", { year: "numeric", month: "long" })}
              </p>
            </div>

            <button
              onClick={toggleFollow}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                isFollowing
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isFollowing ? "已关注" : "关注"}
            </button>
          </div>
        </div>

        {/* 简介 */}
        {user.bio && (
          <div className="mb-6">
            <p className="text-gray-700">{user.bio}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              {user.location && (
                <span className="flex items-center gap-1">
                  📍 {user.location}
                </span>
              )}
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  🔗 {user.website.replace(/https?:\/\//, "")}
                </a>
              )}
            </div>
          </div>
        )}

        {/* 徽章 */}
        {user.badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {user.badges.map((badge) => (
              <span
                key={badge}
                className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium"
              >
                🏆 {badge}
              </span>
            ))}
          </div>
        )}

        {/* 统计 */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-gray-800">{user.stats.diaries}</div>
            <div className="text-xs text-gray-500 mt-1">日记</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-gray-800">{user.stats.followers}</div>
            <div className="text-xs text-gray-500 mt-1">粉丝</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-gray-800">{user.stats.following}</div>
            <div className="text-xs text-gray-500 mt-1">关注</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-gray-800">{user.stats.likes}</div>
            <div className="text-xs text-gray-500 mt-1">获赞</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-gray-800">{user.stats.achievements}</div>
            <div className="text-xs text-gray-500 mt-1">成就</div>
          </div>
        </div>

        {/* 标签页 */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 shadow-sm">
          {[
            { key: "diaries", label: "日记", icon: "📔" },
            { key: "achievements", label: "成就", icon: "🏆" },
            { key: "following", label: "关注", icon: "👥" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* 内容 */}
        {activeTab === "diaries" && (
          <div className="space-y-4">
            {user.recentDiaries.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">📝</div>
                <div>暂无公开日记</div>
              </div>
            ) : (
              user.recentDiaries.map((diary) => (
                <Link
                  key={diary.id}
                  href={`/diary/${diary.id}`}
                  className="block bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800 hover:text-blue-600">
                        {diary.title}
                      </h3>
                      <div className="text-sm text-gray-500 mt-1">{diary.date}</div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <span>❤️</span>
                      <span className="text-sm">{diary.likes}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === "achievements" && (
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: user.stats.achievements }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-5 text-center shadow-sm"
              >
                <div className="text-4xl mb-3">🏆</div>
                <div className="font-medium text-gray-800">成就 #{i + 1}</div>
                <div className="text-xs text-gray-500 mt-1">2026-03-{10 - i}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "following" && (
          <div className="bg-white rounded-xl p-6 shadow-sm text-center">
            <div className="text-gray-500">
              关注列表仅对本人可见
            </div>
          </div>
        )}
      </div>
    </div>
  );
}