'use client'

import { useState } from 'react'
import Link from 'next/link'

type SynthesisType = 'personality' | 'growth' | 'values' | 'timeline' | 'dreams'

interface SynthesisResult {
  type: SynthesisType
  title: string
  insight: string
  details: string[]
  score?: number
  emoji: string
}

const synthesisOptions: { type: SynthesisType; name: string; desc: string; icon: string }[] = [
  { type: 'personality', name: '性格画像', desc: '从日记中提炼你的性格特质', icon: '🎭' },
  { type: 'growth', name: '成长轨迹', desc: '发现你的进步与变化', icon: '📈' },
  { type: 'values', name: '价值观图谱', desc: '揭示你真正重视的事物', icon: '💎' },
  { type: 'timeline', name: '人生时间线', desc: '串联重要时刻的故事', icon: '🎬' },
  { type: 'dreams', name: '梦想分析', desc: '解析你的愿望与目标', icon: '🌟' },
]

// 模拟AI分析结果
const generateSynthesis = (type: SynthesisType): SynthesisResult => {
  const results: Record<SynthesisType, SynthesisResult> = {
    personality: {
      type: 'personality',
      title: '你的性格画像',
      insight: '你是一个内省且富有创造力的思考者，善于从日常中发现深意，同时保持着对生活的热爱与好奇。',
      details: [
        '📖 深度思考者 - 喜欢记录内心感受和思考',
        '🌱 成长导向 - 经常反思和寻求进步',
        '🎨 感性丰富 - 对美和情感有敏锐感知',
        '🤝 关系重视 - 在意与他人的连接',
      ],
      score: 87,
      emoji: '🎭',
    },
    growth: {
      type: 'growth',
      title: '你的成长轨迹',
      insight: '过去半年，你在情绪管理和自我认知方面取得了显著进步，学会了更多地接纳自己。',
      details: [
        '↑ 情绪稳定性 +32%',
        '↑ 自我接纳度 +28%',
        '↑ 目标清晰度 +45%',
        '→ 需要关注：工作生活平衡',
      ],
      score: 78,
      emoji: '📈',
    },
    values: {
      type: 'values',
      title: '你的价值观图谱',
      insight: '自由、成长和真实是你最看重的三个价值观，它们指引着你的选择和行动。',
      details: [
        '🕊️ 自由 - 渴望自主和选择权',
        '🌱 成长 - 追求进步和突破',
        '💎 真实 - 重视真诚和一致',
        '❤️ 连接 - 在意深度关系',
        '🎯 意义 - 寻找生活的价值',
      ],
      score: 91,
      emoji: '💎',
    },
    timeline: {
      type: 'timeline',
      title: '你的人生时间线',
      insight: '你的日记串联起一段关于发现与蜕变的故事，每一个转折都让你更接近真实的自己。',
      details: [
        '2024.09 - 开始写作之旅，记录日常',
        '2024.11 - 职业转型期，面临选择',
        '2025.01 - 突破瓶颈，找到新方向',
        '2025.03 - 建立规律，稳步前进',
        '现在 - 继续探索，保持好奇',
      ],
      emoji: '🎬',
    },
    dreams: {
      type: 'dreams',
      title: '你的梦想分析',
      insight: '你的梦想正在从模糊变得清晰，你开始知道自己真正想要的是什么。',
      details: [
        '🎯 短期目标：建立稳定的写作习惯',
        '🏔️ 中期愿景：找到热爱的工作方式',
        '🌌 长期梦想：活出真实而有意义的人生',
        '⚠️ 阻碍识别：完美主义倾向',
        '💡 建议：先完成，再完美',
      ],
      score: 73,
      emoji: '🌟',
    },
  }
  return results[type]
}

