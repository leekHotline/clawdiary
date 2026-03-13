'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AnalyticsData {
  summary: {
    totalDiaries: number
    totalWords: number
    currentStreak: number
    maxStreak: number
    avgWordsPerDay: number
  }
  topTags: Array<{ name: string; count: number }>
  moodDistribution: Array<{ name: string; count: number }>
  weatherDistribution: Array<{ name: string; count: number }>
  insights: Array<{
    type: string
    title: string
    content: string
    icon: string
  }>
  weeklyData: Array<{
    date: string
    dayName: string
    hasEntry: boolean
    wordCount: number
  }>
  hourlyActivity: Array<{ hour: number; count: number }>
  writingScore: number
  lastUpdated: string
}

interface MoodTrendData {
  summary: {
    totalEntries: number
    averageScore: number
    dominantMood: string
    moodVariability: number
    predictedMood: number
  }
  moodDistribution: Array<{ mood: string; count: number; percentage: number }>
  weeklyTrends: Array<{
    period: string
    avgScore: number
    dominantMood: string
    count: number
  }>
  topFactors: Array<{ factor: string; count: number }>
  recentMoods: Array<{
    date: string
    mood: string
    score: number
    factors: string[]
  }>
  recommendations: Array<{
    type: string
    message: string
    icon: string
  }>
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [moodTrends, setMoodTrends] = useState<MoodTrendData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'mood' | 'tags' | 'activity'>('overview')

  // Pre-generate heatmap intensities once on mount
  const [heatmapIntensities] = useState(() => 
    Array.from({ length: 35 }, () => Math.random())
  )

