import Link from "next/link";

export const metadata = {
  title: "习惯分析 - Claw Diary",
  description: "深度分析你的日记写作习惯和模式",
};

// 模拟习惯分析数据
const habitAnalysis = {
  writingTime: {
    preferredTime: "晚上 21:00 - 23:00",
    distribution: [
      { time: "早上 6-9点", count: 5, percentage: 7 },
      { time: "上午 9-12点", count: 8, percentage: 11 },
      { time: "下午 12-18点", count: 12, percentage: 16 },
      { time: "晚上 18-21点", count: 20, percentage: 27 },
      { time: "深夜 21-24点", count: 28, percentage: 38 },
      { time: "凌晨 0-6点", count: 1, percentage: 1 },
    ],
    insight: "你是典型的夜猫子写作者，夜晚思维最活跃",
  },
  writingFrequency: {
    averagePerWeek: 5.2,
    streaks: [
      { start: "2026-02-15", end: "2026-03-12", days: 26, active: true },
      { start: "2026-01-20", end: "2026-02-10", days: 21, active: false },
    ],
    bestDay: "周六",
    worstDay: "周二",
    monthlyTrend: "上升 (+15%)",
  },
  contentPatterns: {
    avgWordCount: 850,
    avgReadingTime: "3.5 分钟",
    topTags: [
      { tag: "AI", count: 15 },
      { tag: "功能", count: 12 },
      { tag: "系统", count: 10 },
      { tag: "优化", count: 8 },
      { tag: "学习", count: 6 },
    ],
    moodDistribution: [
      { mood: "开心", count: 25, color: "bg-green-500" },
      { mood: "满足", count: 18, color: "bg-blue-500" },
      { mood: "平静", count: 15, color: "bg-cyan-500" },
      { mood: "兴奋", count: 10, color: "bg-purple-500" },
      { mood: "疲惫", count: 5, color: "bg-yellow-500" },
    ],
  },
  productivity: {
    score: 82,
    factors: [
      { name: "连续性", score: 95, impact: "+18%" },
      { name: "内容质量", score: 88, impact: "+12%" },
      { name: "字数稳定", score: 75, impact: "+8%" },
      { name: "心情积极", score: 82, impact: "+10%" },
    ],
    suggestions: [
      "尝试在周末增加写作量，保持节奏",
      "周二可以设定写作提醒，避免中断",
      "记录心情细节，让日记更有温度",
    ],
  },
  seasonal: {
    springAvg: 820,
    summerAvg: null,
    fallAvg: null,
    winterAvg: null,
    insight: "春季写作最活跃，建议保持这个势头",
  },
};

