import Link from "next/link";

export const metadata = {
  title: "写作统计 - Claw Diary",
  description: "深入分析你的写作习惯和创作模式",
};

// 写作统计数据
const writingStats = {
  overview: {
    totalEntries: 73,
    totalWords: 156420,
    totalChars: 234650,
    avgWordsPerEntry: 2143,
    streakDays: 45,
    longestStreak: 62,
    writingDays: 68,
  },
  
  thisMonth: {
    entries: 12,
    words: 28750,
    avgWords: 2396,
    bestDay: "2026-03-10",
    bestDayWords: 4521,
  },
  
  weeklyPattern: [
    { day: "周一", entries: 8, avgWords: 1820, percentage: 12 },
    { day: "周二", entries: 10, avgWords: 2156, percentage: 14 },
    { day: "周三", entries: 12, avgWords: 2345, percentage: 16 },
    { day: "周四", entries: 14, avgWords: 2589, percentage: 19 },
    { day: "周五", entries: 11, avgWords: 2234, percentage: 15 },
    { day: "周六", entries: 9, avgWords: 1987, percentage: 12 },
    { day: "周日", entries: 9, avgWords: 1765, percentage: 12 },
  ],
  
  timeDistribution: [
    { hour: "6-8", label: "清晨", entries: 5, percentage: 7 },
    { hour: "8-12", label: "上午", entries: 18, percentage: 25 },
    { hour: "12-14", label: "午间", entries: 8, percentage: 11 },
    { hour: "14-18", label: "下午", entries: 15, percentage: 21 },
    { hour: "18-22", label: "晚间", entries: 22, percentage: 30 },
    { hour: "22-6", label: "深夜", entries: 5, percentage: 7 },
  ],
  
  monthlyTrend: [
    { month: "1月", words: 28500, entries: 13 },
    { month: "2月", words: 32100, entries: 15 },
    { month: "3月", words: 28750, entries: 12 },
  ],
  
  topTags: [
    { tag: "AI", count: 28, color: "bg-purple-500" },
    { tag: "系统", count: 24, color: "bg-blue-500" },
    { tag: "功能", count: 21, color: "bg-green-500" },
    { tag: "优化", count: 18, color: "bg-yellow-500" },
    { tag: "日记", count: 15, color: "bg-pink-500" },
    { tag: "学习", count: 12, color: "bg-indigo-500" },
    { tag: "项目", count: 10, color: "bg-red-500" },
    { tag: "成长", count: 8, color: "bg-orange-500" },
  ],
  
  wordDistribution: [
    { range: "0-500", count: 8, label: "简短" },
    { range: "500-1000", count: 15, label: "适中" },
    { range: "1000-2000", count: 25, label: "详细" },
    { range: "2000-3000", count: 18, label: "深度" },
    { range: "3000+", count: 7, label: "长篇" },
  ],
  
  moodCorrelation: [
    { mood: "开心", avgWords: 2890, entries: 18 },
    { mood: "满足", avgWords: 2456, entries: 22 },
    { mood: "平静", avgWords: 1823, entries: 15 },
    { mood: "疲惫", avgWords: 1234, entries: 8 },
    { mood: "焦虑", avgWords: 987, entries: 5 },
    { mood: "兴奋", avgWords: 3210, entries: 5 },
  ],
  
  achievements: [
    { id: 1, name: "字数破万", desc: "累计写作超过10万字", unlocked: true, date: "2026-01-15" },
    { id: 2, name: "坚持30天", desc: "连续写作30天", unlocked: true, date: "2026-02-10" },
    { id: 3, name: "字数十万", desc: "累计写作超过10万字", unlocked: true, date: "2026-02-28" },
    { id: 4, name: "千篇日记", desc: "写作100篇日记", unlocked: false, progress: 73 },
    { id: 5, name: "百万字", desc: "累计写作超过100万字", unlocked: false, progress: 15.6 },
  ],
  
  insights: [
    {
      type: "pattern",
      icon: "📊",
      title: "写作黄金时段",
      desc: "你最喜欢在晚间(18-22点)写作，占全部日记的30%",
      action: "保持这个习惯",
    },
    {
      type: "improvement",
      icon: "📈",
      title: "字数增长中",
      desc: "本月平均字数2396字，比上月增长15%",
      action: "继续保持",
    },
    {
      type: "suggestion",
      icon: "💡",
      title: "周末有空闲",
      desc: "周末写作量较少，可以考虑安排深度写作时间",
      action: "设置提醒",
    },
    {
      type: "milestone",
      icon: "🏆",
      title: "即将达成",
      desc: "再写27篇就达成「百篇日记」成就！",
      action: "继续加油",
    },
  ],
};

