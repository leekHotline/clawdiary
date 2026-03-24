"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// 每日主题库
const DAILY_THEMES = [
  {
    id: "gratitude",
    title: "感恩时刻",
    emoji: "🙏",
    prompt: "今天有什么让你心存感激？写下一件小事，一个人，或一个瞬间。",
    tips: ["可以从一杯热咖啡开始", "想想谁给了你帮助", "回忆一个温暖的瞬间"],
    difficulty: 1,
    category: "情感",
  },
  {
    id: "achievement",
    title: "小成就记录",
    emoji: "🏆",
    prompt: "不管多小，记录今天完成的一件事。这很重要！",
    tips: ["早起也算！", "完成一项工作任务", "学会了一个新东西"],
    difficulty: 1,
    category: "成长",
  },
  {
    id: "challenge",
    title: "挑战日",
    emoji: "💪",
    prompt: "今天遇到了什么困难？你是怎么应对的？或者你打算怎么应对？",
    tips: ["困难是成长的机会", "记录你的思考过程", "解决方案不唯一"],
    difficulty: 2,
    category: "成长",
  },
  {
    id: "random-joy",
    title: "意外惊喜",
    emoji: "🎁",
    prompt: "今天有什么意想不到的好事发生了吗？或者你给别人制造了什么惊喜？",
    tips: ["可以是小事", "意外的好消息", "偶遇的老朋友"],
    difficulty: 1,
    category: "生活",
  },
  {
    id: "reflection",
    title: "深度反思",
    emoji: "🔍",
    prompt: "回想最近的一个决定，如果重来你会怎么做？为什么？",
    tips: ["没有对错判断", "关注学习与成长", "原谅过去的自己"],
    difficulty: 3,
    category: "思考",
  },
  {
    id: "future-self",
    title: "给未来的自己",
    emoji: "📬",
    prompt: "写一封信给一年后的自己，说说你现在的期待和担忧。",
    tips: ["诚实面对自己", "描述你的梦想", "承认你的恐惧"],
    difficulty: 2,
    category: "成长",
  },
  {
    id: "people",
    title: "人物素描",
    emoji: "👤",
    prompt: "描述今天遇见的一个人，或者想写的一个人。TA让你印象最深刻的是什么？",
    tips: ["外貌细节", "一个独特的习惯", "你们之间的故事"],
    difficulty: 2,
    category: "生活",
  },
  {
    id: "nature",
    title: "自然观察",
    emoji: "🌿",
    prompt: "走出户外（或在窗边），观察自然界的一个细节。天空、植物、云朵、声音...",
    tips: ["用五感记录", "关注变化", "不需要很远"],
    difficulty: 1,
    category: "生活",
  },
  {
    id: "food-memory",
    title: "味蕾记忆",
    emoji: "🍜",
    prompt: "描述一道有故事的菜或一种食物。它让你想起了什么？",
    tips: ["童年的味道", "旅行中的美食", "家人做的菜"],
    difficulty: 2,
    category: "生活",
  },
  {
    id: "creative",
    title: "创意爆发",
    emoji: "🎨",
    prompt: "如果你可以发明一样东西来解决生活中的烦恼，它会是什么？",
    tips: ["天马行空都可以", "解决自己的问题", "想想谁会用它"],
    difficulty: 3,
    category: "创意",
  },
  {
    id: "kindness",
    title: "善意传递",
    emoji: "💝",
    prompt: "今天你做了什么善意的事？或者有人对你做了什么善意的事？",
    tips: ["小小的善意也很重要", "不求回报", "传递下去"],
    difficulty: 1,
    category: "情感",
  },
  {
    id: "fear",
    title: "直面恐惧",
    emoji: "🦁",
    prompt: "写下你害怕的一件事，以及如果它发生了你会怎么办？",
    tips: ["恐惧很正常", "想象最坏情况", "发现你的韧性"],
    difficulty: 3,
    category: "成长",
  },
  {
    id: "morning",
    title: "清晨仪式",
    emoji: "🌅",
    prompt: "描述你的清晨。你是怎么开始这一天的？理想中的早晨是什么样的？",
    tips: ["从醒来到出门", "习惯和仪式", "想改变什么"],
    difficulty: 1,
    category: "生活",
  },
  {
    id: "dream",
    title: "梦境记录",
    emoji: "🌙",
    prompt: "最近做了什么有趣的梦？或者你梦想中的生活是什么样的？",
    tips: ["梦可以是隐喻", "记录细节", "不需要完整"],
    difficulty: 2,
    category: "创意",
  },
  {
    id: "lesson",
    title: "今日一课",
    emoji: "📚",
    prompt: "今天学到了什么？可能是知识、技能，或者关于自己的新认识。",
    tips: ["学习不只在课堂", "失败也是学习", "教会别人更巩固"],
    difficulty: 1,
    category: "成长",
  },
];

