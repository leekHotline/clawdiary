'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface LevelInfo {
  level: number;
  title: string;
  currentXP: number;
  requiredXP: number;
  totalXP: number;
  progress: number;
  nextLevel: {
    level: number;
    title: string;
    requiredXP: number;
  } | null;
  benefits: string[];
  badges: string[];
  joinedAt: string;
  diaryCount: number;
  totalWords: number;
  streakDays: number;
}

const LEVEL_TITLES: Record<number, { title: string; color: string; icon: string }> = {
  1: { title: '初学者', color: 'text-gray-600', icon: '🌱' },
  2: { title: '探索者', color: 'text-green-600', icon: '🌿' },
  3: { title: '记录者', color: 'text-blue-600', icon: '📝' },
  4: { title: '创作者', color: 'text-purple-600', icon: '✨' },
  5: { title: '作家', color: 'text-yellow-600', icon: '⭐' },
  6: { title: '大师', color: 'text-orange-600', icon: '🏆' },
  7: { title: '传奇', color: 'text-red-600', icon: '👑' },
  8: { title: '神话', color: 'text-pink-600', icon: '💎' },
  9: { title: '永恒', color: 'text-indigo-600', icon: '🌟' },
  10: { title: '超越者', color: 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500', icon: '🌈' },
};

const XP_PER_LEVEL = 1000;

export default function UserLevelPage() {
  const params = useParams();
  const userId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [levelInfo, setLevelInfo] = useState<LevelInfo | null>(null);
  const [xpHistory, setXpHistory] = useState<{ date: string; amount: number; reason: string }[]>([]);

  useEffect(() => {
    fetchLevelInfo();
  }, [userId]);

  const fetchLevelInfo = async () => {
    try {
      const res = await fetch(`/api/user/level?userId=${userId}`);
      const data = await res.json();
      setLevelInfo(data);
      
      // 模拟XP历史
      setXpHistory([
        { date: '2026-03-12', amount: 50, reason: '完成每日日记' },
        { date: '2026-03-12', amount: 100, reason: '连续7天写作' },
        { date: '2026-03-11', amount: 50, reason: '完成每日日记' },
        { date: '2026-03-11', amount: 30, reason: '获得点赞' },
        { date: '2026-03-10', amount: 50, reason: '完成每日日记' },
        { date: '2026-03-10', amount: 200, reason: '完成写作挑战' },
      ]);
    } catch (_error) {
      // 使用模拟数据
      setLevelInfo({
        level: 4,
        title: '创作者',
        currentXP: 650,
        requiredXP: 1000,
        totalXP: 3650,
        progress: 65,
        nextLevel: {
          level: 5,
          title: '作家',
          requiredXP: 1000
        },
        benefits: [
          '解锁高级主题',
          '自定义日记封面',
          '优先技术支持',
          '专属徽章展示',
        ],
        badges: ['第一篇日记', '连续7天', '获得100赞', '月度最佳'],
        joinedAt: '2026-01-01',
        diaryCount: 45,
        totalWords: 15680,
        streakDays: 12,
      });
    } finally {
      setLoading(false);
    }
  };

  const getLevelInfo = (level: number) => {
    return LEVEL_TITLES[level] || LEVEL_TITLES[1];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-yellow-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">加载中...</p>
        </div>
      </div>
    );
  }

  if (!levelInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-yellow-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">未找到用户等级信息</p>
      </div>
    );
  }

  const currentLevelInfo = getLevelInfo(levelInfo.level);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-gray-900 dark:to-yellow-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 返回链接 */}
        <Link 
          href={`/user/${userId}`}
          className="text-yellow-600 dark:text-yellow-400 hover:underline flex items-center gap-2 mb-6"
        >
          ← 返回用户主页
        </Link>

        {/* 等级卡片 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* 头部背景 */}
          <div className="h-32 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-gray-800"></div>
          </div>
          
          {/* 等级徽章 */}
          <div className="relative px-6 pb-6">
            <div className="flex items-end gap-6 -mt-12">
              <div className="w-24 h-24 bg-white dark:bg-gray-700 rounded-2xl shadow-lg flex items-center justify-center border-4 border-white dark:border-gray-800">
                <span className="text-5xl">{currentLevelInfo.icon}</span>
              </div>
              <div className="pb-2">
                <div className={`text-2xl font-bold ${currentLevelInfo.color}`}>
                  Lv.{levelInfo.level} {levelInfo.title}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  加入于 {levelInfo.joinedAt}
                </p>
              </div>
            </div>
          </div>

          {/* 经验值进度 */}
          <div className="px-6 pb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>经验值</span>
              <span>{levelInfo.currentXP} / {levelInfo.requiredXP} XP</span>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all"
                style={{ width: `${levelInfo.progress}%` }}
              />
            </div>
            {levelInfo.nextLevel && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                还需要 {levelInfo.requiredXP - levelInfo.currentXP} XP 升级到 Lv.{levelInfo.nextLevel.level} {levelInfo.nextLevel.title}
              </p>
            )}
          </div>

          {/* 统计数据 */}
          <div className="grid grid-cols-4 divide-x divide-gray-200 dark:divide-gray-700 border-t border-gray-200 dark:border-gray-700">
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{levelInfo.diaryCount}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">日记</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{levelInfo.totalWords.toLocaleString()}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">字数</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{levelInfo.streakDays}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">连续天数</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{levelInfo.totalXP.toLocaleString()}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">总经验</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 等级特权 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span>🎁</span> 当前等级特权
            </h2>
            <ul className="space-y-3">
              {levelInfo.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <span className="text-green-500">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* 徽章展示 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <span>🏅</span> 获得徽章
            </h2>
            <div className="flex flex-wrap gap-2">
              {levelInfo.badges.map((badge, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full text-sm"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 经验值历史 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span>📊</span> 经验值记录
          </h2>
          <div className="space-y-3">
            {xpHistory.map((item, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div>
                  <p className="text-gray-800 dark:text-white">{item.reason}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.date}</p>
                </div>
                <span className="text-green-600 dark:text-green-400 font-medium">
                  +{item.amount} XP
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 等级对照表 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span>📈</span> 等级对照表
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(LEVEL_TITLES).map(([level, info]) => (
              <div 
                key={level}
                className={`p-3 rounded-lg border-2 text-center ${
                  parseInt(level) === levelInfo.level
                    ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="text-2xl mb-1">{info.icon}</div>
                <div className={`font-medium ${info.color}`}>Lv.{level}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{info.title}</div>
                {parseInt(level) === levelInfo.level && (
                  <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">当前</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}