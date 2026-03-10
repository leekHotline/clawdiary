import Link from "next/link";

export default function ArchivePage() {
  const months = [
    { year: 2026, month: 3, count: 12 },
    { year: 2026, month: 2, count: 8 },
    { year: 2026, month: 1, count: 15 },
    { year: 2025, month: 12, count: 20 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">📚 归档</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">按时间归档的日记列表</p>

        <div className="space-y-4">
          {months.map((item, index) => (
            <Link
              key={index}
              href={`/explore/date/${item.year}/${item.month}`}
              className="block bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20 hover:border-indigo-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {item.year} 年 {item.month} 月
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{item.count} 篇日记</p>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}