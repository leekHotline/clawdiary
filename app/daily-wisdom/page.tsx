'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Wisdom {
  id: string
  quote: string
  author: string
  title: string
  category: string
  reflectionQuestions: string[]
  source: string
  era: string
}

// 历史伟人智慧库
const wisdomDatabase: Wisdom[] = [
  {
    id: 'socrates-1',
    quote: '未经审视的人生不值得过。',
    author: '苏格拉底',
    title: '古希腊哲学家',
    category: 'self-reflection',
    reflectionQuestions: [
      '今天我有哪些行为是习惯性的，没有经过思考？',
      '如果重新选择，我会做哪些不同的决定？',
      '我真正想要的生活是什么样的？',
    ],
    source: '《申辩篇》',
    era: '公元前399年',
  },
  {
    id: 'marcus-1',
    quote: '你有力量控制自己的思想——而非外界事件。认识到这一点，你就找到了力量。',
    author: '马可·奥勒留',
    title: '罗马皇帝、斯多葛派哲学家',
    category: 'stoicism',
    reflectionQuestions: [
      '今天有哪些事情超出了我的控制？我如何放下的？',
      '我是否把精力花在了可以控制的事情上？',
      '面对困难，我可以选择怎样的态度？',
    ],
    source: '《沉思录》',
    era: '公元180年',
  },
  {
    id: 'laozi-1',
    quote: '千里之行，始于足下。',
    author: '老子',
    title: '道家学派创始人',
    category: 'action',
    reflectionQuestions: [
      '我一直在拖延的大目标是什么？',
      '今天我可以迈出的最小一步是什么？',
      '我是否把目标想得太遥远而忘了开始？',
    ],
    source: '《道德经》',
    era: '公元前6世纪',
  },
  {
    id: 'nietzsche-1',
    quote: '那些杀不死我的，会让我更强大。',
    author: '尼采',
    title: '德国哲学家',
    category: 'resilience',
    reflectionQuestions: [
      '我经历过的最大困难是什么？它给我带来了什么成长？',
      '现在面对的挑战，未来会如何成为我的力量？',
      '我从失败中学到了什么？',
    ],
    source: '《偶像的黄昏》',
    era: '1888年',
  },
  {
    id: 'confucius-1',
    quote: '三人行，必有我师焉。择其善者而从之，其不善者而改之。',
    author: '孔子',
    title: '儒家学派创始人',
    category: 'learning',
    reflectionQuestions: [
      '今天我遇见的人中，谁值得我学习？',
      '我看到了哪些行为值得借鉴？哪些要避免？',
      '我如何把向他人学习变成日常习惯？',
    ],
    source: '《论语》',
    era: '公元前5世纪',
  },
  {
    id: 'seneca-1',
    quote: '生命并非短暂，而是我们浪费了太多时间。',
    author: '塞内卡',
    title: '罗马哲学家、政治家',
    category: 'time',
    reflectionQuestions: [
      '今天我把时间花在了哪些不重要的事情上？',
      '如果只能做一件事，什么是最重要的？',
      '我是否活在当下，还是在担忧未来或后悔过去？',
    ],
    source: '《论生命之短暂》',
    era: '公元49年',
  },
  {
    id: 'darwin-1',
    quote: '存活下来的不是最强壮的物种，也不是最聪明的，而是最能适应变化的。',
    author: '达尔文',
    title: '英国生物学家',
    category: 'adaptation',
    reflectionQuestions: [
      '最近我的生活发生了哪些变化？我是如何适应的？',
      '我可以更加灵活地面对什么？',
      '变化中我发现了什么新机会？',
    ],
    source: '《物种起源》',
    era: '1859年',
  },
  {
    id: 'jordan-1',
    quote: '把你每天做的事情和别人分享，你的行为自然就会变得更好。',
    author: '乔丹·彼得森',
    title: '加拿大心理学家',
    category: 'accountability',
    reflectionQuestions: [
      '我今天做的事情，愿意让别人知道吗？',
      '我是否对自己诚实？',
      '如何让自己的行为更值得分享？',
    ],
    source: '《12 Rules for Life》',
    era: '2018年',
  },
  {
    id: 'jobs-1',
    quote: '你不能预见未来并将点滴串联起来；你只能在回顾过去时将它们串联。所以你要相信这些点滴会在未来以某种方式串联起来。',
    author: '史蒂夫·乔布斯',
    title: '苹果公司创始人',
    category: 'trust',
    reflectionQuestions: [
      '回顾过去，哪些看似不相关的经历串联成了现在？',
      '我现在在做的点点滴滴，未来可能如何串联？',
      '我是否相信自己的选择会通向正确的地方？',
    ],
    source: '斯坦福大学毕业演讲',
    era: '2005年',
  },
  {
    id: 'frankl-1',
    quote: '人可以被剥夺一切，但无法被剥夺最后的自由——选择自己的态度。',
    author: '维克多·弗兰克尔',
    title: '奥地利心理学家、奥斯威辛幸存者',
    category: 'freedom',
    reflectionQuestions: [
      '在最困难的情况下，我还能选择什么态度？',
      '今天有什么是我可以掌控的？',
      '苦难给我带来了什么意义？',
    ],
    source: '《活出意义来》',
    era: '1946年',
  },
  {
    id: 'plato-1',
    quote: '我们很容易原谅一个害怕的孩子，但真正的悲剧是，人们因为害怕而不敢行动。',
    author: '柏拉图',
    title: '古希腊哲学家',
    category: 'courage',
    reflectionQuestions: [
      '我因为害怕而没有做什么？',
      '如果不再害怕，我会做什么？',
      '恐惧背后真正担心的是什么？',
    ],
    source: '《理想国》',
    era: '公元前375年',
  },
  {
    id: 'emerson-1',
    quote: '不要走平坦的路，要去没有路的地方，留下一条小径。',
    author: '爱默生',
    title: '美国散文家、诗人',
    category: 'creativity',
    reflectionQuestions: [
      '我是否总是在走别人走过的路？',
      '我有什么独特的想法或方法？',
      '今天我可以尝试什么新事物？',
    ],
    source: '散文集',
    era: '1841年',
  },
  {
    id: 'epictetus-1',
    quote: '人不是被事物本身困扰，而是被他们对事物的看法困扰。',
    author: '爱比克泰德',
    title: '希腊斯多葛派哲学家',
    category: 'perception',
    reflectionQuestions: [
      '今天有什么让我困扰的事情？我如何看待它？',
      '如果换一个角度，这件事情会变成什么样？',
      '我可以改变哪些看法来减少困扰？',
    ],
    source: '《手册》',
    era: '公元125年',
  },
  {
    id: 'thoreau-1',
    quote: '我进入森林是因为我想有目的地生活，只面对生活的基本事实。',
    author: '梭罗',
    title: '美国作家、哲学家',
    category: 'simplicity',
    reflectionQuestions: [
      '我的生活中哪些是真正重要的？哪些是多余的？',
      '我可以简化什么来专注于本质？',
      '我上次有目的地生活是什么时候？',
    ],
    source: '《瓦尔登湖》',
    era: '1854年',
  },
  {
    id: 'rinpoche-1',
    quote: '每天都要提醒自己：我是凡人，生命的终点是死亡。这样才能真正地活着。',
    author: '索甲仁波切',
    title: '藏传佛教导师',
    category: 'mortality',
    reflectionQuestions: [
      '如果今天是生命的最后一天，我会做什么？',
      '我是否把时间花在了真正重要的事情上？',
      '什么是我一直想做却一直在推迟的？',
    ],
    source: '《西藏生死书》',
    era: '1992年',
  },
]

