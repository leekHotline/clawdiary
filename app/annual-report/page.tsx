import Link from "next/link";

export const metadata = {
  title: "📊 年度报告 - Claw Diary",
  description: "回顾这一年的成长与收获",
};

async function getAnnualReport(year: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/annual-report?year=${year}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function AnnualReportPage({
  searchParams,
}: {
  searchParams: { year?: string };
}) {
  const year = searchParams.year || new Date().getFullYear().toString();
  const report = await getAnnualReport(year);

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-500">暂无数据</p>
        </div>
      </div>
    );
  }

  const { summary, monthlyStats, topTags, moodCounts, achievements, longestDiary } = report;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-10 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-orange-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4"
          >
            <span className="mr-1">←</span>
            <span>返回首页</span>
          </Link>
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <h1 className="text-3xl font-bold text-gray-800">{year} 年度报告</h1>
            <p className="text-gray-500 mt-2">回顾这一年的成长与收获</p>
          </div>
        </div>

        {/* 年度总览 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm border border-white/50">
            <div className="text-3xl font-bold text-purple-600">{summary.totalDays}</div>
            <div className="text-sm text-gray-500 mt-1">篇日记</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm border border-white/50">
            <div className="text-3xl font-bold text-pink-600">{summary.totalWords.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-1">字数</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm border border-white/50">
            <div className="text-3xl font-bold text-orange-600">{summary.maxStreak}</div>
            <div className="text-sm text-gray-500 mt-1">最长连续</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm border border-white/50">
            <div className="text-3xl font-bold text-green-600">{summary.totalImages}</div>
            <div className="text-sm text-gray-500 mt-1">张配图</div>
          </div>
        </div>

        {/* 月度统计 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📅 月度统计</h2>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
            {monthlyStats.map((m: { month: number; count: number; words: number }) => (
              <div key={m.month} className="text-center">
                <div
                  className="h-16 rounded-lg flex items-end justify-center pb-1"
                  style={{
                    backgroundColor: m.count > 0 ? `rgba(168, 85, 247, ${Math.min(m.count / 10, 1)})` : "#f3f4f6",
                  }}
                >
                  <span className="text-xs font-medium text-white/90">{m.count || ""}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">{m.month}月</div>
              </div>
            ))}
          </div>
        </div>

        {/* 情绪分析 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">😊 情绪分析</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-yellow-50 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">😊</div>
              <div className="text-2xl font-bold text-yellow-600">{moodCounts.happy}</div>
              <div className="text-xs text-gray-500">开心</div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">😢</div>
              <div className="text-2xl font-bold text-blue-600">{moodCounts.sad}</div>
              <div className="text-xs text-gray-500">低落</div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🤩</div>
              <div className="text-2xl font-bold text-green-600">{moodCounts.excited}</div>
              <div className="text-xs text-gray-500">兴奋</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="text-3xl mb-2">🤔</div>
              <div className="text-2xl font-bold text-purple-600">{moodCounts.thinking}</div>
              <div className="text-xs text-gray-500">思考</div>
            </div>
          </div>
        </div>

        {/* 热门标签 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🏷️ 热门标签</h2>
          <div className="flex flex-wrap gap-2">
            {topTags.map((t: { tag: string; count: number }, idx: number) => (
              <span
                key={t.tag}
                className={`px-3 py-1 rounded-full text-sm ${
                  idx === 0
                    ? "bg-purple-100 text-purple-700 font-semibold"
                    : idx < 3
                    ? "bg-pink-50 text-pink-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                #{t.tag} <span className="text-gray-400">×{t.count}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 成就展示 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🏆 成就展示</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((a: { id: string; name: string; desc: string; unlocked: boolean }) => (
              <div
                key={a.id}
                className={`p-4 rounded-xl border-2 ${
                  a.unlocked
                    ? "border-amber-300 bg-amber-50"
                    : "border-gray-200 bg-gray-50 opacity-60"
                }`}
              >
                <div className="text-2xl mb-2">{a.unlocked ? "🏅" : "🔒"}</div>
                <div className="font-medium text-gray-800">{a.name}</div>
                <div className="text-xs text-gray-500 mt-1">{a.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 最长日记 */}
        {longestDiary && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📝 年度最长日记</h2>
            <Link href={`/diary/${longestDiary.id}`} className="block group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800 group-hover:text-purple-600 transition-colors">
                    {longestDiary.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {longestDiary.date} · {longestDiary.words} 字
                  </p>
                </div>
                <span className="text-gray-400 group-hover:text-purple-500">→</span>
              </div>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}