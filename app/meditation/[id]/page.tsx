'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'

interface MediationSession {
  id: string
  title: string
  duration: number
  category: string
  description: string
  guide?: string
}

const MEDITATION_CATEGORIES = [
  { id: 'breathing', name: '呼吸练习', emoji: '🌬️', color: 'from-blue-400 to-cyan-400' },
  { id: 'body-scan', name: '身体扫描', emoji: '🧘', color: 'from-green-400 to-emerald-400' },
  { id: 'visualization', name: '视觉冥想', emoji: '🌅', color: 'from-purple-400 to-pink-400' },
  { id: 'sleep', name: '睡眠冥想', emoji: '🌙', color: 'from-indigo-400 to-violet-400' },
  { id: 'focus', name: '专注训练', emoji: '🎯', color: 'from-orange-400 to-red-400' },
  { id: 'gratitude', name: '感恩冥想', emoji: '🙏', color: 'from-yellow-400 to-amber-400' }
]

const SAMPLE_MEDITATIONS: MediationSession[] = [
  {
    id: '1',
    title: '晨间呼吸练习',
    duration: 5,
    category: 'breathing',
    description: '用5分钟的呼吸练习开启美好的一天',
    guide: '找一个安静的地方坐下，闭上眼睛，开始深呼吸...'
  },
  {
    id: '2',
    title: '深度放松身体扫描',
    duration: 15,
    category: 'body-scan',
    description: '从头到脚逐渐放松身体的每一个部位',
    guide: '平躺在床上，从头顶开始，感受每一个身体部位...'
  },
  {
    id: '3',
    title: '森林漫步视觉冥想',
    duration: 10,
    category: 'visualization',
    description: '在想象中漫步于宁静的森林',
    guide: '想象你正在一片美丽的森林中漫步...'
  },
  {
    id: '4',
    title: '入睡引导冥想',
    duration: 20,
    category: 'sleep',
    description: '帮助您平静心情，进入深度睡眠',
    guide: '现在是放松的时候了，让所有的烦恼都随风而去...'
  },
  {
    id: '5',
    title: '专注力提升训练',
    duration: 8,
    category: 'focus',
    description: '训练您的专注力和注意力',
    guide: '选择一个焦点，保持注意力集中...'
  },
  {
    id: '6',
    title: '感恩之心冥想',
    duration: 7,
    category: 'gratitude',
    description: '感受感恩的力量，培养积极心态',
    guide: '想想今天发生的让你感恩的事情...'
  }
]

export default function MeditationDetailPage({ params }: { params: { id: string } }) {
  // Derive meditation from params using useMemo (no setState in effect)
  const meditation = useMemo(() => 
    SAMPLE_MEDITATIONS.find(m => m.id === params.id) || null,
    [params.id]
  )
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [userNotes, setUserNotes] = useState('')

  const saveSession = useCallback(() => {
    const sessions = JSON.parse(localStorage.getItem('meditation-sessions') || '[]')
    sessions.push({
      id: Date.now(),
      meditationId: meditation?.id,
      duration: meditation?.duration,
      completedAt: new Date().toISOString(),
      notes: userNotes
    })
    localStorage.setItem('meditation-sessions', JSON.stringify(sessions))
  }, [meditation, userNotes])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isPlaying && meditation && timeElapsed < meditation.duration * 60) {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          if (prev + 1 >= meditation.duration * 60) {
            setIsPlaying(false)
            setIsCompleted(true)
            saveSession()
            return meditation.duration * 60
          }
          return prev + 1
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, timeElapsed, meditation, saveSession])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const resetTimer = () => {
    setIsPlaying(false)
    setTimeElapsed(0)
    setIsCompleted(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getCategory = () => {
    return MEDITATION_CATEGORIES.find(c => c.id === meditation?.category)
  }

  const progress = meditation ? (timeElapsed / (meditation.duration * 60)) * 100 : 0

  if (!meditation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-100 via-cyan-50 to-emerald-100 p-6 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-4">🧘</div>
          <p>冥想未找到</p>
          <Link href="/meditation" className="text-teal-600 hover:underline mt-4 block">
            返回冥想列表
          </Link>
        </div>
      </div>
    )
  }

  const category = getCategory()

  return (
    <div className={`min-h-screen bg-gradient-to-br ${category?.color || 'from-teal-100 to-cyan-100'} p-6`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/meditation"
            className="p-2 bg-white/30 rounded-lg hover:bg-white/50 transition"
          >
            ← 返回
          </Link>
          <div>
            <span className="text-sm opacity-80">{category?.emoji} {category?.name}</span>
            <h1 className="text-2xl font-bold text-white">{meditation.title}</h1>
          </div>
        </div>

        {/* Timer Card */}
        <div className="bg-white/90 rounded-3xl p-8 shadow-xl text-center mb-8">
          {!isCompleted ? (
            <>
              {/* Progress Ring */}
              <div className="relative w-64 h-64 mx-auto mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="110"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="110"
                    stroke="url(#progress)"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 110}
                    strokeDashoffset={2 * Math.PI * 110 * (1 - progress / 100)}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="progress" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#14b8a6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-mono font-bold text-gray-800">
                    {formatTime(meditation.duration * 60 - timeElapsed)}
                  </div>
                  <div className="text-gray-500 mt-2">剩余时间</div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={togglePlay}
                  className={`px-8 py-4 rounded-2xl font-bold text-lg transition ${
                    isPlaying
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                      : 'bg-teal-500 hover:bg-teal-600 text-white'
                  }`}
                >
                  {isPlaying ? '⏸️ 暂停' : '▶️ 开始'}
                </button>
                <button
                  onClick={resetTimer}
                  className="px-6 py-4 bg-gray-200 rounded-2xl hover:bg-gray-300 transition"
                >
                  🔄 重置
                </button>
              </div>
            </>
          ) : (
            <div className="py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">冥想完成！</h2>
              <p className="text-gray-600 mb-6">你完成了 {meditation.duration} 分钟的冥想</p>
              
              <textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="记录你的感受..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:border-teal-300 focus:outline-none"
              />
              
              <button
                onClick={resetTimer}
                className="px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 transition"
              >
                再来一次
              </button>
            </div>
          )}
        </div>

        {/* Guide */}
        <div className="bg-white/80 rounded-2xl p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">📖 引导词</h3>
          <p className="text-gray-700 leading-relaxed">{meditation.guide}</p>
        </div>

        {/* Description */}
        <div className="bg-white/60 rounded-xl p-6">
          <h3 className="font-bold text-gray-800 mb-2">📝 关于这个冥想</h3>
          <p className="text-gray-600">{meditation.description}</p>
          <div className="mt-4 flex gap-4 text-sm text-gray-500">
            <span>⏱️ {meditation.duration} 分钟</span>
            <span>{category?.emoji} {category?.name}</span>
          </div>
        </div>
      </div>
    </div>
  )
}