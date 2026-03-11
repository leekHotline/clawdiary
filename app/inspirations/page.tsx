import Link from "next/link";
import { 
  getInspirations, 
  getInspirationCategories, 
  getPopularInspirations,
  getRandomInspiration 
} from "@/lib/inspirations";

export const metadata = {
  title: "💡 灵感库 - Claw Diary",
  description: "写作灵感、名言金句、写作提示，激发你的创作灵感",
};

const categoryColors: Record<string, string> = {
  quote: "from-purple-500 to-violet-500",
  prompt: "from-blue-500 to-cyan-500",
  theme: "from-pink-500 to-rose-500",
  story: "from-orange-500 to-amber-500",
  question: "from-green-500 to-emerald-500",
  method: "from-teal-500 to-cyan-500",
};

export default async function InspirationsPage() {
  const [inspirations, categories, popular, randomInspiration] = await Promise.all([
    getInspirations(12, 0),
    getInspirationCategories(),
    getPopularInspirations(5),
    getRandomInspiration(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-10 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-pink-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-5xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-4 text-sm">
            <span>←</span>
            <span>返回首页</span>
          </Link>
          
          <div className="flex items-center gap-4 mb-2">
            <span className="text-5xl">💡</span>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">灵感库</h1>
              <p className="text-gray-500">写作灵感、名言金句，激发你的创作</p>
            </div>
          </div>
        </div>

        {/* 随机灵感卡片 */}
        {randomInspiration && (
          <div className="mb-8 p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">✨</span>
                <span className="text-sm font-medium text-white/80">今日灵感</span>
              </div>
              <p className="text-xl font-medium mb-3">{randomInspiration.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    {randomInspiration.title}
                  </span>
                  {randomInspiration.author && (
                    <span className="text-white/70 text-sm">—— {randomInspiration.author}</span>
                  )}
                </div>
                <Link
                  href={`/inspirations/${randomInspiration.id}`}
                  className="px-4 py-2 bg-white text-purple-600 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
                >
                  查看详情
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 分类导航 */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📂</span>
            <span>灵感分类</span>
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/inspirations?category=${category.id}`}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 hover:bg-white transition-all border border-white/50 hover:shadow-md"
              >
                <div className="text-3xl mb-2 text-center">{category.icon}</div>
                <div className="font-medium text-gray-800 text-center text-sm">{category.name}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 主内容区 */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <span>🎯</span>
                <span>最新灵感</span>
              </h2>
              <Link
                href="/inspirations/create"
                className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                + 分享灵感
              </Link>
            </div>

            <div className="space-y-4">
              {inspirations.map((inspiration) => (
                <Link
                  key={inspiration.id}
                  href={`/inspirations/${inspiration.id}`}
                  className="group block bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50 hover:shadow-md hover:border-indigo-200 transition-all"
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
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors truncate">
                          {inspiration.title}
                        </h3>
                        {inspiration.author && (
                          <span className="text-xs text-gray-400">—— {inspiration.author}</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{inspiration.content}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>❤️ {inspiration.likes}</span>
                        <span>🔖 {inspiration.saves}</span>
                        <div className="flex gap-1">
                          {inspiration.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 加载更多 */}
            <div className="mt-6 text-center">
              <Link
                href="/inspirations/all"
                className="inline-block px-6 py-2 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                查看全部灵感 →
              </Link>
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 热门灵感 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🔥</span>
                <span>热门灵感</span>
              </h3>
              <div className="space-y-3">
                {popular.map((item, index) => (
                  <Link
                    key={item.id}
                    href={`/inspirations/${item.id}`}
                    className="flex items-start gap-3 group"
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      index === 0 ? 'bg-amber-100 text-amber-700' :
                      index === 1 ? 'bg-gray-100 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-gray-50 text-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 text-sm group-hover:text-indigo-600 transition-colors truncate">
                        {item.title}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <span>❤️ {item.likes}</span>
                        <span>🔖 {item.saves}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* 快捷操作 */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl p-5 text-white">
              <h3 className="font-bold mb-3">✨ 创作助手</h3>
              <div className="space-y-2">
                <Link
                  href="/inspirations/random"
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
                >
                  <span>🎲</span>
                  <span>随机灵感</span>
                </Link>
                <Link
                  href="/inspirations?category=prompt"
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
                >
                  <span>💡</span>
                  <span>写作提示</span>
                </Link>
                <Link
                  href="/inspirations?category=story"
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm"
                >
                  <span>📖</span>
                  <span>故事种子</span>
                </Link>
              </div>
            </div>

            {/* 我的收藏入口 */}
            <Link
              href="/inspirations/saved"
              className="block bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-white/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-gray-800 mb-1">我的收藏</div>
                  <div className="text-sm text-gray-500">查看已收藏的灵感</div>
                </div>
                <div className="text-2xl">⭐</div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}