// 成就系统
const ACHIEVEMENTS = [
  { id: "first", name: "初出茅庐", emoji: "🌱", desc: "完成第一个挑战", requirement: 1 },
  { id: "week", name: "一周坚持", emoji: "📅", desc: "连续7天完成挑战", requirement: 7 },
  { id: "halfmonth", name: "半月达人", emoji: "🌟", desc: "连续15天完成挑战", requirement: 15 },
  { id: "month", name: "月度冠军", emoji: "👑", desc: "连续30天完成挑战", requirement: 30 },
  { id: "master", name: "写作大师", emoji: "🏆", desc: "累计完成50个挑战", requirement: 50 },
  { id: "explorer", name: "探索者", emoji: "🗺️", desc: "尝试10种不同类型主题", requirement: 10 },
  { id: "brave", name: "勇者无畏", emoji: "⚔️", desc: "完成5个高难度挑战", requirement: 5 },
  { id: "night", name: "深夜写手", emoji: "🦉", desc: "在22:00后完成挑战", requirement: 1 },
];

// 获取今日主题（基于日期）
const getTodayTheme = () => {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  return DAILY_THEMES[dayOfYear % DAILY_THEMES.length];
};

// 本地存储工具
const getStorage = () => {
  if (typeof window === 'undefined') return null;
  return {
    get: (key: string) => {
      try {
        return JSON.parse(localStorage.getItem(`daily-challenge-${key}`) || 'null');
      } catch {
        return null;
      }
    },
    set: (key: string, value: any) => {
      localStorage.setItem(`daily-challenge-${key}`, JSON.stringify(value));
    },
  };
};

