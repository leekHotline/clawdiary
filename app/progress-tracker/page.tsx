'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ProgressData {
  totalDiaries: number
  currentStreak: number
  longestStreak: number
  totalWords: number
  writingDays: number
  level: number
  xp: number
  xpToNextLevel: number
  skills: SkillData[]
  milestones: MilestoneData[]
  weeklyProgress: number[]
  monthlyHighlights: string[]
}

interface SkillData {
  name: string
  level: number
  xp: number
  icon: string
}

interface MilestoneData {
  id: string
  title: string
  description: string
  unlocked: boolean
  unlockedAt?: string
  icon: string
  category: 'writing' | 'streak' | 'exploration' | 'creativity'
}

const defaultProgress: ProgressData = {
  totalDiaries: 47,
  currentStreak: 12,
  longestStreak: 28,
  totalWords: 28450,
  writingDays: 35,
  level: 8,
  xp: 2450,
  xpToNextLevel: 800,
  skills: [
    { name: '情感表达', level: 5, xp: 180, icon: '💝' },
    { name: '细节描写', level: 3, xp: 320, icon: '🔍' },
    { name: '创意叙事', level: 4, xp: 150, icon: '✨' },
    { name: '自我反思', level: 6, xp: 420, icon: '🪞' },
    { name: '幽默感', level: 2, xp: 90, icon: '😄' },
  ],
  milestones: [
    { id: '1', title: '初心者', description: '写下第一篇日记', unlocked: true, unlockedAt: '2025-01-15', icon: '🌱', category: 'writing' },
    { id: '2', title: '坚持一周', description: '连续写日记7天', unlocked: true, unlockedAt: '2025-01-22', icon: '🔥', category: 'streak' },
    { id: '3', title: '月度达人', description: '一个月内写满30篇', unlocked: true, unlockedAt: '2025-02-15', icon: '📅', category: 'streak' },
    { id: '4', title: '万字作家', description: '累计写作10000字', unlocked: true, unlockedAt: '2025-02-20', icon: '✍️', category: 'writing' },
    { id: '5', title: '情感大师', description: '情感表达技能达到5级', unlocked: true, unlockedAt: '2025-03-01', icon: '💫', category: 'creativity' },
    { id: '6', title: '探险家', description: '使用5种不同的日记功能', unlocked: true, unlockedAt: '2025-03-05', icon: '🗺️', category: 'exploration' },
    { id: '7', title: '反思者', description: '自我反思技能达到5级', unlocked: true, unlockedAt: '2025-03-10', icon: '🧠', category: 'creativity' },
    { id: '8', title: '百日传奇', description: '连续写日记100天', unlocked: false, icon: '🏆', category: 'streak' },
    { id: '9', title: '十万字俱乐部', description: '累计写作100000字', unlocked: false, icon: '📚', category: 'writing' },
    { id: '10', title: '全技能大师', description: '所有技能达到10级', unlocked: false, icon: '👑', category: 'creativity' },
  ],
  weeklyProgress: [65, 80, 45, 90, 75, 100, 60],
  monthlyHighlights: [
    '本月写作字数达到历史新高 📈',
    '连续写作天数突破10天 🎯',
    '解锁"反思者"成就 🧠',
    '情感表达技能升级到5级 💝',
  ],
}

const categoryColors: Record<string, string> = {
  writing: 'from-blue-500 to-cyan-500',
  streak: 'from-orange-500 to-red-500',
  exploration: 'from-green-500 to-emerald-500',
  creativity: 'from-purple-500 to-pink-500',
}

const categoryBg: Record<string, string> = {
  writing: 'bg-blue-50 border-blue-200',
  streak: 'bg-orange-50 border-orange-200',
  exploration: 'bg-green-50 border-green-200',
  creativity: 'bg-purple-50 border-purple-200',
}

