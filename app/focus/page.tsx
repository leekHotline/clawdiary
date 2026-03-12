'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface FocusSession {
  id: string;
  startTime: string;
  endTime?: string;
  duration: number;
  wordsWritten: number;
  diaryId?: string;
  notes?: string;
}

interface FocusSettings {
  duration: number;
  breakDuration: number;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  autoSave: boolean;
}

const PRESET_DURATIONS = [15, 25, 30, 45, 60, 90];
const AMBIENT_SOUNDS = [
  { id: 'rain', name: '雨声', icon: '🌧️' },
  { id: 'forest', name: '森林', icon: '🌲' },
  { id: 'ocean', name: '海浪', icon: '🌊' },
  { id: 'fire', name: '壁炉', icon: '🔥' },
  { id: 'cafe', name: '咖啡厅', icon: '☕' },
  { id: 'night', name: '夜晚', icon: '🌙' },
];

export default function FocusPage() {
  const router = useRouter();
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [settings, setSettings] = useState<FocusSettings>({
    duration: 25,
    breakDuration: 5,
    soundEnabled: true,
    notificationsEnabled: true,
    autoSave: true,
  });
  const [content, setContent] = useState('');
  const [currentSound, setCurrentSound] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [todaySessions, setTodaySessions] = useState<FocusSession[]>([]);
  const [todayStats, setTodayStats] = useState({
    totalMinutes: 0,
    totalWords: 0,
    sessions: 0,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(25);

  // Fetch today's focus sessions
  useEffect(() => {
    fetchTodaySessions();
  }, []);

  const fetchTodaySessions = async () => {
    try {
      const res = await fetch('/api/focus/today');
      if (res.ok) {
        const data = await res.json();
        setTodaySessions(data.sessions || []);
        setTodayStats(data.stats || { totalMinutes: 0, totalWords: 0, sessions: 0 });
      }
    } catch (error) {
      console.error('Failed to fetch focus sessions:', error);
    }
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && !isPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isActive, isPaused, timeLeft]);

  const startSession = () => {
    setIsActive(true);
    setIsPaused(false);
    setSessionStartTime(new Date());
    setTimeLeft(selectedDuration * 60);
    setTotalTime(selectedDuration * 60);
  };

  const pauseSession = () => {
    setIsPaused(!isPaused);
  };

  const endSession = async () => {
    if (!sessionStartTime) return;

    const duration = Math.floor((totalTime - timeLeft) / 60);
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

    try {
      await fetch('/api/focus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: sessionStartTime.toISOString(),
          endTime: new Date().toISOString(),
          duration,
          wordsWritten: wordCount,
          notes: content,
        }),
      });
      
      fetchTodaySessions();
    } catch (error) {
      console.error('Failed to save focus session:', error);
    }

    resetSession();
  };

  const handleSessionComplete = () => {
    // Auto-save session
    endSession();
    
    // Play notification sound
    if (settings.notificationsEnabled) {
      // Could integrate with Web Notifications API
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('专注时间结束！', {
          body: `你完成了 ${selectedDuration} 分钟的专注写作`,
        });
      }
    }
  };

  const resetSession = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(selectedDuration * 60);
    setTotalTime(selectedDuration * 60);
    setSessionStartTime(null);
    setContent('');
  };

  const saveAsDraft = async () => {
    if (!content.trim()) return;
    
    try {
      await fetch('/api/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          title: `专注写作 - ${new Date().toLocaleDateString()}`,
        }),
      });
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  const saveAsDiary = async () => {
    if (!content.trim()) return;
    
    try {
      const res = await fetch('/api/diaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          title: `专注写作 - ${new Date().toLocaleDateString()}`,
          mood: 'productive',
          tags: ['专注写作'],
        }),
      });
      
      if (res.ok) {
        const diary = await res.json();
        router.push(`/diary/${diary.id}`);
      }
    } catch (error) {
      console.error('Failed to save diary:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl">🦞</Link>
            <h1 className="text-xl font-bold">专注模式</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              ⚙️
            </button>
            <Link href="/" className="text-sm hover:text-purple-300 transition-colors">
              退出
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-8 px-4 max-w-6xl mx-auto">
        {!isActive ? (
          /* Setup Phase */
          <div className="space-y-8">
            {/* Duration Selection */}
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold mb-8">选择专注时长</h2>
              <div className="flex flex-wrap justify-center gap-4">
                {PRESET_DURATIONS.map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setSelectedDuration(duration)}
                    className={`px-8 py-4 rounded-2xl text-lg font-semibold transition-all ${
                      selectedDuration === duration
                        ? 'bg-purple-500 text-white scale-105 shadow-lg shadow-purple-500/30'
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {duration} 分钟
                  </button>
                ))}
              </div>
            </div>

            {/* Ambient Sounds */}
            <div className="bg-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">背景音效</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {AMBIENT_SOUNDS.map((sound) => (
                  <button
                    key={sound.id}
                    onClick={() => setCurrentSound(currentSound === sound.id ? null : sound.id)}
                    className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                      currentSound === sound.id
                        ? 'bg-purple-500/30 border-2 border-purple-400'
                        : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                    }`}
                  >
                    <span className="text-2xl">{sound.icon}</span>
                    <span className="text-sm">{sound.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Today's Stats */}
            <div className="bg-white/5 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">今日专注统计</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-purple-400">{todayStats.totalMinutes}</div>
                  <div className="text-sm text-gray-400">分钟</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-blue-400">{todayStats.totalWords}</div>
                  <div className="text-sm text-gray-400">字数</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-green-400">{todayStats.sessions}</div>
                  <div className="text-sm text-gray-400">次数</div>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <button
                onClick={startSession}
                className="px-12 py-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-xl shadow-purple-500/30"
              >
                🎯 开始专注
              </button>
            </div>

            {/* Recent Sessions */}
            {todaySessions.length > 0 && (
              <div className="bg-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">今日记录</h3>
                <div className="space-y-3">
                  {todaySessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">📝</div>
                        <div>
                          <div className="font-medium">{session.duration} 分钟专注</div>
                          <div className="text-sm text-gray-400">
                            {new Date(session.startTime).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-purple-400 font-semibold">
                        {session.wordsWritten} 字
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Active Session */
          <div className="min-h-[80vh] flex flex-col">
            {/* Timer Display */}
            <div className="flex-1 flex flex-col items-center justify-center py-12">
              <div className="relative w-64 h-64 mb-8">
                {/* Progress Ring */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 120}`}
                    strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Time Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-mono font-bold">{formatTime(timeLeft)}</span>
                  <span className="text-sm text-gray-400 mt-2">
                    {isPaused ? '已暂停' : '专注中...'}
                  </span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={pauseSession}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full text-lg transition-colors"
                >
                  {isPaused ? '▶️ 继续' : '⏸️ 暂停'}
                </button>
                <button
                  onClick={endSession}
                  className="px-8 py-4 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-full text-lg transition-colors"
                >
                  ⏹️ 结束
                </button>
              </div>

              {/* Word Count */}
              <div className="text-center text-gray-400">
                已写 <span className="text-white font-bold">{content.trim().split(/\s+/).filter(Boolean).length}</span> 字
              </div>
            </div>

            {/* Writing Area */}
            <div className="bg-white/5 rounded-2xl p-6">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="开始写作..."
                className="w-full h-64 bg-transparent resize-none focus:outline-none text-lg leading-relaxed placeholder-gray-500"
                autoFocus
              />
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-2">
                  {currentSound && (
                    <span className="text-sm text-purple-400">
                      🎵 {AMBIENT_SOUNDS.find(s => s.id === currentSound)?.name}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={saveAsDraft}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
                  >
                    存为草稿
                  </button>
                  <button
                    onClick={saveAsDiary}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors text-sm"
                  >
                    发布日记
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold mb-6">专注设置</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>休息时长</span>
                  <select
                    value={settings.breakDuration}
                    onChange={(e) => setSettings({ ...settings, breakDuration: Number(e.target.value) })}
                    className="bg-white/10 rounded-lg px-3 py-2"
                  >
                    <option value={5}>5 分钟</option>
                    <option value={10}>10 分钟</option>
                    <option value={15}>15 分钟</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span>音效提醒</span>
                  <button
                    onClick={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.soundEnabled ? 'bg-purple-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>桌面通知</span>
                  <button
                    onClick={() => setSettings({ ...settings, notificationsEnabled: !settings.notificationsEnabled })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.notificationsEnabled ? 'bg-purple-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span>自动保存</span>
                  <button
                    onClick={() => setSettings({ ...settings, autoSave: !settings.autoSave })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.autoSave ? 'bg-purple-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.autoSave ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="w-full mt-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
              >
                保存设置
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}