"use client";

import { useState } from 'react';
import Link from 'next/link';

// 能量等级配置
const ENERGY_LEVELS = [
  { level: 1, name: "初生虾苗", min: 0, max: 100, emoji: "🦐", color: "from-gray-400 to-gray-500" },
  { level: 2, name: "活力小龙虾", min: 100, max: 300, emoji: "🦞", color: "from-orange-400 to-red-500" },
  { level: 3, name: "能量龙虾", min: 300, max: 600, emoji: "⚡🦞", color: "from-yellow-400 to-orange-500" },
  { level: 4, name: "黄金龙虾", min: 600, max: 1000, emoji: "✨🦞", color: "from-amber-400 to-yellow-500" },
  { level: 5, name: "传说龙虾", min: 1000, max: 2000, emoji: "👑🦞", color: "from-purple-500 to-pink-500" },
  { level: 6, name: "宇宙龙虾", min: 2000, max: Infinity, emoji: "🌌🦞", color: "from-indigo-500 via-purple-500 to-pink-500" },
];

// 成就徽章
const BADGES = [
  { id: "first", name: "初出茅庐", desc: "完成第一篇日记", emoji: "🌱", unlocked: true },
  { id: "week", name: "一周坚持", desc: "连续写作7天", emoji: "🔥", unlocked: true },
  { id: "month", name: "月度冠军", desc: "连续写作30天", emoji: "🏆", unlocked: false },
  { id: "night", name: "夜猫子", desc: "深夜写作10篇", emoji: "🦉", unlocked: true },
  { id: "morning", name: "早起鸟", desc: "早起写作10篇", emoji: "🐦", unlocked: false },
  { id: "emotion", name: "情绪大师", desc: "记录20种不同心情", emoji: "🎭", unlocked: false },
  { id: "words", name: "万字作家", desc: "累计写作10000字", emoji: "📝", unlocked: true },
  { id: "tags", name: "标签达人", desc: "使用50个不同标签", emoji: "🏷️", unlocked: false },
];

// 激励语录
const MOTIVATIONAL_QUOTES = [
  { text: "每一篇日记，都是送给未来自己的一封信", author: "龙虾能量站" },
  { text: "记录今天的你，明天的你会感谢现在坚持的自己", author: "龙虾能量站" },
  { text: "文字有力量，你的故事值得被记住", author: "龙虾能量站" },
  { text: "不追求完美，只求真实地记录每一个当下", author: "龙虾能量站" },
  { text: "今天写的每一句话，都是时间的礼物", author: "龙虾能量站" },
];

// 能量任务
const ENERGY_TASKS = [
  { id: "daily", name: "今日日记", energy: 20, completed: false, emoji: "📝" },
  { id: "mood", name: "记录心情", energy: 5, completed: true, emoji: "😊" },
  { id: "photo", name: "添加图片", energy: 10, completed: false, emoji: "📷" },
  { id: "tags", name: "添加标签", energy: 5, completed: true, emoji: "🏷️" },
  { id: "review", name: "回顾一周", energy: 15, completed: false, emoji: "📚" },
];

// Helper function for random quote
function getRandomQuote() {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
}

