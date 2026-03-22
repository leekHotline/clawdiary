'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

interface Perspective {
  id: string
  name: string
  emoji: string
  color: string
  description: string
  focus: string
  questions: string[]
}

const perspectives: Perspective[] = [
  {
    id: 'compassionate',
    name: '慈悲视角',
    emoji: '💝',
    color: 'from-pink-500 to-rose-500',
    description: '以温柔和理解的目光看待自己',
    focus: '自我关怀、接纳、善意',
    questions: [
      '如果你最好的朋友经历了这件事，你会对TA说什么？',
      '这件事中，你已经做得很好的部分是什么？',
      '你能给自己什么样的温柔和理解？',
    ],
  },
  {
    id: 'growth',
    name: '成长视角',
    emoji: '🌱',
    color: 'from-green-500 to-emerald-500',
    description: '寻找学习和成长的机会',
    focus: '进步、学习、未来发展',
    questions: [
      '这件事教会了你什么？',
      '下次遇到类似情况，你会怎么做？',
      '这个经历中有什么隐藏的礼物？',
    ],
  },
  {
    id: 'curious',
    name: '好奇视角',
    emoji: '🔍',
    color: 'from-blue-500 to-cyan-500',
    description: '以好奇心探索内心的真实',
    focus: '探索、发现、洞察',
    questions: [
      '是什么让你有了这样的反应？',
      '有没有其他可能的解释？',
      '你真正想要的是什么？',
    ],
  },
  {
    id: 'gratitude',
    name: '感恩视角',
    emoji: '🙏',
    color: 'from-yellow-500 to-orange-500',
    description: '发现生活中值得感谢的部分',
    focus: '感谢、珍惜、积极',
    questions: [
      '这件事中有什么值得感谢的？',
      '谁在这件事中帮助过你？',
      '你的生活中有哪些被忽视的美好？',
    ],
  },
  {
    id: 'future',
    name: '未来视角',
    emoji: '🚀',
    color: 'from-purple-500 to-violet-500',
    description: '从未来的角度回看现在',
    focus: '愿景、希望、长远',
    questions: [
      '一年后的你会怎么看待这件事？',
      '这件事对你的人生轨迹有什么影响？',
      '你想成为什么样的人？这件事如何帮助你？',
    ],
  },
  {
    id: 'peaceful',
    name: '平静视角',
    emoji: '🧘',
    color: 'from-teal-500 to-sky-500',
    description: '以平和的心态接纳一切',
    focus: '平静、接纳、当下',
    questions: [
      '此刻，你能允许自己感受到什么？',
      '如果你放下控制，会发生什么？',
      '你能做到的最小一步是什么？',
    ],
  },
]

