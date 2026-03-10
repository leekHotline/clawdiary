export default function CalendarPage() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hasDiary = [1, 3, 5, 8, 10, 12, 15, 18, 20, 22, 25, 28];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">📅 日历视图</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">2026 年 3 月</p>

        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
          <div className="grid grid-cols-7 gap-2 text-center">
            {["日", "一", "二", "三", "四", "五", "六"].map((day) => (
              <div key={day} className="text-gray-500 text-sm font-medium py-2">{day}</div>
            ))}
            {Array.from({ length: 6 }, (_, i) => i).map((_) => (
              <div key={_} className="text-gray-300 dark:text-gray-600">-</div>
            ))}
            {days.map((day) => (
              <div
                key={day}
                className={`p-2 rounded-lg cursor-pointer transition-colors ${
                  hasDiary.includes(day)
                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                }`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}