'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Affirmation {
  id: string
  text: string
  category: string
  isCustom: boolean
  createdAt: string
}

interface DailyAffirmation {
  date: string
  affirmationId: string
  timesRead: number
  reflection: string
}

const CATEGORIES = [
  { id: 'confidence', name: '自信', emoji: '💪', color: 'from-orange-500 to-red-500' },
  { id: 'peace', name: '平静', emoji: '🧘', color: 'from-blue-500 to-cyan-500' },
  { id: 'success', name: '成功', emoji: '🏆', color: 'from-yellow-500 to-amber-500' },
  { id: 'love', name: '爱', emoji: '❤️', color: 'from-pink-500 to-rose-500' },
  { id: 'health', name: '健康', emoji: '🏃', color: 'from-green-500 to-emerald-500' },
  { id: 'abundance', name: '丰盛', emoji: '🌟', color: 'from-purple-500 to-violet-500' },
  { id: 'gratitude', name: '感恩', emoji: '🙏', color: 'from-indigo-500 to-blue-500' },
  { id: 'growth', name: '成长', emoji: '🌱', color: 'from-teal-500 to-green-500' }
]

const DEFAULT_AFFIRMATIONS: Record<string, string[]> = {
  confidence: [
    '我相信自己有能力实现目标',
    '我值得拥有美好的事物',
    '我越来越自信，越来越有力量',
    '我的价值不取决于他人的看法',
    '我每天都在进步，成为更好的自己',
    '我有能力克服任何挑战',
    '我相信自己的直觉和判断',
    '我是独一无二的存在'
  ],
  peace: [
    '我的内心平静而安宁',
    '我选择放下焦虑，拥抱当下',
    '我值得拥有内心的宁静',
    '每一次呼吸都让我更加平静',
    '我释放所有不必要的担忧',
    '我的心灵是一片宁静的海洋',
    '我接纳此刻的自己',
    '平静是我自然的状态'
  ],
  success: [
    '我正在走向成功',
    '每一天我都在创造价值',
    '我的努力终将得到回报',
    '我拥有成功的所有品质',
    '机会总是眷顾有准备的我',
    '我的潜力是无限的',
    '我值得拥有富足的人生',
    '成功是我生活的一部分'
  ],
  love: [
    '我值得被爱',
    '我的心中充满爱与温暖',
    '我先爱自己，然后爱他人',
    '爱是我生命中最强大的力量',
    '我吸引真诚的爱进入我的生活',
    '我是一个有爱心的人',
    '我接受他人的爱',
    '我用爱对待每一个人'
  ],
  health: [
    '我的身体越来越健康',
    '我珍惜并照顾我的身体',
    '每一天我都在变得更加强壮',
    '我的身体有强大的自愈能力',
    '我选择健康的生活方式',
    '我充满活力和能量',
    '我的每一个细胞都充满活力',
    '健康是我最珍贵的财富'
  ],
  abundance: [
    '我的人生丰盛富足',
    '财富从四面八方流向我的生活',
    '我值得拥有丰盛的一切',
    '我敞开心扉接受宇宙的馈赠',
    '我的生活充满了美好',
    '我感恩我所拥有的一切',
    '丰盛是我的自然状态',
    '我创造自己的繁荣'
  ],
  gratitude: [
    '我感恩生命中的每一个美好瞬间',
    '我的心中充满感激',
    '我珍惜身边的每一个人',
    '感恩让我的生活更加美好',
    '我为拥有的一切感到幸福',
    '我每天都发现值得感恩的事',
    '感恩是我生活的一部分',
    '我感谢宇宙的眷顾'
  ],
  growth: [
    '每一天我都在成长',
    '我拥抱变化和挑战',
    '我的潜力是无限的',
    '我从每一次经历中学习',
    '我正在成为最好的自己',
    '我欢迎新的可能性',
    '我的未来充满希望',
    '我相信自己能够不断进步'
  ]
}