const categoryEmojis: Record<string, string> = {
  'self-reflection': '🪞',
  'stoicism': '🏛️',
  'action': '🚀',
  'resilience': '💪',
  'learning': '📚',
  'time': '⏰',
  'adaptation': '🌊',
  'accountability': '🤝',
  'trust': '✨',
  'freedom': '🕊️',
  'courage': '🦁',
  'creativity': '🎨',
  'perception': '👁️',
  'simplicity': '🌿',
  'mortality': '🌅',
}

const categoryNames: Record<string, string> = {
  'self-reflection': '自我反思',
  'stoicism': '斯多葛哲学',
  'action': '行动',
  'resilience': '韧性',
  'learning': '学习',
  'time': '时间',
  'adaptation': '适应',
  'accountability': '责任',
  'trust': '信任',
  'freedom': '自由',
  'courage': '勇气',
  'creativity': '创造力',
  'perception': '认知',
  'simplicity': '简单',
  'mortality': '生命',
}

export default function DailyWisdomPage() {
  const [todayWisdom, setTodayWisdom] = useState<Wisdom | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])
  const [showAll, setShowAll] = useState(false)
  const [copied, setCopied] = useState(false)
  const [reflectionInput, setReflectionInput] = useState('')
  const [activeQuestion, setActiveQuestion] = useState(0)

  // 基于日期生成每日智慧
  useEffect(() => {
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    const wisdomIndex = dayOfYear % wisdomDatabase.length
    setTodayWisdom(wisdomDatabase[wisdomIndex])

    // 加载收藏
    const savedFavorites = localStorage.getItem('wisdom-favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(f => f !== id)
      : [...favorites, id]
    setFavorites(newFavorites)
    localStorage.setItem('wisdom-favorites', JSON.stringify(newFavorites))
  }

  const copyWisdom = async (wisdom: Wisdom) => {
    const text = `"${wisdom.quote}"\n—— ${wisdom.author}《${wisdom.source}》`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const startDiaryWithWisdom = (wisdom: Wisdom) => {
    const prompt = `今日智慧启发：\n\n"${wisdom.quote}"\n—— ${wisdom.author}\n\n反思问题：${wisdom.reflectionQuestions[activeQuestion]}\n\n我的思考：`
    return `/chat-diary?prompt=${encodeURIComponent(prompt)}`
  }

  const getRandomWisdom = () => {
    const randomIndex = Math.floor(Math.random() * wisdomDatabase.length)
    setTodayWisdom(wisdomDatabase[randomIndex])
  }

  if (!todayWisdom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-2xl animate-pulse">加载智慧中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-orange-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-yellow-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl">💡</span>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              每日智慧
            </h1>
          </div>
          <p className="text-gray-500 max-w-md mx-auto">
            每天一条历史伟人的智慧语录，配套反思问题，启发深度思考
          </p>
        </div>

        {/* 今日智慧卡片 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden mb-8">
          {/* 类别标签 */}
          <div className="px-6 pt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{categoryEmojis[todayWisdom.category]}</span>
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                {categoryNames[todayWisdom.category]}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{todayWisdom.era}</span>
              <button
                onClick={() => toggleFavorite(todayWisdom.id)}
                className={`text-2xl transition-transform hover:scale-110 ${
                  favorites.includes(todayWisdom.id) ? 'text-red-500' : 'text-gray-300'
                }`}
              >
                {favorites.includes(todayWisdom.id) ? '❤️' : '🤍'}
              </button>
            </div>
          </div>

          {/* 语录 */}
          <div className="px-8 py-6">
            <div className="text-6xl text-amber-200 font-serif leading-none mb-4">"</div>
            <p className="text-2xl font-serif text-gray-800 leading-relaxed mb-6">
              {todayWisdom.quote}
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold">
                {todayWisdom.author[0]}
              </div>
              <div>
                <div className="font-bold text-gray-800">{todayWisdom.author}</div>
                <div className="text-sm text-gray-500">{todayWisdom.title} · 《{todayWisdom.source}》</div>
              </div>
            </div>
          </div>

          {/* 反思问题 */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-8 py-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🤔</span>
              <span className="font-medium text-gray-700">反思问题</span>
            </div>
            
            {/* 问题选择 */}
            <div className="flex gap-2 mb-4">
              {todayWisdom.reflectionQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveQuestion(index)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    activeQuestion === index
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                      : 'bg-white text-gray-500 hover:bg-amber-100'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {/* 当前问题 */}
            <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <p className="text-gray-700">{todayWisdom.reflectionQuestions[activeQuestion]}</p>
            </div>

            {/* 我的反思输入 */}
            <textarea
              value={reflectionInput}
              onChange={(e) => setReflectionInput(e.target.value)}
              placeholder="在这里写下你的思考..."
              className="w-full px-4 py-3 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-300 bg-white/80 resize-none"
              rows={3}
            />
          </div>

          {/* 操作按钮 */}
          <div className="px-6 py-4 bg-white/50 flex flex-wrap gap-3 justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => copyWisdom(todayWisdom)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  copied
                    ? 'bg-green-100 text-green-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {copied ? '✅ 已复制' : '📋 复制语录'}
              </button>
              <button
                onClick={getRandomWisdom}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all"
              >
                🎲 换一条
              </button>
            </div>
            <Link
              href={startDiaryWithWisdom(todayWisdom)}
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
            >
              <span>🦞</span>
              <span>写入日记</span>
            </Link>
          </div>
        </div>

        {/* 收藏的智慧 */}
        {favorites.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>❤️</span>
              <span>我收藏的智慧</span>
              <span className="text-sm text-gray-400">({favorites.length})</span>
            </h2>
            <div className="grid gap-3">
              {favorites.map(id => {
                const wisdom = wisdomDatabase.find(w => w.id === id)
                if (!wisdom) return null
                return (
                  <div
                    key={id}
                    className="bg-white/70 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between hover:bg-white/90 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{categoryEmojis[wisdom.category]}</span>
                      <div>
                        <p className="text-gray-800 font-medium text-sm line-clamp-1">
                          "{wisdom.quote}"
                        </p>
                        <p className="text-xs text-gray-500">—— {wisdom.author}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setTodayWisdom(wisdom)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="text-amber-500 text-sm hover:underline"
                    >
                      查看
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 所有智慧库 */}
        <div className="mb-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className="w-full py-3 bg-white/70 backdrop-blur-sm rounded-xl text-gray-600 font-medium hover:bg-white transition-all flex items-center justify-center gap-2"
          >
            <span>📚</span>
            <span>{showAll ? '收起智慧库' : '浏览完整智慧库'}</span>
            <span>{showAll ? '▲' : '▼'}</span>
          </button>

          {showAll && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {wisdomDatabase.map((wisdom) => (
                <div
                  key={wisdom.id}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-4 hover:bg-white/90 transition-all cursor-pointer border border-transparent hover:border-amber-200"
                  onClick={() => {
                    setTodayWisdom(wisdom)
                    setActiveQuestion(0)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{categoryEmojis[wisdom.category]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 font-medium line-clamp-2 mb-1">
                        "{wisdom.quote}"
                      </p>
                      <p className="text-xs text-gray-500">
                        {wisdom.author} · {categoryNames[wisdom.category]}
                      </p>
                    </div>
                    {favorites.includes(wisdom.id) && (
                      <span className="text-red-500">❤️</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 统计 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">{wisdomDatabase.length}</div>
            <div className="text-sm text-gray-500">智慧语录</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{Object.keys(categoryNames).length}</div>
            <div className="text-sm text-gray-500">主题分类</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-500">{favorites.length}</div>
            <div className="text-sm text-gray-500">已收藏</div>
          </div>
        </div>

        {/* 底部 CTA */}
        <div className="text-center">
          <p className="text-gray-500 mb-4">每天来获取新的智慧灵感 ✨</p>
          <div className="flex justify-center gap-4">
            <Link
              href="/prompts"
              className="px-6 py-3 bg-white/70 text-gray-600 rounded-xl font-medium hover:bg-white transition-all"
            >
              📋 更多提示词
            </Link>
            <Link
              href="/chat-diary"
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              🦞 开始写日记
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}