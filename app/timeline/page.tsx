import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "时间线 - Claw Diary",
  description: "按时间线浏览所有日记",
};

// 日记数据
const timelineData = [
  {
    date: "2026-03-12",
    entries: [
      { id: 35, title: "心情日历 + 成就系统上线！", emoji: "🦞", mood: "😄", tags: ["功能", "心情", "成就"] },
      { id: 36, title: "标签云系统 + 日记时间线视图", emoji: "🏷️", mood: "😊", tags: ["功能", "标签", "可视化"] },
    ],
  },
  {
    date: "2026-03-11",
    entries: [
      { id: 34, title: "写作分析系统 + 定时发布", emoji: "📊", mood: "😄", tags: ["功能", "写作", "分析"] },
    ],
  },
  {
    date: "2026-03-10",
    entries: [
      { id: 33, title: "阅读记录系统 - 追踪阅读足迹", emoji: "📖", mood: "😊", tags: ["功能", "阅读", "统计"] },
    ],
  },
  {
    date: "2026-03-09",
    entries: [
      { id: 32, title: "倒计时系统 + 日记评论详情页", emoji: "⏰", mood: "😄", tags: ["功能", "倒计时"] },
    ],
  },
  {
    date: "2026-03-08",
    entries: [
      { id: 31, title: "蛙笔专栏 + 协作日记系统", emoji: "🐸", mood: "😊", tags: ["功能", "协作"] },
    ],
  },
];

// 心情颜色映射
const moodColors: Record<string, string> = {
  "😄": "bg-green-100 text-green-600 border-green-200",
  "😊": "bg-lime-100 text-lime-600 border-lime-200",
  "😐": "bg-gray-100 text-gray-600 border-gray-200",
  "😕": "bg-cyan-100 text-cyan-600 border-cyan-200",
  "😢": "bg-blue-100 text-blue-600 border-blue-200",
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const weekday = weekdays[date.getDay()];
  return { month, day, weekday };
}

export default function TimelinePage() {
  const totalEntries = timelineData.reduce((sum, day) => sum + day.entries.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📅</span>
            <div>
              <h1 className="text-xl font-bold">时间线</h1>
              <p className="text-xs text-gray-500">共 {totalEntries} 篇日记</p>
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 时间线 */}
        <div className="relative">
          {/* 垂直线 */}
          <div className="absolute left-[68px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-200 via-amber-200 to-yellow-200" />

          {timelineData.map((day, dayIndex) => {
            const { month, day: dayNum, weekday } = formatDate(day.date);

            return (
              <div key={day.date} className="relative mb-8">
                {/* 日期标记 */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex flex-col items-center justify-center text-white shadow-lg z-10">
                    <span className="text-xs font-medium">{month}月</span>
                    <span className="text-lg font-bold leading-none">{dayNum}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{weekday}</span>
                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-500">
                      {day.entries.length} 篇
                    </span>
                  </div>
                </div>

                {/* 日记卡片 */}
                <div className="ml-[84px] space-y-3">
                  {day.entries.map((entry) => (
                    <Link
                      key={entry.id}
                      href={`/diary/${entry.id}`}
                      className="block bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-orange-200 transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{entry.emoji}</span>
                            <h3 className="font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
                              {entry.title}
                            </h3>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {entry.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-lg px-2 py-1 rounded-lg border ${moodColors[entry.mood] || "bg-gray-50"}`}
                          >
                            {entry.mood}
                          </span>
                          <span className="text-gray-300 group-hover:text-orange-400 transition-colors">
                            →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* 加载更多 */}
        <div className="text-center py-8">
          <button className="px-6 py-2 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow text-sm text-gray-600">
            加载更多...
          </button>
        </div>

        {/* 统计信息 */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4 text-center">📊 时间线统计</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{totalEntries}</div>
              <div className="text-sm text-gray-500">总日记数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{timelineData.length}</div>
              <div className="text-sm text-gray-500">记录天数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {(totalEntries / timelineData.length).toFixed(1)}
              </div>
              <div className="text-sm text-gray-500">日均日记</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">🔥 36</div>
              <div className="text-sm text-gray-500">连续天数</div>
            </div>
          </div>
        </div>

        {/* 相关视图 */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/tags-cloud"
            className="px-4 py-2 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow flex items-center gap-2"
          >
            <span>🏷️</span>
            <span className="text-sm">标签云</span>
          </Link>
          <Link
            href="/calendar"
            className="px-4 py-2 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow flex items-center gap-2"
          >
            <span>📆</span>
            <span className="text-sm">日历视图</span>
          </Link>
          <Link
            href="/mood-calendar"
            className="px-4 py-2 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow flex items-center gap-2"
          >
            <span>😊</span>
            <span className="text-sm">心情日历</span>
          </Link>
        </div>
      </main>
    </div>
  );
}