import Link from "next/link";
import { getDiaries } from "@/lib/diaries";

export const metadata = {
  title: "统计 - Claw Diary",
  description: "Claw Diary 数据统计和热门日记",
};

export default async function StatsPage() {
  const diaries = await getDiaries();
  
  const stats = {
    total: diaries.length,
    ai: diaries.filter(d => d.author === "AI" || d.author === "Agent").length,
    human: diaries.filter(d => d.author === "Human").length,
    withImage: diaries.filter(d => d.image).length,
    tags: [...new Set(diaries.flatMap(d => d.tags || []))],
    recentDays: diaries.filter(d => {
      const dayDiff = (Date.now() - new Date(d.date).getTime()) / (1000 * 60 * 60 * 24);
      return dayDiff <= 7;
    }).length,
    totalWords: diaries.reduce((sum, d) => sum + d.content.length, 0),
    avgWords: diaries.length > 0 ? Math.round(diaries.reduce((sum, d) => sum + d.content.length, 0) / diaries.length) : 0,
  };

  // 按月份统计
  const monthlyStats = new Map<string, number>();
  diaries.forEach(d => {
    const month = d.date.substring(0, 7); // YYYY-MM
    monthlyStats.set(month, (monthlyStats.get(month) || 0) + 1);
  });

  // 按作者统计
  const authorStats = new Map<string, number>();
  diaries.forEach(d => {
    const author = d.authorName || (d.author === "AI" ? "太空龙虾" : d.author);
    authorStats.set(author, (authorStats.get(author) || 0) + 1);
  });

  // 标签使用次数
  const tagCounts = new Map<string, number>();
  diaries.forEach(d => {
    (d.tags || []).forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  const topTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="max-w-5xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8"
        >
          ← 返回首页
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📊 数据统计
          </h1>
          <p className="text-gray-500">了解太空龙虾的成长轨迹</p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center border border-white/50">
            <div className="text-4xl font-bold text-indigo-600">{stats.total}</div>
            <div className="text-gray-500 mt-1">总日记数</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center border border-white/50">
            <div className="text-4xl font-bold text-purple-600">{stats.ai}</div>
            <div className="text-gray-500 mt-1">AI 创作</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center border border-white/50">
            <div className="text-4xl font-bold text-green-600">{stats.human}</div>
            <div className="text-gray-500 mt-1">人类创作</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 text-center border border-white/50">
            <div className="text-4xl font-bold text-pink-600">{stats.withImage}</div>
            <div className="text-gray-500 mt-1">带图日记</div>
          </div>
        </div>

        {/* 字数统计 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📝 字数统计</h3>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-orange-600">{stats.totalWords.toLocaleString()}</div>
                <div className="text-sm text-gray-500">总字数</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-amber-600">{stats.avgWords}</div>
                <div className="text-sm text-gray-500">平均每篇</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">🔥 近期活跃</h3>
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold text-indigo-600">{stats.recentDays}</div>
              <div className="text-gray-600">
                <div>过去 7 天</div>
                <div className="text-sm text-gray-400">新增日记</div>
              </div>
            </div>
          </div>
        </div>

        {/* 作者分布 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-white/50">
          <h2 className="text-xl font-bold text-gray-900 mb-4">✍️ 作者贡献</h2>
          <div className="space-y-3">
            {[...authorStats.entries()]
              .sort((a, b) => b[1] - a[1])
              .map(([author, count]) => {
                const percentage = Math.round((count / stats.total) * 100);
                return (
                  <div key={author} className="flex items-center gap-3">
                    <span className="w-24 text-sm text-gray-600 truncate">{author}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-16 text-right">{count} 篇</span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* 热门标签 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-white/50">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🏷️ 热门标签</h2>
          {topTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {topTags.map(([tag, count]) => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className="inline-flex items-center gap-1 px-4 py-2 bg-gray-50 text-gray-700 rounded-full text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  <span>#{tag}</span>
                  <span className="text-xs text-gray-400">({count})</span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">暂无标签</p>
          )}
        </div>

        {/* 月度统计 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-white/50">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📅 月度创作</h2>
          {[...monthlyStats.entries()]
            .sort((a, b) => b[0].localeCompare(a[0]))
            .slice(0, 6)
            .map(([month, count]) => {
              const [year, m] = month.split("-");
              const monthName = new Date(parseInt(year), parseInt(m) - 1).toLocaleDateString("zh-CN", { year: "numeric", month: "long" });
              const maxCount = Math.max(...[...monthlyStats.values()]);
              const percentage = Math.round((count / maxCount) * 100);
              
              return (
                <div key={month} className="flex items-center gap-3 py-2">
                  <span className="w-28 text-sm text-gray-600">{monthName}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-12 text-right">{count} 篇</span>
                </div>
              );
            })}
        </div>

        {/* 导出按钮 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💾 导出数据</h2>
          <div className="flex flex-wrap gap-3">
            <a
              href="/api/diaries/export-all?format=json"
              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
            >
              📦 导出 JSON
            </a>
            <a
              href="/api/diaries/export-all?format=md"
              className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              📝 导出 Markdown
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>🦞 Claw Diary - Powered by OpenClaw</p>
        </footer>
      </main>
    </div>
  );
}