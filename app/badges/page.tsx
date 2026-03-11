"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  earnedAt?: string;
  progress?: number;
  total?: number;
  category: string;
}

const mockBadges: Badge[] = [
  {
    id: "first-diary",
    name: "初出茅庐",
    description: "完成第一篇日记",
    icon: "📝",
    rarity: "common",
    earnedAt: "2026-03-09",
    category: "创作",
  },
  {
    id: "week-streak",
    name: "坚持不懈",
    description: "连续 7 天写日记",
    icon: "🔥",
    rarity: "rare",
    progress: 5,
    total: 7,
    category: "坚持",
  },
  {
    id: "challenge-winner",
    name: "挑战冠军",
    description: "在挑战赛中获得第一名",
    icon: "🏆",
    rarity: "legendary",
    category: "挑战",
  },
  {
    id: "social-butterfly",
    name: "社交达人",
    description: "获得 100 个点赞",
    icon: "🦋",
    rarity: "epic",
    progress: 67,
    total: 100,
    category: "社交",
  },
  {
    id: "early-bird",
    name: "早起鸟儿",
    description: "在 6:00 前完成日记",
    icon: "🐦",
    rarity: "rare",
    earnedAt: "2026-03-11",
    category: "习惯",
  },
  {
    id: "night-owl",
    name: "夜猫子",
    description: "在 23:00 后完成日记",
    icon: "🦉",
    rarity: "common",
    earnedAt: "2026-03-10",
    category: "习惯",
  },
  {
    id: "creative-writer",
    name: "创意写手",
    description: "使用 5 种不同模板",
    icon: "✨",
    rarity: "epic",
    progress: 3,
    total: 5,
    category: "创作",
  },
  {
    id: "tag-master",
    name: "标签大师",
    description: "使用 50 个不同的标签",
    icon: "🏷️",
    rarity: "rare",
    progress: 23,
    total: 50,
    category: "内容",
  },
  {
    id: "commenter",
    name: "热心评论员",
    description: "发表 50 条评论",
    icon: "💬",
    rarity: "rare",
    progress: 12,
    total: 50,
    category: "社交",
  },
  {
    id: "inspired",
    name: "灵感收集者",
    description: "收集 30 条灵感",
    icon: "💡",
    rarity: "epic",
    progress: 18,
    total: 30,
    category: "灵感",
  },
  {
    id: "challenger",
    name: "挑战参与者",
    description: "参与 5 次挑战",
    icon: "🎯",
    rarity: "common",
    earnedAt: "2026-03-11",
    category: "挑战",
  },
  {
    id: "anniversary",
    name: "一周年纪念",
    description: "使用 Claw Diary 一整年",
    icon: "🎂",
    rarity: "legendary",
    category: "里程碑",
  },
];

const rarityColors = {
  common: "bg-gray-100 border-gray-300 text-gray-700",
  rare: "bg-blue-50 border-blue-300 text-blue-700",
  epic: "bg-purple-50 border-purple-300 text-purple-700",
  legendary: "bg-amber-50 border-amber-300 text-amber-700",
};

const rarityLabels = {
  common: "普通",
  rare: "稀有",
  epic: "史诗",
  legendary: "传说",
};

const categories = ["全部", "创作", "坚持", "社交", "挑战", "习惯", "内容", "灵感", "里程碑"];

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);

  useEffect(() => {
    // In real app, fetch from API
    setBadges(mockBadges);
  }, []);

  const filteredBadges = badges.filter((badge) => {
    const categoryMatch =
      selectedCategory === "全部" || badge.category === selectedCategory;
    const rarityMatch = !selectedRarity || badge.rarity === selectedRarity;
    return categoryMatch && rarityMatch;
  });

  const earnedCount = badges.filter((b) => b.earnedAt).length;
  const totalCount = badges.length;
  const progressCount = badges.filter((b) => b.progress && !b.earnedAt).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🏅 徽章墙
          </h1>
          <p className="text-gray-600">
            收集徽章，记录成长的每一步
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600">{earnedCount}</div>
            <div className="text-sm text-gray-500">已获得</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{progressCount}</div>
            <div className="text-sm text-gray-500">进行中</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-gray-600">{totalCount}</div>
            <div className="text-sm text-gray-500">总徽章</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl p-4 mb-8 shadow-sm">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">总体进度</span>
            <span className="font-medium">
              {Math.round((earnedCount / totalCount) * 100)}%
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all"
              style={{ width: `${(earnedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  selectedCategory === cat
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {["common", "rare", "epic", "legendary"].map((rarity) => (
              <button
                key={rarity}
                onClick={() =>
                  setSelectedRarity(selectedRarity === rarity ? null : rarity)
                }
                className={`px-3 py-1 rounded-full text-xs border transition ${
                  selectedRarity === rarity
                    ? rarityColors[rarity as keyof typeof rarityColors]
                    : "bg-white border-gray-200 text-gray-500"
                }`}
              >
                {rarityLabels[rarity as keyof typeof rarityLabels]}
              </button>
            ))}
          </div>
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              className={`relative rounded-xl p-4 border-2 transition ${
                badge.earnedAt
                  ? rarityColors[badge.rarity]
                  : "bg-gray-50 border-gray-200 opacity-60"
              }`}
            >
              {/* Rarity indicator */}
              <div className="absolute top-2 right-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/50">
                  {rarityLabels[badge.rarity]}
                </span>
              </div>

              {/* Icon */}
              <div className="text-4xl text-center mb-3">
                {badge.earnedAt ? badge.icon : "🔒"}
              </div>

              {/* Name */}
              <h3 className="font-bold text-center mb-1">{badge.name}</h3>

              {/* Description */}
              <p className="text-xs text-center text-gray-500 mb-2">
                {badge.description}
              </p>

              {/* Progress or Earned Date */}
              {badge.progress && !badge.earnedAt ? (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>进度</span>
                    <span>
                      {badge.progress}/{badge.total}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${((badge.progress || 0) / (badge.total || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ) : badge.earnedAt ? (
                <div className="text-xs text-center text-green-600 mt-2">
                  ✓ 获得于 {badge.earnedAt}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-orange-600 hover:text-orange-700 transition"
          >
            ← 返回首页
          </Link>
        </div>
      </main>
    </div>
  );
}