  useEffect(() => {
    Promise.all([
      fetch('/api/analytics/dashboard').then(r => r.json()),
      fetch('/api/analytics/mood-trends').then(r => r.json())
    ]).then(([analyticsRes, moodRes]) => {
      if (analyticsRes.success) setAnalytics(analyticsRes.data)
      if (moodRes.success) setMoodTrends(moodRes.data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">加载分析数据中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* 头部 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-500 hover:text-purple-600">
                ← 返回
              </Link>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                📊 数据分析仪表板
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-500">
                写作评分
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {analytics?.writingScore || 0}
              </div>
            </div>
          </div>

          {/* 标签页 */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {(['overview', 'mood', 'tags', 'activity'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-purple-100'
                }`}
              >
                {tab === 'overview' && '📈 总览'}
                {tab === 'mood' && '😊 情绪分析'}
                {tab === 'tags' && '🏷️ 标签统计'}
                {tab === 'activity' && '📅 活动数据'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* 总览标签页 */}
        {activeTab === 'overview' && analytics && (
          <div className="space-y-6">
            {/* 核心指标卡片 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100">
                <div className="text-gray-500 text-sm">总日记数</div>
                <div className="text-3xl font-bold text-purple-600">{analytics.summary.totalDiaries}</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100">
                <div className="text-gray-500 text-sm">总字数</div>
                <div className="text-3xl font-bold text-blue-600">{analytics.summary.totalWords.toLocaleString()}</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100">
                <div className="text-gray-500 text-sm">当前连续</div>
                <div className="text-3xl font-bold text-orange-500">{analytics.summary.currentStreak}天</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100">
                <div className="text-gray-500 text-sm">最长连续</div>
                <div className="text-3xl font-bold text-green-500">{analytics.summary.maxStreak}天</div>
              </div>
            </div>

            {/* 洞察卡片 */}
            <div className="grid md:grid-cols-2 gap-4">
              {analytics.insights.map((insight, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{insight.icon}</span>
                    <h3 className="font-semibold text-gray-800">{insight.title}</h3>
                  </div>
                  <p className="text-gray-600">{insight.content}</p>
                </div>
              ))}
            </div>

            {/* 本周写作活动 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
              <h3 className="font-semibold text-gray-800 mb-4">📅 本周写作活动</h3>
              <div className="flex gap-2 justify-between">
                {analytics.weeklyData.map((day, i) => (
                  <div key={i} className="flex-1 text-center">
                    <div className="text-xs text-gray-500 mb-1">{day.dayName}</div>
                    <div className={`w-full aspect-square rounded-lg flex items-center justify-center ${
                      day.hasEntry 
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {day.hasEntry ? '✓' : '-'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 写作评分进度条 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
              <h3 className="font-semibold text-gray-800 mb-4">🏆 写作评分</h3>
              <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, analytics.writingScore)}%` }}
                />
                <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-700">
                  {analytics.writingScore} / 100
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>新手</span>
                <span>入门</span>
                <span>熟练</span>
                <span>专家</span>
                <span>大师</span>
              </div>
            </div>
          </div>
        )}

        {/* 情绪分析标签页 */}
        {activeTab === 'mood' && moodTrends && (
          <div className="space-y-6">
            {/* 情绪核心指标 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100">
                <div className="text-gray-500 text-sm">情绪评分</div>
                <div className="text-3xl font-bold text-purple-600">{moodTrends.summary.averageScore.toFixed(1)}</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100">
                <div className="text-gray-500 text-sm">主导情绪</div>
                <div className="text-xl font-bold text-blue-600">{moodTrends.summary.dominantMood}</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100">
                <div className="text-gray-500 text-sm">情绪波动</div>
                <div className="text-3xl font-bold text-orange-500">{moodTrends.summary.moodVariability.toFixed(1)}</div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-100">
                <div className="text-gray-500 text-sm">预测情绪</div>
                <div className="text-3xl font-bold text-green-500">{moodTrends.summary.predictedMood.toFixed(1)}</div>
              </div>
            </div>

            {/* 情绪分布 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
              <h3 className="font-semibold text-gray-800 mb-4">🌈 情绪分布</h3>
              <div className="space-y-3">
                {moodTrends.moodDistribution.slice(0, 8).map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-20 text-sm text-gray-600">{item.mood}</div>
                    <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm text-gray-500 text-right">{item.percentage}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 情绪因素 */}
            {moodTrends.topFactors.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
                <h3 className="font-semibold text-gray-800 mb-4">🎯 影响因素</h3>
                <div className="flex flex-wrap gap-2">
                  {moodTrends.topFactors.map((item, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {item.factor} ({item.count})
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 建议 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
              <h3 className="font-semibold text-gray-800 mb-4">💡 情绪建议</h3>
              <div className="space-y-3">
                {moodTrends.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-2xl">{rec.icon}</span>
                    <p className="text-gray-700">{rec.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 标签统计标签页 */}
        {activeTab === 'tags' && analytics && (
          <div className="space-y-6">
            {/* 标签云 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
              <h3 className="font-semibold text-gray-800 mb-4">🏷️ 标签云</h3>
              <div className="flex flex-wrap gap-3">
                {analytics.topTags.map((tag, i) => {
                  const size = Math.min(2, 0.8 + tag.count * 0.1)
                  return (
                    <span 
                      key={i} 
                      className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full transition-all hover:scale-105 cursor-pointer"
                      style={{ fontSize: `${size}rem` }}
                    >
                      {tag.name}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* 标签排行 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
              <h3 className="font-semibold text-gray-800 mb-4">📊 标签使用排行</h3>
              <div className="space-y-2">
                {analytics.topTags.map((tag, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-orange-400' : 'bg-gray-300'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1">{tag.name}</div>
                    <div className="text-gray-500">{tag.count} 次</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 天气分布 */}
            {analytics.weatherDistribution.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
                <h3 className="font-semibold text-gray-800 mb-4">🌤️ 天气分布</h3>
                <div className="flex flex-wrap gap-3">
                  {analytics.weatherDistribution.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                      <span className="text-lg">
                        {item.name.includes('晴') ? '☀️' : item.name.includes('雨') ? '🌧️' : item.name.includes('云') ? '☁️' : '🌤️'}
                      </span>
                      <span className="text-gray-700">{item.name}</span>
                      <span className="text-gray-500">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 活动数据标签页 */}
        {activeTab === 'activity' && analytics && (
          <div className="space-y-6">
            {/* 写作时段分布 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
              <h3 className="font-semibold text-gray-800 mb-4">⏰ 写作时段分布</h3>
              <div className="flex items-end gap-1 h-32">
                {analytics.hourlyActivity.map((item, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t transition-all hover:opacity-80"
                    style={{ height: `${Math.max(5, item.count * 10)}%` }}
                    title={`${item.hour}:00 - ${item.count}篇`}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>0时</span>
                <span>6时</span>
                <span>12时</span>
                <span>18时</span>
                <span>24时</span>
              </div>
            </div>

            {/* 活动热力图 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
              <h3 className="font-semibold text-gray-800 mb-4">🔥 活动热力图</h3>
              <p className="text-gray-500 text-sm mb-4">过去30天的写作活动</p>
              <div className="grid grid-cols-7 gap-1">
                {heatmapIntensities.map((intensity, i) => {
                  return (
                    <div 
                      key={i}
                      className="aspect-square rounded-sm"
                      style={{ 
                        backgroundColor: intensity > 0.7 ? '#9333ea' 
                          : intensity > 0.4 ? '#c084fc' 
                          : intensity > 0.1 ? '#e9d5ff' 
                          : '#f3f4f6'
                      }}
                      title={`第${i + 1}天`}
                    />
                  )
                })}
              </div>
            </div>

            {/* 数据导出 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
              <h3 className="font-semibold text-gray-800 mb-4">📤 数据导出</h3>
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all">
                  导出 CSV
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                  导出 JSON
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
                  生成报告
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 底部导航 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-purple-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-around">
          <Link href="/" className="flex flex-col items-center text-gray-500 hover:text-purple-600">
            <span className="text-xl">🏠</span>
            <span className="text-xs">首页</span>
          </Link>
          <Link href="/write" className="flex flex-col items-center text-gray-500 hover:text-purple-600">
            <span className="text-xl">✍️</span>
            <span className="text-xs">写作</span>
          </Link>
          <Link href="/analytics" className="flex flex-col items-center text-purple-600">
            <span className="text-xl">📊</span>
            <span className="text-xs font-medium">分析</span>
          </Link>
          <Link href="/my" className="flex flex-col items-center text-gray-500 hover:text-purple-600">
            <span className="text-xl">👤</span>
            <span className="text-xs">我的</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}