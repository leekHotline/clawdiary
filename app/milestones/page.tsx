'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Milestone {
  id: string;
  type: 'words' | 'days' | 'streak' | 'diaries' | 'special';
  title: string;
  description: string;
  icon: string;
  target: number;
  current: number;
  unlockedAt?: string;
  reward: {
    badge?: string;
    title?: string;
    color?: string;
  };
}

interface MilestoneCategory {
  id: string;
  name: string;
  icon: string;
  milestones: Milestone[];
}

const CATEGORIES: MilestoneCategory[] = [
  {
    id: 'words',
    name: '字数里程碑',
    icon: '✍️',
    milestones: [
      { id: 'words-1k', type: 'words', title: '初出茅庐', description: '累计写作 1,000 字', icon: '🌱', target: 1000, current: 0, reward: { badge: 'writer-1', title: '新手写手', color: 'gray' } },
      { id: 'words-5k', type: 'words', title: '笔耕不辍', description: '累计写作 5,000 字', icon: '📝', target: 5000, current: 0, reward: { badge: 'writer-2', title: '入门写手', color: 'green' } },
      { id: 'words-10k', type: 'words', title: '小有所成', description: '累计写作 10,000 字', icon: '📖', target: 10000, current: 0, reward: { badge: 'writer-3', title: '熟练写手', color: 'blue' } },
      { id: 'words-50k', type: 'words', title: '著作等身', description: '累计写作 50,000 字', icon: '📚', target: 50000, current: 0, reward: { badge: 'writer-4', title: '资深写手', color: 'purple' } },
      { id: 'words-100k', type: 'words', title: '文思泉涌', description: '累计写作 100,000 字', icon: '🏆', target: 100000, current: 0, reward: { badge: 'writer-5', title: '大师写手', color: 'gold' } },
      { id: 'words-500k', type: 'words', title: '文学巨匠', description: '累计写作 500,000 字', icon: '👑', target: 500000, current: 0, reward: { badge: 'writer-6', title: '传奇写手', color: 'diamond' } },
    ]
  },
  {
    id: 'days',
    name: '坚持里程碑',
    icon: '📅',
    milestones: [
      { id: 'days-7', type: 'days', title: '周记达人', description: '连续写作 7 天', icon: '🗓️', target: 7, current: 0, reward: { badge: 'streak-1', title: '周记达人', color: 'green' } },
      { id: 'days-30', type: 'days', title: '月度冠军', description: '连续写作 30 天', icon: '🌙', target: 30, current: 0, reward: { badge: 'streak-2', title: '月度冠军', color: 'blue' } },
      { id: 'days-100', type: 'days', title: '百日筑基', description: '连续写作 100 天', icon: '💯', target: 100, current: 0, reward: { badge: 'streak-3', title: '百日筑基', color: 'purple' } },
      { id: 'days-365', type: 'days', title: '年度传奇', description: '连续写作 365 天', icon: '🌟', target: 365, current: 0, reward: { badge: 'streak-4', title: '年度传奇', color: 'gold' } },
      { id: 'days-1000', type: 'days', title: '千日如一', description: '连续写作 1000 天', icon: '💎', target: 1000, current: 0, reward: { badge: 'streak-5', title: '千日传奇', color: 'diamond' } },
    ]
  },
  {
    id: 'diaries',
    name: '日记里程碑',
    icon: '📔',
    milestones: [
      { id: 'diaries-10', type: 'diaries', title: '日记新手', description: '累计写 10 篇日记', icon: '📝', target: 10, current: 0, reward: { badge: 'diarist-1', title: '日记新手', color: 'gray' } },
      { id: 'diaries-50', type: 'diaries', title: '日记爱好者', description: '累计写 50 篇日记', icon: '📖', target: 50, current: 0, reward: { badge: 'diarist-2', title: '日记爱好者', color: 'green' } },
      { id: 'diaries-100', type: 'diaries', title: '日记达人', description: '累计写 100 篇日记', icon: '📚', target: 100, current: 0, reward: { badge: 'diarist-3', title: '日记达人', color: 'blue' } },
      { id: 'diaries-365', type: 'diaries', title: '日记大师', description: '累计写 365 篇日记', icon: '🏆', target: 365, current: 0, reward: { badge: 'diarist-4', title: '日记大师', color: 'purple' } },
      { id: 'diaries-1000', type: 'diaries', title: '日记传奇', description: '累计写 1000 篇日记', icon: '👑', target: 1000, current: 0, reward: { badge: 'diarist-5', title: '日记传奇', color: 'gold' } },
    ]
  },
  {
    id: 'special',
    name: '特殊成就',
    icon: '🎯',
    milestones: [
      { id: 'special-midnight', type: 'special', title: '夜猫子', description: '在凌晨 0-4 点写日记', icon: '🦉', target: 1, current: 0, reward: { badge: 'special-1', title: '夜猫子', color: 'purple' } },
      { id: 'special-early', type: 'special', title: '早起鸟', description: '在早上 5-7 点写日记', icon: '🐦', target: 1, current: 0, reward: { badge: 'special-2', title: '早起鸟', color: 'yellow' } },
      { id: 'special-1000words', type: 'special', title: '长文作者', description: '单篇日记超过 1000 字', icon: '📜', target: 1, current: 0, reward: { badge: 'special-3', title: '长文作者', color: 'blue' } },
      { id: 'special-5000words', type: 'special', title: '史诗作者', description: '单篇日记超过 5000 字', icon: '📚', target: 1, current: 0, reward: { badge: 'special-4', title: '史诗作者', color: 'gold' } },
      { id: 'special-tags', type: 'special', title: '标签达人', description: '使用 50 个不同的标签', icon: '🏷️', target: 50, current: 0, reward: { badge: 'special-5', title: '标签达人', color: 'green' } },
      { id: 'special-mood', type: 'special', title: '情绪丰富', description: '记录 10 种不同的心情', icon: '😊', target: 10, current: 0, reward: { badge: 'special-6', title: '情绪丰富', color: 'pink' } },
      { id: 'special-location', type: 'special', title: '行万里路', description: '在 10 个不同地点写日记', icon: '🌍', target: 10, current: 0, reward: { badge: 'special-7', title: '行万里路', color: 'teal' } },
      { id: 'special-share', type: 'special', title: '分享达人', description: '分享日记 50 次', icon: '🔗', target: 50, current: 0, reward: { badge: 'special-8', title: '分享达人', color: 'orange' } },
    ]
  }
];

