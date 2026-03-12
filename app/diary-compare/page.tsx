import Link from "next/link";

export const metadata = {
  title: "日记对比 - Claw Diary",
  description: "对比不同时期的日记，发现成长与变化",
};

// 模拟对比数据
const comparisonModes = [
  { id: "period", name: "时间段对比", icon: "📅", desc: "对比两个时间段的写作情况" },
  { id: "mood", name: "心情对比", icon: "😊", desc: "不同心情状态下的写作差异" },
  { id: "growth", name: "成长对比", icon: "🌱", desc: "今昔对比，见证成长" },
];

const recentComparisons = [
  { id: 1, name: "1月 vs 2月", type: "时间段对比", date: "2026-03-10", insight: "字数增长15%" },
  { id: 2, name: "开心 vs 疲惫", type: "心情对比", date: "2026-03-08", insight: "字数差异1656字" },
  { id: 3, name: "年初 vs 现在", type: "成长对比", date: "2026-03-05", insight: "进步显著" },
];

const sampleComparison = {
  periodA: {
    label: "2026年1月",
    entries: 13,
    words: 28500,
    avgWords: 2192,
    topTags: ["AI", "系统", "功能"],
    moods: { happy: 5, calm: 4, tired: 3, anxious: 1 },
  },
  periodB: {
    label: "2026年2月",
    entries: 15,
    words: 32100,
    avgWords: 2140,
    topTags: ["AI", "优化", "成长"],
    moods: { happy: 7, calm: 5, tired: 2, anxious: 1 },
  },
  diff: {
    entries: +2,
    words: +3600,
    avgWords: -52,
    consistency: +8,
  },
  insights: [
    { type: "positive", icon: "📈", text: "写作量增加，2月比1月多写3600字" },
    { type: "positive", icon: "😊", text: "积极情绪比例从38%提升到47%" },
    { type: "neutral", icon: "📊", text: "平均字数略有下降，但更稳定" },
    { type: "suggestion", icon: "💡", text: "建议保持当前节奏，同时尝试增加单篇深度" },
  ],
};

const growthComparison = {
  before: {
    label: "3个月前",
    totalWords: 0,
    entries: 0,
    avgWords: 0,
    topTags: [],
    habits: [],
  },
  now: {
    label: "现在",
    totalWords: 156420,
    entries: 73,
    avgWords: 2143,
    topTags: ["AI", "系统", "功能"],
    habits: ["每日写作", "早起记录", "周度反思"],
  },
  milestones: [
    { date: "2025-12-01", event: "开始写日记", icon: "🚀" },
    { date: "2025-12-20", event: "字数破万", icon: "📝" },
    { date: "2026-01-05", event: "连续30天", icon: "🔥" },
    { date: "2026-02-28", event: "字数十万", icon: "🎯" },
    { date: "2026-03-04", event: "连续60天", icon: "🌟" },
  ],
};

export default function DiaryComparePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* 头部 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                ← 返回首页
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  ⚖️ 日记对比
                </h1>
                <p className="text-sm text-gray-500">发现成长与变化</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              + 新建对比
            </button>
          </div>
        </div>
      </header>

      {/* 对比模式选择 */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {comparisonModes.map((mode) => (
            <div
              key={mode.id}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="text-3xl mb-3">{mode.icon}</div>
              <h3 className="font-semibold text-gray-800">{mode.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{mode.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 最近对比 */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        <h2 className="font-semibold text-gray-800 mb-4">最近对比</h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">对比名称</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">类型</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">日期</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">洞察</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentComparisons.map((comp) => (
                <tr key={comp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{comp.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{comp.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{comp.date}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                      {comp.insight}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="text-orange-600 hover:text-orange-700 text-sm">
                      查看 →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 示例对比：时间段对比 */}
      <main className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-800">时间段对比示例</h2>
            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">
              1月 vs 2月
            </span>
          </div>

          {/* 对比卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* 时间段 A */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-4">{sampleComparison.periodA.label}</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">日记数</span>
                  <span className="font-medium text-gray-800">{sampleComparison.periodA.entries} 篇</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">总字数</span>
                  <span className="font-medium text-gray-800">{(sampleComparison.periodA.words / 1000).toFixed(1)}K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">平均字数</span>
                  <span className="font-medium text-gray-800">{sampleComparison.periodA.avgWords} 字</span>
                </div>
                <div className="pt-2 border-t border-blue-200">
                  <span className="text-sm text-gray-500">热门标签：</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {sampleComparison.periodA.topTags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 时间段 B */}
            <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl p-5 border border-orange-100">
              <h3 className="font-medium text-orange-800 mb-4">{sampleComparison.periodB.label}</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">日记数</span>
                  <span className="font-medium text-gray-800">
                    {sampleComparison.periodB.entries} 篇
                    <span className="text-green-600 text-sm ml-1">(+{sampleComparison.diff.entries})</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">总字数</span>
                  <span className="font-medium text-gray-800">
                    {(sampleComparison.periodB.words / 1000).toFixed(1)}K
                    <span className="text-green-600 text-sm ml-1">(+{sampleComparison.diff.words / 1000}K)</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">平均字数</span>
                  <span className="font-medium text-gray-800">
                    {sampleComparison.periodB.avgWords} 字
                    <span className="text-red-600 text-sm ml-1">({sampleComparison.diff.avgWords})</span>
                  </span>
                </div>
                <div className="pt-2 border-t border-orange-200">
                  <span className="text-sm text-gray-500">热门标签：</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {sampleComparison.periodB.topTags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 洞察 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-gray-800 mb-3">对比洞察</h4>
            <div className="space-y-2">
              {sampleComparison.insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span>{insight.icon}</span>
                  <span className={`text-sm ${
                    insight.type === "positive" ? "text-green-700" :
                    insight.type === "suggestion" ? "text-blue-700" :
                    "text-gray-600"
                  }`}>
                    {insight.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 成长对比 */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-6">成长轨迹 🌱</h2>
          
          {/* 里程碑时间线 */}
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-6">
              {growthComparison.milestones.map((milestone, index) => (
                <div key={index} className="relative flex items-start gap-4 pl-10">
                  <div className="absolute left-2 w-5 h-5 bg-white border-2 border-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-xs">{milestone.icon}</span>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">{milestone.event}</span>
                      <span className="text-sm text-gray-500">{milestone.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 今昔对比卡片 */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-100 rounded-xl p-5">
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">{growthComparison.before.label}</div>
                <div className="text-4xl font-bold text-gray-300">0</div>
                <div className="text-sm text-gray-400 mt-1">字</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-100 to-rose-100 rounded-xl p-5">
              <div className="text-center">
                <div className="text-sm text-orange-600 mb-2">{growthComparison.now.label}</div>
                <div className="text-4xl font-bold text-orange-600">
                  {(growthComparison.now.totalWords / 1000).toFixed(1)}K
                </div>
                <div className="text-sm text-orange-500 mt-1">{growthComparison.now.entries} 篇日记</div>
              </div>
            </div>
          </div>
        </div>

        {/* 创建新对比 */}
        <div className="mt-6 bg-gradient-to-r from-orange-500 to-rose-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">创建你的自定义对比</h3>
              <p className="text-orange-100 text-sm mt-1">
                选择任意两个时间段、心情或维度进行对比
              </p>
            </div>
            <button className="px-5 py-2.5 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors">
              开始对比
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}