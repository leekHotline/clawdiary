"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// 风险等级配置
const RISK_LEVELS = [
  { level: "safe", emoji: "🛡️", color: "green", text: "安全", desc: "你的连链稳如泰山！" },
  { level: "low", emoji: "⚡", color: "yellow", text: "低风险", desc: "继续保持，小心轻放" },
  { level: "medium", emoji: "⚠️", color: "orange", text: "中风险", desc: "需要关注了，建议今天写一篇" },
  { level: "high", emoji: "🔥", color: "red", text: "高风险", desc: "危险！你的连链岌岌可危！" },
  { level: "critical", emoji: "💀", color: "purple", text: "紧急", desc: "最后防线！立刻行动！" },
];

// 激励语句库
const MOTIVATIONS = {
  safe: [
    "你是写作机器！继续保持这个节奏 💪",
    "连续写作的秘诀就是——你已经掌握了！",
    "看到你的坚持，Streak Guardian 很欣慰 🛡️",
    "你的习惯已经养成，继续保持！",
  ],
  low: [
    "还记得你上次写作的感觉吗？那种成就感...",
    "今天还差一点点，再写一篇就完美了！",
    "你的连链很珍贵，守护好它 ✨",
    "写作不是为了完美，是为了坚持",
  ],
  medium: [
    "我知道你有能力继续，来吧！",
    "哪怕只写50个字，也是在守护连链",
    "别让今天成为遗憾，现在就开始",
    "记得你开始写作的初心吗？",
  ],
  high: [
    "🚨 紧急提醒：你的连链正在燃烧！",
    "此时不写，更待何时？！",
    "想想那些天的努力，别让它们白费",
    "只要写一个字，连链就能延续！",
  ],
  critical: [
    "‼️ 最后机会！连链即将断裂！",
    "不要犹豫！立刻写下今天的日记！",
    "你的所有努力，就在此刻见分晓",
    "一个句子。只需要一个句子就能拯救一切！",
  ],
};

// 守护者角色
const GUARDIAN_PERSONAS = [
  { id: "wise", name: "智慧长老", emoji: "🧙", style: "温和睿智" },
  { id: "warrior", name: "守护战士", emoji: "⚔️", style: "热情激励" },
  { id: "gamer", name: "游戏达人", emoji: "🎮", style: "游戏化挑战" },
];

// 模拟数据生成（实际项目中会从数据库读取）
const generateMockData = () => {
  const today = new Date();
  const writingDays: Date[] = [];
  
  // 生成过去30天的模拟写作记录
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    // 80%的概率写了日记
    if (Math.random() > 0.2) {
      writingDays.push(date);
    }
  }
  
  return writingDays;
};

// 计算当前连续天数
const calculateStreak = (writingDays: Date[]): number => {
  if (writingDays.length === 0) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  const checkDate = new Date(today);
  
  while (true) {
    const dateStr = checkDate.toDateString();
    const hasWritten = writingDays.some(d => d.toDateString() === dateStr);
    
    if (hasWritten) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // 如果今天还没写，检查昨天
      if (checkDate.getTime() === today.getTime()) {
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }
      break;
    }
  }
  
  return streak;
};

// 计算断链风险
const calculateRisk = (streak: number, lastWriteDate: Date | null, hourOfDay: number): string => {
  if (!lastWriteDate) return "critical";
  
  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  
  const lastWrite = new Date(lastWriteDate);
  lastWrite.setHours(0, 0, 0, 0);
  
  const diffDays = Math.floor((today.getTime() - lastWrite.getTime()) / (1000 * 60 * 60 * 24));
  
  // 今天已写
  if (diffDays === 0) return "safe";
  
  // 昨天没写，今天还没写
  if (diffDays >= 1) {
    // 根据当前时间判断风险
    if (hourOfDay >= 20) return "critical"; // 晚上8点后高风险
    if (hourOfDay >= 18) return "high";     // 晚上6点后
    if (hourOfDay >= 14) return "medium";   // 下午2点后
    return "low";
  }
  
  return "low";
};

