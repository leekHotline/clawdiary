import Link from "next/link";

export const metadata = {
  title: "心情预测 - Claw Diary",
  description: "AI 基于历史数据分析预测未来心情趋势",
};

// 模拟预测数据
const moodPrediction = {
  overallTrend: "上升",
  confidence: 78,
  nextWeek: [
    { day: "周一", mood: "开心", score: 8, reason: "周末休息后状态恢复" },
    { day: "周二", mood: "平静", score: 7, reason: "常规工作日，情绪稳定" },
    { day: "周三", mood: "兴奋", score: 9, reason: "预期有愉快事件" },
    { day: "周四", mood: "满足", score: 8, reason: "目标完成后的成就感" },
    { day: "周五", mood: "开心", score: 8, reason: "周末临近的期待感" },
    { day: "周六", mood: "放松", score: 9, reason: "自由支配时间" },
    { day: "周日", mood: "平静", score: 7, reason: "为新一周做准备" },
  ],
  insights: [
    {
      type: "pattern",
      icon: "📊",
      title: "周期规律",
      desc: "你的心情在周末明显好于工作日，建议在周中安排一些小确幸",
    },
    {
      type: "trigger",
      icon: "🎯",
      title: "积极触发因素",
      desc: "运动、社交、创作是你心情提升的三大法宝",
    },
    {
      type: "warning",
      icon: "⚠️",
      title: "潜在压力源",
      desc: "周中下午时段容易出现疲惫感，建议适当休息",
    },
    {
      type: "suggestion",
      icon: "💡",
      title: "改善建议",
      desc: "每周三安排一次小型奖励，可以显著提升整体幸福感",
    },
  ],
  monthlyTrend: [
    { week: "第1周", avg: 6.5 },
    { week: "第2周", avg: 7.2 },
    { week: "第3周", avg: 7.8 },
    { week: "第4周", avg: 8.1, predicted: true },
  ],
};

const moodFactors = [
  { name: "睡眠质量", impact: "+15%", trend: "up", icon: "😴" },
  { name: "运动频率", impact: "+12%", trend: "up", icon: "🏃" },
  { name: "社交活动", impact: "+8%", trend: "stable", icon: "👥" },
  { name: "创作输出", impact: "+10%", trend: "up", icon: "✍️" },
  { name: "工作压力", impact: "-5%", trend: "down", icon: "💼" },
  { name: "天气变化", impact: "-3%", trend: "stable", icon: "🌤️" },
];

export default function MoodPredictionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-fuchsia-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-fuchsia-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 标题 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl">🔮</span>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              心情预测
            </h1>
          </div>
          <p className="text-gray-500">AI 分析历史数据，预测未来心情趋势</p>
        </div>

        {/* 总体预测 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8 border border-white/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-sm text-gray-500">未来一周心情趋势</span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-3xl font-bold text-violet-600">{moodPrediction.overallTrend}</span>
                <span className="text-sm text-gray-400">趋势</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500">预测置信度</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                    style={{ width: `${moodPrediction.confidence}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-violet-600">{moodPrediction.confidence}%</span>
              </div>
            </div>
          </div>

          {/* 周预测 */}
          <div className="grid grid-cols-7 gap-2">
            {moodPrediction.nextWeek.map((day, i) => (
              <div key={i} className="text-center">
                <div className="text-xs text-gray-400 mb-2">{day.day}</div>
                <div 
                  className="aspect-square rounded-2xl flex items-center justify-center text-lg font-bold mb-2"
                  style={{
                    background: day.score >= 8 
                      ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
                      : day.score >= 6
                      ? 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'
                      : 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                    color: 'white',
                  }}
                >
                  {day.score}
                </div>
                <div className="text-xs text-gray-600">{day.mood}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 月度趋势 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8 border border-white/50">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📈 月度心情趋势</h2>
          <div className="flex items-end gap-4 h-32">
            {moodPrediction.monthlyTrend.map((week, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className={`w-full rounded-t-xl transition-all ${week.predicted ? 'bg-gradient-to-t from-violet-200 to-violet-400' : 'bg-gradient-to-t from-violet-400 to-violet-600'}`}
                  style={{ height: `${(week.avg / 10) * 100}%` }}
                />
                <div className="mt-2 text-sm font-medium text-gray-600">{week.avg}</div>
                <div className="text-xs text-gray-400 mt-1">{week.week}</div>
                {week.predicted && (
                  <span className="text-xs text-violet-500 mt-1">预测</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 影响因素 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8 border border-white/50">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🎯 心情影响因素分析</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {moodFactors.map((factor, i) => (
              <div 
                key={i}
                className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{factor.icon}</span>
                  <span className="font-medium text-gray-700">{factor.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-lg font-bold ${factor.impact.startsWith('+') ? 'text-green-600' : 'text-red-500'}`}>
                    {factor.impact}
                  </span>
                  <span className="text-sm text-gray-400">影响</span>
                  {factor.trend === 'up' && <span className="text-green-500">↑</span>}
                  {factor.trend === 'down' && <span className="text-red-500">↓</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 洞察建议 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {moodPrediction.insights.map((insight, i) => (
            <div 
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{insight.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-800">{insight.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{insight.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 行动建议 */}
        <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-3xl p-8 text-white mb-8">
          <h2 className="text-2xl font-bold mb-4">💡 本周行动建议</h2>
          <div className="space-y-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">🏃</span>
              <div>
                <div className="font-medium">周三傍晚运动 30 分钟</div>
                <div className="text-sm text-white/80">可提升本周心情指数 15%</div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">👥</span>
              <div>
                <div className="font-medium">周五安排一次朋友聚会</div>
                <div className="text-sm text-white/80">社交活动能延续周末的幸福感</div>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3">
              <span className="text-2xl">📝</span>
              <div>
                <div className="font-medium">记录每天三件感恩的事</div>
                <div className="text-sm text-white/80">持续感恩练习可提升整体幸福感</div>
              </div>
            </div>
          </div>
        </div>

        {/* 相关链接 */}
        <div className="grid grid-cols-3 gap-4">
          <Link
            href="/mood"
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center hover:shadow-md transition-shadow"
          >
            <span className="text-2xl block mb-2">📊</span>
            <span className="text-sm font-medium text-gray-700">心情历史</span>
          </Link>
          <Link
            href="/mood/calendar"
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center hover:shadow-md transition-shadow"
          >
            <span className="text-2xl block mb-2">📅</span>
            <span className="text-sm font-medium text-gray-700">心情日历</span>
          </Link>
          <Link
            href="/mood-trends"
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 text-center hover:shadow-md transition-shadow"
          >
            <span className="text-2xl block mb-2">📈</span>
            <span className="text-sm font-medium text-gray-700">趋势分析</span>
          </Link>
        </div>
      </div>
    </div>
  );
}