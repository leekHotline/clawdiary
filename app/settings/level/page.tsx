"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface UserLevel {
  level: number;
  title: string;
  currentXp: number;
  requiredXp: number;
  totalXp: number;
}

interface LevelReward {
  level: number;
  title: string;
  badge: string;
  perks: string[];
}

const levelTitles: Record<number, string> = {
  1: "日记新手",
  2: "日记学徒",
  3: "日记行者",
  4: "日记达人",
  5: "日记专家",
  6: "日记大师",
  7: "日记宗师",
  8: "日记传奇",
  9: "日记圣者",
  10: "日记神话",
};

const levelBadges: Record<number, string> = {
  1: "🌱",
  2: "🌿",
  3: "🌳",
  4: "⭐",
  5: "🌟",
  6: "💫",
  7: "✨",
  8: "🔥",
  9: "💎",
  10: "👑",
};

export default function UserLevelPage() {
  const [levelData, setLevelData] = useState<UserLevel | null>(null);
  const [rewards, setRewards] = useState<LevelReward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLevelData();
  }, []);

  const fetchLevelData = async () => {
    try {
      const res = await fetch("/api/user/level");
      const data = await res.json();
      setLevelData(data.level);
      setRewards(data.rewards || []);
    } catch (error) {
      console.error("Failed to fetch level data:", error);
      // 使用模拟数据
      setLevelData({
        level: 4,
        title: "日记达人",
        currentXp: 2450,
        requiredXp: 3000,
        totalXp: 8450,
      });
      setRewards(getMockRewards());
    } finally {
      setLoading(false);
    }
  };

  const getMockRewards = (): LevelReward[] => [
    { level: 1, title: "日记新手", badge: "🌱", perks: ["基础日记功能", "每日提醒"] },
    { level: 2, title: "日记学徒", badge: "🌿", perks: ["标签功能", "搜索功能"] },
    { level: 3, title: "日记行者", badge: "🌳", perks: ["心情追踪", "统计图表"] },
    { level: 4, title: "日记达人", badge: "⭐", perks: ["成就系统", "自定义主题"] },
    { level: 5, title: "日记专家", badge: "🌟", perks: ["AI 写作建议", "封面生成"] },
    { level: 6, title: "日记大师", badge: "💫", perks: ["协作日记", "高级统计"] },
    { level: 7, title: "日记宗师", badge: "✨", perks: ["API 访问", "数据导出"] },
    { level: 8, title: "日记传奇", badge: "🔥", perks: ["专属徽章", "优先支持"] },
    { level: 9, title: "日记圣者", badge: "💎", perks: ["隐藏功能", "定制头像"] },
    { level: 10, title: "日记神话", badge: "👑", perks: ["所有功能", "传奇称号"] },
  ];

  const getXpSources = () => [
    { action: "写一篇日记", xp: 50, icon: "📝" },
    { action: "连续写日记", xp: 20, icon: "🔥" },
    { action: "获得点赞", xp: 5, icon: "❤️" },
    { action: "获得评论", xp: 10, icon: "💬" },
    { action: "解锁成就", xp: 30, icon: "🏆" },
    { action: "完成挑战", xp: 100, icon: "🎯" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  const progressPercent = levelData ? (levelData.currentXp / levelData.requiredXp) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">⭐ 用户等级</h1>
          <p className="text-gray-600 mt-1">写日记，升等级，解锁更多功能</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Current Level Card */}
        {levelData && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{levelBadges[levelData.level]}</div>
                <div>
                  <div className="text-sm text-gray-500">当前等级</div>
                  <div className="text-2xl font-bold text-emerald-600">
                    Lv.{levelData.level} {levelData.title}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">总经验值</div>
                <div className="text-xl font-bold text-gray-900">{levelData.totalXp.toLocaleString()} XP</div>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">升级进度</span>
                <span className="font-medium">{levelData.currentXp}/{levelData.requiredXp} XP</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Lv.{levelData.level}</span>
                <span>Lv.{levelData.level + 1} - {levelTitles[levelData.level + 1] || "???"}</span>
              </div>
            </div>

            {/* Next Level Preview */}
            {levelData.level < 10 && (
              <div className="bg-emerald-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{levelBadges[levelData.level + 1]}</div>
                  <div>
                    <div className="text-sm text-gray-600">下一等级</div>
                    <div className="font-semibold text-emerald-700">
                      Lv.{levelData.level + 1} {levelTitles[levelData.level + 1]}
                    </div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-sm text-gray-600">还需</div>
                    <div className="font-medium text-emerald-600">
                      {levelData.requiredXp - levelData.currentXp} XP
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* XP Sources */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">💡 获取经验值</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {getXpSources().map((source, index) => (
              <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                <span className="text-2xl">{source.icon}</span>
                <div>
                  <div className="text-sm text-gray-700">{source.action}</div>
                  <div className="text-emerald-600 font-semibold">+{source.xp} XP</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Level Rewards */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">🎁 等级奖励</h3>
          <div className="space-y-3">
            {rewards.map((reward) => (
              <div
                key={reward.level}
                className={`flex items-center gap-4 p-4 rounded-lg transition ${
                  levelData && reward.level <= levelData.level
                    ? "bg-emerald-50 border border-emerald-200"
                    : "bg-gray-50 opacity-60"
                }`}
              >
                <div className="text-3xl">{reward.badge}</div>
                <div className="flex-1">
                  <div className="font-semibold">
                    Lv.{reward.level} {reward.title}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {reward.perks.map((perk, i) => (
                      <span key={i} className="text-xs bg-white px-2 py-1 rounded text-gray-600">
                        {perk}
                      </span>
                    ))}
                  </div>
                </div>
                {levelData && reward.level <= levelData.level && (
                  <span className="text-emerald-600 text-sm font-medium">✅ 已解锁</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Level Titles */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">📊 等级称号一览</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(levelTitles).map(([level, title]) => (
              <div
                key={level}
                className={`text-center p-3 rounded-lg ${
                  levelData && parseInt(level) <= levelData.level
                    ? "bg-emerald-100"
                    : "bg-gray-100"
                }`}
              >
                <div className="text-2xl">{levelBadges[parseInt(level)]}</div>
                <div className="text-sm font-medium mt-1">Lv.{level}</div>
                <div className="text-xs text-gray-600">{title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/achievements" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition text-center">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-sm text-gray-700">成就系统</div>
          </Link>
          <Link href="/stats" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition text-center">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-sm text-gray-700">数据统计</div>
          </Link>
          <Link href="/challenges" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition text-center">
            <div className="text-2xl mb-1">🎯</div>
            <div className="text-sm text-gray-700">写作挑战</div>
          </Link>
          <Link href="/badges" className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition text-center">
            <div className="text-2xl mb-1">🏅</div>
            <div className="text-sm text-gray-700">徽章墙</div>
          </Link>
        </div>
      </main>

      {/* Back */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <Link href="/settings" className="text-emerald-600 hover:underline">
          ← 返回设置
        </Link>
      </div>
    </div>
  );
}