// 本地存储
const getStorage = () => {
  if (typeof window === 'undefined') return null;
  return {
    get: (key: string) => {
      try {
        return JSON.parse(localStorage.getItem(`streak-guardian-${key}`) || 'null');
      } catch {
        return null;
      }
    },
    set: (key: string, value: any) => {
      localStorage.setItem(`streak-guardian-${key}`, JSON.stringify(value));
    },
  };
};

export default function StreakGuardianPage() {
  const [mounted, setMounted] = useState(false);
  const [writingDays, setWritingDays] = useState<Date[]>([]);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [risk, setRisk] = useState("safe");
  const [motivation, setMotivation] = useState("");
  const [guardian, setGuardian] = useState(GUARDIAN_PERSONAS[0]);
  const [writingPattern, setWritingPattern] = useState<{
    bestHour: number;
    avgWords: number;
    preferredDays: string[];
  } | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [reminderTime, setReminderTime] = useState("20:00");

  // 初始化
  useEffect(() => {
    setMounted(true);
    const storage = getStorage();
    
    // 加载或生成数据
    let savedDays = storage?.get('writingDays');
    if (!savedDays || savedDays.length === 0) {
      savedDays = generateMockData();
      storage?.set('writingDays', savedDays);
    }
    
    const days = savedDays.map((d: string) => new Date(d));
    setWritingDays(days);
    
    // 计算连续天数
    const currentStreak = calculateStreak(days);
    setStreak(currentStreak);
    
    // 加载最长连续
    const savedLongest = storage?.get('longestStreak') || currentStreak;
    setLongestStreak(savedLongest);
    
    // 加载设置
    const savedGuardian = storage?.get('guardian');
    if (savedGuardian) {
      setGuardian(GUARDIAN_PERSONAS.find(g => g.id === savedGuardian) || GUARDIAN_PERSONAS[0]);
    }
    
    setNotifications(storage?.get('notifications') ?? true);
    setReminderTime(storage?.get('reminderTime') || "20:00");
    
    // 计算写作模式
    analyzeWritingPattern(days);
  }, []);

  // 分析风险
  useEffect(() => {
    if (writingDays.length === 0) return;
    
    const lastWrite = writingDays[0];
    const now = new Date();
    const riskLevel = calculateRisk(streak, lastWrite, now.getHours());
    setRisk(riskLevel);
    
    // 随机选择激励语句
    const motivations = MOTIVATIONS[riskLevel as keyof typeof MOTIVATIONS];
    setMotivation(motivations[Math.floor(Math.random() * motivations.length)]);
  }, [writingDays, streak]);

  // 分析写作模式
  const analyzeWritingPattern = (days: Date[]) => {
    if (days.length < 3) {
      setWritingPattern(null);
      return;
    }
    
    // 简化分析：假设用户喜欢在晚上写作
    const hourCounts: Record<number, number> = {};
    const dayCounts: Record<string, number> = {};
    
    days.forEach(day => {
      const hour = 20 + Math.floor(Math.random() * 3); // 模拟：20-22点
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      
      const dayName = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][day.getDay()];
      dayCounts[dayName] = (dayCounts[dayName] || 0) + 1;
    });
    
    const bestHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "21";
    const preferredDays = Object.entries(dayCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([day]) => day);
    
    setWritingPattern({
      bestHour: parseInt(bestHour),
      avgWords: 150 + Math.floor(Math.random() * 100),
      preferredDays,
    });
  };

  // 模拟今日写作
  const simulateWrite = () => {
    const now = new Date();
    const storage = getStorage();
    
    const newDays = [now, ...writingDays];
    setWritingDays(newDays);
    storage?.set('writingDays', newDays.map(d => d.toISOString()));
    
    const newStreak = streak + 1;
    setStreak(newStreak);
    
    if (newStreak > longestStreak) {
      setLongestStreak(newStreak);
      storage?.set('longestStreak', newStreak);
    }
    
    setRisk("safe");
    setMotivation(MOTIVATIONS.safe[Math.floor(Math.random() * MOTIVATIONS.safe.length)]);
  };

  // 获取风险配置
  const getRiskConfig = () => {
    return RISK_LEVELS.find(r => r.level === risk) || RISK_LEVELS[0];
  };

  // 保存设置
  const saveSettings = () => {
    const storage = getStorage();
    storage?.set('guardian', guardian.id);
    storage?.set('notifications', notifications);
    storage?.set('reminderTime', reminderTime);
    setShowSettings(false);
  };

  // 生成连链日历
  const getStreakCalendar = () => {
    const calendar = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const hasWritten = writingDays.some(d => d.toDateString() === dateStr);
      const isToday = i === 0;
      
      calendar.push({
        date,
        hasWritten,
        isToday,
        dayNum: date.getDate(),
      });
    }
    
    return calendar;
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900" />;
  }

  const riskConfig = getRiskConfig();
  const streakCalendar = getStreakCalendar();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl" />
        
        {/* 星星效果 */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/50 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <main className="relative max-w-2xl mx-auto px-4 pt-8 pb-16">
        {/* 头部 */}
        <div className="mb-6">
          <Link href="/" className="text-sm text-white/50 hover:text-white/80 mb-4 inline-block">
            ← 返回首页
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{guardian.emoji}</span>
              <div>
                <h1 className="text-2xl font-bold">连链守护者</h1>
                <p className="text-sm text-white/50">Streak Guardian</p>
              </div>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* 风险警报 */}
        <div className={`bg-gradient-to-r ${
          risk === "safe" ? "from-green-600/30 to-emerald-600/30 border-green-500/50" :
          risk === "low" ? "from-yellow-600/30 to-amber-600/30 border-yellow-500/50" :
          risk === "medium" ? "from-orange-600/30 to-red-600/30 border-orange-500/50" :
          risk === "high" ? "from-red-600/30 to-rose-600/30 border-red-500/50" :
          "from-purple-600/30 to-pink-600/30 border-purple-500/50"
        } backdrop-blur-sm rounded-2xl p-6 mb-6 border-2`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-5xl animate-pulse">{riskConfig.emoji}</span>
              <div>
                <div className="text-xl font-bold">{riskConfig.text}</div>
                <div className="text-sm text-white/70">{riskConfig.desc}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{streak}</div>
              <div className="text-xs text-white/50">当前连链</div>
            </div>
          </div>
          
          {/* 激励语句 */}
          <div className="bg-white/10 rounded-xl p-4 mb-4">
            <p className="text-lg font-medium text-center">"{motivation}"</p>
            <p className="text-xs text-white/50 text-center mt-2">—— {guardian.name}</p>
          </div>
          
          {/* 行动按钮 */}
          {risk !== "safe" && (
            <button
              onClick={simulateWrite}
              className="w-full py-3 bg-white/20 hover:bg-white/30 rounded-xl font-medium transition-all active:scale-98"
            >
              🔥 立即写作，守护连链！
            </button>
          )}
          
          {risk === "safe" && (
            <div className="flex items-center justify-center gap-2 text-green-300">
              <span>✅</span>
              <span>今日任务已完成，休息一下吧~</span>
            </div>
          )}
        </div>

        {/* 连链统计 */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{streak}</div>
            <div className="text-xs text-white/50">当前连链</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{longestStreak}</div>
            <div className="text-xs text-white/50">最长连链</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{writingDays.length}</div>
            <div className="text-xs text-white/50">总写作天数</div>
          </div>
        </div>

        {/* 连链日历 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">📅 连链日历</h3>
            <button
              onClick={() => setShowAnalysis(true)}
              className="text-xs text-white/50 hover:text-white/80"
            >
              查看分析 →
            </button>
          </div>
          
          <div className="grid grid-cols-10 gap-1.5">
            {streakCalendar.map((day, i) => (
              <div
                key={i}
                className={`aspect-square rounded-md flex items-center justify-center text-xs font-medium ${
                  day.hasWritten
                    ? "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg"
                    : "bg-white/10 text-white/30"
                } ${day.isToday ? "ring-2 ring-white/50 ring-offset-2 ring-offset-transparent" : ""}`}
                title={`${day.date.toLocaleDateString('zh-CN')} ${day.hasWritten ? '✅' : '❌'}`}
              >
                {day.dayNum}
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-white/50">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-gradient-to-br from-orange-500 to-red-500" />
              已写作
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-white/10" />
              未写作
            </span>
          </div>
        </div>

        {/* 写作模式分析 */}
        {writingPattern && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 mb-6">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <span>📊</span> 你的写作模式
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                <span className="text-sm text-white/70">最佳写作时段</span>
                <span className="font-medium text-blue-300">
                  {writingPattern.bestHour}:00 - {writingPattern.bestHour + 1}:00
                </span>
              </div>
              
              <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                <span className="text-sm text-white/70">平均字数</span>
                <span className="font-medium text-green-300">{writingPattern.avgWords} 字</span>
              </div>
              
              <div className="flex items-center justify-between bg-white/5 rounded-xl p-3">
                <span className="text-sm text-white/70">活跃写作日</span>
                <span className="font-medium text-purple-300">{writingPattern.preferredDays.join('、')}</span>
              </div>
            </div>
          </div>
        )}

        {/* 守护者建议 */}
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{guardian.emoji}</span>
            <div>
              <div className="font-medium mb-1">{guardian.name}的建议</div>
              <p className="text-sm text-white/70">
                {risk === "safe" 
                  ? "你今天已经完成了写作！继续保持这个优秀的习惯。建议你在睡前回顾一下今天的内容，看看有没有新的感悟。"
                  : risk === "low"
                  ? "今天还早，你有充足的时间完成写作。建议在你最喜欢的时段（晚上）来完成今天的日记。"
                  : risk === "medium"
                  ? "时间在流逝，但还来得及！我建议你现在就打开日记，哪怕只写几句话也好。重要的是保持连续性。"
                  : risk === "high"
                  ? "紧急情况！你今天的连链岌岌可危。请立刻找一个安静的地方，花5分钟写下今天的感受。不要让努力白费！"
                  : "这是最后的警报！你的连链即将断裂。无论你在做什么，请停下来，立刻开始写作。只需要一个句子！"
                }
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* 设置弹窗 */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">⚙️ 守护者设置</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            {/* 守护者角色选择 */}
            <div className="mb-6">
              <label className="block text-sm text-white/70 mb-3">选择你的守护者</label>
              <div className="grid grid-cols-3 gap-3">
                {GUARDIAN_PERSONAS.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setGuardian(g)}
                    className={`p-3 rounded-xl text-center transition-all ${
                      guardian.id === g.id
                        ? "bg-purple-600 ring-2 ring-purple-400"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    <span className="text-2xl block mb-1">{g.emoji}</span>
                    <span className="text-xs">{g.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* 提醒设置 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm text-white/70">开启提醒</label>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notifications ? "bg-green-500" : "bg-white/20"
                  }`}
                >
                  <span className={`block w-5 h-5 bg-white rounded-full transition-transform ${
                    notifications ? "translate-x-6" : "translate-x-0.5"
                  }`} />
                </button>
              </div>
              
              {notifications && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white/70">提醒时间</span>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="bg-white/10 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
              )}
            </div>
            
            <button
              onClick={saveSettings}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-xl font-medium transition-colors"
            >
              保存设置
            </button>
          </div>
        </div>
      )}

      {/* 详细分析弹窗 */}
      {showAnalysis && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">📊 详细分析</h2>
              <button
                onClick={() => setShowAnalysis(false)}
                className="text-white/50 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            {/* 连链详情 */}
            <div className="space-y-4">
              <div className="bg-white/10 rounded-xl p-4">
                <h3 className="font-medium mb-2">🔥 连链状态</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-orange-400">{streak}</div>
                    <div className="text-xs text-white/50">当前连链</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">{longestStreak}</div>
                    <div className="text-xs text-white/50">历史最长</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4">
                <h3 className="font-medium mb-2">📈 写作统计</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">本月写作</span>
                    <span>{writingDays.filter(d => d.getMonth() === new Date().getMonth()).length} 天</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">本周写作</span>
                    <span>{writingDays.filter(d => {
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return d >= weekAgo;
                    }).length} 天</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">写作频率</span>
                    <span>{Math.round(writingDays.length / 30 * 100)}%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4">
                <h3 className="font-medium mb-2">💡 成长建议</h3>
                <ul className="space-y-2 text-sm text-white/70">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    坚持每日写作是培养习惯的关键
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    尝试在固定时间写作，更容易养成习惯
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    不要追求完美，保持连续性更重要
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}