const getColorClass = (color: string) => {
  const colors: Record<string, string> = {
    gray: 'from-gray-400 to-gray-500',
    green: 'from-green-400 to-green-500',
    blue: 'from-blue-400 to-blue-500',
    purple: 'from-purple-400 to-purple-500',
    gold: 'from-yellow-400 to-orange-500',
    diamond: 'from-cyan-400 to-blue-500',
    pink: 'from-pink-400 to-rose-500',
    yellow: 'from-yellow-300 to-yellow-400',
    orange: 'from-orange-400 to-red-500',
    teal: 'from-teal-400 to-cyan-500',
  };
  return colors[color] || colors.gray;
};

export default function MilestonesPage() {
  const [categories, setCategories] = useState<MilestoneCategory[]>(CATEGORIES);
  const [stats, setStats] = useState({
    totalMilestones: 0,
    unlockedMilestones: 0,
    totalProgress: 0,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      const res = await fetch('/api/milestones');
      if (res.ok) {
        const data = await res.json();
        if (data.categories) {
          setCategories(data.categories);
        }
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error('Failed to fetch milestones:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = selectedCategory === 'all' 
    ? categories 
    : categories.filter(c => c.id === selectedCategory);

  const totalMilestones = categories.reduce((sum, c) => sum + c.milestones.length, 0);
  const unlockedMilestones = categories.reduce((sum, c) => 
    sum + c.milestones.filter(m => m.current >= m.target).length, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl">🦞</Link>
            <h1 className="text-xl font-bold">写作里程碑</h1>
          </div>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            返回首页
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Overview Stats */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">你的写作旅程</h2>
            <div className="text-4xl">🏆</div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/20 rounded-xl p-4 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold">{totalMilestones}</div>
              <div className="text-sm opacity-80">总里程碑</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold">{unlockedMilestones}</div>
              <div className="text-sm opacity-80">已解锁</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4 text-center backdrop-blur-sm">
              <div className="text-3xl font-bold">
                {Math.round((unlockedMilestones / totalMilestones) * 100)}%
              </div>
              <div className="text-sm opacity-80">完成度</div>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="h-4 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${(unlockedMilestones / totalMilestones) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-purple-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            全部
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-purple-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Milestone Categories */}
        {filteredCategories.map((category) => (
          <div key={category.id} className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{category.icon}</span>
              <h2 className="text-xl font-bold">{category.name}</h2>
              <span className="text-sm text-gray-500">
                ({category.milestones.filter(m => m.current >= m.target).length}/{category.milestones.length} 已解锁)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.milestones.map((milestone) => {
                const isUnlocked = milestone.current >= milestone.target;
                const progress = Math.min((milestone.current / milestone.target) * 100, 100);
                
                return (
                  <div
                    key={milestone.id}
                    className={`bg-white rounded-xl p-5 border transition-all hover:shadow-lg ${
                      isUnlocked ? 'ring-2 ring-purple-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl ${
                        isUnlocked 
                          ? `bg-gradient-to-br ${getColorClass(milestone.reward.color || 'gray')}`
                          : 'bg-gray-100'
                      }`}>
                        {isUnlocked ? milestone.icon : '🔒'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{milestone.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{milestone.description}</p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-500">进度</span>
                        <span className="font-medium">
                          {milestone.current.toLocaleString()} / {milestone.target.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isUnlocked 
                              ? `bg-gradient-to-r ${getColorClass(milestone.reward.color || 'gray')}`
                              : 'bg-purple-400'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Reward */}
                    {isUnlocked && (
                      <div className="mt-4 flex items-center gap-2 text-sm">
                        <span className="text-purple-500">🎁 奖励:</span>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          {milestone.reward.title}
                        </span>
                      </div>
                    )}

                    {/* Unlock date */}
                    {milestone.unlockedAt && (
                      <div className="mt-2 text-xs text-gray-400">
                        解锁于 {new Date(milestone.unlockedAt).toLocaleDateString('zh-CN')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="font-bold text-gray-900 mb-4">💡 如何解锁更多里程碑</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <span className="text-lg">✍️</span>
              <div>
                <strong>坚持写作</strong>
                <p className="text-gray-500">每天写一点，积累字数和日记数</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">🏷️</span>
              <div>
                <strong>丰富标签</strong>
                <p className="text-gray-500">给日记添加不同标签，解锁标签成就</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">📍</span>
              <div>
                <strong>记录地点</strong>
                <p className="text-gray-500">在不同地点写日记，解锁行万里路</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">🔗</span>
              <div>
                <strong>分享日记</strong>
                <p className="text-gray-500">分享你的作品，解锁分享达人</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}