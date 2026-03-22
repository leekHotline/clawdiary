'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface BlindBox {
  id: string
  emoji: string
  name: string
  color: string
  description: string
}

const blindBoxes: BlindBox[] = [
  {
    id: 'memory',
    emoji: '🎁',
    name: '回忆盲盒',
    color: 'from-pink-500 to-rose-500',
    description: '随机抽取过去的一篇日记，重新发现遗忘的记忆',
  },
  {
    id: 'emotion',
    emoji: '💝',
    name: '情绪盲盒',
    color: 'from-purple-500 to-indigo-500',
    description: '抽取一个情绪主题，找到相关的日记片段',
  },
  {
    id: 'wisdom',
    emoji: '✨',
    name: '智慧盲盒',
    color: 'from-amber-500 to-orange-500',
    description: '从日记中提取的金句和感悟',
  },
  {
    id: 'question',
    emoji: '❓',
    name: '问题盲盒',
    color: 'from-cyan-500 to-blue-500',
    description: '一个有趣的问题，激发今天的写作灵感',
  },
  {
    id: 'challenge',
    emoji: '🎯',
    name: '挑战盲盒',
    color: 'from-green-500 to-emerald-500',
    description: '一个今日小挑战，让日记更有趣',
  },
]

// 模拟日记数据
const mockDiaries = [
  {
    id: 1,
    date: '2026-03-20',
    title: '春分时节',
    content: '今天是春分，阳光特别好。早上起来看到了窗外的樱花开了，粉色的花瓣随风飘落。突然想到，春天代表着新的开始...',
    tags: ['春天', '心情', '感悟'],
    mood: '😊',
  },
  {
    id: 2,
    date: '2026-03-18',
    title: '一次有趣的对话',
    content: '和朋友聊了很久，发现很多时候我们都在追求外在的认可，却忘了内心的平静才是最重要的。这次对话让我重新思考了生活的意义...',
    tags: ['对话', '思考', '友谊'],
    mood: '🤔',
  },
  {
    id: 3,
    date: '2026-03-15',
    title: '阅读《小王子》有感',
    content: '重读《小王子》，那句话又让我感动了："真正重要的东西，用眼睛是看不见的，只有用心才能看清楚。"...',
    tags: ['阅读', '感悟', '成长'],
    mood: '📖',
  },
  {
    id: 4,
    date: '2026-03-10',
    title: '学会放下',
    content: '今天学会了接受不完美。有些事情，不是努力就能改变的，学会放下反而是一种智慧...',
    tags: ['成长', '放下', '智慧'],
    mood: '🧘',
  },
  {
    id: 5,
    date: '2026-03-05',
    title: '一个小小的成功',
    content: '完成了一个困扰我两周的项目，那种如释重负的感觉真好。原来只要坚持，困难总会过去的...',
    tags: ['成就', '坚持', '工作'],
    mood: '🎉',
  },
]

// 模拟情绪数据
const emotionData = [
  { emotion: '快乐', emoji: '😊', diaries: mockDiaries.filter(d => d.mood === '😊' || d.mood === '🎉') },
  { emotion: '思考', emoji: '🤔', diaries: mockDiaries.filter(d => d.mood === '🤔' || d.mood === '📖') },
  { emotion: '平静', emoji: '🧘', diaries: mockDiaries.filter(d => d.mood === '🧘') },
]

// 智慧金句
const wisdomQuotes = [
  { quote: '真正的强大，不是从不受伤，而是受伤后依然选择相信美好。', source: '2026-03-10 日记' },
  { quote: '春天不会因为冬天的漫长而迟到，生活也是如此。', source: '2026-03-20 日记' },
  { quote: '学会接受不完美，是一种更高级的完美主义。', source: '2026-03-15 日记' },
  { quote: '有时候，最勇敢的决定是选择放下。', source: '2026-03-10 日记' },
  { quote: '时间会告诉我们，什么才是真正重要的。', source: '2026-03-18 日记' },
]

// 问题库
const questionBank = [
  { question: '如果给今天的自己打分，你会打几分？为什么？', category: '自省' },
  { question: '最近让你感到感激的一件小事是什么？', category: '感恩' },
  { question: '如果明天是世界末日，今天你最想做什么？', category: '想象' },
  { question: '描述一个让你感到温暖的瞬间。', category: '回忆' },
  { question: '你最想对一年前的自己说什么？', category: '成长' },
  { question: '如果可以拥有一个超能力，你会选择什么？', category: '想象' },
  { question: '今天有什么让你意外的事情吗？', category: '日常' },
  { question: '描述一下你理想中的一天。', category: '愿景' },
]

