import Link from "next/link";
import { getUserSavedInspirations, getInspirationCategories } from "@/lib/inspirations";

export const metadata = {
  title: "⭐ 我的收藏 - Claw Diary",
  description: "查看收藏的写作灵感",
};

const categoryColors: Record<string, string> = {
  quote: "from-purple-500 to-violet-500",
  prompt: "from-blue-500 to-cyan-500",
  theme: "from-pink-500 to-rose-500",
  story: "from-orange-500 to-amber-500",
  question: "from-green-500 to-emerald-500",
  method: "from-teal-500 to-cyan-500",
};

export default async function SavedInspirationsPage() {
  // 模拟用户ID，实际应从session获取
  const userId = "demo-user";
  const [savedInspirations, categories] = await Promise.all([
    getUserSavedInspirations(userId),
    getInspirationCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-yellow-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-10 w-56 h-56 bg-orange-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-3xl mx-auto px-6 pt-8 pb-16">
        {/* 返回 */}
        <Link href="/inspirations" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6 text-sm">
          <span>←</span>
          <span>返回灵感库</span>
        </Link>

        {/* 头部 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <span className="text-5xl">⭐</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">我的收藏</h1>
              <p className="text-gray-500">{savedInspirations.length} 个灵感</p>
            </div>
          </div>
        </div>

        {savedInspirations.length === 0 ? (
          /* 空状态 */
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">还没有收藏任何灵感</h3>
            <p className="text-gray-500 mb-6">浏览灵感库，收藏你喜欢的灵感吧！</p>
            <Link
              href="/inspirations"
              className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
            >
              浏览灵感库
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedInspirations.map((inspiration) => (
              <Link
                key={inspiration.id}
                href={`/inspirations/${inspiration.id}`}
                className="group block bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50 hover:shadow-md hover:border-amber-200 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryColors[inspiration.category] || 'from-gray-400 to-gray-500'} flex items-center justify-center text-white text-xl flex-shrink-0`}>
                    {inspiration.category === 'quote' && '💭'}
                    {inspiration.category === 'prompt' && '💡'}
                    {inspiration.category === 'theme' && '🎨'}
                    {inspiration.category === 'story' && '📖'}
                    {inspiration.category === 'question' && '🤔'}
                    {inspiration.category === 'method' && '✏️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 group-hover:text-amber-600 transition-colors truncate">
                      {inspiration.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{inspiration.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>❤️ {inspiration.likes}</span>
                      <span>🔖 {inspiration.saves}</span>
                    </div>
                  </div>
                  <button className="text-amber-500 text-xl">⭐</button>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 发现更多 */}
        <div className="mt-8 p-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold mb-1">发现更多灵感</h3>
              <p className="text-white/80 text-sm">随机浏览，找到你的下一个写作灵感</p>
            </div>
            <Link
              href="/inspirations/random"
              className="px-5 py-2 bg-white text-amber-600 rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              🎲 随机灵感
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}