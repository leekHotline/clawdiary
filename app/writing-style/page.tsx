'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface StyleAnalysis {
  vocabulary: {
    totalWords: number
    uniqueWords: number
    vocabularyRichness: number
    avgSentenceLength: number
    topWords: Array<{ word: string; count: number }>
    rareWords: string[]
  }
  style: {
    formality: number
    emotionalTone: number
    descriptiveness: number
    sentenceVariety: number
    readability: number
  }
  patterns: {
    commonPhrases: Array<{ phrase: string; count: number }>
    sentenceStarters: Array<{ starter: string; count: number }>
    punctuation: { type: string; count: number }[]
  }
  evolution: {
    month: string
    wordCount: number
    vocabularyGrowth: number
    styleScore: number
  }[]
  suggestions: {
    type: 'strength' | 'improvement' | 'tip'
    title: string
    content: string
    icon: string
  }[]
  personality: {
    traits: { name: string; score: number }[]
    writingVoice: string
    communicationStyle: string
  }
}

export default function WritingStylePage() {
  const [analysis, setAnalysis] = useState<StyleAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'vocabulary' | 'patterns' | 'evolution'>('overview')

  useEffect(() => {
    fetch('/api/writing-style/analyze')
      .then(r => r.json())
      .then(res => {
        if (res.success) setAnalysis(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">正在分析你的写作风格...</p>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">暂无数据，请先写几篇日记</p>
          <Link href="/write" className="text-indigo-600 hover:underline mt-2 inline-block">
            开始写作 →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* 头部 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-500 hover:text-indigo-600">
                ← 返回
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                ✨ 写作风格分析
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              基于 {analysis.vocabulary.totalWords.toLocaleString()} 字分析
            </div>
          </div>

          {/* 标签页 */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {(['overview', 'vocabulary', 'patterns', 'evolution'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-indigo-100'
                }`}
              >
                {tab === 'overview' && '📝 总览'}
                {tab === 'vocabulary' && '📚 词汇分析'}
                {tab === 'patterns' && '🔍 写作模式'}
                {tab === 'evolution' && '📈 风格演变'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 pb-24">
        {/* 总览 */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 风格指标 */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-indigo-100 text-center">
                <div className="text-3xl font-bold text-indigo-600">{analysis.style.formality}%</div>
                <div className="text-sm text-gray-500 mt-1">正式度</div>
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${analysis.style.formality}%` }} />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-indigo-100 text-center">
                <div className="text-3xl font-bold text-pink-600">{analysis.style.emotionalTone}%</div>
                <div className="text-sm text-gray-500 mt-1">情感表达</div>
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-pink-500 rounded-full" style={{ width: `${analysis.style.emotionalTone}%` }} />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-indigo-100 text-center">
                <div className="text-3xl font-bold text-purple-600">{analysis.style.descriptiveness}%</div>
                <div className="text-sm text-gray-500 mt-1">描写丰富度</div>
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${analysis.style.descriptiveness}%` }} />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-indigo-100 text-center">
                <div className="text-3xl font-bold text-blue-600">{analysis.style.sentenceVariety}%</div>
                <div className="text-sm text-gray-500 mt-1">句式多样性</div>
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${analysis.style.sentenceVariety}%` }} />
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-indigo-100 text-center">
                <div className="text-3xl font-bold text-green-600">{analysis.style.readability}%</div>
                <div className="text-sm text-gray-500 mt-1">可读性</div>
                <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${analysis.style.readability}%` }} />
                </div>
              </div>
            </div>

            {/* 写作人格 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100">
              <h3 className="font-semibold text-gray-800 mb-4">🎭 你的写作人格</h3>
              <div className="text-lg text-gray-700 mb-4">
                <span className="font-semibold text-indigo-600">{analysis.personality.writingVoice}</span>
              </div>
              <p className="text-gray-600">{analysis.personality.communicationStyle}</p>
              
              <div className="mt-6 space-y-3">
                {analysis.personality.traits.map((trait, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-24 text-sm text-gray-600">{trait.name}</div>
                    <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                        style={{ width: `${trait.score}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm text-gray-500 text-right">{trait.score}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 建议 */}
            <div className="grid md:grid-cols-2 gap-4">
              {analysis.suggestions.map((suggestion, i) => (
                <div key={i} className={`bg-white rounded-2xl p-5 shadow-sm border ${
                  suggestion.type === 'strength' ? 'border-green-200' :
                  suggestion.type === 'improvement' ? 'border-orange-200' : 'border-blue-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{suggestion.icon}</span>
                    <h4 className="font-semibold text-gray-800">{suggestion.title}</h4>
                    <span className={`ml-auto px-2 py-0.5 rounded-full text-xs ${
                      suggestion.type === 'strength' ? 'bg-green-100 text-green-700' :
                      suggestion.type === 'improvement' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {suggestion.type === 'strength' ? '优势' : suggestion.type === 'improvement' ? '提升' : '建议'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{suggestion.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 词汇分析 */}
        {activeTab === 'vocabulary' && (
          <div className="space-y-6">
            {/* 词汇概览 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-indigo-100">
                <div className="text-gray-500 text-sm">总词数</div>
                <div className="text-3xl font-bold text-indigo-600">{analysis.vocabulary.totalWords.toLocaleString()}</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-indigo-100">
                <div className="text-gray-500 text-sm">不重复词汇</div>
                <div className="text-3xl font-bold text-purple-600">{analysis.vocabulary.uniqueWords.toLocaleString()}</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-indigo-100">
                <div className="text-gray-500 text-sm">词汇丰富度</div>
                <div className="text-3xl font-bold text-pink-600">{analysis.vocabulary.vocabularyRichness.toFixed(2)}</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-indigo-100">
                <div className="text-gray-500 text-sm">平均句长</div>
                <div className="text-3xl font-bold text-blue-600">{analysis.vocabulary.avgSentenceLength}</div>
              </div>
            </div>

            {/* 高频词汇 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100">
              <h3 className="font-semibold text-gray-800 mb-4">📊 高频词汇</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {analysis.vocabulary.topWords.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-orange-400' : 'bg-gray-300'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{item.word}</div>
                      <div className="text-xs text-gray-500">{item.count} 次</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 稀有词汇 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100">
              <h3 className="font-semibold text-gray-800 mb-4">💎 你使用的优美词汇</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.vocabulary.rareWords.map((word, i) => (
                  <span key={i} className="px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-sm">
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 写作模式 */}
        {activeTab === 'patterns' && (
          <div className="space-y-6">
            {/* 常用短语 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100">
              <h3 className="font-semibold text-gray-800 mb-4">📝 常用短语</h3>
              <div className="space-y-3">
                {analysis.patterns.commonPhrases.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1 text-gray-700">"{item.phrase}"</div>
                    <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                      {item.count} 次
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 句子开头 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100">
              <h3 className="font-semibold text-gray-800 mb-4">🚀 常用句子开头</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {analysis.patterns.sentenceStarters.map((item, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl">
                    <div className="font-medium text-gray-800">"{item.starter}"</div>
                    <div className="text-sm text-gray-500 mt-1">{item.count} 次</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 标点符号使用 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100">
              <h3 className="font-semibold text-gray-800 mb-4">⌨️ 标点符号使用</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analysis.patterns.punctuation.map((item, i) => (
                  <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="text-3xl mb-2">{item.type}</div>
                    <div className="text-2xl font-bold text-gray-800">{item.count}</div>
                    <div className="text-xs text-gray-500">次使用</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 风格演变 */}
        {activeTab === 'evolution' && (
          <div className="space-y-6">
            {/* 演变图表 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100">
              <h3 className="font-semibold text-gray-800 mb-4">📈 写作风格演变</h3>
              <div className="h-64 flex items-end gap-2">
                {analysis.evolution.map((item, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t transition-all hover:opacity-80"
                      style={{ height: `${item.styleScore}%` }}
                      title={`${item.month}: 风格评分 ${item.styleScore}`}
                    />
                    <div className="text-xs text-gray-500 mt-2 truncate">{item.month}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 月度统计 */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100">
                <h3 className="font-semibold text-gray-800 mb-4">📝 月度字数</h3>
                <div className="space-y-3">
                  {analysis.evolution.slice(-6).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-16 text-sm text-gray-600">{item.month}</div>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                          style={{ width: `${(item.wordCount / 10000) * 100}%` }}
                        />
                      </div>
                      <div className="w-20 text-sm text-gray-500 text-right">{item.wordCount.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-indigo-100">
                <h3 className="font-semibold text-gray-800 mb-4">📚 词汇增长</h3>
                <div className="space-y-3">
                  {analysis.evolution.slice(-6).map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-16 text-sm text-gray-600">{item.month}</div>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ width: `${Math.min(100, item.vocabularyGrowth * 10)}%` }}
                        />
                      </div>
                      <div className="w-20 text-sm text-gray-500 text-right">+{item.vocabularyGrowth}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-indigo-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-around">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-indigo-600">
            <span className="text-xl">🏠</span>
            <span className="text-xs">首页</span>
          </Link>
          <Link href="/write" className="flex flex-col items-center text-gray-500 hover:text-indigo-600">
            <span className="text-xl">✍️</span>
            <span className="text-xs">写作</span>
          </Link>
          <Link href="/writing-style" className="flex flex-col items-center text-indigo-600">
            <span className="text-xl">✨</span>
            <span className="text-xs font-medium">风格</span>
          </Link>
          <Link href="/analytics" className="flex flex-col items-center text-gray-500 hover:text-indigo-600">
            <span className="text-xl">📊</span>
            <span className="text-xs">分析</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}