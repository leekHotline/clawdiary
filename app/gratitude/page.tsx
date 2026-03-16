'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface GratitudeEntry {
  id: string
  date: string
  items: string[]
  mood: number
  reflection: string
  createdAt: string
}

const MOOD_EMOJIS = ['😢', '😕', '😐', '🙂', '😊', '😄', '🥰']

const PROMPTS = [
  '今天让你微笑的事情是什么？',
  '你今天学到的新东西是什么？',
  '谁让你今天感到温暖？',
  '今天的某个小确幸是什么？',
  '你为自己的什么感到骄傲？',
  '今天有什么事情让你感到平静？',
  '你最享受今天的哪个时刻？',
  '有什么你今天视为理所当然的好事？',
  '今天有什么挑战让你变得更好？',
  '你今天收到的善意是什么？'
]

export default function GratitudePage() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([])
  const [todayEntry, setTodayEntry] = useState<GratitudeEntry | null>(null)
  const [gratitudeItems, setGratitudeItems] = useState<string[]>(['', '', ''])
  const [mood, setMood] = useState(4)
  const [reflection, setReflection] = useState('')
  const [currentPrompt, setCurrentPrompt] = useState('')
  const [streak, setStreak] = useState(0)
  const [showHistory, setShowHistory] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('gratitude-entries')
    if (saved) {
      const allEntries = JSON.parse(saved)
      setEntries(allEntries) // eslint-disable-line react-hooks/set-state-in-effect

      // Check for today's entry
      const today = new Date().toDateString()
      const existing = allEntries.find((e: GratitudeEntry) =>
        new Date(e.date).toDateString() === today
      )
      if (existing) {
        setTodayEntry(existing)
        setGratitudeItems(existing.items)
        setMood(existing.mood)
        setReflection(existing.reflection)
      }

      // Calculate streak
      const todayDate = new Date()
      let currentStreak = 0
      const checkDate = new Date(todayDate)

      // Check if today has an entry
      const todayStr = todayDate.toDateString()
      const hasToday = allEntries.some((e: GratitudeEntry) => new Date(e.date).toDateString() === todayStr)

      if (!hasToday) {
        checkDate.setDate(checkDate.getDate() - 1)
      }

      while (true) {
        const dateStr = checkDate.toDateString()
        const hasEntry = allEntries.some((e: GratitudeEntry) => new Date(e.date).toDateString() === dateStr)

        if (hasEntry) {
          currentStreak++
          checkDate.setDate(checkDate.getDate() - 1)
        } else {
          break
        }
      }

      setStreak(currentStreak)
    }
    setCurrentPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])
  }, [])

  const calculateStreak = (allEntries: GratitudeEntry[]) => {
    const today = new Date()
    let currentStreak = 0
    const checkDate = new Date(today)

    // Check if today has an entry
    const todayStr = today.toDateString()
    const hasToday = allEntries.some(e => new Date(e.date).toDateString() === todayStr)

    if (!hasToday) {
      checkDate.setDate(checkDate.getDate() - 1)
    }

    while (true) {
      const dateStr = checkDate.toDateString()
      const hasEntry = allEntries.some(e => new Date(e.date).toDateString() === dateStr)

      if (hasEntry) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }

    setStreak(currentStreak)
  }

  const saveEntry = () => {
    const filledItems = gratitudeItems.filter(item => item.trim())
    if (filledItems.length < 1) {
      alert('请至少写下一件感恩的事')
      return
    }
    
    const entry: GratitudeEntry = {
      id: todayEntry?.id || Date.now().toString(),
      date: new Date().toISOString(),
      items: filledItems,
      mood,
      reflection,
      createdAt: todayEntry?.createdAt || new Date().toISOString()
    }
    
    let updatedEntries: GratitudeEntry[]
    if (todayEntry) {
      updatedEntries = entries.map(e => e.id === entry.id ? entry : e)
    } else {
      updatedEntries = [...entries, entry]
    }
    
    localStorage.setItem('gratitude-entries', JSON.stringify(updatedEntries))
    setEntries(updatedEntries)
    setTodayEntry(entry)
    calculateStreak(updatedEntries)
  }

  const addItem = () => {
    if (gratitudeItems.length < 10) {
      setGratitudeItems([...gratitudeItems, ''])
    }
  }

  const updateItem = (index: number, value: string) => {
    const newItems = [...gratitudeItems]
    newItems[index] = value
    setGratitudeItems(newItems)
  }

  const removeItem = (index: number) => {
    if (gratitudeItems.length > 1) {
      setGratitudeItems(gratitudeItems.filter((_, i) => i !== index))
    }
  }

  const getRandomPrompt = () => {
    setCurrentPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])
  }

  const getEntriesByMonth = (year: number, month: number) => {
    return entries.filter(e => {
      const d = new Date(e.date)
      return d.getFullYear() === year && d.getMonth() === month
    })
  }

  const thisMonthEntries = getEntriesByMonth(
    new Date().getFullYear(),
    new Date().getMonth()
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-orange-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🙏 感恩日记</h1>
            <p className="text-gray-600 mt-1">每天记录三件感恩的事</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-white/80 rounded-lg hover:bg-white transition shadow-sm"
          >
            返回首页
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-pink-500">{streak}</div>
            <div className="text-sm text-gray-600">连续天数</div>
          </div>
          <div className="bg-white/80 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-500">{entries.length}</div>
            <div className="text-sm text-gray-600">总记录数</div>
          </div>
          <div className="bg-white/80 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-orange-500">{thisMonthEntries.length}</div>
            <div className="text-sm text-gray-600">本月记录</div>
          </div>
        </div>

        {/* Streak Banner */}
        {streak >= 7 && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-4 mb-6 text-center text-white shadow-lg">
            🎉 恭喜！你已连续 {streak} 天记录感恩日记！
          </div>
        )}

        {/* Today's Entry */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {todayEntry ? '📝 今日感恩' : '✨ 新增今日感恩'}
            </h2>
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString('zh-CN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
              })}
            </span>
          </div>

          {/* Prompt */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-purple-700 font-medium">💭 {currentPrompt}</p>
              <button
                onClick={getRandomPrompt}
                className="text-sm text-purple-500 hover:text-purple-700"
              >
                🔄 换一个
              </button>
            </div>
          </div>

          {/* Gratitude Items */}
          <div className="space-y-3 mb-6">
            {gratitudeItems.map((item, index) => (
              <div key={index} className="flex gap-2">
                <span className="flex-shrink-0 w-8 h-10 flex items-center justify-center text-pink-500 font-bold">
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  placeholder={`感恩的第 ${index + 1} 件事...`}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                />
                {gratitudeItems.length > 1 && (
                  <button
                    onClick={() => removeItem(index)}
                    className="px-3 text-gray-400 hover:text-red-500"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {gratitudeItems.length < 10 && (
              <button
                onClick={addItem}
                className="w-full py-2 border-2 border-dashed border-pink-200 rounded-xl text-pink-400 hover:border-pink-400 hover:text-pink-600 transition"
              >
                + 添加更多
              </button>
            )}
          </div>

          {/* Mood */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              今天的心情指数
            </label>
            <div className="flex gap-2">
              {MOOD_EMOJIS.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => setMood(index)}
                  className={`text-3xl p-2 rounded-xl transition ${
                    mood === index 
                      ? 'bg-pink-100 scale-110' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Reflection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              今日感悟（可选）
            </label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="写下你今天的感受、思考或任何想法..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100 resize-none"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={saveEntry}
            className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl hover:from-pink-600 hover:to-purple-600 transition shadow-lg"
          >
            {todayEntry ? '💾 更新记录' : '✨ 保存今日感恩'}
          </button>
        </div>

        {/* History Toggle */}
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-full py-3 bg-white/80 rounded-xl text-gray-600 hover:bg-white transition mb-4"
        >
          {showHistory ? '📁 收起历史' : `📚 查看历史记录 (${entries.length})`}
        </button>

        {/* History */}
        {showHistory && (
          <div className="space-y-4">
            {entries.slice().reverse().map((entry) => (
              <div 
                key={entry.id} 
                className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer"
                onClick={() => setSelectedDate(selectedDate === entry.id ? null : entry.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{MOOD_EMOJIS[entry.mood]}</span>
                    <span className="font-medium text-gray-800">
                      {new Date(entry.date).toLocaleDateString('zh-CN', {
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {entry.items.length} 件感恩的事
                  </span>
                </div>
                
                {selectedDate === entry.id && (
                  <>
                    <ul className="mt-3 space-y-2">
                      {entry.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-600">
                          <span className="text-pink-400">✿</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    {entry.reflection && (
                      <p className="mt-3 text-gray-500 italic border-l-2 border-pink-200 pl-3">
                        &ldquo;{entry.reflection}&rdquo;
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quote */}
        <div className="mt-8 text-center text-gray-500 italic">
          &ldquo;感恩是最高级的记忆。&rdquo; — 让·巴蒂斯特·马西永
        </div>
      </div>
    </div>
  )
}