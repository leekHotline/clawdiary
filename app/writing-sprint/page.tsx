"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";

interface SprintSession {
  id: string;
  duration: number;
  targetWords: number;
  actualWords: number;
  completedAt: string;
  theme?: string;
}

const SPRINT_THEMES = [
  { emoji: "🌅", theme: "今天最感恩的事", color: "from-orange-400 to-rose-500" },
  { emoji: "💪", theme: "我克服的一个挑战", color: "from-blue-400 to-indigo-500" },
  { emoji: "😊", theme: "让我微笑的瞬间", color: "from-yellow-400 to-orange-500" },
  { emoji: "🧠", theme: "我学到的新东西", color: "from-purple-400 to-pink-500" },
  { emoji: "❤️", theme: "我爱的人", color: "from-red-400 to-rose-500" },
  { emoji: "🌟", theme: "我的小成就", color: "from-cyan-400 to-blue-500" },
  { emoji: "🌈", theme: "我的希望与期待", color: "from-green-400 to-teal-500" },
  { emoji: "🎨", theme: "创意灵光一闪", color: "from-fuchsia-400 to-purple-500" },
];

const DURATION_OPTIONS = [
  { value: 3, label: "3分钟", desc: "快速热身" },
  { value: 5, label: "5分钟", desc: "标准冲刺" },
  { value: 10, label: "10分钟", desc: "深度写作" },
  { value: 15, label: "15分钟", desc: "马拉松模式" },
];

const ENCOURAGEMENTS = [
  "写得漂亮！继续保持！ ✨",
  "你的文字有力量！💪",
  "每一个字都是进步！🚀",
  "太棒了！创意无限！🎨",
  "你在创造美好的记录！📝",
  "写作就是与自己对话！💭",
  "每一个句子都很珍贵！💎",
  "你的故事值得被记录！📖",
];

// 辅助函数：从 localStorage 加载数据
function loadSessionsFromStorage(): SprintSession[] {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem("sprint-sessions");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
}

function loadStreakFromStorage(): number {
  if (typeof window === 'undefined') return 0;
  const streak = localStorage.getItem("sprint-streak");
  return streak ? parseInt(streak) : 0;
}

