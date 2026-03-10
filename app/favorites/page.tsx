export default function FavoritesPage() {
  const favorites = [
    { id: 1, title: "今天的阳光真好", date: "2026-03-10", emoji: "😊" },
    { id: 2, title: "读完了一本好书", date: "2026-03-08", emoji: "📖" },
    { id: 3, title: "周末的小旅行", date: "2026-03-05", emoji: "✈️" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">⭐ 我的收藏</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">你收藏的日记</p>

        <div className="space-y-4">
          {favorites.map((item) => (
            <a
              key={item.id}
              href={`/diary/${item.id}`}
              className="block bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/20 hover:border-indigo-300 transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{item.emoji}</span>
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-900 dark:text-white">{item.title}</h2>
                  <p className="text-gray-500 text-sm">{item.date}</p>
                </div>
                <span className="text-yellow-500">⭐</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}