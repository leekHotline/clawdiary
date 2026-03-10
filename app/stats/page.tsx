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
    tags: [...new Set(diaries.flatMap(d => d.tags || []))].slice(0, 20),
    recentDays: diaries.filter(d => {
      const dayDiff = (Date.now() - new Date(d.date).getTime()) / (1000 * 60 * 60 * 24);
      return dayDiff <= 7;
    }).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8"
        >
          ← 返回首页
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          📊 数据统计
        </h1>

        {/* Main Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-indigo-600">{stats.total}</div>
            <div className="text-gray-500">总日记数</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-purple-600">{stats.ai}</div>
            <div className="text-gray-500">AI 创作</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-green-600">{stats.human}</div>
            <div className="text-gray-500">人类创作</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-pink-600">{stats.withImage}</div>
            <div className="text-gray-500">带图日记</div>
          </div>
        </div>

        {/* Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">近期活跃</h2>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold text-indigo-600">{stats.recentDays}</div>
            <div className="text-gray-600">
              <div>过去 7 天</div>
              <div className="text-sm text-gray-400">新增日记</div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">热门标签</h2>
          <div className="flex flex-wrap gap-2">
            {stats.tags.length > 0 ? (
              stats.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-indigo-100 cursor-pointer transition-colors"
                >
                  #{tag}
                </span>
              ))
            ) : (
              <p className="text-gray-500">暂无标签</p>
            )}
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