export default function WritingSprintPage() {
  const [phase, setPhase] = useState<"setup" | "sprinting" | "complete">("setup");
  const [duration, setDuration] = useState(5);
  const [theme, setTheme] = useState(SPRINT_THEMES[0]);
  const [content, setContent] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [encouragement, setEncouragement] = useState("");
  const [showEncouragement, setShowEncouragement] = useState(false);
  
  // 使用 state 初始化函数从 localStorage 加载（避免在 effect 中调用 setState）
  const [sessions, setSessions] = useState<SprintSession[]>(loadSessionsFromStorage);
  const [sprintStreak, setSprintStreak] = useState(loadStreakFromStorage);
  
  // 计算派生状态（不使用 effect）
  const totalWords = useMemo(() => 
    sessions.reduce((sum, s) => sum + s.actualWords, 0), 
    [sessions]
  );
  
  // 计算字数（派生状态）
  const wordCount = useMemo(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
    return words + chineseChars;
  }, [content])
  
  // 跟踪上一个鼓励里程碑（避免重复触发）
  const lastMilestoneRef = useRef(0);

  // 计时器
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (phase === "sprinting" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setPhase("complete");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase, timeLeft]);

  // 内容变化时检查里程碑（避免在 effect 中调用 setState）
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    
    // 计算新字数
    const words = newContent.trim().split(/\s+/).filter(Boolean).length;
    const chineseChars = (newContent.match(/[\u4e00-\u9fa5]/g) || []).length;
    const newWordCount = words + chineseChars;
    
    // 检查是否到达新里程碑（每50字）
    if (phase === "sprinting" && newWordCount > 0 && newWordCount % 50 === 0) {
      const currentMilestone = Math.floor(newWordCount / 50);
      if (currentMilestone > lastMilestoneRef.current) {
        lastMilestoneRef.current = currentMilestone;
        const random = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
        setEncouragement(random);
        setShowEncouragement(true);
        setTimeout(() => setShowEncouragement(false), 3000);
      }
    }
  }, [phase])

  const startSprint = () => {
    setPhase("sprinting");
    setTimeLeft(duration * 60);
    setContent("");
  };

  const finishSprint = () => {
    const session: SprintSession = {
      id: Date.now().toString(),
      duration,
      targetWords: duration * 20,
      actualWords: wordCount,
      completedAt: new Date().toISOString(),
      theme: theme.theme,
    };

    const newSessions = [session, ...sessions].slice(0, 20);
    setSessions(newSessions);
    localStorage.setItem("sprint-sessions", JSON.stringify(newSessions));

    // 更新连续天数
    const today = new Date().toDateString();
    const lastSprint = localStorage.getItem("last-sprint-date");
    if (lastSprint !== today) {
      const newStreak = sprintStreak + 1;
      setSprintStreak(newStreak);
      localStorage.setItem("sprint-streak", newStreak.toString());
      localStorage.setItem("last-sprint-date", today);
    }

    setPhase("setup");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgressPercent = () => {
    return ((duration * 60 - timeLeft) / (duration * 60)) * 100;
  };

  const getSpeed = () => {
    const elapsed = duration * 60 - timeLeft;
    if (elapsed === 0) return 0;
    return Math.round((wordCount / elapsed) * 60);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-2xl hover:scale-110 transition-transform">
                🦞
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">写作冲刺</h1>
                <p className="text-xs text-gray-400">限时挑战，突破写作障碍</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-orange-400">
                <span>🔥</span>
                <span>{sprintStreak} 天连续</span>
              </div>
              <div className="flex items-center gap-1 text-purple-400">
                <span>✍️</span>
                <span>{totalWords} 字</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-4xl mx-auto px-4 py-8">
        {/* Setup Phase */}
        {phase === "setup" && (
          <div className="space-y-8">
            {/* Hero */}
            <div className="text-center">
              <div className="text-6xl mb-4">⚡</div>
              <h2 className="text-3xl font-bold text-white mb-2">准备好冲刺了吗？</h2>
              <p className="text-gray-400">选择时长，拿起主题，开始写作！</p>
            </div>

            {/* Duration Selection */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>⏱️</span>
                <span>选择时长</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {DURATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDuration(opt.value)}
                    className={`p-4 rounded-xl border transition-all ${
                      duration === opt.value
                        ? "bg-purple-600/30 border-purple-500 text-white"
                        : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30"
                    }`}
                  >
                    <div className="text-xl font-bold">{opt.label}</div>
                    <div className="text-xs opacity-60">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selection */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>🎯</span>
                <span>选择主题</span>
                <button
                  onClick={() => setTheme(SPRINT_THEMES[Math.floor(Math.random() * SPRINT_THEMES.length)])}
                  className="ml-auto text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  🎲 随机
                </button>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {SPRINT_THEMES.map((t) => (
                  <button
                    key={t.theme}
                    onClick={() => setTheme(t)}
                    className={`p-4 rounded-xl border transition-all text-left ${
                      theme.theme === t.theme
                        ? `bg-gradient-to-br ${t.color} border-transparent text-white`
                        : "bg-white/5 border-white/10 text-gray-300 hover:border-white/30"
                    }`}
                  >
                    <div className="text-2xl mb-2">{t.emoji}</div>
                    <div className="text-sm font-medium">{t.theme}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={startSprint}
              className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white text-xl font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-[1.02]"
            >
              🚀 开始冲刺！
            </button>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <div className="text-2xl font-bold text-purple-400">{sessions.length}</div>
                <div className="text-xs text-gray-500">完成次数</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <div className="text-2xl font-bold text-green-400">
                  {sessions.length > 0 ? Math.round(sessions.reduce((a, s) => a + s.actualWords, 0) / sessions.length) : 0}
                </div>
                <div className="text-xs text-gray-500">平均字数</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <div className="text-2xl font-bold text-orange-400">{sprintStreak}</div>
                <div className="text-xs text-gray-500">连续天数</div>
              </div>
            </div>

            {/* Recent Sessions */}
            {sessions.length > 0 && (
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span>📜</span>
                  <span>最近冲刺</span>
                </h3>
                <div className="space-y-3">
                  {sessions.slice(0, 5).map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {SPRINT_THEMES.find((t) => t.theme === s.theme)?.emoji || "📝"}
                        </span>
                        <div>
                          <div className="text-sm text-gray-300">{s.theme}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(s.completedAt).toLocaleString("zh-CN")}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-purple-400">{s.actualWords} 字</div>
                        <div className="text-xs text-gray-500">{s.duration} 分钟</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sprint Phase */}
        {phase === "sprinting" && (
          <div className="space-y-6">
            {/* Timer Bar */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{theme.emoji}</span>
                  <span className="text-white font-medium">{theme.theme}</span>
                </div>
                <div className="text-4xl font-mono font-bold text-white">
                  {formatTime(timeLeft)}
                </div>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${theme.color} transition-all duration-1000`}
                  style={{ width: `${getProgressPercent()}%` }}
                />
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <div className="text-3xl font-bold text-white">{wordCount}</div>
                <div className="text-xs text-gray-500">字数</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <div className="text-3xl font-bold text-green-400">{getSpeed()}</div>
                <div className="text-xs text-gray-500">字/分钟</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <div className="text-3xl font-bold text-purple-400">
                  {Math.max(0, duration * 20 - wordCount)}
                </div>
                <div className="text-xs text-gray-500">目标差距</div>
              </div>
            </div>

            {/* Writing Area */}
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder={`开始写吧！主题：${theme.theme}`}
                className="w-full h-80 bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-lg leading-relaxed placeholder-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none resize-none"
                autoFocus
              />
              
              {/* Encouragement Toast */}
              {showEncouragement && (
                <div className="absolute top-4 right-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white text-sm font-medium animate-pulse">
                  {encouragement}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setPhase("setup");
                  setContent("");
                }}
                className="flex-1 py-4 bg-white/10 rounded-xl text-gray-300 font-medium hover:bg-white/20 transition-colors"
              >
                放弃冲刺
              </button>
              <button
                onClick={finishSprint}
                className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white font-bold hover:shadow-lg transition-all"
              >
                ✓ 完成冲刺
              </button>
            </div>

            {/* Tips */}
            <div className="text-center text-gray-500 text-sm">
              💡 别担心语法和结构，尽情写！最后可以保存为日记
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>🦞 写作冲刺 · 让写作成为习惯</p>
        </div>
      </footer>
    </div>
  );
}