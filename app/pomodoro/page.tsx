'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

type TimerMode = 'work' | 'shortBreak' | 'longBreak'

const TIMER_SETTINGS = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60
}

const MODE_LABELS: Record<TimerMode, string> = {
  work: '专注',
  shortBreak: '短休息',
  longBreak: '长休息'
}

const MODE_COLORS: Record<TimerMode, string> = {
  work: 'from-red-500 to-orange-500',
  shortBreak: 'from-green-500 to-emerald-500',
  longBreak: 'from-blue-500 to-cyan-500'
}

export default function PomodoroPage() {
  const [mode, setMode] = useState<TimerMode>('work')
  const [timeLeft, setTimeLeft] = useState(TIMER_SETTINGS.work)
  const [isRunning, setIsRunning] = useState(false)
  const [selectedTask, setSelectedTask] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [customTimes, setCustomTimes] = useState(TIMER_SETTINGS)
  
  // 使用惰性初始化从 localStorage 读取今日数据，避免 useEffect 中的同步 setState
  const [todaySessions, setTodaySessions] = useState<any[]>(() => {
    if (typeof window === 'undefined') return []
    const saved = localStorage.getItem('pomodoro-sessions')
    if (saved) {
      const allSessions = JSON.parse(saved)
      const today = new Date().toDateString()
      return allSessions.filter((s: { timestamp: string }) => 
        new Date(s.timestamp).toDateString() === today
      )
    }
    return []
  })
  const [sessions, setSessions] = useState(() => {
    if (typeof window === 'undefined') return 0
    const saved = localStorage.getItem('pomodoro-sessions')
    if (saved) {
      const allSessions = JSON.parse(saved)
      const today = new Date().toDateString()
      const todayData = allSessions.filter((s: { timestamp: string }) => 
        new Date(s.timestamp).toDateString() === today
      )
      return todayData.filter((s: { type: string }) => s.type === 'work').length
    }
    return 0
  })
  const [totalFocusTime, setTotalFocusTime] = useState(() => {
    if (typeof window === 'undefined') return 0
    const saved = localStorage.getItem('pomodoro-sessions')
    if (saved) {
      const allSessions = JSON.parse(saved)
      const today = new Date().toDateString()
      const todayData = allSessions.filter((s: { timestamp: string }) => 
        new Date(s.timestamp).toDateString() === today
      )
      return todayData
        .filter((s: { type: string }) => s.type === 'work')
        .reduce((acc: number, s: { duration: number }) => acc + s.duration, 0)
    }
    return 0
  })

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false)
    
    // Play notification sound
    if (typeof window !== 'undefined') {
      const audio = new Audio('/notification.mp3')
      audio.play().catch(() => {})
    }
    
    // Save session
    const newSession = {
      id: Date.now(),
      type: mode,
      duration: customTimes[mode] / 60,
      task: selectedTask,
      timestamp: new Date().toISOString()
    }
    
    const saved = localStorage.getItem('pomodoro-sessions')
    const allSessions = saved ? JSON.parse(saved) : []
    allSessions.push(newSession)
    localStorage.setItem('pomodoro-sessions', JSON.stringify(allSessions))
    
    // Update state
    if (mode === 'work') {
      const newCount = sessions + 1
      setSessions(newCount)
      setTotalFocusTime(prev => prev + customTimes[mode] / 60)
      setTodaySessions(prev => [...prev, newSession])
      
      // Every 4 sessions, take a long break
      if (newCount % 4 === 0) {
        setMode('longBreak')
        setTimeLeft(customTimes.longBreak)
      } else {
        setMode('shortBreak')
        setTimeLeft(customTimes.shortBreak)
      }
    } else {
      setMode('work')
      setTimeLeft(customTimes.work)
    }
    
    // Browser notification
    if (Notification.permission === 'granted') {
      new Notification('番茄钟完成！', {
        body: mode === 'work' ? '休息一下吧！' : '准备开始新的专注时间！'
      })
    }
  }, [mode, sessions, selectedTask, customTimes])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      // 使用 setTimeout 避免在 effect 中同步调用 setState
      setTimeout(() => handleTimerComplete(), 0)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, handleTimerComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(customTimes[mode])
  }

  const switchMode = (newMode: TimerMode) => {
    setIsRunning(false)
    setMode(newMode)
    setTimeLeft(customTimes[newMode])
  }

  const progress = 1 - (timeLeft / customTimes[mode])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">🍅 番茄钟</h1>
            <p className="text-gray-400 mt-1">专注工作，高效休息</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
          >
            返回首页
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-orange-400">{sessions}</div>
            <div className="text-sm text-gray-400">今日番茄</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-400">{Math.floor(totalFocusTime)}分钟</div>
            <div className="text-sm text-gray-400">专注时长</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-blue-400">{todaySessions.length}</div>
            <div className="text-sm text-gray-400">总计时</div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 mb-8 justify-center">
          {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`px-6 py-3 rounded-xl font-medium transition ${
                mode === m 
                  ? `bg-gradient-to-r ${MODE_COLORS[m]} text-white shadow-lg`
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>

        {/* Main Timer */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-80 h-80">
            {/* Progress Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="160"
                cy="160"
                r="140"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-white/10"
              />
              <circle
                cx="160"
                cy="160"
                r="140"
                stroke="url(#gradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 140}
                strokeDashoffset={2 * Math.PI * 140 * (1 - progress)}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={mode === 'work' ? '#ef4444' : mode === 'shortBreak' ? '#22c55e' : '#3b82f6'} />
                  <stop offset="100%" stopColor={mode === 'work' ? '#f97316' : mode === 'shortBreak' ? '#10b981' : '#06b6d4'} />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Timer Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-6xl font-mono font-bold mb-2">
                {formatTime(timeLeft)}
              </div>
              <div className="text-gray-400">{MODE_LABELS[mode]}</div>
              {selectedTask && (
                <div className="mt-2 text-sm text-purple-300 max-w-48 truncate">
                  📝 {selectedTask}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={toggleTimer}
            className={`px-8 py-4 rounded-2xl font-bold text-lg transition ${
              isRunning
                ? 'bg-yellow-500 hover:bg-yellow-600 text-black'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
            }`}
          >
            {isRunning ? '⏸️ 暂停' : '▶️ 开始'}
          </button>
          <button
            onClick={resetTimer}
            className="px-6 py-4 bg-white/10 rounded-2xl hover:bg-white/20 transition"
          >
            🔄 重置
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-6 py-4 bg-white/10 rounded-2xl hover:bg-white/20 transition"
          >
            ⚙️ 设置
          </button>
        </div>

        {/* Task Input */}
        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="当前任务（可选）"
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 rounded-xl border border-white/20 focus:border-purple-500 focus:outline-none"
          />
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white/10 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-bold mb-4">⏱️ 时间设置（分钟）</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">专注时长</label>
                <input
                  type="number"
                  value={customTimes.work / 60}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) * 60
                    setCustomTimes(prev => ({ ...prev, work: val }))
                    if (mode === 'work' && !isRunning) setTimeLeft(val)
                  }}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg text-center"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">短休息</label>
                <input
                  type="number"
                  value={customTimes.shortBreak / 60}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) * 60
                    setCustomTimes(prev => ({ ...prev, shortBreak: val }))
                    if (mode === 'shortBreak' && !isRunning) setTimeLeft(val)
                  }}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg text-center"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">长休息</label>
                <input
                  type="number"
                  value={customTimes.longBreak / 60}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) * 60
                    setCustomTimes(prev => ({ ...prev, longBreak: val }))
                    if (mode === 'longBreak' && !isRunning) setTimeLeft(val)
                  }}
                  className="w-full px-3 py-2 bg-white/10 rounded-lg text-center"
                />
              </div>
            </div>
          </div>
        )}

        {/* Today's Sessions */}
        {todaySessions.length > 0 && (
          <div className="bg-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4">📊 今日记录</h3>
            <div className="space-y-2">
              {todaySessions.slice(-10).reverse().map((session: any) => (
                <div key={session.id} className="flex items-center justify-between py-2 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {session.type === 'work' ? '🍅' : '☕'}
                    </span>
                    <span>{session.task || MODE_LABELS[session.type as TimerMode]}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{session.duration}分钟</span>
                    <span>{new Date(session.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-white/5 rounded-xl p-6">
          <h3 className="font-bold mb-2">💡 番茄工作法小贴士</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• 每个「番茄」= 25分钟专注 + 5分钟休息</li>
            <li>• 每完成4个番茄，休息15-30分钟</li>
            <li>• 专注期间屏蔽所有干扰</li>
            <li>• 休息时站起来活动，让眼睛休息</li>
          </ul>
        </div>
      </div>
    </div>
  )
}