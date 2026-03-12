'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface GratitudeEntry {
  id: string
  date: string
  items: string[]
  mood: number
  reflection: string
}

const MOOD_EMOJIS = ['😢', '😕', '😐', '🙂', '😊', '😄', '🥰']

export default function GratitudeStatsPage() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([])
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [moodDistribution, setMoodDistribution] = useState<Record<number, number>>({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const saved = localStorage.getItem('gratitude-entries')
    if (saved) {
      const allEntries = JSON.parse(saved)
      setEntries(allEntries)
      
      // Calculate mood distribution
      const distribution: Record<number, number> = {}
      allEntries.forEach((entry: GratitudeEntry) => {
        distribution[entry.mood] = (distribution[entry.mood] || 0) + 1
      })
      setMoodDistribution(distribution)
    }
  }

  const getMonthEntries = () => {
    return entries.filter(entry => {
      const date = new Date(entry.date)
      return date.getMonth() === selectedMonth.getMonth() && 
             date.getFullYear() === selectedMonth.getFullYear()
    })
  }

  const getMonthStats = () => {
    const monthEntries = getMonthEntries()
    const totalItems = monthEntries.reduce((acc, e) => acc + e.items.length, 0)
    const avgMood = monthEntries.length > 0
      ? monthEntries.reduce((acc, e) => acc + e.mood, 0) / monthEntries.length
      : 0
    
    return {
      entries: monthEntries.length,
      totalItems,
      avgMood: avgMood.toFixed(1)
    }
  }

  const getMostCommonWords = () => {
    const wordCount: Record<string, number> = {}
    entries.forEach(entry => {
      entry.items.forEach(item => {
        const words = item.split(/\s+/).filter(w => w.length > 1)
        words.forEach(word => {
          wordCount[word] = (wordCount[word] || 0) + 1
        })
      })
    })
    
    return Object.entries(wordCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
  }

  const getStreakInfo = () => {
    if (entries.length === 0) return { current: 0, longest: 0 }
    
    const sortedDates = entries
      .map(e => new Date(e.date).toDateString())
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    
    const uniqueDates = [...new Set(sortedDates)]
    
    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 1
    
    // Calculate longest streak
    for (let i = 1; i < uniqueDates.length; i++) {
      const prev = new Date(uniqueDates[i - 1])
      const curr = new Date(uniqueDates[i])
      const diff = (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
      
      if (diff === 1) {
        tempStreak++
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        tempStreak = 1
      }
    }
    
    // Calculate current streak
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    
    if (uniqueDates.includes(today) || uniqueDates.includes(yesterday)) {
      currentStreak = 1
      const startFrom = uniqueDates.includes(today) ? today : yesterday
      
      for (let i = 1; i < 365; i++) {
        const checkDate = new Date(startFrom)
        checkDate.setDate(checkDate.getDate() - i)
        const dateStr = checkDate.toDateString()
        
        if (uniqueDates.includes(dateStr)) {
          currentStreak++
        } else {
          break
        }
      }
    }
    
    return { current: currentStreak, longest: Math.max(longestStreak, 1) }
  }

  const monthStats = getMonthStats()
  const commonWords = getMostCommonWords()
  const streakInfo = getStreakInfo()

  const navigateMonth = (direction: number) => {
    const newMonth = new Date(selectedMonth)
    newMonth.setMonth(newMonth.getMonth() + direction)
    setSelectedMonth(newMonth)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-orange-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/gratitude"
            className="px-4 py-2 bg-white/80 rounded-lg hover:bg-white transition shadow-sm"
          >
            ← 返回
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">📊 感恩统计</h1>
            <p className="text-gray-600 text-sm">了解你的感恩习惯</p>
          </div>
        </div>

        {/* Streak Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-5xl font-bold text-orange-500">{streakInfo.current}</div>
            <div className="text-gray-600 mt-1">🔥 当前连续</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-5xl font-bold text-purple-500">{streakInfo.longest}</div>
            <div className="text-gray-600 mt-1">🏆 最长连续</div>
          </div>
        </div>

        {/* Month Selector */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              ← 上月
            </button>
            <div className="text-lg font-bold">
              {selectedMonth.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
            </div>
            <button
              onClick={() => navigateMonth(1)}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              下月 →
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-pink-50 rounded-xl">
              <div className="text-3xl font-bold text-pink-500">{monthStats.entries}</div>
              <div className="text-sm text-gray-600">本月记录</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-500">{monthStats.totalItems}</div>
              <div className="text-sm text-gray-600">感恩事项</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-3xl font-bold text-orange-500">{monthStats.avgMood}</div>
              <div className="text-sm text-gray-600">平均心情</div>
            </div>
          </div>
        </div>

        {/* Mood Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">😊 心情分布</h3>
          <div className="space-y-3">
            {MOOD_EMOJIS.map((emoji, index) => {
              const count = moodDistribution[index] || 0
              const total = entries.length
              const percentage = total > 0 ? (count / total) * 100 : 0
              
              return (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-2xl w-10 text-center">{emoji}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-16 text-right">
                    {count} ({percentage.toFixed(0)}%)
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Word Cloud */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">☁️ 高频词汇</h3>
          {commonWords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {commonWords.map(([word, count]) => {
                const size = Math.min(24 + count * 2, 36)
                return (
                  <span
                    key={word}
                    className="px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 rounded-full text-gray-700"
                    style={{ fontSize: `${size}px` }}
                  >
                    {word}
                  </span>
                )
              })}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-4">
              还没有足够的数据生成词汇云
            </div>
          )}
        </div>

        {/* Total Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📈 总体统计</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-pink-50 rounded-xl">
              <div className="text-3xl font-bold text-pink-500">{entries.length}</div>
              <div className="text-sm text-gray-600">总记录数</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="text-3xl font-bold text-purple-500">
                {entries.reduce((acc, e) => acc + e.items.length, 0)}
              </div>
              <div className="text-sm text-gray-600">感恩事项总数</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-xl">
              <div className="text-3xl font-bold text-orange-500">
                {entries.length > 0 
                  ? (entries.reduce((acc, e) => acc + e.items.length, 0) / entries.length).toFixed(1)
                  : 0
                }
              </div>
              <div className="text-sm text-gray-600">平均每条事项</div>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-500">
                {entries.length > 0
                  ? (entries.reduce((acc, e) => acc + e.mood, 0) / entries.length).toFixed(1)
                  : 0
                }
              </div>
              <div className="text-sm text-gray-600">平均心情指数</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}