// 挑战库
const challengeBank = [
  { challenge: '写下今天发生的3件好事，无论多小', emoji: '🙏', difficulty: '简单' },
  { challenge: '用100字描述你看到的某个人的善意', emoji: '👀', difficulty: '简单' },
  { challenge: '写一封信给未来的自己', emoji: '📬', difficulty: '中等' },
  { challenge: '尝试用诗句或歌词描述今天的心情', emoji: '🎵', difficulty: '中等' },
  { challenge: '记录一个你一直想做但还没做的事情', emoji: '🎯', difficulty: '简单' },
  { challenge: '写下你对某个决定的反思', emoji: '💭', difficulty: '中等' },
]

export default function DiaryBlindBoxPage() {
  const [selectedBox, setSelectedBox] = useState<BlindBox | null>(null)
  const [isOpening, setIsOpening] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  const openBox = async (box: BlindBox) => {
    setSelectedBox(box)
    setIsOpening(true)
    setResult(null)
    
    // 开箱动画
    await new Promise(resolve => setTimeout(resolve, 1200))
    
    let boxResult: { type: string; data: any; message: string }
    
    try {
      // 尝试从API获取真实数据
      if (box.id === 'memory' || box.id === 'wisdom') {
        const res = await fetch(`/api/diary-blindbox?type=${box.id === 'memory' ? 'random' : 'wisdom'}`)
        if (res.ok) {
          boxResult = await res.json()
        } else {
          // 降级到本地数据
          boxResult = generateResult(box)
        }
      } else {
        // 其他类型使用本地数据
        boxResult = generateResult(box)
      }
    } catch {
      // 网络错误时使用本地数据
      boxResult = generateResult(box)
    }
    
    setResult(boxResult)
    setIsOpening(false)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 2000)
  }
  
  // 生成盲盒结果
  const generateResult = (box: BlindBox): { type: string; data: any; message: string } => {
    switch (box.id) {
      case 'memory':
        const randomDiary = mockDiaries[Math.floor(Math.random() * mockDiaries.length)]
        return {
          type: 'diary',
          data: randomDiary,
          message: `回忆起 ${randomDiary.date} 的那天...`,
        }
      case 'emotion':
        const randomEmotion = emotionData[Math.floor(Math.random() * emotionData.length)]
        return {
          type: 'emotion',
          data: randomEmotion,
          message: `发现「${randomEmotion.emotion}」时刻`,
        }
      case 'wisdom':
        const randomWisdom = wisdomQuotes[Math.floor(Math.random() * wisdomQuotes.length)]
        return {
          type: 'wisdom',
          data: randomWisdom,
          message: '提取到一条智慧金句',
        }
      case 'question':
        const randomQuestion = questionBank[Math.floor(Math.random() * questionBank.length)]
        return {
          type: 'question',
          data: randomQuestion,
          message: '今天的问题来啦',
        }
      case 'challenge':
        const randomChallenge = challengeBank[Math.floor(Math.random() * challengeBank.length)]
        return {
          type: 'challenge',
          data: randomChallenge,
          message: '接受今天的挑战？',
        }
      default:
        const defaultDiary = mockDiaries[0]
        return {
          type: 'diary',
          data: defaultDiary,
          message: `回忆起 ${defaultDiary.date} 的那天...`,
        }
    }
  }

  const reset = () => {
    setSelectedBox(null)
    setResult(null)
    setShowConfetti(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-16 w-56 h-56 bg-pink-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-orange-200/30 rounded-full blur-3xl" />
      </div>

      {/* 礼花效果 */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            >
              <span className="text-2xl">
                {['🎉', '✨', '🌟', '💫', '🎁'][Math.floor(Math.random() * 5)]}
              </span>
            </div>
          ))}
        </div>
      )}

      <main className="relative max-w-2xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-purple-600 mb-4 inline-block">
            ← 返回首页
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🎁</span>
            <h1 className="text-3xl font-bold text-gray-800">日记盲盒</h1>
          </div>
          <p className="text-gray-500">
            每一次打开都是惊喜，发现日记中隐藏的宝藏
          </p>
        </div>

        {/* 主内容区 */}
        {!selectedBox ? (
          /* 选择盲盒 */
          <div className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-gray-500 text-sm">选择一个盲盒开启</p>
            </div>

            <div className="grid gap-4">
              {blindBoxes.map((box) => (
                <button
                  key={box.id}
                  onClick={() => openBox(box)}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all border border-white/50 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${box.color} flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform`}>
                      {box.emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-lg mb-1">
                        {box.name}
                        <span className="ml-2 text-sm text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          点击开启 →
                        </span>
                      </h3>
                      <p className="text-sm text-gray-500">{box.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* 今日统计 */}
            <div className="mt-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-600">今日已开启</span>
                <span className="font-bold text-purple-700">0 次</span>
              </div>
              <p className="text-xs text-purple-500 mt-2">
                每天可以无限次开启盲盒，发现更多惊喜 ✨
              </p>
            </div>
          </div>
        ) : isOpening ? (
          /* 开箱动画 */
          <div className="flex flex-col items-center justify-center py-20">
            <div className={`w-32 h-32 rounded-3xl bg-gradient-to-br ${selectedBox.color} flex items-center justify-center text-6xl shadow-2xl animate-pulse`}>
              {selectedBox.emoji}
            </div>
            <p className="mt-6 text-gray-600 animate-pulse">正在开启盲盒...</p>
          </div>
        ) : result ? (
          /* 结果展示 */
          <div className="space-y-6">
            {/* 盲盒标题 */}
            <div className={`bg-gradient-to-r ${selectedBox.color} rounded-2xl p-6 text-white shadow-lg`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{selectedBox.emoji}</span>
                <h2 className="text-xl font-bold">{selectedBox.name}</h2>
              </div>
              <p className="text-white/90">{result.message}</p>
            </div>

            {/* 结果内容 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
              {result.type === 'diary' && (
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                    <span>{result.data.date}</span>
                    <span>·</span>
                    <span className="text-2xl">{result.data.mood}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{result.data.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">{result.data.content}</p>
                  <div className="flex gap-2 flex-wrap">
                    {result.data.tags.map((tag: string) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link
                      href={`/diary/${result.data.id}`}
                      className="text-sm text-purple-600 hover:text-purple-700"
                    >
                      查看完整日记 →
                    </Link>
                  </div>
                </div>
              )}

              {result.type === 'emotion' && (
                <div className="p-6 text-center">
                  <div className="text-6xl mb-4">{result.data.emoji}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{result.data.emotion}</h3>
                  <p className="text-gray-500 mb-6">发现 {result.data.diaries.length} 篇相关日记</p>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-2">最近一篇：</p>
                    <p className="text-gray-700">{result.data.diaries[0]?.title}</p>
                  </div>
                </div>
              )}

              {result.type === 'wisdom' && (
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">✨</span>
                    <span className="text-sm text-gray-400">从日记中提取</span>
                  </div>
                  <blockquote className="text-xl text-gray-800 leading-relaxed mb-4 italic">
                    "{result.data.quote}"
                  </blockquote>
                  <p className="text-sm text-gray-400">— {result.data.source}</p>
                </div>
              )}

              {result.type === 'question' && (
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-600 rounded">
                      {result.data.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 leading-relaxed">
                    {result.data.question}
                  </h3>
                  <div className="mt-6">
                    <Link
                      href="/chat-diary"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      开始写日记回答 →
                    </Link>
                  </div>
                </div>
              )}

              {result.type === 'challenge' && (
                <div className="p-6 text-center">
                  <div className="text-5xl mb-4">{result.data.emoji}</div>
                  <span className="inline-block text-xs px-3 py-1 bg-green-100 text-green-600 rounded-full mb-4">
                    难度：{result.data.difficulty}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mb-6">{result.data.challenge}</h3>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        // 标记接受挑战
                        alert('挑战已接受！完成后来这里打卡吧 ✅')
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                      接受挑战 ✅
                    </button>
                    <button
                      onClick={reset}
                      className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50"
                    >
                      换一个
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <button
                onClick={() => openBox(selectedBox)}
                className="flex-1 py-3 border border-purple-200 text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition-colors"
              >
                再开一次
              </button>
              <button
                onClick={reset}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                选择其他盲盒
              </button>
            </div>
          </div>
        ) : null}

        {/* 底部说明 */}
        <div className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/50">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>💡</span> 关于日记盲盒
          </h3>
          <ul className="text-sm text-gray-500 space-y-2">
            <li>• 回忆盲盒：随机抽取过去的日记，重新发现遗忘的美好</li>
            <li>• 情绪盲盒：按情绪分类浏览，找到相似心情的时刻</li>
            <li>• 智慧盲盒：从日记中提取的金句和感悟</li>
            <li>• 问题盲盒：有趣的问题激发写作灵感</li>
            <li>• 挑战盲盒：小挑战让日记更有趣</li>
          </ul>
        </div>
      </main>
    </div>
  )
}