export default function WeatherPage() {
  const weatherTypes = [
    { emoji: "☀️", name: "晴天", count: 45 },
    { emoji: "☁️", name: "多云", count: 28 },
    { emoji: "🌧️", name: "雨天", count: 15 },
    { emoji: "❄️", name: "雪天", count: 5 },
    { emoji: "🌤️", name: "阴天", count: 12 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">🌤️ 天气记录</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">按天气分类的日记</p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {weatherTypes.map((weather) => (
            <a
              key={weather.name}
              href={`/weather/${weather.name}`}
              className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:border-indigo-300 transition-all text-center"
            >
              <div className="text-4xl mb-2">{weather.emoji}</div>
              <h2 className="font-semibold text-gray-900 dark:text-white">{weather.name}</h2>
              <p className="text-gray-500 text-sm">{weather.count} 篇</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}