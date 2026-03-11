import { notFound } from "next/navigation";
import Link from "next/link";
import { getInspirationById, getUserInspirationStatus } from "@/lib/inspirations";

export const metadata = {
  title: "灵感详情 - Claw Diary",
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

export default async function InspirationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const inspiration = await getInspirationById(id);

  if (!inspiration) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-pink-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-10 w-56 h-56 bg-purple-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-3xl mx-auto px-6 pt-8 pb-16">
        {/* 返回 */}
        <Link href="/inspirations" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 mb-6 text-sm">
          <span>←</span>
          <span>返回灵感库</span>
        </Link>

        {/* 灵感卡片 */}
        <div className={`bg-gradient-to-br ${categoryColors[inspiration.category] || 'from-gray-400 to-gray-500'} rounded-3xl p-8 text-white mb-6 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative">
            {/* 分类标签 */}
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                {categoryLabels[inspiration.category]}
              </span>
              {inspiration.source && (
                <span className="text-white/70 text-sm">来源: {inspiration.source}</span>
              )}
            </div>

            {/* 标题 */}
            <h1 className="text-2xl font-bold mb-4">{inspiration.title}</h1>

            {/* 内容 */}
            <p className="text-xl leading-relaxed mb-6">{inspiration.content}</p>

            {/* 作者 */}
            {inspiration.author && (
              <div className="text-white/80">
                —— {inspiration.author}
              </div>
            )}
          </div>
        </div>

        {/* 统计和操作 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6 text-gray-500">
            <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
              <span className="text-xl">❤️</span>
              <span>{inspiration.likes}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-amber-500 transition-colors">
              <span className="text-xl">🔖</span>
              <span>{inspiration.saves}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
              <span className="text-xl">🔗</span>
              <span>分享</span>
            </button>
          </div>
          <div className="flex gap-3">
            <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
              ⭐ 收藏
            </button>
            <Link
              href={`/create?inspiration=${inspiration.id}`}
              className="px-5 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ✍️ 开始写作
            </Link>
          </div>
        </div>

        {/* 标签 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>🏷️</span>
            <span>相关标签</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {inspiration.tags.map((tag) => (
              <Link
                key={tag}
                href={`/inspirations?tag=${tag}`}
                className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm hover:bg-indigo-100 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {/* 相关灵感 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>💡</span>
            <span>更多灵感</span>
          </h3>
          <div className="text-center text-gray-500 py-8">
            <p>探索更多写作灵感</p>
            <Link
              href="/inspirations"
              className="inline-block mt-3 text-indigo-600 hover:text-indigo-700"
            >
              浏览全部 →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}