// AI 生成透视分析
const generateLensAnalysis = (
  content: string,
  perspective: Perspective
): { rewrite: string; insights: string[]; questions: string[] } => {
  // 基于视角生成重写和分析
  const templates: Record<string, { rewrites: string[]; insights: string[] }> = {
    compassionate: {
      rewrites: [
        '我看到你经历了很多，这真的很不容易。你已经在努力了，这一点值得肯定。',
        '在这个故事里，你展现了勇气和诚实。对自己温柔一点，你值得被善待。',
        '你正在经历一个成长的过程。每一步，无论大小，都是有意义的。',
      ],
      insights: [
        '💡 你在困难中仍然保持记录，这本身就是一种自我关怀',
        '💡 承认自己的感受是勇敢的第一步',
        '💡 你有觉察自己情绪的能力，这是非常宝贵的品质',
      ],
    },
    growth: {
      rewrites: [
        '从这个经历中，我发现了几个可以学习的点...',
        '这是一次宝贵的学习机会，让我看到了自己的成长空间...',
        '回顾这件事，我意识到自己其实比想象中更有韧性...',
      ],
      insights: [
        '🌱 每个挑战都蕴含着成长的机会',
        '🌱 你正在发展更成熟的情绪应对方式',
        '🌱 这种反思本身就是成长的证明',
      ],
    },
    curious: {
      rewrites: [
        '有趣的是，当我深入探索这件事时，我发现...',
        '让我好奇的是，为什么我会这样反应？背后可能是因为...',
        '这件事让我思考：什么是真正重要的？',
      ],
      insights: [
        '🔍 探索自己内心深处的真实想法',
        '🔍 有时候答案就藏在问题本身',
        '🔍 好奇心是打开心门的钥匙',
      ],
    },
    gratitude: {
      rewrites: [
        '虽然这件事有挑战，但我感谢它让我...',
        '在这段经历中，我很感谢有...的存在',
        '细数这件事带来的礼物，我发现...',
      ],
      insights: [
        '🙏 即使在困难中，也有值得感谢的部分',
        '🙏 感恩能帮助我们找到内心的平静',
        '🙏 每一天都有值得珍惜的小确幸',
      ],
    },
    future: {
      rewrites: [
        '当我从未来回望今天，这件事其实是一个转折点...',
        '一年后，我会感谢今天的自己...',
        '这是我人生故事中重要的一章，它将我引向...',
      ],
      insights: [
        '🚀 现在的困难可能是未来的礼物',
        '🚀 你正在书写自己的人生故事',
        '🚀 每一步都在塑造未来的你',
      ],
    },
    peaceful: {
      rewrites: [
        '此刻，我允许自己感受这一切...',
        '放下控制，我能感受到内心的平静...',
        '不需要急着改变什么，现在这样就好...',
      ],
      insights: [
        '🧘 接纳当下的感受是一种力量',
        '🧘 平静来自于放下期待和控制',
        '🧘 此刻，你已经足够好了',
      ],
    },
  }

  const perspectiveData = templates[perspective.id]
  const rewrite = perspectiveData.rewrites[Math.floor(Math.random() * perspectiveData.rewrites.length)]
  const insights = perspectiveData.insights.slice(0, 2)

  // 选择2-3个问题
  const selectedQuestions = perspective.questions
    .sort(() => Math.random() - 0.5)
    .slice(0, 2)

  return { rewrite, insights, questions: selectedQuestions }
}

interface LensSession {
  content: string
  selectedPerspective: Perspective | null
  analysis: {
    rewrite: string
    insights: string[]
    questions: string[]
  } | null
  reflections: string[]
  savedPerspectives: {
    perspective: Perspective
    analysis: { rewrite: string; insights: string[]; questions: string[] }
  }[]
}

