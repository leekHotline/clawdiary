'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface AchievementDetail {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  points: number;
  requirement: {
    type: string;
    target: number;
    current: number;
  };
  rewards: {
    type: string;
    value: number;
  }[];
  unlockedAt?: string;
  progress: number;
  unlocked: boolean;
  users: number;
  firstUnlockedBy?: {
    id: string;
    name: string;
    avatar: string;
    unlockedAt: string;
  };
  recentUnlocks: {
    id: string;
    name: string;
    avatar: string;
    unlockedAt: string;
  }[];
  tips: string[];
  relatedAchievements: {
    id: string;
    name: string;
    icon: string;
    unlocked: boolean;
  }[];
}

const RARITY_COLORS = {
  common: 'from-gray-400 to-gray-500',
  uncommon: 'from-green-400 to-green-500',
  rare: 'from-blue-400 to-blue-500',
  epic: 'from-purple-400 to-purple-500',
  legendary: 'from-yellow-400 to-orange-500',
};

const RARITY_BG = {
  common: 'bg-gray-100 border-gray-300',
  uncommon: 'bg-green-50 border-green-300',
  rare: 'bg-blue-50 border-blue-300',
  epic: 'bg-purple-50 border-purple-300',
  legendary: 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300',
};

export default function AchievementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [achievement, setAchievement] = useState<AchievementDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    fetchAchievement();
  }, [params.id]);

  const fetchAchievement = async () => {
    try {
      const res = await fetch(`/api/achievements/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setAchievement(data);
      }
    } catch (error) {
      console.error('Failed to fetch achievement:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (!achievement) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="text-6xl">🏆</div>
        <h1 className="text-2xl font-bold text-gray-800">成就不存在</h1>
        <Link href="/achievements" className="text-purple-600 hover:text-purple-700">
          返回成就列表
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ←
          </button>
          <h1 className="text-xl font-bold">成就详情</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Achievement Card */}
        <div className={`rounded-2xl border-2 ${RARITY_BG[achievement.rarity]} overflow-hidden`}>
          {/* Hero Section */}
          <div className={`h-32 bg-gradient-to-r ${RARITY_COLORS[achievement.rarity]} relative`}>
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute -bottom-12 left-8">
              <div className={`w-24 h-24 rounded-2xl bg-white shadow-lg flex items-center justify-center text-5xl ${
                achievement.unlocked ? '' : 'grayscale opacity-50'
              }`}>
                {achievement.icon}
              </div>
            </div>
            {achievement.unlocked && (
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm font-medium">
                ✓ 已解锁
              </div>
            )}
          </div>

          <div className="pt-16 px-8 pb-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{achievement.name}</h2>
                <p className="text-gray-600 mt-1">{achievement.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">+{achievement.points}</div>
                <div className="text-sm text-gray-500">积分</div>
              </div>
            </div>

            {/* Category & Rarity */}
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                {achievement.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm text-white bg-gradient-to-r ${RARITY_COLORS[achievement.rarity]}`}>
                {achievement.rarity === 'legendary' ? '传说' :
                 achievement.rarity === 'epic' ? '史诗' :
                 achievement.rarity === 'rare' ? '稀有' :
                 achievement.rarity === 'uncommon' ? '优秀' : '普通'}
              </span>
              <span className="text-sm text-gray-500">
                {achievement.users.toLocaleString()} 人已解锁
              </span>
            </div>

            {/* Progress */}
            {!achievement.unlocked && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">进度</span>
                  <span className="text-sm text-gray-500">
                    {achievement.requirement.current.toLocaleString()} / {achievement.requirement.target.toLocaleString()}
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${RARITY_COLORS[achievement.rarity]} transition-all duration-500`}
                    style={{ width: `${Math.min(100, achievement.progress)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  还需要 {(achievement.requirement.target - achievement.requirement.current).toLocaleString()} {achievement.requirement.type}
                </p>
              </div>
            )}

            {/* Rewards */}
            {achievement.rewards.length > 0 && (
              <div className="bg-white rounded-xl p-4 border mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">奖励</h3>
                <div className="flex flex-wrap gap-3">
                  {achievement.rewards.map((reward, index) => (
                    <div key={index} className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg">
                      <span className="text-lg">
                        {reward.type === 'points' ? '⭐' :
                         reward.type === 'badge' ? '🏅' :
                         reward.type === 'title' ? '👑' :
                         reward.type === 'feature' ? '✨' : '🎁'}
                      </span>
                      <span className="text-sm font-medium text-purple-700">
                        +{reward.value} {reward.type === 'points' ? '积分' :
                                        reward.type === 'badge' ? '徽章' :
                                        reward.type === 'title' ? '头衔' :
                                        reward.type === 'feature' ? '功能' : '奖励'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Unlocked Time */}
            {achievement.unlockedAt && (
              <div className="text-center text-sm text-gray-500 mb-4">
                解锁于 {new Date(achievement.unlockedAt).toLocaleString('zh-CN')}
              </div>
            )}

            {/* Share Button */}
            {achievement.unlocked && (
              <button
                onClick={() => setShowShareModal(true)}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
              >
                分享成就
              </button>
            )}
          </div>
        </div>

        {/* Tips */}
        {achievement.tips.length > 0 && !achievement.unlocked && (
          <div className="bg-white rounded-2xl p-6 border">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">💡</span>
              获取技巧
            </h3>
            <ul className="space-y-2">
              {achievement.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600">
                  <span className="text-purple-500 mt-1">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* First Unlock */}
        {achievement.firstUnlockedBy && (
          <div className="bg-white rounded-2xl p-6 border">
            <h3 className="font-semibold text-gray-800 mb-4">🏆 首位解锁者</h3>
            <Link
              href={`/user/${achievement.firstUnlockedBy.id}`}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl hover:shadow-md transition-shadow"
            >
              <img
                src={achievement.firstUnlockedBy.avatar}
                alt={achievement.firstUnlockedBy.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="font-medium text-gray-900">{achievement.firstUnlockedBy.name}</div>
                <div className="text-sm text-gray-500">
                  {new Date(achievement.firstUnlockedBy.unlockedAt).toLocaleDateString('zh-CN')}
                </div>
              </div>
              <div className="ml-auto text-2xl">👑</div>
            </Link>
          </div>
        )}

        {/* Recent Unlocks */}
        {achievement.recentUnlocks.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border">
            <h3 className="font-semibold text-gray-800 mb-4">最近解锁</h3>
            <div className="space-y-3">
              {achievement.recentUnlocks.map((user) => (
                <Link
                  key={user.id}
                  href={`/user/${user.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(user.unlockedAt).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Related Achievements */}
        {achievement.relatedAchievements.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border">
            <h3 className="font-semibold text-gray-800 mb-4">相关成就</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievement.relatedAchievements.map((related) => (
                <Link
                  key={related.id}
                  href={`/achievements/${related.id}`}
                  className="p-4 bg-gray-50 rounded-xl text-center hover:bg-gray-100 transition-colors"
                >
                  <div className={`text-3xl mb-2 ${related.unlocked ? '' : 'grayscale opacity-50'}`}>
                    {related.icon}
                  </div>
                  <div className={`text-sm font-medium ${related.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                    {related.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">分享成就</h3>
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 text-center mb-4">
              <div className="text-6xl mb-3">{achievement.icon}</div>
              <div className="font-bold text-xl">{achievement.name}</div>
              <div className="text-sm text-gray-600 mt-1">{achievement.description}</div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="flex-1 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  // Share functionality
                  navigator.share?.({
                    title: `我解锁了「${achievement.name}」成就！`,
                    text: achievement.description,
                  });
                  setShowShareModal(false);
                }}
                className="flex-1 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                分享
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}