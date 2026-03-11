import Link from "next/link";
import { getRandomInspiration, getInspirationCategories } from "@/lib/inspirations";

export const metadata = {
  title: "🎲 随机灵感 - Claw Diary",
  description: "获取随机写作灵感",
};

const categoryColors: Record<string, string> = {
  quote: "from-purple-500 to-violet-500",
  prompt: "from-blue-500 to-cyan-500",
  theme: "from-pink-500 to-rose-500",
  story: "from-orange-500 to-amber-500",
  question: "from-green-500 to-emerald-500",
  method: "from-teal-500 to-cyan-500",
};

const categoryLabels: Record<string, string> = {
  quote: "名言金句",
  prompt: "写作提示",
  theme: "写作主题",
  story: "故事种子",
  question: "思考问题",
  method: "写作方法",
};

export default async function RandomInspirationPage() {
  const [inspiration, categories] = await Promise.all([
    getRandomInspiration(),
    getInspirationCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-fuchsia-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-violet-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-fuchsia-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-3xl mx-auto px-6 pt-8 pb-16">
        {/* 返回 */}
        <Link href="/inspirations" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6 text-sm">
          <span>←</span>
          <span>返回灵感库</span>
        </Link>

        {/* 头部 */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🎲</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">随机灵感</h1>
          <p className="text-gray-500">让命运为你选择今天的写作灵感</p>
        </div>

        {/* 随机灵感卡片 */}
        {inspiration && (
          <div className={`bg-gradient-to-br ${categoryColors[inspiration.category] || 'from-gray-400 to-gray-500'} rounded-3xl p-10 text-white mb-8 relative overflow-hidden shadow-xl`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative">
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="px-4 py-1.5 bg-white/20 rounded-full text-sm font-medium">
                  {categoryLabels[inspiration.category]}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-center mb-4">{inspiration.title}</h2>
              <p className="text-xl text-center leading-relaxed mb-6">{inspiration.content}</p>

              {inspiration.author && (
                <div className="text-center text-white/80">
                  —— {inspiration.author}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex justify-center gap-4 mb-10">
          <Link
            href="/inspirations/random"
            className="px-8 py-3 bg-white rounded-xl font-medium text-purple-600 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <span className="text-xl">🔄</span>
            <span>再来一个</span>
          </Link>
          {inspiration && (
            <Link
              href={`/inspirations/${inspiration.id}`}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all"
            >
              查看详情
            </Link>
          )}
        </div>

        {/* 分类筛选 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 text-center">按分类随机</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/inspirations/random?category=${category.id}`}
                className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-center"
              >
                <div className="text-2xl mb-1">{category.icon}</div>
                <div className="text-xs text-gray-600">{category.name}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* 开始写作 */}
        {inspiration && (
          <div className="mt-8 text-center">
            <Link
              href={`/create?inspiration=${inspiration.id}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
            >
              <span>✍️</span>
              <span>开始写作</span>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}