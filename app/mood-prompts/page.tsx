'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Mood {
  id: string
  name: string
  emoji: string
  color: string
  bgColor: string
  description: string
  prompts: string[]
}

const moods: Mood[] = [
  {
    id: 'happy',
    name: '开心',
    emoji: '😊',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    description: '心情愉悦，充满正能量',
    prompts: [
      '今天发生了什么让你开心的事？',
      '这种快乐的感觉来自哪里？',
      '你想和谁分享这份快乐？',
      '如何让这种状态持续更久？',
      '记录下这个时刻，未来回顾会很美好',
    ],
  },
  {
    id: 'calm',
    name: '平静',
    emoji: '😌',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    description: '内心安宁，享受当下',
    prompts: [
      '此刻你在想什么？',
      '周围有什么美好的事物？',
      '深呼吸，感受空气的流动',
      '简单描述你现在的环境',
      '这种平静的感觉有什么特别之处？',
    ],
  },
  {
    id: 'anxious',
    name: '焦虑',
    emoji: '😰',
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    description: '感到担忧或紧张',
    prompts: [
      '你现在最担心的是什么？',
      '这些担心有多少是真正会发生的？',
      '写下三件你能控制的事',
      '深呼吸，问自己：一年后这件事还重要吗？',
      '把焦虑写出来，让它们离开你的脑海',
    ],
  },
  {
    id: 'sad',
    name: '难过',
    emoji: '😢',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    description: '心情低落，需要释放',
    prompts: [
      '是什么让你感到难过？',
      '允许自己感受这份情绪',
      '写下你想对某人或某事说的话',
      '这段经历教会了你什么？',
      '什么能让你稍微好一点？',
    ],
  },
  {
    id: 'angry',
    name: '愤怒',
    emoji: '😤',
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    description: '感到生气或不公',
    prompts: [
      '是什么触发了你的愤怒？',
      '愤怒背后，你真正想要的是什么？',
      '写下你想发泄的话，然后撕掉它',
      '这件事中有多少是你的责任？',
      '如何以建设性的方式表达？',
    ],
  },
  {
    id: 'tired',
    name: '疲惫',
    emoji: '😩',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    description: '身心俱疲，需要休息',
    prompts: [
      '是什么让你感到疲惫？',
      '你的身体在告诉你什么？',
      '今天有没有给自己足够的休息？',
      '写下三件可以减少负担的事',
      '列出明天可以跳过的事',
    ],
  },
  {
    id: 'grateful',
    name: '感恩',
    emoji: '🙏',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    description: '心存感激，珍惜当下',
    prompts: [
      '今天你最感恩的三件事是什么？',
      '谁是最近帮助过你的人？',
      '什么小事让你感到温暖？',
      '写下对某人的感谢，也许可以发给他们',
      '回顾这一天，哪个瞬间让你觉得"真好"？',
    ],
  },
  {
    id: 'confused',
    name: '迷茫',
    emoji: '🤔',
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    description: '不确定方向，需要清晰',
    prompts: [
      '你现在最大的困惑是什么？',
      '如果只能选一个方向，你会选什么？',
      '谁可以给你建议或启发？',
      '一年后，你希望自己在做什么？',
      '写下所有选项，然后划掉不重要的',
    ],
  },
  {
    id: 'hopeful',
    name: '期待',
    emoji: '🌟',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    description: '对未来充满希望',
    prompts: [
      '你最期待的是什么？',
      '想象它已经实现，那是什么样子？',
      '接下来的一小步是什么？',
      '写下你的愿望清单',
      '谁可以和你一起期待这件事？',
    ],
  },
  {
    id: 'creative',
    name: '创意',
    emoji: '🎨',
    color: 'text-pink-600',
    bgColor: 'bg-pink-100',
    description: '灵感涌现，想要创作',
    prompts: [
      '现在有什么想法想记录下来？',
      '如果没有任何限制，你想创造什么？',
      '最近什么激发了你的灵感？',
      '用三个比喻描述你现在的心情',
      '写下天马行空的想法，不要评判',
    ],
  },
  {
    id: 'lonely',
    name: '孤独',
    emoji: '🌑',
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
    description: '感到孤独，需要连接',
    prompts: [
      '孤独是什么感觉？描述它',
      '你真正渴望的是什么？',
      '写下你怀念的人或事',
      '独处和孤独有什么不同？',
      '你可以和谁建立连接？',
    ],
  },
  {
    id: 'proud',
    name: '自豪',
    emoji: '💪',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
    description: '成就感满满',
    prompts: [
      '今天你做成了什么？',
      '这个成就来之不易的地方在哪？',
      '谁帮助了你？你想感谢谁？',
      '这是你以前无法想象能做到的吗？',
      '下一个目标是什么？',
    ],
  },
]

