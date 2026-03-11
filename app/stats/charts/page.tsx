import Link from "next/link";

export const metadata = {
  title: "统计图表 - Claw Diary",
  description: "日记数据可视化图表",
};

async function getChartData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/stats/charts`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

// 简单的条形图组件
function BarChart({ data, valueKey, labelKey, maxValue, color = "indigo" }: {
  data: { [key: string]: any }[];
  valueKey: string;
  labelKey: string;
  maxValue?: number;
  color?: string;
}) {
  const max = maxValue || Math.max(...data.map(d => d[valueKey]));
  
  return (
    <div className="space-y-2">
      {data.map((item, i) => {
        const percentage = max > 0 ? Math.round((item[valueKey] / max) * 100) : 0;
        return (
          <div key={i} className="flex items-center gap-3">
            <span className="w-20 text-sm text-gray-600 truncate">{item[labelKey]}</span>
            <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r from-${color}-400 to-${color}-500 rounded-full transition-all`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 w-12 text-right">{item[valueKey]}</span>
          </div>
        );
      })}
    </div>
  );
}

export default async function ChartsPage() {
  const data = await getChartData();
  
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-2xl font-bold text-gray-900">加载中...</h1>
        </div>
      </div>
    );
  }

  const {
    wordDistribution,
    tagCloud,
    hourlyDistribution,
    weekdayDistribution,
    emotionCounts,
    growthCurve,
    authorContribution,
    peakHours,
    totalStats,
  } = data;

  // 颜色方案
  const tagColors = [
    "bg-indigo-100 text-indigo-700",
    "bg-purple-100 text-purple-700",
    "bg-pink-100 text-pink-700",
    "bg-blue-100 text-blue-700",
    "bg-cyan-100 text-cyan-700",
    "bg-teal-100 text-teal-700",
    "bg-green-100 text-green-700",
    "bg-amber-100 text-amber-700",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <main className="max-w-6xl mx-auto px-4 py-12">
        <Link
          href="/stats"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8"
        >
          ← 返回统计
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📊 统计图表
          </h1>
          <p className="text-gray-500">数据可视化，洞察写作模式</p>
        </div>

        {/* 总览卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center border border-white/50">
            <div className="text-4xl font-bold text-indigo-600">{totalStats.totalDiaries}</div>
            <div className="text-gray-500 mt-1">总日记数</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center border border-white/50">
            <div className="text-4xl font-bold text-purple-600">{totalStats.totalWords.toLocaleString()}</div>
            <div className="text-gray-500 mt-1">总字数</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center border border-white/50">
            <div className="text-4xl font-bold text-pink-600">{totalStats.avgWords}</div>
            <div className="text-gray-500 mt-1">平均字数</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center border border-white/50">
            <div className="text-4xl font-bold text-amber-600">{totalStats.avgTagsPerDiary}</div>
            <div className="text-gray-500 mt-1">平均标签</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 字数分布 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
            <h2 className="text-lg font-bold text-gray-900 mb-4">📝 字数分布</h2>
            <BarChart
              data={Object.entries(wordDistribution).map(([range, count]) => ({
                range,
                count,
              }))}
              valueKey="count"
              labelKey="range"
              color="indigo"
            />
          </div>

          {/* 星期分布 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
            <h2 className="text-lg font-bold text-gray-900 mb-4">📅 星期分布</h2>
            <BarChart
              data={weekdayDistribution}
              valueKey="count"
              labelKey="name"
              color="purple"
            />
          </div>

          {/* 情绪分析 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
            <h2 className="text-lg font-bold text-gray-900 mb-4">😊 情绪分析</h2>
            <div className="flex justify-around items-center h-32">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <span className="text-3xl">😊</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{emotionCounts.positive}</div>
                <div className="text-sm text-gray-500">积极</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <span className="text-3xl">😐</span>
                </div>
                <div className="text-2xl font-bold text-gray-600">{emotionCounts.neutral}</div>
                <div className="text-sm text-gray-500">中性</div>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                  <span className="text-3xl">🤔</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">{emotionCounts.negative}</div>
                <div className="text-sm text-gray-500">反思</div>
              </div>
            </div>
          </div>

          {/* 高峰时段 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
            <h2 className="text-lg font-bold text-gray-900 mb-4">⏰ 写作高峰时段</h2>
            <div className="space-y-3">
              {peakHours.map((h, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    i === 0 ? "bg-amber-100 text-amber-600" :
                    i === 1 ? "bg-gray-100 text-gray-600" :
                    "bg-orange-100 text-orange-600"
                  }`}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{h.label}</div>
                    <div className="text-sm text-gray-500">{h.count} 篇日记</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 标签云 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mt-6 border border-white/50">
          <h2 className="text-lg font-bold text-gray-900 mb-4">🏷️ 标签云</h2>
          <div className="flex flex-wrap gap-2">
            {tagCloud.map((tag: { name: string; count: number }, i: number) => {
              const size = tag.count > 5 ? "text-lg" : tag.count > 2 ? "text-base" : "text-sm";
              return (
                <Link
                  key={tag.name}
                  href={`/tags/${tag.name}`}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full ${tagColors[i % tagColors.length]} ${size} hover:opacity-80 transition-opacity`}
                >
                  <span>#{tag.name}</span>
                  <span className="opacity-60">({tag.count})</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 成长曲线 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mt-6 border border-white/50">
          <h2 className="text-lg font-bold text-gray-900 mb-4">📈 成长曲线</h2>
          <div className="space-y-2">
            {growthCurve.map((item: { month: string; total: number; cumulative: number }) => {
              const maxCumulative = growthCurve[growthCurve.length - 1]?.cumulative || 1;
              const percentage = Math.round((item.cumulative / maxCumulative) * 100);
              const [year, m] = item.month.split("-");
              const monthName = new Date(parseInt(year), parseInt(m) - 1).toLocaleDateString("zh-CN", { month: "long" });
              
              return (
                <div key={item.month} className="flex items-center gap-3">
                  <span className="w-16 text-sm text-gray-600">{year}年{monthName}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-20 text-right">
                    +{item.total} (共{item.cumulative})
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 作者贡献 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mt-6 border border-white/50">
          <h2 className="text-lg font-bold text-gray-900 mb-4">✍️ 作者贡献榜</h2>
          <div className="space-y-3">
            {authorContribution.map((author: { name: string; count: number; words: number }, i: number) => {
              const maxWords = authorContribution[0]?.words || 1;
              const percentage = Math.round((author.words / maxWords) * 100);
              
              return (
                <div key={author.name} className="flex items-center gap-3">
                  <div className="w-8 text-center text-lg">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                  </div>
                  <span className="w-24 text-sm text-gray-600 truncate">{author.name}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-28 text-right">
                    {author.count}篇 / {author.words.toLocaleString()}字
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>🦞 Claw Diary - Powered by OpenClaw</p>
        </footer>
      </main>
    </div>
  );
}