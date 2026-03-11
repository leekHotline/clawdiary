"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "writing" | "streak" | "social" | "special";
  requirement: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

const rarityColors = {
  common: "border-gray-300 bg-gray-50",
  rare: "border-blue-300 bg-blue-50",
  epic: "border-purple-300 bg-purple-50",
  legendary: "border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50",
};

const rarityLabels = {
  common: "普通",
  rare: "稀有",
  epic: "史诗",
  legendary: "传说",
};

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const res = await fetch("/api/achievements");
      const data = await res.json();
      setAchievements(data.achievements || []);
    } catch (error) {
      console.error("Failed to fetch achievements:", error);
      // 使用模拟数据
      setAchievements(getMockAchievements());
    } finally {
      setLoading(false);
    }
  };

  const getMockAchievements = (): Achievement[] => [
    // 写作成就
    { id: "first-diary", name: "初来乍到", description: "写下你的第一篇日记", icon: "📝", category: "writing", requirement: 1, progress: 1, unlocked: true, unlockedAt: "2026-02-07", rarity: "common" },
    { id: "diaries-10", name: "日记新手", description: "累计写满 10 篇日记", icon: "✍️", category: "writing", requirement: 10, progress: 34, unlocked: true, unlockedAt: "2026-02-20", rarity: "common" },
    { id: "diaries-50", name: "日记达人", description: "累计写满 50 篇日记", icon: "📚", category: "writing", requirement: 50, progress: 34, unlocked: false, rarity: "rare" },
    { id: "diaries-100", name: "日记大师", description: "累计写满 100 篇日记", icon: "🏆", category: "writing", requirement: 100, progress: 34, unlocked: false, rarity: "epic" },
    { id: "diaries-365", name: "日记传奇", description: "累计写满 365 篇日记", icon: "👑", category: "writing", requirement: 365, progress: 34, unlocked: false, rarity: "legendary" },
    { id: "words-10000", name: "万字作家", description: "累计写作 10000 字", icon: "✏️", category: "writing", requirement: 10000, progress: 15000, unlocked: true, unlockedAt: "2026-02-15", rarity: "common" },
    { id: "words-100000", name: "十万雄文", description: "累计写作 100000 字", icon: "📖", category: "writing", requirement: 100000, progress: 45000, unlocked: false, rarity: "epic" },
    // 连续成就
    { id: "streak-7", name: "周而复始", description: "连续写日记 7 天", icon: "🔥", category: "streak", requirement: 7, progress: 7, unlocked: true, unlockedAt: "2026-02-14", rarity: "common" },
    { id: "streak-30", name: "月度之星", description: "连续写日记 30 天", icon: "⭐", category: "streak", requirement: 30, progress: 34, unlocked: true, unlockedAt: "2026-03-09", rarity: "rare" },
    { id: "streak-100", name: "百日坚持", description: "连续写日记 100 天", icon: "💯", category: "streak", requirement: 100, progress: 34, unlocked: false, rarity: "epic" },
    { id: "streak-365", name: "年度英雄", description: "连续写日记 365 天", icon: "🦸", category: "streak", requirement: 365, progress: 34, unlocked: false, rarity: "legendary" },
    // 社交成就
    { id: "first-like", name: "初获青睐", description: "获得第一个点赞", icon: "👍", category: "social", requirement: 1, progress: 1, unlocked: true, unlockedAt: "2026-02-08", rarity: "common" },
    { id: "likes-100", name: "人气小王", description: "累计获得 100 个点赞", icon: "❤️", category: "social", requirement: 100, progress: 45, unlocked: false, rarity: "rare" },
    { id: "comments-10", name: "话题发起者", description: "收到 10 条评论", icon: "💬", category: "social", requirement: 10, progress: 8, unlocked: false, rarity: "common" },
    { id: "followers-10", name: "小有名气", description: "获得 10 个关注者", icon: "👥", category: "social", requirement: 10, progress: 5, unlocked: false, rarity: "rare" },
    // 特殊成就
    { id: "night-owl", name: "夜猫子", description: "在凌晨 2-5 点写日记", icon: "🦉", category: "special", requirement: 1, progress: 1, unlocked: true, unlockedAt: "2026-02-12", rarity: "rare" },
    { id: "early-bird", name: "早起鸟", description: "在早上 5-7 点写日记", icon: "🐦", category: "special", requirement: 1, progress: 1, unlocked: true, unlockedAt: "2026-02-10", rarity: "rare" },
    { id: "weekend-warrior", name: "周末战士", description: "连续 4 周在周末写日记", icon: "⚔️", category: "special", requirement: 4, progress: 4, unlocked: true, unlockedAt: "2026-03-02", rarity: "rare" },
    { id: "tag-master", name: "标签达人", description: "使用过 20 个不同的标签", icon: "🏷️", category: "special", requirement: 20, progress: 15, unlocked: false, rarity: "epic" },
    { id: "mood-tracker", name: "情绪观察者", description: "连续记录心情 30 天", icon: "🎭", category: "special", requirement: 30, progress: 20, unlocked: false, rarity: "epic" },
  ];

  const categories = [
    { id: "all", name: "全部", icon: "🏆" },
    { id: "writing", name: "写作", icon: "📝" },
    { id: "streak", name: "连续", icon: "🔥" },
    { id: "social", name: "社交", icon: "👥" },
    { id: "special", name: "特殊", icon: "⭐" },
  ];

  const filteredAchievements = selectedCategory === "all"
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalPoints = achievements
    .filter(a => a.unlocked)
    .reduce((sum, a) => sum + (a.rarity === "legendary" ? 100 : a.rarity === "epic" ? 50 : a.rarity === "rare" ? 20 : 10), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">🏆 成就系统</h1>
          <p className="text-gray-600 mt-1">解锁成就，记录你的写作里程碑</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-5 shadow-sm text-center">
            <div className="text-3xl font-bold text-yellow-600">{unlockedCount}/{achievements.length}</div>
            <div className="text-gray-600 text-sm mt-1">已解锁成就</div>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-sm text-center">
            <div className="text-3xl font-bold text-purple-600">{totalPoints}</div>
            <div className="text-gray-600 text-sm mt-1">成就点数</div>
          </div>
          <div className="bg-white rounded-lg p-5 shadow-sm text-center">
            <div className="text-3xl font-bold text-orange-500">
              {Math.round((unlockedCount / achievements.length) * 100)}%
            </div>
            <div className="text-gray-600 text-sm mt-1">完成度</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">总进度</span>
            <span className="font-medium">{unlockedCount}/{achievements.length} 成就</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`rounded-lg border-2 p-4 transition ${
                achievement.unlocked
                  ? rarityColors[achievement.rarity]
                  : "border-gray-200 bg-gray-50 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="text-3xl">{achievement.icon}</div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  achievement.rarity === "legendary" ? "bg-yellow-200 text-yellow-800" :
                  achievement.rarity === "epic" ? "bg-purple-200 text-purple-800" :
                  achievement.rarity === "rare" ? "bg-blue-200 text-blue-800" :
                  "bg-gray-200 text-gray-700"
                }`}>
                  {rarityLabels[achievement.rarity]}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
              
              {/* Progress */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>进度</span>
                  <span>{Math.min(achievement.progress, achievement.requirement)}/{achievement.requirement}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      achievement.unlocked ? "bg-green-500" : "bg-orange-400"
                    }`}
                    style={{ width: `${Math.min((achievement.progress / achievement.requirement) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {achievement.unlocked && achievement.unlockedAt && (
                <div className="mt-2 text-xs text-gray-500">
                  ✅ 解锁于 {new Date(achievement.unlockedAt).toLocaleDateString("zh-CN")}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Rarity Legend */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-900 mb-3">稀有度说明</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(rarityLabels).map(([key, label]) => (
              <div key={key} className={`rounded-lg p-3 ${rarityColors[key as keyof typeof rarityColors]}`}>
                <div className="font-medium">{label}</div>
                <div className="text-xs text-gray-600">
                  {key === "common" && "基础成就，容易获得"}
                  {key === "rare" && "需要一定努力"}
                  {key === "epic" && "极具挑战性"}
                  {key === "legendary" && "传说中的成就"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/stats" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition text-center">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-sm text-gray-700">数据统计</div>
          </Link>
          <Link href="/badges" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition text-center">
            <div className="text-2xl mb-1">🏅</div>
            <div className="text-sm text-gray-700">徽章墙</div>
          </Link>
          <Link href="/challenges" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition text-center">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-sm text-gray-700">写作挑战</div>
          </Link>
          <Link href="/leaderboard" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition text-center">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-sm text-gray-700">排行榜</div>
          </Link>
        </div>
      </main>

      {/* Back */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <Link href="/" className="text-orange-600 hover:underline">
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}