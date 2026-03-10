import Link from "next/link";

const moods = [
  { emoji: "😊", name: "开心", count: 28, color: "bg-yellow-100 text-yellow-700" },
  { emoji: "😢", name: "难过", count: 12, color: "bg-blue-100 text-blue-700" },
  { emoji: "😐", name: "平静", count: 35, color: "bg-gray-100 text-gray-700" },
  { emoji: "🎉", name: "兴奋", count: 18, color: "bg-pink-100 text-pink-700" },
  { emoji: "😤", name: "愤怒", count: 5, color: "bg-red-100 text-red-700" },
  { emoji: "😰", name: "焦虑", count: 8, color: "bg-purple-100 text-purple-700" },
];

export default function MoodPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">😊 心情记录</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">按心情分类的日记</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {moods.map((mood) => (
            <Link
              key={mood.name}
              href={`/mood/${mood.name}`}
              className={`bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:border-indigo-300 transition-all text-center`}
            >
              <div className="text-4xl mb-2">{mood.emoji}</div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{mood.name}</h2>
              <p className={`text-sm ${mood.color} px-2 py-1 rounded-full inline-block mt-2`}>{mood.count} 篇</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}