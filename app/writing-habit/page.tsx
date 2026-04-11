"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

// 类型定义
interface WritingDay {
  date: string;
  wordCount: number;
  hasEntry: boolean;
  mood?: string;
}

interface HabitStats {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  totalWords: number;
  avgWords: number;
  thisWeekCount: number;
  thisMonthCount: number;
  weeklyGoal: number;
  monthlyGoal: number;
}

// 心情 emoji 映射
const MOOD_EMOJIS: Record<string, string> = {
  happy: "😊",
  calm: "😌",
  excited: "🎉",
  tired: "😴",
  anxious: "😰",
  sad: "😢",
  grateful: "🙏",
  reflective: "🤔",
};

// 成就徽章
const ACHIEVEMENTS = [
  { id: "first", name: "第一步", desc: "完成第一篇日记", emoji: "🌱", requirement: 1 },
  { id: "week1", name: "一周达人", desc: "连续7天写日记", emoji: "🌟", requirement: 7 },
  { id: "month1", name: "月度冠军", desc: "连续30天写日记", emoji: "🏆", requirement: 30 },
  { id: "month3", name: "季度之星", desc: "连续90天写日记", emoji: "💎", requirement: 90 },
  { id: "words1k", name: "千字达人", desc: "累计写作1000字", emoji: "✍️", requirement: 1000 },
  { id: "words10k", name: "万字大师", desc: "累计写作10000字", emoji: "📚", requirement: 10000 },
  { id: "words50k", name: "作家之路", desc: "累计写作50000字", emoji: "🎯", requirement: 50000 },
  { id: "early", name: "早起鸟儿", desc: "早上6点前写日记", emoji: "🐦", requirement: -1 },
  { id: "night", name: "夜猫子", desc: "晚上11点后写日记", emoji: "🦉", requirement: -1 },
];

// 模拟生成过去90天的数据
function generateMockData(): WritingDay[] {
  const data: WritingDay[] = [];
  const today = new Date();
  
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // 随机决定是否写了日记 (70%概率)
    const hasEntry = Math.random() > 0.3;
    const wordCount = hasEntry ? Math.floor(Math.random() * 500) + 50 : 0;
    const moods = Object.keys(MOOD_EMOJIS);
    const mood = hasEntry ? moods[Math.floor(Math.random() * moods.length)] : undefined;
    
    data.push({
      date: date.toISOString().split('T')[0],
      wordCount,
      hasEntry,
      mood,
    });
  }
  
  return data;
}

// 计算统计数据
function calculateStats(data: WritingDay[]): HabitStats {
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let totalWords = 0;
  let totalDays = 0;
  
  // 从今天往前计算连续天数
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].hasEntry) {
      currentStreak++;
    } else {
      break;
    }
  }
  
  // 计算最长连续天数和总数
  for (const day of data) {
    if (day.hasEntry) {
      tempStreak++;
      totalDays++;
      totalWords += day.wordCount;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }
  
  // 本周和本月统计
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  
  let thisWeekCount = 0;
  let thisMonthCount = 0;
  
  for (const day of data) {
    const dayDate = new Date(day.date);
    if (day.hasEntry && dayDate >= weekStart) {
      thisWeekCount++;
    }
    if (day.hasEntry && dayDate >= monthStart) {
      thisMonthCount++;
    }
  }
  
  return {
    currentStreak,
    longestStreak,
    totalDays,
    totalWords,
    avgWords: totalDays > 0 ? Math.round(totalWords / totalDays) : 0,
    thisWeekCount,
    thisMonthCount,
    weeklyGoal: 5,
    monthlyGoal: 20,
  };
}

// 获取已解锁的成就
function getUnlockedAchievements(stats: HabitStats, data: WritingDay[]): typeof ACHIEVEMENTS {
  return ACHIEVEMENTS.filter(a => {
    if (a.id === "first") return stats.totalDays >= 1;
    if (a.id === "week1") return stats.longestStreak >= 7;
    if (a.id === "month1") return stats.longestStreak >= 30;
    if (a.id === "month3") return stats.longestStreak >= 90;
    if (a.id === "words1k") return stats.totalWords >= 1000;
    if (a.id === "words10k") return stats.totalWords >= 10000;
    if (a.id === "words50k") return stats.totalWords >= 50000;
    return false;
  });
}