export default function EnergyStationPage() {
  const [energy, setEnergy] = useState(386);
  const [streak, setStreak] = useState(7);
  const [todayWritten, setTodayWritten] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [quote, setQuote] = useState(getRandomQuote);
  const [tasks, setTasks] = useState(ENERGY_TASKS);

  // 获取当前等级
  const getCurrentLevel = () => {
    return ENERGY_LEVELS.find(l => energy >= l.min && energy < l.max) || ENERGY_LEVELS[0];
  };

  // 获取下一等级
  const getNextLevel = () => {
    const currentIdx = ENERGY_LEVELS.findIndex(l => l.level === getCurrentLevel().level);
    return ENERGY_LEVELS[currentIdx + 1] || null;
  };

  // 计算进度
  const getProgress = () => {
    const current = getCurrentLevel();
    const next = getNextLevel();
    if (!next) return 100;
    const progress = ((energy - current.min) / (next.min - current.min)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  // 完成任务
  const completeTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId && !t.completed) {
        setShowAnimation(true);
        setTimeout(() => setShowAnimation(false), 1000);
        setEnergy(e => e + t.energy);
        return { ...t, completed: true };
      }
      return t;
    }));
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const progress = getProgress();
  const unlockedBadges = BADGES.filter(b => b.unlocked).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-yellow-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-lg mx-auto px-4 pt-6 pb-16">
        {/* 返回按钮 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <span>←</span>
          <span>返回首页</span>
        </Link>

        {/* 能量卡片 */}
        <div className={`bg-gradient-to-br ${currentLevel.color} rounded-3xl p-6 text-white shadow-xl mb-6 relative overflow-hidden`}>
          {/* 动画效果 */}
          {showAnimation && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm z-10">
              <div className="text-4xl animate-bounce">+10 ⚡</div>
            </div>
          )}
          
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-white/60 text-sm">当前能量</div>
              <div className="text-4xl font-bold">{energy}</div>
            </div>
            <div className="text-5xl">{currentLevel.emoji}</div>
          </div>
          
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white/80">{currentLevel.name}</span>
              {nextLevel && <span className="text-white/60">下一级: {nextLevel.name}</span>}
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {nextLevel && (
            <div className="text-white/60 text-xs">
              还需 {nextLevel.min - energy} 能量升级
            </div>
          )}
        </div>

        {/* 连续写作天数 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🔥</div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{streak}</div>
                <div className="text-gray-500 text-sm">连续写作天数</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">最长记录</div>
              <div className="font-bold text-gray-700">15 天</div>
            </div>
          </div>
          
          {/* 本周打卡 */}
          <div className="mt-4 flex justify-between">
            {['一', '二', '三', '四', '五', '六', '日'].map((day, i) => (
              <div key={day} className="text-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mb-1 ${
                  i < 5 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {i < 5 ? '✓' : day}
                </div>
                <div className="text-xs text-gray-400">{day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 今日任务 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <span>⚡</span> 今日能量任务
            </h2>
            <span className="text-xs text-gray-400">
              {tasks.filter(t => t.completed).length}/{tasks.length} 完成
            </span>
          </div>
          
          <div className="space-y-2">
            {tasks.map((task) => (
              <button
                key={task.id}
                onClick={() => completeTask(task.id)}
                disabled={task.completed}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  task.completed
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{task.emoji}</span>
                  <span className="font-medium">{task.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${task.completed ? 'text-green-500' : 'text-orange-500'}`}>
                    +{task.energy} ⚡
                  </span>
                  {task.completed && <span className="text-green-500">✓</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 成就徽章 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <span>🏆</span> 成就徽章
            </h2>
            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
              {unlockedBadges}/{BADGES.length} 已解锁
            </span>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {BADGES.map((badge) => (
              <div
                key={badge.id}
                className={`text-center p-2 rounded-xl transition-all ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50'
                    : 'bg-gray-50 opacity-50'
                }`}
              >
                <div className={`text-2xl mb-1 ${!badge.unlocked && 'grayscale'}`}>
                  {badge.emoji}
                </div>
                <div className="text-xs text-gray-600 truncate">{badge.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 激励语录 */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-5 text-white mb-6">
          <div className="text-2xl mb-2">💭</div>
          <p className="text-lg font-medium mb-2">"{quote.text}"</p>
          <p className="text-white/60 text-sm">— {quote.author}</p>
          <button
            onClick={() => setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)])}
            className="mt-3 text-white/80 text-sm hover:text-white transition-colors"
          >
            换一句 →
          </button>
        </div>

        {/* 快捷入口 */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/chat-diary"
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/90 transition-colors"
          >
            <div className="text-2xl mb-1">📝</div>
            <div className="text-sm font-medium text-gray-700">开始写作</div>
          </Link>
          <Link
            href="/growth"
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/90 transition-colors"
          >
            <div className="text-2xl mb-1">📊</div>
            <div className="text-sm font-medium text-gray-700">查看成长</div>
          </Link>
        </div>

        {/* 底部说明 */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            ⚡ 坚持写作，能量无限
          </p>
        </div>
      </main>
    </div>
  );
}