export default function HabitAnalysisPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-fuchsia-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-fuchsia-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 标题 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl">🧠</span>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-fuchsia-600 bg-clip-text text-transparent">
              习惯分析
            </h1>
          </div>
          <p className="text-gray-500">深度分析你的日记写作模式和习惯</p>
        </div>

        {/* 写作时间分布 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8 border border-white/50">
          <h2 className="text-lg font-bold text-gray-800 mb-4">⏰ 写作时间分布</h2>
          <div className="mb-4">
            <span className="text-sm text-gray-500">最佳写作时段</span>
            <div className="text-2xl font-bold text-rose-600 mt-1">
              {habitAnalysis.writingTime.preferredTime}
            </div>
          </div>
          <div className="space-y-3">
            {habitAnalysis.writingTime.distribution.map((item) => (
              <div key={item.time} className="flex items-center gap-3">
                <div className="w-24 text-sm text-gray-600">{item.time}</div>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-rose-400 to-fuchsia-400 rounded-full transition-all"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="w-12 text-right text-sm text-gray-500">
                  {item.percentage}%
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-rose-50 rounded-xl text-sm text-rose-600">
            💡 {habitAnalysis.writingTime.insight}
          </div>
        </div>

        {/* 写作频率 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/50">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📊 写作频率</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-rose-50 to-fuchsia-50 rounded-2xl">
                <div className="text-3xl font-bold text-rose-600">
                  {habitAnalysis.writingFrequency.averagePerWeek}
                </div>
                <div className="text-sm text-gray-500 mt-1">篇/周</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl">
                <div className="text-3xl font-bold text-pink-600">
                  {habitAnalysis.writingFrequency.streaks[0].days}
                </div>
                <div className="text-sm text-gray-500 mt-1">连续天数</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span className="text-gray-600">最佳日: {habitAnalysis.writingFrequency.bestDay}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">!</span>
                <span className="text-gray-600">待改进: {habitAnalysis.writingFrequency.worstDay}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-emerald-500 font-medium">
                📈 {habitAnalysis.writingFrequency.monthlyTrend}
              </span>
            </div>
          </div>

          {/* 内容模式 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/50">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📝 内容模式</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-rose-50 rounded-xl">
                <div className="text-2xl font-bold text-rose-600">
                  {habitAnalysis.contentPatterns.avgWordCount}
                </div>
                <div className="text-xs text-gray-500">平均字数</div>
              </div>
              <div className="text-center p-3 bg-fuchsia-50 rounded-xl">
                <div className="text-2xl font-bold text-fuchsia-600">
                  {habitAnalysis.contentPatterns.avgReadingTime}
                </div>
                <div className="text-xs text-gray-500">阅读时长</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-2">常用标签</div>
            <div className="flex flex-wrap gap-2">
              {habitAnalysis.contentPatterns.topTags.map((tag) => (
                <span
                  key={tag.tag}
                  className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-sm"
                >
                  #{tag.tag} ({tag.count})
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 心情分布 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8 border border-white/50">
          <h2 className="text-lg font-bold text-gray-800 mb-4">😊 心情分布</h2>
          <div className="flex items-end gap-2 h-32">
            {habitAnalysis.contentPatterns.moodDistribution.map((item) => (
              <div key={item.mood} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full ${item.color} rounded-t-xl transition-all`}
                  style={{ height: `${(item.count / 25) * 100}%` }}
                />
                <div className="mt-2 text-sm text-gray-600">{item.mood}</div>
                <div className="text-xs text-gray-400">{item.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 生产力分析 */}
        <div className="bg-gradient-to-r from-rose-500 to-fuchsia-500 rounded-3xl p-8 text-white mb-8">
          <h2 className="text-2xl font-bold mb-4">🎯 写作生产力评分</h2>
          <div className="flex items-center gap-6 mb-6">
            <div className="text-6xl font-bold">{habitAnalysis.productivity.score}</div>
            <div>
              <div className="text-white/80">综合评分</div>
              <div className="text-sm text-white/60">基于多维度分析</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {habitAnalysis.productivity.factors.map((factor) => (
              <div key={factor.name} className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{factor.name}</span>
                  <span className="text-sm text-white/80">{factor.score}分</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full"
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
                <div className="text-xs text-white/60 mt-1">影响 {factor.impact}</div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {habitAnalysis.productivity.suggestions.map((suggestion, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-white/90">
                <span>💡</span>
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 连续记录 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8 border border-white/50">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🔥 连续记录</h2>
          <div className="space-y-4">
            {habitAnalysis.writingFrequency.streaks.map((streak, i) => (
              <div
                key={i}
                className={`p-4 rounded-2xl ${streak.active ? 'bg-gradient-to-r from-rose-50 to-fuchsia-50 border-2 border-rose-200' : 'bg-gray-50'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-rose-600">{streak.days} 天</span>
                      {streak.active && (
                        <span className="px-2 py-0.5 bg-rose-500 text-white text-xs rounded-full">
                          进行中
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {streak.start} → {streak.active ? '现在' : streak.end}
                    </div>
                  </div>
                  <div className="text-4xl">🔥</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 相关链接 */}
        <div className="grid grid-cols-3 gap-4">
          <Link
            href="/habits"
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center hover:shadow-md transition-shadow"
          >
            <span className="text-2xl block mb-2">✅</span>
            <span className="text-sm font-medium text-gray-700">习惯追踪</span>
          </Link>
          <Link
            href="/stats"
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center hover:shadow-md transition-shadow"
          >
            <span className="text-2xl block mb-2">📊</span>
            <span className="text-sm font-medium text-gray-700">详细统计</span>
          </Link>
          <Link
            href="/writing-analysis"
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center hover:shadow-md transition-shadow"
          >
            <span className="text-2xl block mb-2">✍️</span>
            <span className="text-sm font-medium text-gray-700">写作分析</span>
          </Link>
        </div>
      </div>
    </div>
  );
}