export default function EmotionLensPage() {
  const [step, setStep] = useState<'input' | 'perspective' | 'analysis' | 'compare'>('input')
  const [session, setSession] = useState<LensSession>({
    content: '',
    selectedPerspective: null,
    analysis: null,
    reflections: [],
    savedPerspectives: [],
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentReflection, setCurrentReflection] = useState('')

  const analyzeWithPerspective = async (perspective: Perspective) => {
    setIsAnalyzing(true)
    setSession(prev => ({ ...prev, selectedPerspective: perspective }))
    
    // 模拟 AI 分析
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const analysis = generateLensAnalysis(session.content, perspective)
    
    setSession(prev => ({
      ...prev,
      analysis,
    }))
    setIsAnalyzing(false)
    setStep('analysis')
  }

  const saveCurrentPerspective = () => {
    if (!session.selectedPerspective || !session.analysis) return
    
    setSession(prev => ({
      ...prev,
      savedPerspectives: [
        ...prev.savedPerspectives,
        {
          perspective: prev.selectedPerspective!,
          analysis: prev.analysis!,
        },
      ],
      selectedPerspective: null,
      analysis: null,
    }))
    
    if (session.savedPerspectives.length >= 1) {
      setStep('compare')
    } else {
      setStep('perspective')
    }
  }

  const addReflection = () => {
    if (!currentReflection.trim()) return
    setSession(prev => ({
      ...prev,
      reflections: [...prev.reflections, currentReflection.trim()],
    }))
    setCurrentReflection('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-pink-200/20 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-3xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-purple-600 mb-4 inline-block">
            ← 返回首页
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🔍</span>
            <h1 className="text-3xl font-bold text-gray-800">情绪透视镜</h1>
          </div>
          <p className="text-gray-500">
            从多个情绪视角重新审视你的日记，发现隐藏的洞察
          </p>
        </div>

        {/* 进度指示 */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {['input', 'perspective', 'analysis', 'compare'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step === s
                    ? 'bg-purple-500 text-white'
                    : i < ['input', 'perspective', 'analysis', 'compare'].indexOf(step)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i < ['input', 'perspective', 'analysis', 'compare'].indexOf(step) ? '✓' : i + 1}
              </div>
              {i < 3 && (
                <div
                  className={`w-12 h-1 ${
                    i < ['input', 'perspective', 'analysis', 'compare'].indexOf(step)
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* 第一步：输入内容 */}
        {step === 'input' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/50">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              📝 粘贴或输入你的日记内容
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              输入你想重新审视的文字，可以是今天的日记、一段想法或任何需要多角度分析的内容
            </p>
            <textarea
              value={session.content}
              onChange={(e) => setSession(prev => ({ ...prev, content: e.target.value }))}
              placeholder="在这里粘贴你的日记内容..."
              className="w-full h-48 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-700"
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-400">
                {session.content.length} 字
              </span>
              <button
                onClick={() => session.content.trim().length >= 20 && setStep('perspective')}
                disabled={session.content.trim().length < 20}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                开始透视 →
              </button>
            </div>
          </div>
        )}

        {/* 第二步：选择视角 */}
        {step === 'perspective' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                🎭 选择一个视角来审视这段内容
              </h2>
              <p className="text-gray-500 text-sm">
                每个视角会带给你不同的洞察，建议尝试多个视角对比
              </p>
            </div>

            {/* 已保存的视角 */}
            {session.savedPerspectives.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">已分析的视角：</p>
                <div className="flex gap-2 flex-wrap">
                  {session.savedPerspectives.map(({ perspective }) => (
                    <span
                      key={perspective.id}
                      className={`px-3 py-1 rounded-full text-sm text-white bg-gradient-to-r ${perspective.color}`}
                    >
                      {perspective.emoji} {perspective.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 视角选择卡片 */}
            <div className="grid gap-4">
              {perspectives
                .filter(p => !session.savedPerspectives.find(s => s.perspective.id === p.id))
                .map((perspective) => (
                  <button
                    key={perspective.id}
                    onClick={() => analyzeWithPerspective(perspective)}
                    disabled={isAnalyzing}
                    className={`bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow-md hover:shadow-lg transition-all border border-white/50 text-left group ${
                      isAnalyzing ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-r ${perspective.color}`}
                      >
                        {perspective.emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {perspective.name}
                          <span className="ml-2 text-sm text-gray-400 group-hover:text-purple-500 transition-colors">
                            点击选择 →
                          </span>
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">{perspective.description}</p>
                        <div className="flex gap-2 flex-wrap">
                          {perspective.focus.split('、').map((f, i) => (
                            <span
                              key={i}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
            </div>

            {/* 分析中状态 */}
            {isAnalyzing && (
              <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
                  <div className="text-5xl mb-4 animate-pulse">
                    {session.selectedPerspective?.emoji}
                  </div>
                  <p className="text-gray-600">正在通过「{session.selectedPerspective?.name}」分析...</p>
                </div>
              </div>
            )}

            {/* 跳过对比按钮 */}
            {session.savedPerspectives.length > 0 && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setStep('compare')}
                  className="px-6 py-3 border border-purple-300 text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition-colors"
                >
                  查看多视角对比 ({session.savedPerspectives.length + 1} 个视角)
                </button>
              </div>
            )}
          </div>
        )}

        {/* 第三步：分析结果 */}
        {step === 'analysis' && session.analysis && session.selectedPerspective && (
          <div className="space-y-6">
            {/* 视角标题 */}
            <div className={`bg-gradient-to-r ${session.selectedPerspective.color} rounded-2xl p-6 text-white shadow-lg`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{session.selectedPerspective.emoji}</span>
                <h2 className="text-2xl font-bold">{session.selectedPerspective.name}</h2>
              </div>
              <p className="text-white/90">{session.selectedPerspective.description}</p>
            </div>

            {/* 重写内容 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/50">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>✨</span> 透视重写
              </h3>
              <p className="text-gray-700 leading-relaxed italic">
                "{session.analysis.rewrite}"
              </p>
            </div>

            {/* 洞察 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/50">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>💡</span> 发现的洞察
              </h3>
              <ul className="space-y-2">
                {session.analysis.insights.map((insight, i) => (
                  <li key={i} className="text-gray-600 pl-4 border-l-2 border-purple-300">
                    {insight}
                  </li>
                ))}
              </ul>
            </div>

            {/* 引导问题 */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>🤔</span> 引导问题
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                思考这些问题，帮助深化你的理解
              </p>
              <div className="space-y-3">
                {session.analysis.questions.map((question, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg p-4 text-gray-700 shadow-sm"
                  >
                    {question}
                  </div>
                ))}
              </div>
            </div>

            {/* 记录反思 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/50">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span>📝</span> 记录你的反思
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentReflection}
                  onChange={(e) => setCurrentReflection(e.target.value)}
                  placeholder="写下你的想法..."
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300"
                  onKeyPress={(e) => e.key === 'Enter' && addReflection()}
                />
                <button
                  onClick={addReflection}
                  className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  添加
                </button>
              </div>
              {session.reflections.length > 0 && (
                <div className="mt-4 space-y-2">
                  {session.reflections.map((reflection, i) => (
                    <div key={i} className="text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
                      {reflection}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <button
                onClick={() => setStep('perspective')}
                className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                尝试其他视角
              </button>
              <button
                onClick={saveCurrentPerspective}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                保存并对比
              </button>
            </div>
          </div>
        )}

        {/* 第四步：多视角对比 */}
        {step === 'compare' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                🎭 多视角对比分析
              </h2>
              <p className="text-gray-500 text-sm">
                比较不同视角的洞察，发现更深层的理解
              </p>
            </div>

            {/* 原文 */}
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 max-h-32 overflow-y-auto">
              <p className="font-medium text-gray-500 mb-2">原文：</p>
              {session.content}
            </div>

            {/* 视角对比卡片 */}
            <div className="space-y-4">
              {session.savedPerspectives.map(({ perspective, analysis }, index) => (
                <div
                  key={perspective.id}
                  className={`bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-md border border-white/50`}
                >
                  <div className={`bg-gradient-to-r ${perspective.color} p-4 text-white`}>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{perspective.emoji}</span>
                      <span className="font-semibold">{perspective.name}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 italic mb-3">"{analysis.rewrite}"</p>
                    <div className="space-y-1">
                      {analysis.insights.map((insight, i) => (
                        <p key={i} className="text-sm text-gray-500">{insight}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 综合洞察 */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6">
              <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                <span>🌟</span> 综合洞察
              </h3>
              <p className="text-purple-700">
                通过 {session.savedPerspectives.length} 个不同视角的审视，你正在培养多角度思考的能力。
                每个视角都提供了独特的价值，帮助你更全面地理解自己的经历。
              </p>
            </div>

            {/* 我的反思汇总 */}
            {session.reflections.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md border border-white/50">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span>📝</span> 我的反思
                </h3>
                <ul className="space-y-2">
                  {session.reflections.map((reflection, i) => (
                    <li key={i} className="text-gray-600 flex items-start gap-2">
                      <span className="text-purple-500">•</span>
                      {reflection}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setStep('perspective')}
                className="py-3 border border-purple-300 text-purple-600 rounded-xl font-medium hover:bg-purple-50 transition-colors"
              >
                继续探索其他视角
              </button>
              <Link
                href="/diary/new"
                className="py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium text-center hover:shadow-lg transition-all"
              >
                写入新日记
              </Link>
            </div>

            {/* 重新开始 */}
            <div className="text-center">
              <button
                onClick={() => {
                  setStep('input')
                  setSession({
                    content: '',
                    selectedPerspective: null,
                    analysis: null,
                    reflections: [],
                    savedPerspectives: [],
                  })
                }}
                className="text-gray-500 text-sm hover:text-gray-700"
              >
                分析新内容
              </button>
            </div>
          </div>
        )}

        {/* 底部说明 */}
        <div className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/50">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>💡</span> 关于情绪透视镜
          </h3>
          <ul className="text-sm text-gray-500 space-y-2">
            <li>• 培养多角度思考能力，提升情绪智慧</li>
            <li>• 不同视角帮助我们看到被忽略的面向</li>
            <li>• 建议对重要事件尝试多个视角分析</li>
            <li>• 所有内容仅保存在本地，保护你的隐私</li>
          </ul>
        </div>
      </main>
    </div>
  )
}