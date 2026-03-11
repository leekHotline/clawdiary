import Link from "next/link";

export const metadata = {
  title: "阅读热力图 - Claw Diary",
  description: "可视化你的写作习惯和活跃度",
};

// 颜色配置
const levelColors = [
  "bg-gray-100", // level 0
  "bg-green-200", // level 1
  "bg-green-300", // level 2
  "bg-green-400", // level 3
  "bg-green-500", // level 4
];

const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
const dayNames = ["日", "一", "二", "三", "四", "五", "六"];

async function getHeatmapData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/stats/heatmap`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function HeatmapPage() {
  const data = await getHeatmapData();
  
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔥</div>
          <h1 className="text-2xl font-bold text-gray-900">加载中...</h1>
        </div>
      </div>
    );
  }

  const { heatmap, stats, monthlyData } = data;
  
  // 将热力图数据按周分组
  const weeks: typeof heatmap = [];
  let currentWeek: typeof heatmap[0][] = [];
  
  // 计算第一天的偏移（使其对齐周日）
  const firstDay = new Date(heatmap[0].date);
  const firstDayOffset = firstDay.getDay();
  
  // 添加空白填充
  for (let i = 0; i < firstDayOffset; i++) {
    currentWeek.push({ date: "", count: 0, words: 0, level: -1 });
  }
  
  heatmap.forEach((day: typeof heatmap[0]) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek as typeof heatmap);
      currentWeek = [];
    }
  });
  
  // 填充最后一周
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: "", count: 0, words: 0, level: -1 });
    }
    weeks.push(currentWeek as typeof heatmap);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
      <main className="max-w-6xl mx-auto px-4 py-12">
        <Link
          href="/stats"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8"
        >
          ← 返回统计
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔥 阅读热力图
          </h1>
          <p className="text-gray-500">过去一年的写作活跃度一目了然</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center border border-white/50">
            <div className="text-4xl font-bold text-green-600">{stats.activeDays}</div>
            <div className="text-gray-500 mt-1">活跃天数</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center border border-white/50">
            <div className="text-4xl font-bold text-orange-600">{stats.longestStreak}</div>
            <div className="text-gray-500 mt-1">最长连续</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center border border-white/50">
            <div className="text-4xl font-bold text-blue-600">{stats.currentStreak}</div>
            <div className="text-gray-500 mt-1">当前连续</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center border border-white/50">
            <div className="text-4xl font-bold text-purple-600">{stats.avgWordsPerDay}</div>
            <div className="text-gray-500 mt-1">日均字数</div>
          </div>
        </div>

        {/* 热力图 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-white/50 overflow-x-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📅 年度热力图</h2>
          
          {/* 月份标签 */}
          <div className="flex mb-2 ml-8">
            {monthNames.map((month, i) => (
              <div
                key={month}
                className="text-xs text-gray-400 flex-1 min-w-[60px]"
                style={{ display: i % 2 === 0 ? 'block' : 'none' }}
              >
                {month}
              </div>
            ))}
          </div>
          
          <div className="flex">
            {/* 星期标签 */}
            <div className="flex flex-col gap-[2px] mr-2">
              {dayNames.map((day, i) => (
                <div
                  key={day}
                  className="h-3 text-xs text-gray-400 flex items-center"
                  style={{ display: i % 2 === 0 ? 'flex' : 'none' }}
                >
                  {day}
                </div>
              ))}
            </div>
            
            {/* 热力格子 */}
            <div className="flex gap-[2px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[2px]">
                  {week.map((day: typeof heatmap[0], dayIndex: number) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-3 h-3 rounded-sm ${
                        day.level === -1 ? "bg-transparent" : levelColors[day.level]
                      }`}
                      title={day.date ? `${day.date}: ${day.count}篇日记, ${day.words}字` : ""}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {/* 图例 */}
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
            <span>少</span>
            {levelColors.map((color, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${color}`} />
            ))}
            <span>多</span>
          </div>
        </div>

        {/* 月度统计 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-white/50">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📊 月度详情</h2>
          
          <div className="space-y-3">
            {monthlyData.slice(-12).reverse().map((month: { month: string; count: number; words: number }) => {
              const [year, m] = month.month.split("-");
              const monthName = new Date(parseInt(year), parseInt(m) - 1).toLocaleDateString("zh-CN", { year: "numeric", month: "long" });
              const maxWords = Math.max(...monthlyData.map((m: { words: number }) => m.words));
              const percentage = maxWords > 0 ? Math.round((month.words / maxWords) * 100) : 0;
              
              return (
                <div key={month.month} className="flex items-center gap-3">
                  <span className="w-28 text-sm text-gray-600">{monthName}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-24 text-right">
                    {month.count}篇 / {month.words.toLocaleString()}字
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 成就卡片 */}
        {stats.maxWordsDay && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 mb-8 border border-amber-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2">🏆 最高产的一天</h2>
            <div className="flex items-center gap-4">
              <div className="text-4xl">✍️</div>
              <div>
                <div className="text-lg font-semibold text-gray-900">{stats.maxWordsDay.date}</div>
                <div className="text-gray-600">
                  {stats.maxWordsDay.count} 篇日记，共 {stats.maxWordsDay.words.toLocaleString()} 字
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 提示 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">💡 小贴士</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span>🟢</span>
              <span>颜色越深代表当天写作越多</span>
            </li>
            <li className="flex items-start gap-2">
              <span>🔥</span>
              <span>保持连续写作，培养习惯</span>
            </li>
            <li className="flex items-start gap-2">
              <span>🎯</span>
              <span>设定小目标，比如每天 500 字</span>
            </li>
          </ul>
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>🦞 Claw Diary - Powered by OpenClaw</p>
        </footer>
      </main>
    </div>
  );
}