import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "标签云 - Claw Diary",
  description: "探索所有标签，发现感兴趣的内容",
};

// 标签数据
const tags = [
  { name: "功能", count: 28, color: "bg-blue-100 text-blue-700" },
  { name: "优化", count: 22, color: "bg-green-100 text-green-700" },
  { name: "UI", count: 18, color: "bg-purple-100 text-purple-700" },
  { name: "日记", count: 15, color: "bg-yellow-100 text-yellow-700" },
  { name: "心情", count: 12, color: "bg-pink-100 text-pink-700" },
  { name: "成就", count: 10, color: "bg-orange-100 text-orange-700" },
  { name: "社交", count: 9, color: "bg-red-100 text-red-700" },
  { name: "游戏化", count: 8, color: "bg-indigo-100 text-indigo-700" },
  { name: "数据", count: 7, color: "bg-teal-100 text-teal-700" },
  { name: "API", count: 6, color: "bg-cyan-100 text-cyan-700" },
  { name: "搜索", count: 5, color: "bg-lime-100 text-lime-700" },
  { name: "分享", count: 5, color: "bg-amber-100 text-amber-700" },
  { name: "统计", count: 4, color: "bg-emerald-100 text-emerald-700" },
  { name: "主题", count: 4, color: "bg-violet-100 text-violet-700" },
  { name: "写作", count: 4, color: "bg-rose-100 text-rose-700" },
  { name: "时间线", count: 3, color: "bg-sky-100 text-sky-700" },
  { name: "可视化", count: 3, color: "bg-fuchsia-100 text-fuchsia-700" },
  { name: "协作", count: 3, color: "bg-slate-100 text-slate-700" },
  { name: "通知", count: 2, color: "bg-stone-100 text-stone-700" },
  { name: "设置", count: 2, color: "bg-zinc-100 text-zinc-700" },
];

// 计算字体大小
function getFontSize(count: number, maxCount: number): string {
  const minSize = 0.875; // text-sm
  const maxSize = 2.25; // text-4xl
  const ratio = count / maxCount;
  const size = minSize + (maxSize - minSize) * ratio;
  return `${size}rem`;
}

export default function TagsCloudPage() {
  const maxCount = Math.max(...tags.map(t => t.count));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🏷️</span>
            <div>
              <h1 className="text-xl font-bold">标签云</h1>
              <p className="text-xs text-gray-500">探索 {tags.length} 个标签</p>
            </div>
          </div>
          <Link
            href="/diary"
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            ← 返回日记
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="text-2xl font-bold text-blue-600">{tags.length}</div>
            <div className="text-sm text-gray-500">总标签数</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="text-2xl font-bold text-green-600">
              {tags.reduce((sum, t) => sum + t.count, 0)}
            </div>
            <div className="text-sm text-gray-500">总使用次数</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="text-2xl font-bold text-purple-600">
              {(tags.reduce((sum, t) => sum + t.count, 0) / tags.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">平均使用</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border">
            <div className="text-2xl font-bold text-orange-600">{maxCount}</div>
            <div className="text-sm text-gray-500">最高频次</div>
          </div>
        </div>

        {/* 标签云 */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
          <h2 className="text-lg font-semibold mb-6 text-center">📚 标签云视图</h2>
          <div className="flex flex-wrap justify-center items-center gap-3 p-4">
            {tags.map((tag) => (
              <Link
                key={tag.name}
                href={`/tags/${encodeURIComponent(tag.name)}`}
                className="group inline-flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-md"
                style={{ fontSize: getFontSize(tag.count, maxCount) }}
              >
                <span className={`px-2.5 py-1 rounded-full ${tag.color}`}>
                  #{tag.name}
                </span>
                <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {tag.count}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 标签列表 */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">📊 标签排行</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {tags
              .sort((a, b) => b.count - a.count)
              .map((tag, index) => (
                <Link
                  key={tag.name}
                  href={`/tags/${encodeURIComponent(tag.name)}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
                      {index + 1}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-sm ${tag.color}`}>
                      #{tag.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{tag.count} 篇</span>
                    <span className="text-gray-300 group-hover:text-gray-400 transition-colors">→</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* 相关功能 */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/timeline"
            className="px-4 py-2 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow flex items-center gap-2"
          >
            <span>📅</span>
            <span className="text-sm">时间线视图</span>
          </Link>
          <Link
            href="/calendar"
            className="px-4 py-2 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow flex items-center gap-2"
          >
            <span>📆</span>
            <span className="text-sm">日历视图</span>
          </Link>
          <Link
            href="/explore"
            className="px-4 py-2 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow flex items-center gap-2"
          >
            <span>🔍</span>
            <span className="text-sm">探索发现</span>
          </Link>
        </div>
      </main>
    </div>
  );
}