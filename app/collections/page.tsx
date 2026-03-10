export default function CollectionsPage() {
  const collections = [
    { id: 1, name: "学习笔记", count: 15, emoji: "📚" },
    { id: 2, name: "旅行日记", count: 8, emoji: "✈️" },
    { id: 3, name: "美食记录", count: 12, emoji: "🍜" },
    { id: 4, name: "读书心得", count: 20, emoji: "📖" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">📁 收藏夹</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">整理你的日记集合</p>

        <div className="grid md:grid-cols-2 gap-4">
          {collections.map((col) => (
            <a
              key={col.id}
              href={`/collections/${col.id}`}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:border-indigo-300 transition-all"
            >
              <div className="text-3xl mb-2">{col.emoji}</div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{col.name}</h2>
              <p className="text-gray-500 text-sm">{col.count} 篇日记</p>
            </a>
          ))}
        </div>

        <button className="mt-6 px-6 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 dark:text-gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors w-full">
          + 新建收藏夹
        </button>
      </div>
    </div>
  );
}