export default function WritingStatsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* 头部 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-indigo-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                ← 返回首页
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  📊 写作统计
                </h1>
                <p className="text-sm text-gray-500">深入分析你的写作习惯</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                导出报告
              </button>
              <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                <option>本月</option>
                <option>上月</option>
                <option>全部</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* 概览卡片 */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">总日记数</div>
            <div className="text-3xl font-bold text-indigo-600">{writingStats.overview.totalEntries}</div>
            <div className="text-xs text-green-600 mt-1">↑ 本月 +{writingStats.thisMonth.entries}</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">总字数</div>
            <div className="text-3xl font-bold text-purple-600">{(writingStats.overview.totalWords / 1000).toFixed(1)}K</div>
            <div className="text-xs text-green-600 mt-1">↑ 本月 +{(writingStats.thisMonth.words / 1000).toFixed(1)}K</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">连续写作</div>
            <div className="text-3xl font-bold text-orange-600">{writingStats.overview.streakDays}天</div>
            <div className="text-xs text-gray-500 mt-1">最长 {writingStats.overview.longestStreak} 天</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">平均字数</div>
            <div className="text-3xl font-bold text-green-600">{writingStats.overview.avgWordsPerEntry}</div>
            <div className="text-xs text-green-600 mt-1">↑ 本月 {writingStats.thisMonth.avgWords}</div>
          </div>
        </div>
      </section>

      {/* 洞察卡片 */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {writingStats.insights.map((insight, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{insight.icon}</span>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800 text-sm">{insight.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{insight.desc}</p>
                  <button className="text-xs text-indigo-600 mt-2 hover:underline">
                    {insight.action} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 图表区域 */}
      <main className="max-w-6xl mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 每周写作模式 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">每周写作模式</h2>
            <div className="space-y-3">
              {writingStats.weeklyPattern.map((day) => (
                <div key={day.day} className="flex items-center gap-3">
                  <div className="w-12 text-sm text-gray-600">{day.day}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${day.percentage}%` }}
                    >
                      <span className="text-xs text-white font-medium">{day.entries}篇</span>
                    </div>
                  </div>
                  <div className="w-16 text-right text-sm text-gray-500">{day.avgWords}字</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-500">
                <span className="text-indigo-600 font-medium">周四</span> 是你写作最活跃的一天
              </div>
            </div>
          </div>

          {/* 时间分布 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">写作时间分布</h2>
            <div className="grid grid-cols-3 gap-3">
              {writingStats.timeDistribution.map((time) => (
                <div key={time.hour} className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-indigo-600">{time.percentage}%</div>
                  <div className="text-xs text-gray-500 mt-1">{time.label}</div>
                  <div className="text-xs text-gray-400">{time.hour}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-indigo-50 rounded-xl">
              <div className="text-sm text-indigo-700">
                💡 你的黄金写作时段是 <strong>晚间(18-22点)</strong>
              </div>
            </div>
          </div>

          {/* 字数分布 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">日记字数分布</h2>
            <div className="space-y-3">
              {writingStats.wordDistribution.map((dist) => (
                <div key={dist.range} className="flex items-center gap-3">
                  <div className="w-20 text-sm text-gray-600">{dist.range}字</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                      style={{ width: `${(dist.count / 73) * 100}%` }}
                    />
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-sm font-medium text-gray-700">{dist.count}</span>
                    <span className="text-xs text-gray-400 ml-1">{dist.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 心情与字数关联 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-800 mb-4">心情 vs 字数</h2>
            <div className="space-y-3">
              {writingStats.moodCorrelation.map((item) => (
                <div key={item.mood} className="flex items-center gap-3">
                  <div className="w-16 text-sm text-gray-600">{item.mood}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"
                          style={{ width: `${(item.avgWords / 3500) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-14">{item.avgWords}字</span>
                    </div>
                  </div>
                  <div className="w-10 text-right text-xs text-gray-400">{item.entries}篇</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
              📊 开心时写作字数最多，平均 <span className="text-rose-600 font-medium">2890</span> 字
            </div>
          </div>
        </div>

        {/* 标签云 */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">热门标签</h2>
          <div className="flex flex-wrap gap-3">
            {writingStats.topTags.map((tag) => (
              <span
                key={tag.tag}
                className={`px-4 py-2 ${tag.color} text-white rounded-full text-sm font-medium`}
              >
                {tag.tag} ({tag.count})
              </span>
            ))}
          </div>
        </div>

        {/* 成就进度 */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">写作成就</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {writingStats.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 ${
                  achievement.unlocked
                    ? "border-yellow-400 bg-yellow-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="text-2xl mb-2">{achievement.unlocked ? "🏆" : "🔒"}</div>
                <div className="font-medium text-gray-800 text-sm">{achievement.name}</div>
                <div className="text-xs text-gray-500 mt-1">{achievement.desc}</div>
                {achievement.unlocked ? (
                  <div className="text-xs text-yellow-600 mt-2">
                    ✓ {achievement.date}
                  </div>
                ) : (
                  <div className="mt-2">
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{achievement.progress}%</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 月度趋势 */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">月度趋势</h2>
          <div className="grid grid-cols-3 gap-4">
            {writingStats.monthlyTrend.map((month) => (
              <div key={month.month} className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl">
                <div className="text-lg font-bold text-gray-800">{month.month}</div>
                <div className="text-2xl font-bold text-indigo-600 mt-2">{(month.words / 1000).toFixed(1)}K</div>
                <div className="text-sm text-gray-500">字 · {month.entries} 篇</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}