export default function DiarySynthesisPage() {
  const [selectedType, setSelectedType] = useState<SynthesisType | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<SynthesisResult | null>(null)
  const [synthesisHistory, setSynthesisHistory] = useState<SynthesisType[]>([])

  const handleSynthesize = async (type: SynthesisType) => {
    setSelectedType(type)
    setIsAnalyzing(true)
    setResult(null)

    // 模拟AI分析延迟
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const synthesisResult = generateSynthesis(type)
    setResult(synthesisResult)
    setIsAnalyzing(false)
    setSynthesisHistory((prev) => [type, ...prev.filter((t) => t !== type)])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="border-b border-amber-200/50 bg-white/60 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/60">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-2xl hover:opacity-70 transition-opacity"
              >
                ←
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                  🔮 日记炼金室
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  将碎片日记炼成人生智慧
                </p>
              </div>
            </div>
            {synthesisHistory.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>已分析:</span>
                {synthesisHistory.slice(0, 3).map((type) => (
                  <span key={type} className="text-lg">
                    {synthesisOptions.find((o) => o.type === type)?.icon}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* 炼金炉 - 选择区 */}
        <section className="mb-8">
          <div className="rounded-2xl border border-amber-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
            <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
              🧪 选择炼金配方
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {synthesisOptions.map((option) => (
                <button
                  key={option.type}
                  onClick={() => handleSynthesize(option.type)}
                  disabled={isAnalyzing}
                  className={`group rounded-xl border-2 p-4 text-left transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 ${
                    selectedType === option.type
                      ? 'border-amber-500 bg-amber-50 dark:border-amber-400 dark:bg-amber-900/30'
                      : 'border-gray-200 bg-white hover:border-amber-300 dark:border-gray-600 dark:bg-gray-700'
                  }`}
                >
                  <div className="mb-2 text-2xl">{option.icon}</div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    {option.name}
                  </div>
                  <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {option.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 炼金过程 */}
        {isAnalyzing && (
          <section className="mb-8">
            <div className="rounded-2xl border border-amber-200/50 bg-gradient-to-r from-amber-100 to-orange-100 p-8 text-center dark:border-gray-700 dark:from-amber-900/30 dark:to-orange-900/30">
              <div className="mb-4 text-5xl animate-pulse">🔮</div>
              <div className="text-lg font-medium text-amber-700 dark:text-amber-300">
                正在炼金中...
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                分析你的日记，提炼智慧精华
              </div>
              <div className="mt-4 flex justify-center gap-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-2 w-8 animate-pulse rounded-full bg-amber-500"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 炼金结果 */}
        {result && !isAnalyzing && (
          <section className="mb-8">
            <div className="rounded-2xl border border-amber-200/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{result.emoji}</span>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                    {result.title}
                  </h2>
                </div>
                {result.score && (
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-500">炼成度</div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-sm font-bold text-white shadow-md">
                      {result.score}%
                    </div>
                  </div>
                )}
              </div>

              {/* 核心洞察 */}
              <div className="mb-6 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 p-4 dark:from-amber-900/20 dark:to-orange-900/20">
                <div className="mb-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                  ✨ 核心洞察
                </div>
                <p className="text-gray-700 dark:text-gray-300">{result.insight}</p>
              </div>

              {/* 详细分析 */}
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  📊 详细分析
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {result.details.map((detail, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:bg-gray-700/50 dark:text-gray-300"
                    >
                      {detail}
                    </div>
                  ))}
                </div>
              </div>

              {/* 行动建议 */}
              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  onClick={() => handleSynthesize(result.type)}
                  className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 transition-colors"
                >
                  🔄 重新分析
                </button>
                <button className="rounded-lg border border-amber-300 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-400 dark:hover:bg-amber-900/30 transition-colors">
                  📤 分享结果
                </button>
                <button className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
                  💾 保存到日记
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 炼金原理说明 */}
        <section className="mb-8">
          <div className="rounded-2xl border border-gray-200 bg-white/60 p-6 dark:border-gray-700 dark:bg-gray-800/60">
            <h3 className="mb-4 font-semibold text-gray-800 dark:text-gray-200">
              🔮 炼金原理
            </h3>
            <div className="grid gap-4 text-sm text-gray-600 dark:text-gray-400 sm:grid-cols-2">
              <div className="flex gap-3">
                <span className="text-xl">📝</span>
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    收集素材
                  </div>
                  <div>从你的历史日记中提取关键词和情感</div>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">🧪</span>
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    提炼精华
                  </div>
                  <div>AI 识别模式、主题和成长轨迹</div>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">💎</span>
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    合成宝石
                  </div>
                  <div>生成个性化的洞察和建议</div>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-xl">🎯</span>
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">
                    指引方向
                  </div>
                  <div>帮助你更好地理解自己</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 相关功能 */}
        <section>
          <h3 className="mb-4 font-semibold text-gray-800 dark:text-gray-200">
            🔗 相关功能
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link
              href="/diary-fortune"
              className="group rounded-xl border border-gray-200 bg-white/60 p-4 transition-all hover:border-purple-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/60 dark:hover:border-purple-600"
            >
              <div className="text-2xl">🎯</div>
              <div className="mt-2 font-medium text-gray-800 dark:text-gray-200">
                日记运势
              </div>
              <div className="text-sm text-gray-500">每日运势指引</div>
            </Link>
            <Link
              href="/emotion-wheel"
              className="group rounded-xl border border-gray-200 bg-white/60 p-4 transition-all hover:border-blue-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/60 dark:hover:border-blue-600"
            >
              <div className="text-2xl">🌈</div>
              <div className="mt-2 font-medium text-gray-800 dark:text-gray-200">
                情绪轮盘
              </div>
              <div className="text-sm text-gray-500">探索情绪世界</div>
            </Link>
            <Link
              href="/growth-path"
              className="group rounded-xl border border-gray-200 bg-white/60 p-4 transition-all hover:border-green-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/60 dark:hover:border-green-600"
            >
              <div className="text-2xl">🛤️</div>
              <div className="mt-2 font-medium text-gray-800 dark:text-gray-200">
                成长路径
              </div>
              <div className="text-sm text-gray-500">追踪你的成长</div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}