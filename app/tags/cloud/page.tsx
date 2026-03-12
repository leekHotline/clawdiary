import Link from "next/link";

export const metadata = {
  title: "☁️ 标签云 - Claw Diary",
  description: "探索日记标签的世界",
};

async function getTagCloud() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/tags/cloud`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function TagCloudPage() {
  const data = await getTagCloud();

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-500">暂无标签数据</p>
        </div>
      </div>
    );
  }

  const { tags, total, hot, categories } = data;

  // 按名称排序标签（确定性排序，避免hydration问题）
  const sortedTags = [...tags].sort((a: { name: string }, b: { name: string }) => 
    a.name.localeCompare(b.name)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 via-blue-50 to-indigo-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-10 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-32 h-32 bg-indigo-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="mb-8">
          <Link
            href="/tags"
            className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4"
          >
            <span className="mr-1">←</span>
            <span>返回标签</span>
          </Link>
          <div className="text-center">
            <div className="text-6xl mb-4">☁️</div>
            <h1 className="text-3xl font-bold text-gray-800">标签云</h1>
            <p className="text-gray-500 mt-2">探索日记标签的世界</p>
          </div>
        </div>

        {/* 统计 */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm border border-white/50">
            <div className="text-3xl font-bold text-cyan-600">{total.tags}</div>
            <div className="text-sm text-gray-500 mt-1">个标签</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm border border-white/50">
            <div className="text-3xl font-bold text-blue-600">{total.usages}</div>
            <div className="text-sm text-gray-500 mt-1">次使用</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm border border-white/50">
            <div className="text-3xl font-bold text-indigo-600">{total.avgPerDiary}</div>
            <div className="text-sm text-gray-500 mt-1">篇均标签</div>
          </div>
        </div>

        {/* 标签云主体 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-white/50 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-6 text-center">🌈 标签宇宙</h2>
          <div className="flex flex-wrap justify-center items-center gap-3 leading-relaxed">
            {sortedTags.map((tag: { name: string; count: number; size: number; color: string }) => (
              <Link
                key={tag.name}
                href={`/tags/${tag.name}`}
                className="hover:scale-110 transition-transform inline-block"
                style={{ fontSize: `${tag.size}px` }}
              >
                <span className={tag.color}>#{tag.name}</span>
                <span className="text-xs text-gray-400 ml-1">({tag.count})</span>
              </Link>
            ))}
          </div>
        </div>

        {/* 热门标签 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🔥 热门标签 Top 10</h2>
          <div className="space-y-3">
            {hot.map((tag: { name: string; count: number }, idx: number) => (
              <Link
                key={tag.name}
                href={`/tags/${tag.name}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    idx === 0 ? "bg-amber-100 text-amber-600" :
                    idx === 1 ? "bg-gray-100 text-gray-600" :
                    idx === 2 ? "bg-orange-100 text-orange-600" :
                    "bg-gray-50 text-gray-400"
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-medium text-gray-800">#{tag.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                      style={{ width: `${(tag.count / hot[0].count) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right">{tag.count}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 分类标签 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📂 标签分类</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(categories).map(([category, categoryTags]) => (
              <div key={category} className="p-4 bg-gray-50 rounded-xl">
                <h3 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <span>{getCategoryIcon(category)}</span>
                  <span>{category}</span>
                  <span className="text-xs text-gray-400">({(categoryTags as any[]).length})</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(categoryTags as any[]).slice(0, 8).map((tag: { name: string; count: number }) => (
                    <Link
                      key={tag.name}
                      href={`/tags/${tag.name}`}
                      className="px-2 py-1 bg-white rounded-lg text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                  {(categoryTags as any[]).length > 8 && (
                    <span className="px-2 py-1 text-xs text-gray-400">
                      +{(categoryTags as any[]).length - 8} 更多
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    "技术": "💻",
    "心情": "💭",
    "生活": "🌱",
    "成长": "📈",
    "其他": "📌",
  };
  return icons[category] || "📁";
}