// 热力图颜色
function getHeatColor(hasEntry: boolean, wordCount: number): string {
  if (!hasEntry) return "bg-gray-100";
  if (wordCount < 100) return "bg-green-200";
  if (wordCount < 200) return "bg-green-300";
  if (wordCount < 300) return "bg-green-400";
  return "bg-green-500";
}

export default function WritingHabitPage() {
  const [data, setData] = useState<WritingDay[]>([]);
  const [stats, setStats] = useState<HabitStats | null>(null);
  const [achievements, setAchievements] = useState<typeof ACHIEVEMENTS>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  const [monthlyGoal, setMonthlyGoal] = useState(20);
  
  // 使用 useMemo 派生状态，避免 useEffect 中直接调用 setState
  const mockData = useMemo(() => generateMockData(), []);
  
  // 计算统计数据
  const calculatedStats = useMemo(() => {
    const stats = calculateStats(mockData);
    stats.weeklyGoal = weeklyGoal;
    stats.monthlyGoal = monthlyGoal;
    return stats;
  }, [mockData, weeklyGoal, monthlyGoal]);
  
  // 获取成就
  const unlockedAchievements = useMemo(() => 
    getUnlockedAchievements(calculatedStats, mockData), 
    [calculatedStats, mockData]
  );
  
  useEffect(() => {
    setData(mockData);
    setStats(calculatedStats);
    setAchievements(unlockedAchievements);
  }, [mockData, calculatedStats, unlockedAchievements]);
  
  // 获取当前月份的数据
  const currentYear = new Date().getFullYear();
  const monthData = data.filter(d => {
    const date = new Date(d.date);
    return date.getFullYear() === currentYear && date.getMonth() === selectedMonth;
  });
  
  // 生成日历格子
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, selectedMonth, 1);
    const lastDay = new Date(currentYear, selectedMonth + 1, 0);
    const days = [];
    
    // 填充前面的空白
    const startPadding = firstDay.getDay();
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    
    // 填充日期
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dateStr = `${currentYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayData = data.find(d => d.date === dateStr);
      days.push({
        day: i,
        ...dayData,
      });
    }
    
    return days;
  };
  
  const monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  
  const calendarDays = generateCalendarDays();
  
  // AI 洞察
  const getAIInsight = () => {
    if (!stats) return "";
    
    const insights = [];
    
    if (stats.currentStreak >= 7) {
      insights.push(`🔥 你已连续写作${stats.currentStreak}天，太棒了！继续保持！`);
    } else if (stats.currentStreak >= 3) {
      insights.push(`💪 已连续${stats.currentStreak}天，距离一周目标还差${7 - stats.currentStreak}天！`);
    } else if (stats.currentStreak === 0) {
      insights.push("📝 今天还没有写日记，现在就开始吧！");
    }
    
    if (stats.avgWords > 200) {
      insights.push(`✍️ 平均每篇${stats.avgWords}字，你是写作达人！`);
    }
    
    if (stats.thisWeekCount >= stats.weeklyGoal) {
      insights.push(`🎯 本周目标已达成！${stats.thisWeekCount}/${stats.weeklyGoal}天`);
    }
    
    if (insights.length === 0) {
      insights.push("🌟 坚持就是胜利，每一天都值得记录！");
    }
    
    return insights.join(" | ");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-2xl hover:scale-110 transition-transform">
                🦞
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">写作习惯追踪</h1>
                <p className="text-xs text-gray-400">可视化你的成长轨迹</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/chat-diary"
                className="px-4 py-2 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-500 transition-colors"
              >
                📝 写日记
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-4 py-8">
        {/* AI 洞察横幅 */}
        {stats && (
          <div className="mb-8 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <p className="text-sm text-gray-300">{getAIInsight()}</p>
            </div>
          </div>
        )}

        {/* 统计卡片 */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <div className="text-3xl font-bold text-orange-400">{stats.currentStreak}</div>
              <div className="text-sm text-gray-400 mt-1">当前连续</div>
              <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <span>🔥</span>
                <span>最长 {stats.longestStreak} 天</span>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <div className="text-3xl font-bold text-green-400">{stats.totalDays}</div>
              <div className="text-sm text-gray-400 mt-1">总写作天数</div>
              <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <span>📅</span>
                <span>近90天</span>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <div className="text-3xl font-bold text-blue-400">{stats.totalWords.toLocaleString()}</div>
              <div className="text-sm text-gray-400 mt-1">总字数</div>
              <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <span>✍️</span>
                <span>平均 {stats.avgWords} 字/篇</span>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <div className="text-3xl font-bold text-purple-400">{achievements.length}</div>
              <div className="text-sm text-gray-400 mt-1">已获成就</div>
              <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <span>🏆</span>
                <span>共 {ACHIEVEMENTS.length} 个</span>
              </div>
            </div>
          </div>
        )}

        {/* 目标进度 */}
        {stats && (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white flex items-center gap-2">
                  <span>📊</span>
                  <span>本周目标</span>
                </h3>
                <button 
                  onClick={() => setShowGoalModal(true)}
                  className="text-xs text-purple-400 hover:text-purple-300"
                >
                  编辑
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        stats.thisWeekCount >= stats.weeklyGoal 
                          ? "bg-green-500" 
                          : "bg-purple-500"
                      }`}
                      style={{ width: `${Math.min(100, (stats.thisWeekCount / stats.weeklyGoal) * 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-gray-300">
                  {stats.thisWeekCount}/{stats.weeklyGoal} 天
                </span>
              </div>
              {stats.thisWeekCount >= stats.weeklyGoal && (
                <div className="mt-3 text-sm text-green-400 flex items-center gap-1">
                  <span>✅</span>
                  <span>本周目标已达成！</span>
                </div>
              )}
            </div>
            
            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white flex items-center gap-2">
                  <span>📅</span>
                  <span>本月目标</span>
                </h3>
                <button 
                  onClick={() => setShowGoalModal(true)}
                  className="text-xs text-purple-400 hover:text-purple-300"
                >
                  编辑
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        stats.thisMonthCount >= stats.monthlyGoal 
                          ? "bg-green-500" 
                          : "bg-pink-500"
                      }`}
                      style={{ width: `${Math.min(100, (stats.thisMonthCount / stats.monthlyGoal) * 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-gray-300">
                  {stats.thisMonthCount}/{stats.monthlyGoal} 天
                </span>
              </div>
              {stats.thisMonthCount >= stats.monthlyGoal && (
                <div className="mt-3 text-sm text-green-400 flex items-center gap-1">
                  <span>✅</span>
                  <span>本月目标已达成！</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 日历热力图 */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <span>🗓️</span>
              <span>写作日历</span>
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedMonth((selectedMonth - 1 + 12) % 12)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                ←
              </button>
              <span className="text-gray-300 min-w-[80px] text-center">
                {monthNames[selectedMonth]}
              </span>
              <button
                onClick={() => setSelectedMonth((selectedMonth + 1) % 12)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                →
              </button>
            </div>
          </div>

          {/* 星期标题 */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div key={day} className="text-center text-xs text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* 日历格子 */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => (
              <div
                key={i}
                className={`
                  aspect-square rounded-lg flex flex-col items-center justify-center text-sm
                  transition-all cursor-pointer hover:scale-105
                  ${day === null ? "invisible" : ""}
                  ${day?.hasEntry ? getHeatColor(day.hasEntry, day.wordCount || 0) : "bg-slate-800/50"}
                  ${day?.date === new Date().toISOString().split('T')[0] ? "ring-2 ring-purple-500" : ""}
                `}
                title={day?.hasEntry ? `${day.wordCount} 字` : "未写作"}
              >
                {day && (
                  <>
                    <span className={day.hasEntry ? "text-gray-700 font-medium" : "text-gray-500"}>
                      {day.day}
                    </span>
                    {day.mood && (
                      <span className="text-xs mt-0.5">{MOOD_EMOJIS[day.mood]}</span>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* 图例 */}
          <div className="flex items-center justify-end gap-2 mt-4 text-xs text-gray-400">
            <span>少</span>
            <div className="w-4 h-4 bg-gray-100 rounded" />
            <div className="w-4 h-4 bg-green-200 rounded" />
            <div className="w-4 h-4 bg-green-300 rounded" />
            <div className="w-4 h-4 bg-green-400 rounded" />
            <div className="w-4 h-4 bg-green-500 rounded" />
            <span>多</span>
          </div>
        </div>

        {/* 成就徽章 */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span>🏆</span>
            <span>成就徽章</span>
            <span className="text-sm text-gray-400 font-normal">
              ({achievements.length}/{ACHIEVEMENTS.length})
            </span>
          </h2>
          
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
            {ACHIEVEMENTS.map((achievement) => {
              const isUnlocked = achievements.some(a => a.id === achievement.id);
              return (
                <div
                  key={achievement.id}
                  className={`
                    p-3 rounded-xl text-center transition-all
                    ${isUnlocked 
                      ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30" 
                      : "bg-slate-800/30 opacity-50"
                    }
                  `}
                  title={achievement.desc}
                >
                  <div className={`text-2xl ${isUnlocked ? "" : "grayscale"}`}>
                    {achievement.emoji}
                  </div>
                  <div className={`text-xs mt-1 ${isUnlocked ? "text-white" : "text-gray-500"}`}>
                    {achievement.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 写作建议 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span>💡</span>
              <span>写作小贴士</span>
            </h3>
            <ul className="space-y-3">
              {[
                { title: "固定时间", desc: "选择每天固定的时间写日记，养成习惯" },
                { title: "从小处开始", desc: "不必追求完美，从3句话开始" },
                { title: "记录感受", desc: "不仅记录发生了什么，也记录你的感受" },
                { title: "定期回顾", desc: "每周回顾一次，发现生活模式" },
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-purple-400 text-sm">•</span>
                  <div>
                    <div className="text-sm text-white font-medium">{tip.title}</div>
                    <div className="text-xs text-gray-400">{tip.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <span>🎯</span>
              <span>挑战任务</span>
            </h3>
            <div className="space-y-3">
              {[
                { name: "连续7天", reward: "10 积分", emoji: "🌟" },
                { name: "本周写满", reward: "20 积分", emoji: "📅" },
                { name: "千字日记", reward: "15 积分", emoji: "✍️" },
                { name: "首次分享", reward: "25 积分", emoji: "📤" },
              ].map((task, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{task.emoji}</span>
                    <span className="text-sm text-white">{task.name}</span>
                  </div>
                  <span className="text-xs text-yellow-400">{task.reward}</span>
                </div>
              ))}
            </div>
            <Link
              href="/challenges"
              className="mt-4 block text-center text-sm text-purple-400 hover:text-purple-300"
            >
              查看更多挑战 →
            </Link>
          </div>
        </div>

        {/* 快速入口 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/chat-diary"
            className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-5 border border-purple-500/30 hover:border-purple-400 transition-all text-center"
          >
            <span className="text-3xl block mb-2">💬</span>
            <span className="text-sm text-white">AI 对话日记</span>
          </Link>
          <Link
            href="/daily-question"
            className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-2xl p-5 border border-blue-500/30 hover:border-blue-400 transition-all text-center"
          >
            <span className="text-3xl block mb-2">💭</span>
            <span className="text-sm text-white">每日一问</span>
          </Link>
          <Link
            href="/diary-templates"
            className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-2xl p-5 border border-green-500/30 hover:border-green-400 transition-all text-center"
          >
            <span className="text-3xl block mb-2">📝</span>
            <span className="text-sm text-white">日记模板</span>
          </Link>
          <Link
            href="/stats"
            className="bg-gradient-to-br from-orange-600/20 to-yellow-600/20 rounded-2xl p-5 border border-orange-500/30 hover:border-orange-400 transition-all text-center"
          >
            <span className="text-3xl block mb-2">📊</span>
            <span className="text-sm text-white">详细统计</span>
          </Link>
        </div>
      </main>

      {/* 目标设置弹窗 */}
      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-white mb-4">设置目标</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">每周目标（天）</label>
                <input
                  type="number"
                  value={weeklyGoal}
                  onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                  min={1}
                  max={7}
                  className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-2 text-white"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 block mb-2">每月目标（天）</label>
                <input
                  type="number"
                  value={monthlyGoal}
                  onChange={(e) => setMonthlyGoal(Number(e.target.value))}
                  min={1}
                  max={31}
                  className="w-full bg-slate-700 border border-white/10 rounded-lg px-4 py-2 text-white"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowGoalModal(false)}
                className="flex-1 px-4 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => setShowGoalModal(false)}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            🦞 写作习惯追踪 · 坚持就是胜利
          </p>
        </div>
      </footer>
    </div>
  );
}