export default function DailyChallengePage() {
  const [mounted, setMounted] = useState(false);
  const [todayTheme] = useState(getTodayTheme());
  const [content, setContent] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isWriting, setIsWriting] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [completedToday, setCompletedToday] = useState(false);
  const [stats, setStats] = useState({
    totalCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    categories: [] as string[],
    hardChallenges: 0,
    nightWrites: 0,
  });
  const [achievements, setAchievements] = useState<string[]>([]);
  const [challengeHistory, setChallengeHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(10);

  // 初始化
  useEffect(() => {
    setMounted(true);
    const storage = getStorage();
    if (!storage) return;

    // 加载统计数据
    const savedStats = storage.get('stats');
    if (savedStats) setStats(savedStats);

    // 加载成就
    const savedAchievements = storage.get('achievements');
    if (savedAchievements) setAchievements(savedAchievements);

    // 加载历史
    const savedHistory = storage.get('history');
    if (savedHistory) setChallengeHistory(savedHistory);

    // 检查今日是否已完成
    const today = new Date().toDateString();
    const lastCompleteDate = storage.get('lastCompleteDate');
    if (lastCompleteDate === today) {
      setCompletedToday(true);
      setContent(storage.get('todayContent') || "");
    }
  }, []);

  // 保存数据
  const saveData = useCallback(() => {
    const storage = getStorage();
    if (!storage) return;
    storage.set('stats', stats);
    storage.set('achievements', achievements);
    storage.set('history', challengeHistory);
  }, [stats, achievements, challengeHistory]);

  useEffect(() => {
    if (mounted) saveData();
  }, [mounted, saveData]);

  // 计时器
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showTimer && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setShowTimer(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showTimer, timeLeft]);

  // 开始计时
  const startTimer = () => {
    setTimeLeft(timerMinutes * 60);
    setShowTimer(true);
    setIsWriting(true);
  };

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 检查并解锁成就
  const checkAchievements = useCallback((newStats: typeof stats) => {
    const unlocked: string[] = [];
    
    ACHIEVEMENTS.forEach(achievement => {
      if (achievements.includes(achievement.id)) return;
      
      let unlockedNow = false;
      switch (achievement.id) {
        case 'first':
          unlockedNow = newStats.totalCompleted >= 1;
          break;
        case 'week':
          unlockedNow = newStats.currentStreak >= 7;
          break;
        case 'halfmonth':
          unlockedNow = newStats.currentStreak >= 15;
          break;
        case 'month':
          unlockedNow = newStats.currentStreak >= 30;
          break;
        case 'master':
          unlockedNow = newStats.totalCompleted >= 50;
          break;
        case 'explorer':
          unlockedNow = newStats.categories.length >= 10;
          break;
        case 'brave':
          unlockedNow = newStats.hardChallenges >= 5;
          break;
        case 'night':
          unlockedNow = newStats.nightWrites >= 1;
          break;
      }
      
      if (unlockedNow) unlocked.push(achievement.id);
    });
    
    return unlocked;
  }, [achievements]);

  // 完成挑战
  const completeChallenge = () => {
    if (!content.trim()) return;
    
    const now = new Date();
    const today = now.toDateString();
    const hour = now.getHours();
    const isNight = hour >= 22;
    
    // 更新统计
    const newStats = {
      ...stats,
      totalCompleted: stats.totalCompleted + 1,
      currentStreak: stats.currentStreak + 1,
      longestStreak: Math.max(stats.longestStreak, stats.currentStreak + 1),
      categories: stats.categories.includes(todayTheme.category) 
        ? stats.categories 
        : [...stats.categories, todayTheme.category],
      hardChallenges: todayTheme.difficulty >= 3 ? stats.hardChallenges + 1 : stats.hardChallenges,
      nightWrites: isNight ? stats.nightWrites + 1 : stats.nightWrites,
    };
    
    setStats(newStats);
    
    // 添加历史记录
    const newHistory = [{
      date: today,
      theme: todayTheme,
      content: content,
      wordCount: content.length,
      completedAt: now.toISOString(),
    }, ...challengeHistory].slice(0, 30); // 保留最近30条
    setChallengeHistory(newHistory);
    
    // 检查成就
    const newAchievements = checkAchievements(newStats);
    if (newAchievements.length > 0) {
      setAchievements([...achievements, ...newAchievements]);
    }
    
    // 保存完成状态
    const storage = getStorage();
    if (storage) {
      storage.set('lastCompleteDate', today);
      storage.set('todayContent', content);
    }
    
    setCompletedToday(true);
    setShowTimer(false);
    setIsWriting(false);
  };

  // 计算连击日历
  const getStreakCalendar = () => {
    const calendar = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const completed = challengeHistory.some(h => h.date === dateStr);
      calendar.push({
        day: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
        completed,
        isToday: i === 0,
      });
    }
    return calendar;
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50" />;
  }

  const streakCalendar = getStreakCalendar();

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-yellow-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-2xl mx-auto px-4 pt-8 pb-16">
        {/* 头部 */}
        <div className="mb-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-orange-600 mb-4 inline-block">
            ← 返回首页
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🎯</span>
              <h1 className="text-2xl font-bold text-gray-800">每日主题挑战</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAchievements(true)}
                className="px-3 py-1.5 bg-white/70 rounded-lg text-sm hover:bg-white/90 transition-colors flex items-center gap-1"
              >
                🏆 {achievements.length}
              </button>
              <button
                onClick={() => setShowHistory(true)}
                className="px-3 py-1.5 bg-white/70 rounded-lg text-sm hover:bg-white/90 transition-colors"
              >
                📜 历史
              </button>
            </div>
          </div>
        </div>

        {/* 连击日历 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 mb-6 shadow-sm border border-white/50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-700">本周完成情况</span>
            <span className="text-xs text-orange-600 font-medium">
              🔥 连续 {stats.currentStreak} 天
            </span>
          </div>
          <div className="flex justify-between">
            {streakCalendar.map((day, i) => (
              <div key={i} className="text-center">
                <div className="text-xs text-gray-400 mb-1">{day.day}</div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                  day.completed 
                    ? "bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-md" 
                    : "bg-gray-100 text-gray-300"
                } ${day.isToday ? "ring-2 ring-orange-300 ring-offset-2" : ""}`}>
                  {day.completed ? "✓" : "·"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 今日主题 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg border border-white/50">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-5xl">{todayTheme.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-800">{todayTheme.title}</h2>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  todayTheme.difficulty === 1 ? "bg-green-100 text-green-700" :
                  todayTheme.difficulty === 2 ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {todayTheme.difficulty === 1 ? "简单" : todayTheme.difficulty === 2 ? "中等" : "挑战"}
                </span>
              </div>
              <span className="text-xs text-gray-400">{todayTheme.category}</span>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 leading-relaxed">{todayTheme.prompt}</p>
          
          {/* 写作提示 */}
          <div className="bg-orange-50 rounded-xl p-4 mb-4">
            <div className="text-xs font-medium text-orange-600 mb-2">💡 写作提示</div>
            <ul className="text-sm text-gray-600 space-y-1">
              {todayTheme.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-orange-400">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* 计时器设置 */}
          {!isWriting && !completedToday && (
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm text-gray-500">写作时长：</span>
              <div className="flex gap-2">
                {[5, 10, 15, 20].map(min => (
                  <button
                    key={min}
                    onClick={() => setTimerMinutes(min)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      timerMinutes === min 
                        ? "bg-orange-500 text-white" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {min}分钟
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 计时器 */}
          {showTimer && (
            <div className="flex justify-center mb-4">
              <div className={`text-4xl font-mono font-bold ${
                timeLeft < 60 ? "text-red-500 animate-pulse" : "text-orange-600"
              }`}>
                {formatTime(timeLeft)}
              </div>
            </div>
          )}

          {/* 写作区域 */}
          {completedToday ? (
            <div>
              <div className="flex items-center gap-2 text-green-600 mb-3">
                <span className="text-xl">✅</span>
                <span className="font-medium">今日挑战已完成！</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-gray-600 text-sm">
                {content}
              </div>
              <div className="mt-2 text-xs text-gray-400">
                共 {content.length} 字
              </div>
            </div>
          ) : (
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="开始写作..."
                className="w-full h-40 p-4 bg-gray-50 rounded-xl border-none resize-none focus:ring-2 focus:ring-orange-300 outline-none text-gray-700 placeholder-gray-400"
              />
              <div className="flex justify-between items-center mt-3">
                <span className="text-xs text-gray-400">{content.length} 字</span>
                <div className="flex gap-2">
                  {!isWriting ? (
                    <button
                      onClick={startTimer}
                      className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
                    >
                      🔥 开始挑战
                    </button>
                  ) : (
                    <button
                      onClick={completeChallenge}
                      disabled={!content.trim()}
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ✨ 完成挑战
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-white/50">
            <div className="text-2xl font-bold text-orange-600">{stats.totalCompleted}</div>
            <div className="text-xs text-gray-500">完成挑战</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-white/50">
            <div className="text-2xl font-bold text-red-500">{stats.currentStreak}</div>
            <div className="text-xs text-gray-500">当前连续</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-white/50">
            <div className="text-2xl font-bold text-purple-600">{stats.longestStreak}</div>
            <div className="text-xs text-gray-500">最长连续</div>
          </div>
        </div>

        {/* 主题库预览 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50">
          <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <span>📚</span> 主题库 ({DAILY_THEMES.length}个主题)
          </h3>
          <div className="flex flex-wrap gap-2">
            {DAILY_THEMES.slice(0, 8).map(theme => (
              <span 
                key={theme.id}
                className={`px-2 py-1 rounded-full text-xs ${
                  theme.id === todayTheme.id 
                    ? "bg-orange-100 text-orange-600 ring-2 ring-orange-300" 
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {theme.emoji} {theme.title}
              </span>
            ))}
            {DAILY_THEMES.length > 8 && (
              <span className="px-2 py-1 text-xs text-gray-400">
                +{DAILY_THEMES.length - 8} 更多
              </span>
            )}
          </div>
        </div>
      </main>

      {/* 成就弹窗 */}
      {showAchievements && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">🏆 成就殿堂</h2>
              <button
                onClick={() => setShowAchievements(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {ACHIEVEMENTS.map(achievement => {
                const unlocked = achievements.includes(achievement.id);
                return (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-xl ${
                      unlocked 
                        ? "bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200" 
                        : "bg-gray-50 opacity-60"
                    }`}
                  >
                    <div className="text-3xl mb-2">{unlocked ? achievement.emoji : "🔒"}</div>
                    <div className="font-medium text-gray-800 text-sm">{achievement.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{achievement.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 历史弹窗 */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">📜 挑战历史</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {challengeHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <span className="text-4xl mb-3 block">📝</span>
                <p>还没有挑战记录</p>
                <p className="text-sm">完成你的第一个挑战吧！</p>
              </div>
            ) : (
              <div className="space-y-3">
                {challengeHistory.map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{item.theme.emoji}</span>
                      <span className="font-medium text-gray-800">{item.theme.title}</span>
                      <span className="text-xs text-gray-400 ml-auto">
                        {new Date(item.completedAt).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{item.content}</p>
                    <div className="text-xs text-gray-400 mt-2">{item.wordCount} 字</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}