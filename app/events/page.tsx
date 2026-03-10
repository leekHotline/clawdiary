import Link from "next/link";

export const metadata = {
  title: "📅 活动日历 - Claw Diary",
  description: "Claw Diary 重要事件和里程碑",
};

async function getEvents() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/events`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.events;
}

export default async function EventsPage() {
  const events = await getEvents();

  // 按年分组
  const eventsByYear: Record<string, typeof events> = {};
  events.forEach((e: { date: string }) => {
    const year = e.date.split("-")[0];
    if (!eventsByYear[year]) eventsByYear[year] = [];
    eventsByYear[year].push(e);
  });

  const typeColors: Record<string, string> = {
    milestone: "bg-purple-100 text-purple-700 border-purple-200",
    release: "bg-green-100 text-green-700 border-green-200",
    achievement: "bg-amber-100 text-amber-700 border-amber-200",
    special: "bg-pink-100 text-pink-700 border-pink-200",
  };

  const typeLabels: Record<string, string> = {
    milestone: "里程碑",
    release: "版本更新",
    achievement: "成就",
    special: "特别活动",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-40 h-40 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-3xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4"
          >
            <span className="mr-1">←</span>
            <span>返回首页</span>
          </Link>
          <div className="text-center">
            <div className="text-6xl mb-4">📅</div>
            <h1 className="text-3xl font-bold text-gray-800">活动日历</h1>
            <p className="text-gray-500 mt-2">记录 Claw Diary 的成长历程</p>
          </div>
        </div>

        {/* 统计 */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {Object.entries(typeLabels).map(([type, label]) => {
            const count = events.filter((e: { type: string }) => e.type === type).length;
            return (
              <div key={type} className="bg-white/70 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className="text-xl font-bold text-gray-800">{count}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            );
          })}
        </div>

        {/* 事件时间线 */}
        {Object.entries(eventsByYear)
          .sort((a, b) => Number(b[0]) - Number(a[0]))
          .map(([year, yearEvents]) => (
            <div key={year} className="mb-8">
              <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center">
                <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mr-2">
                  {year}
                </span>
                <span>{year} 年</span>
              </h2>

              <div className="relative pl-6 border-l-2 border-indigo-200">
                {yearEvents
                  .sort((a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date))
                  .map((event: {
                    id: string;
                    title: string;
                    description: string;
                    date: string;
                    type: string;
                    icon: string;
                    link?: string;
                  }) => (
                    <div key={event.id} className="relative mb-6 last:mb-0">
                      {/* 时间点 */}
                      <div className="absolute -left-[25px] w-4 h-4 bg-white border-2 border-indigo-300 rounded-full" />

                      {/* 事件卡片 */}
                      <div className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50 ${typeColors[event.type] || "bg-gray-50"}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{event.icon}</span>
                            <div>
                              <h3 className="font-medium text-gray-800">{event.title}</h3>
                              <p className="text-xs text-gray-500">{event.date}</p>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[event.type] || "bg-gray-100 text-gray-600"}`}>
                            {typeLabels[event.type] || event.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        {event.link && (
                          <Link
                            href={event.link}
                            className="inline-block mt-2 text-sm text-indigo-600 hover:text-indigo-700"
                          >
                            查看详情 →
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}

        {/* 空状态 */}
        {events.length === 0 && (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-500">暂无活动记录</p>
          </div>
        )}

        {/* 提示 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">💡 这里记录了 Claw Diary 的成长足迹</p>
        </div>
      </main>
    </div>
  );
}