export default function AffirmationsPage() {
  const [affirmations, setAffirmations] = useState<Affirmation[]>([])
  const [dailyAffirmation, setDailyAffirmation] = useState<Affirmation | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [customText, setCustomText] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [dailyRecord, setDailyRecord] = useState<DailyAffirmation | null>(null)
  const [reflection, setReflection] = useState('')
  const [streak, setStreak] = useState(0)
  const [favorites, setFavorites] = useState<string[]>([])

  // Calculate streak - defined before loadData
  const calculateStreak = () => {
    const savedHistory = localStorage.getItem('affirmation-history')
    if (savedHistory) {
      const history = JSON.parse(savedHistory)
      let currentStreak = 0
      const today = new Date()

      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today)
        checkDate.setDate(checkDate.getDate() - i)
        const dateStr = checkDate.toDateString()

        if (history.includes(dateStr)) {
          currentStreak++
        } else if (i > 0) {
          break
        }
      }
      setStreak(currentStreak)
    }
  }

  // Pick random affirmation - defined before loadData
  const pickRandomAffirmation = (allAffirmations: Affirmation[], category: string | null = selectedCategory) => {
    const filtered = category
      ? allAffirmations.filter(a => a.category === category)
      : allAffirmations

    if (filtered.length > 0) {
      const random = filtered[Math.floor(Math.random() * filtered.length)]
      setDailyAffirmation(random)

      const daily: DailyAffirmation = {
        date: new Date().toISOString(),
        affirmationId: random.id,
        timesRead: 1,
        reflection: ''
      }
      localStorage.setItem('daily-affirmation', JSON.stringify(daily))
      setDailyRecord(daily)
    }
  }

  const loadData = () => {
    // Load affirmations
    const savedAffirmations = localStorage.getItem('affirmations')
    let allAffirmations: Affirmation[] = []

    if (savedAffirmations) {
      allAffirmations = JSON.parse(savedAffirmations)
    } else {
      // Initialize with default affirmations
      Object.entries(DEFAULT_AFFIRMATIONS).forEach(([category, texts]) => {
        texts.forEach(text => {
          allAffirmations.push({
            id: `${category}-${Date.now()}-${Math.random()}`,
            text,
            category,
            isCustom: false,
            createdAt: new Date().toISOString()
          })
        })
      })
      localStorage.setItem('affirmations', JSON.stringify(allAffirmations))
    }
    setAffirmations(allAffirmations)

    // Load daily affirmation
    const savedDaily = localStorage.getItem('daily-affirmation')
    const today = new Date().toDateString()

    if (savedDaily) {
      const daily = JSON.parse(savedDaily)
      if (new Date(daily.date).toDateString() === today) {
        const affirmation = allAffirmations.find(a => a.id === daily.affirmationId)
        if (affirmation) {
          setDailyAffirmation(affirmation)
          setDailyRecord(daily)
          setReflection(daily.reflection || '')
        }
      } else {
        // New day, pick new affirmation
        pickRandomAffirmation(allAffirmations)
      }
    } else {
      pickRandomAffirmation(allAffirmations)
    }

    // Load favorites
    const savedFavorites = localStorage.getItem('affirmation-favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }

    // Calculate streak
    calculateStreak()
  }

  useEffect(() => {
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const saveReflection = () => {
    if (!dailyRecord || !dailyAffirmation) return
    
    const updated: DailyAffirmation = {
      ...dailyRecord,
      reflection
    }
    
    localStorage.setItem('daily-affirmation', JSON.stringify(updated))
    setDailyRecord(updated)
    
    // Add to history
    const savedHistory = localStorage.getItem('affirmation-history')
    const history = savedHistory ? JSON.parse(savedHistory) : []
    const today = new Date().toDateString()
    if (!history.includes(today)) {
      history.push(today)
      localStorage.setItem('affirmation-history', JSON.stringify(history))
      calculateStreak()
    }
  }

  const addCustomAffirmation = () => {
    if (!customText.trim() || !selectedCategory) return
    
    const newAffirmation: Affirmation = {
      id: `custom-${Date.now()}`,
      text: customText.trim(),
      category: selectedCategory,
      isCustom: true,
      createdAt: new Date().toISOString()
    }
    
    const updated = [...affirmations, newAffirmation]
    setAffirmations(updated)
    localStorage.setItem('affirmations', JSON.stringify(updated))
    setCustomText('')
    setShowCreate(false)
  }

  const toggleFavorite = (id: string) => {
    let updated: string[]
    if (favorites.includes(id)) {
      updated = favorites.filter(f => f !== id)
    } else {
      updated = [...favorites, id]
    }
    setFavorites(updated)
    localStorage.setItem('affirmation-favorites', JSON.stringify(updated))
  }

  const getNewAffirmation = () => {
    pickRandomAffirmation(affirmations)
    setReflection('')
  }

  const getAffirmationsByCategory = (categoryId: string) => {
    return affirmations.filter(a => a.category === categoryId)
  }

  const getFavoriteAffirmations = () => {
    return affirmations.filter(a => favorites.includes(a.id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">✨ 每日肯定语</h1>
            <p className="text-gray-600 mt-1">用积极的语言塑造更好的自己</p>
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
            <div className="text-3xl font-bold text-violet-500">{streak}</div>
            <div className="text-sm text-gray-600">连续天数</div>
          </div>
          <div className="bg-white/80 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-fuchsia-500">{favorites.length}</div>
            <div className="text-sm text-gray-600">收藏数量</div>
          </div>
          <div className="bg-white/80 rounded-xl p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-purple-500">{affirmations.length}</div>
            <div className="text-sm text-gray-600">肯定语总数</div>
          </div>
        </div>

        {/* Daily Affirmation Card */}
        {dailyAffirmation && (
          <div className={`bg-gradient-to-r ${
            CATEGORIES.find(c => c.id === dailyAffirmation.category)?.color || 'from-purple-500 to-pink-500'
          } rounded-2xl p-8 text-white text-center shadow-xl mb-8`}>
            <div className="text-sm uppercase tracking-wider mb-4 opacity-80">
              今日肯定语 · {CATEGORIES.find(c => c.id === dailyAffirmation.category)?.name}
            </div>
            <p className="text-2xl md:text-3xl font-bold leading-relaxed mb-6">
              &ldquo;{dailyAffirmation.text}&rdquo;
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={getNewAffirmation}
                className="px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full transition"
              >
                🔄 换一条
              </button>
              <button
                onClick={() => toggleFavorite(dailyAffirmation.id)}
                className={`px-6 py-2 rounded-full transition ${
                  favorites.includes(dailyAffirmation.id)
                    ? 'bg-white text-purple-600'
                    : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                {favorites.includes(dailyAffirmation.id) ? '❤️ 已收藏' : '🤍 收藏'}
              </button>
            </div>
          </div>
        )}

        {/* Reflection */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">💭 今日感悟</h3>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="这句话让你想到了什么？写下你的感受..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100 resize-none mb-4"
          />
          <button
            onClick={saveReflection}
            className="px-6 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl hover:from-violet-600 hover:to-fuchsia-600 transition"
          >
            💾 保存感悟
          </button>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">📂 分类浏览</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className={`p-4 rounded-xl text-left transition ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-white hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="text-2xl mb-1">{category.emoji}</div>
                <div className="font-medium">{category.name}</div>
                <div className="text-sm opacity-70">
                  {getAffirmationsByCategory(category.id).length} 条
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Category Affirmations */}
        {selectedCategory && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                {CATEGORIES.find(c => c.id === selectedCategory)?.emoji}{' '}
                {CATEGORIES.find(c => c.id === selectedCategory)?.name}肯定语
              </h3>
              <button
                onClick={() => setShowCreate(true)}
                className="px-4 py-2 bg-violet-100 text-violet-600 rounded-lg hover:bg-violet-200 transition"
              >
                + 添加自定义
              </button>
            </div>
            <div className="space-y-3">
              {getAffirmationsByCategory(selectedCategory).map(affirmation => (
                <div 
                  key={affirmation.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                >
                  <p className="text-gray-700">{affirmation.text}</p>
                  <div className="flex items-center gap-2">
                    {affirmation.isCustom && (
                      <span className="text-xs bg-violet-100 text-violet-600 px-2 py-1 rounded">
                        自定义
                      </span>
                    )}
                    <button
                      onClick={() => toggleFavorite(affirmation.id)}
                      className="text-xl"
                    >
                      {favorites.includes(affirmation.id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Custom Modal */}
        {showCreate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-800 mb-4">创建自定义肯定语</h3>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="写下你的肯定语..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-100 resize-none mb-4"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                >
                  取消
                </button>
                <button
                  onClick={addCustomAffirmation}
                  disabled={!customText.trim() || !selectedCategory}
                  className="flex-1 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl hover:from-violet-600 hover:to-fuchsia-600 transition disabled:opacity-50"
                >
                  创建
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Favorites */}
        {favorites.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">❤️ 我的收藏</h3>
            <div className="space-y-3">
              {getFavoriteAffirmations().slice(0, 5).map(affirmation => (
                <div 
                  key={affirmation.id}
                  className="p-4 bg-gradient-to-r from-pink-50 to-violet-50 rounded-xl"
                >
                  <p className="text-gray-700 mb-2">{affirmation.text}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{CATEGORIES.find(c => c.id === affirmation.category)?.emoji}</span>
                    <span>{CATEGORIES.find(c => c.id === affirmation.category)?.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-white/60 rounded-xl p-6">
          <h3 className="font-bold text-gray-800 mb-2">💡 使用技巧</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 每天早晨朗读你的肯定语，让它成为一天的开始</li>
            <li>• 闭上眼睛，深呼吸，用心感受每一句话</li>
            <li>• 将肯定语写在便签上，贴在显眼的地方</li>
            <li>• 创造属于自己的肯定语，更加个性化</li>
          </ul>
        </div>
      </div>
    </div>
  )
}