export default function ProgressTrackerPage() {
  const [data, setData] = useState<ProgressData>(defaultProgress)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const levelProgress = ((data.xpToNextLevel - (data.xp % 1000)) / data.xpToNextLevel) * 100
  
  const filteredMilestones = selectedCategory 
    ? data.milestones.filter(m => m.category === selectedCategory)
    : data.milestones

  const unlockedCount = data.milestones.filter(m => m.unlocked).length

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            🎯 成长追踪器
          </h1>
          <p className="text-gray-500">记录你的每一步进化</p>
        </div>

        {/* Level Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-indigo-100">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                Lv.{data.level}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full shadow">
                {data.xp} XP
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-bold text-gray-800 mb-2">日记探索者</h2>
              <p className="text-gray-500 text-sm mb-3">距离下一级还需 {data.xpToNextLevel} XP</p>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-indigo-50 rounded-xl p-3">
                <div className="text-2xl font-bold text-indigo-600">{data.totalDiaries}</div>
                <div className="text-xs text-gray-500">总日记</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-3">
                <div className="text-2xl font-bold text-orange-600">{data.currentStreak}</div>
                <div className="text-xs text-gray-500">连续天数</div>
              </div>
              <div className="bg-green-50 rounded-xl p-3">
                <div className="text-2xl font-bold text-green-600">{(data.totalWords / 1000).toFixed(1)}k</div>
                <div className="text-xs text-gray-500">总字数</div>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-indigo-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📊 本周进度</h3>
          <div className="flex items-end justify-between gap-2 h-32">
            {['一', '二', '三', '四', '五', '六', '日'].map((day, i) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gray-100 rounded-lg overflow-hidden h-24 relative">
                  <div 
                    className={`absolute bottom-0 w-full rounded-lg transition-all duration-500 ${
                      i === 5 ? 'bg-gradient-to-t from-green-500 to-emerald-400' : 
                      i === 6 ? 'bg-gradient-to-t from-purple-500 to-pink-400' :
                      'bg-gradient-to-t from-indigo-500 to-purple-400'
                    }`}
                    style={{ height: `${data.weeklyProgress[i]}%` }}
                  />
                  {data.weeklyProgress[i] === 100 && (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-lg">✓</div>
                  )}
                </div>
                <span className="text-xs text-gray-500">{day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Skills */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">⚡ 技能成长</h3>
            <div className="space-y-4">
              {data.skills.map((skill) => (
                <div key={skill.name} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{skill.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                    </span>
                    <span className="text-xs text-gray-500">Lv.{skill.level}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-700 group-hover:from-amber-500 group-hover:to-orange-600"
                      style={{ width: `${(skill.xp / 500) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">持续写日记来提升你的技能!</p>
          </div>

          {/* Monthly Highlights */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">✨ 本月亮点</h3>
            <div className="space-y-3">
              {data.monthlyHighlights.map((highlight, i) => (
                <div 
                  key={i}
                  className="flex items-start gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100"
                >
                  <span className="text-indigo-400 mt-0.5">★</span>
                  <span className="text-sm text-gray-700">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">🏆 成就里程碑</h3>
              <p className="text-sm text-gray-500">已解锁 {unlockedCount}/{data.milestones.length} 个成就</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {['all', 'writing', 'streak', 'exploration', 'creativity'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === 'all' ? null : cat)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    (cat === 'all' ? selectedCategory === null : selectedCategory === cat)
                      ? 'bg-indigo-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat === 'all' ? '全部' : cat === 'writing' ? '✍️ 写作' : cat === 'streak' ? '🔥 连续' : cat === 'exploration' ? '🗺️ 探索' : '💫 创意'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMilestones.map((milestone) => (
              <div 
                key={milestone.id}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  milestone.unlocked 
                    ? `${categoryBg[milestone.category]} border-solid` 
                    : 'bg-gray-50 border-dashed border-gray-200 opacity-60'
                }`}
              >
                {milestone.unlocked && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs shadow-lg">
                    ✓
                  </div>
                )}
                <div className="text-3xl mb-2">{milestone.icon}</div>
                <h4 className="font-bold text-gray-800 mb-1">{milestone.title}</h4>
                <p className="text-xs text-gray-500">{milestone.description}</p>
                {milestone.unlockedAt && (
                  <p className="text-xs text-gray-400 mt-2">解锁于 {milestone.unlockedAt}</p>
                )}
                {!milestone.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-xl">
                    <span className="text-2xl">🔒</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 text-white shadow-lg">
            <div className="text-3xl font-bold">{data.longestStreak}</div>
            <div className="text-sm opacity-80">最长连续天数</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white shadow-lg">
            <div className="text-3xl font-bold">{data.writingDays}</div>
            <div className="text-sm opacity-80">写作天数</div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-4 text-white shadow-lg">
            <div className="text-3xl font-bold">{data.skills.length}</div>
            <div className="text-sm opacity-80">技能数量</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-4 text-white shadow-lg">
            <div className="text-3xl font-bold">{unlockedCount}</div>
            <div className="text-sm opacity-80">解锁成就</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <Link 
            href="/write"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            <span>✍️ 继续写日记</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}