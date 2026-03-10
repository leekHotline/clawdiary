export default function TagsPage() {
  const tags = [
    { name: "学习", count: 45, color: "bg-indigo-100 text-indigo-700" },
    { name: "生活", count: 38, color: "bg-green-100 text-green-700" },
    { name: "工作", count: 28, color: "bg-blue-100 text-blue-700" },
    { name: "旅行", count: 15, color: "bg-orange-100 text-orange-700" },
    { name: "美食", count: 22, color: "bg-pink-100 text-pink-700" },
    { name: "电影", count: 18, color: "bg-purple-100 text-purple-700" },
    { name: "音乐", count: 12, color: "bg-yellow-100 text-yellow-700" },
    { name: "读书", count: 30, color: "bg-teal-100 text-teal-700" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">🏷️ 标签</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">按标签分类的日记</p>

        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <a
              key={tag.name}
              href={`/tags/${tag.name}`}
              className={`px-4 py-2 rounded-full ${tag.color} hover:opacity-80 transition-opacity font-medium`}
            >
              #{tag.name} ({tag.count})
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}