// 混合情绪提示
const mixedPrompts = [
  '情绪是复杂的，你现在同时感受到哪些情绪？',
  '这些情绪之间有什么联系？',
  '每种情绪想告诉你什么？',
  '允许自己同时拥有多种感受',
  '把这些情绪画出来或写出来',
]

export default function MoodPromptsPage() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0)
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])
  const [isMixedMode, setIsMixedMode] = useState(false)
  const [journalContent, setJournalContent] = useState('')

  const toggleMoodSelection = (moodId: string) => {
    if (selectedMoods.includes(moodId)) {
      setSelectedMoods(selectedMoods.filter(id => id !== moodId))
    } else {
      if (selectedMoods.length < 3) {
        setSelectedMoods([...selectedMoods, moodId])
      }
    }
  }

  const getMixedModePrompts = () => {
    const prompts: string[] = []
    selectedMoods.forEach(moodId => {
      const mood = moods.find(m => m.id === moodId)
      if (mood) {
        const randomPrompts = [...mood.prompts].sort(() => Math.random() - 0.5).slice(0, 2)
        prompts.push(...randomPrompts)
      }
    })
    prompts.push(...mixedPrompts.sort(() => Math.random() - 0.5).slice(0, 2))
    return prompts
  }

  const nextPrompt = () => {
    if (selectedMood) {
      setCurrentPromptIndex((prev) => (prev + 1) % selectedMood.prompts.length)
    }
  }

  const prevPrompt = () => {
    if (selectedMood) {
      setCurrentPromptIndex((prev) => (prev - 1 + selectedMood.prompts.length) % selectedMood.prompts.length)
    }
  }

  const startDiaryWithPrompt = () => {
    const mood = selectedMood
    if (!mood) return ''
    const prompt = isMixedMode
      ? getMixedModePrompts().join('\n\n')
      : mood.prompts[currentPromptIndex]
    return `/chat-diary?prompt=${encodeURIComponent(`【${mood.emoji} ${mood.name}模式】\n\n${prompt}\n\n我的记录：`)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-fuchsia-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-violet-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl">🎭</span>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              情绪日记提示
            </h1>
          </div>
          <p className="text-gray-500 max-w-md mx-auto">
            选择你现在的情绪，获取专属日记提示，让写作更有针对性
          </p>
        </div>

        {/* 模式切换 */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => {
              setIsMixedMode(false)
              setSelectedMoods([])
              setSelectedMood(null)
            }}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              !isMixedMode
                ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-lg'
                : 'bg-white/70 text-gray-600 hover:bg-white'
            }`}
          >
            单一情绪
          </button>
          <button
            onClick={() => {
              setIsMixedMode(true)
              setSelectedMood(null)
              setSelectedMoods([])
            }}
            className={`px-4 py-2 rounded-xl font-medium transition-all ${
              isMixedMode
                ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-lg'
                : 'bg-white/70 text-gray-600 hover:bg-white'
            }`}
          >
            混合情绪
          </button>
        </div>

        {/* 情绪选择 */}
        {!isMixedMode ? (
          // 单一情绪模式
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-700 mb-4 text-center">你现在感觉怎样？</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => {
                    setSelectedMood(mood)
                    setCurrentPromptIndex(0)
                  }}
                  className={`p-4 rounded-2xl transition-all ${
                    selectedMood?.id === mood.id
                      ? `${mood.bgColor} ring-2 ring-offset-2 ring-violet-400 scale-105 shadow-lg`
                      : 'bg-white/70 hover:bg-white hover:shadow-md'
                  }`}
                >
                  <div className="text-3xl mb-2">{mood.emoji}</div>
                  <div className={`font-medium ${selectedMood?.id === mood.id ? mood.color : 'text-gray-700'}`}>
                    {mood.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // 混合情绪模式
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-700 mb-4 text-center">
              选择你此刻的情绪（最多3个）
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => toggleMoodSelection(mood.id)}
                  className={`p-4 rounded-2xl transition-all ${
                    selectedMoods.includes(mood.id)
                      ? `${mood.bgColor} ring-2 ring-offset-2 ring-violet-400 scale-105 shadow-lg`
                      : selectedMoods.length >= 3
                      ? 'bg-gray-100 opacity-50 cursor-not-allowed'
                      : 'bg-white/70 hover:bg-white hover:shadow-md'
                  }`}
                  disabled={selectedMoods.length >= 3 && !selectedMoods.includes(mood.id)}
                >
                  <div className="text-3xl mb-2">{mood.emoji}</div>
                  <div className={`font-medium ${selectedMoods.includes(mood.id) ? mood.color : 'text-gray-700'}`}>
                    {mood.name}
                  </div>
                </button>
              ))}
            </div>
            {selectedMoods.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                {selectedMoods.map(moodId => {
                  const mood = moods.find(m => m.id === moodId)!
                  return (
                    <span
                      key={moodId}
                      className={`px-3 py-1 ${mood.bgColor} ${mood.color} rounded-full text-sm font-medium`}
                    >
                      {mood.emoji} {mood.name}
                    </span>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* 提示卡片 */}
        {(selectedMood || (isMixedMode && selectedMoods.length > 0)) && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden mb-8">
            {/* 情绪信息 */}
            <div className={`${isMixedMode ? 'bg-gradient-to-r from-violet-100 to-pink-100' : selectedMood?.bgColor} px-6 py-4`}>
              <div className="flex items-center gap-3">
                <div className="text-4xl">
                  {isMixedMode ? '🎭' : selectedMood?.emoji}
                </div>
                <div>
                  <div className={`font-bold text-lg ${isMixedMode ? 'text-violet-700' : selectedMood?.color}`}>
                    {isMixedMode ? '混合情绪' : selectedMood?.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {isMixedMode
                      ? selectedMoods.map(id => moods.find(m => m.id === id)?.name).join(' + ')
                      : selectedMood?.description}
                  </div>
                </div>
              </div>
            </div>

            {/* 提示内容 */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">✨</span>
                <span className="font-medium text-gray-700">日记提示</span>
              </div>

              {!isMixedMode && selectedMood ? (
                <>
                  {/* 单一情绪提示导航 */}
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={prevPrompt}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
                    >
                      ←
                    </button>
                    <div className="flex gap-1">
                      {selectedMood.prompts.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentPromptIndex ? 'bg-violet-500 w-4' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={nextPrompt}
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all"
                    >
                      →
                    </button>
                  </div>

                  {/* 当前提示 */}
                  <div className="bg-gradient-to-r from-violet-50 to-pink-50 rounded-xl p-5 mb-4">
                    <p className="text-lg text-gray-700 leading-relaxed">
                      {selectedMood.prompts[currentPromptIndex]}
                    </p>
                  </div>
                </>
              ) : (
                // 混合情绪提示
                <div className="space-y-3">
                  {getMixedModePrompts().slice(0, 5).map((prompt, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-violet-50 to-pink-50 rounded-xl p-4"
                    >
                      <p className="text-gray-700">{prompt}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* 快速写作区 */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">📝</span>
                  <span className="font-medium text-gray-700">快速记录</span>
                </div>
                <textarea
                  value={journalContent}
                  onChange={(e) => setJournalContent(e.target.value)}
                  placeholder="在这里快速记录你的想法..."
                  className="w-full px-4 py-3 rounded-xl border border-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white/80 resize-none"
                  rows={4}
                />
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="px-6 py-4 bg-white/50 flex flex-wrap gap-3 justify-between">
              <button
                onClick={() => {
                  if (!isMixedMode && selectedMood) {
                    setCurrentPromptIndex(Math.floor(Math.random() * selectedMood.prompts.length))
                  }
                }}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all"
              >
                🎲 换一个提示
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      isMixedMode
                        ? getMixedModePrompts().join('\n\n')
                        : selectedMood?.prompts[currentPromptIndex] || ''
                    )
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all"
                >
                  📋 复制提示
                </button>
                <Link
                  href={startDiaryWithPrompt()}
                  className="px-6 py-2 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span>🦞</span>
                  <span>开始写日记</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 情绪统计 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📊</span>
            <span>情绪分类</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['正面情绪', '负面情绪', '中性情绪', '复杂情绪'].map((category, i) => (
              <div key={i} className="text-center p-3 rounded-xl bg-gradient-to-br from-violet-50 to-pink-50">
                <div className="text-2xl font-bold text-violet-600">
                  {i === 0 ? 5 : i === 1 ? 4 : i === 2 ? 1 : 2}
                </div>
                <div className="text-sm text-gray-500">{category}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            共 {moods.length} 种情绪类型，支持单一和混合模式
          </div>
        </div>

        {/* 快速链接 */}
        <div className="text-center">
          <p className="text-gray-500 mb-4">更多情绪工具 ✨</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/emotion-mirror"
              className="px-4 py-2 bg-white/70 text-gray-600 rounded-xl text-sm font-medium hover:bg-white transition-all"
            >
              🪞 情绪镜子
            </Link>
            <Link
              href="/mood"
              className="px-4 py-2 bg-white/70 text-gray-600 rounded-xl text-sm font-medium hover:bg-white transition-all"
            >
              📈 心情追踪
            </Link>
            <Link
              href="/gratitude"
              className="px-4 py-2 bg-white/70 text-gray-600 rounded-xl text-sm font-medium hover:bg-white transition-all"
            >
              🙏 感恩日记
            </Link>
            <Link
              href="/prompts"
              className="px-4 py-2 bg-white/70 text-gray-600 rounded-xl text-sm font-medium hover:bg-white transition-all"
            >
              📝 更多提示词
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}