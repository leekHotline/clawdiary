import Link from "next/link";
import { getDiaries } from "@/lib/diaries";

export const metadata = {
  title: "📅 那年今日 - Claw Diary",
  description: "回顾历史同期日记，重温美好回忆",
};

interface Diary {
  id: string;
  title: string;
  date: string;
  content: string;
  image?: string;
  tags?: string[];
  author?: string;
  mood?: string;
}

interface OnThisDayEntry {
  yearsAgo: number;
  year: number;
  diaries: Diary[];
}

function getMonthDay(dateStr: string): { month: number; day: number } {
  const parts = dateStr.split("-");
  return {
    month: parseInt(parts[1] || "1"),
    day: parseInt(parts[2] || "1"),
  };
}

function getYear(dateStr: string): number {
  return parseInt(dateStr.split("-")[0] || "2025");
}

export default async function OnThisDayPage() {
  const diaries = await getDiaries();
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  const currentYear = today.getFullYear();

  // 找出历史上的今天
  const onThisDayDiaries = diaries.filter((d) => {
    const { month, day } = getMonthDay(d.date);
    return month === currentMonth && day === currentDay;
  });

  // 按年份分组
  const yearGroups: OnThisDayEntry[] = [];
  const yearMap = new Map<number, Diary[]>();

  onThisDayDiaries.forEach((diary) => {
    const year = getYear(diary.date);
    if (year !== currentYear) {
      if (!yearMap.has(year)) {
        yearMap.set(year, []);
      }
      yearMap.get(year)!.push(diary);
    }
  });

  // 转换为按年份倒序排列
  Array.from(yearMap.entries())
    .sort((a, b) => b[0] - a[0])
    .forEach(([year, yearDiaries]) => {
      yearGroups.push({
        yearsAgo: currentYear - year,
        year,
        diaries: yearDiaries,
      });
    });

  // 找相近日期的日记（前后3天）
  const nearbyDiaries = diaries.filter((d) => {
    const { month, day } = getMonthDay(d.date);
    const year = getYear(d.date);
    if (year === currentYear) return false;

    if (month === currentMonth) {
      const diff = Math.abs(day - currentDay);
      return diff > 0 && diff <= 3;
    }
    return false;
  }).slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-orange-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-3xl mx-auto px-6 pt-8 pb-16">
        {/* 返回链接 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors mb-6"
        >
          <span>←</span>
          <span>返回首页</span>
        </Link>

        {/* 标题区域 */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">📅</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">那年今日</h1>
          <p className="text-gray-500">
            {currentMonth}月{currentDay}日 · 回顾历史同期的美好时光
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm border border-white/50">
            <div className="text-3xl font-bold text-rose-600">{yearGroups.length}</div>
            <div className="text-sm text-gray-500 mt-1">年份记录</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm border border-white/50">
            <div className="text-3xl font-bold text-pink-600">{onThisDayDiaries.length}</div>
            <div className="text-sm text-gray-500 mt-1">今日回忆</div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 text-center shadow-sm border border-white/50">
            <div className="text-3xl font-bold text-orange-600">{currentYear - 2024}</div>
            <div className="text-sm text-gray-500 mt-1">成长年数</div>
          </div>
        </div>

        {/* 历史上的今天 */}
        {yearGroups.length > 0 ? (
          <div className="space-y-8">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span>🎯</span>
              <span>历史上的今天</span>
            </h2>

            {yearGroups.map((group) => (
              <div key={group.year} className="relative">
                {/* 年份标记 */}
                <div className="absolute -left-4 top-0 w-8 h-8 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                  {group.yearsAgo}年
                </div>

                <div className="ml-8 space-y-4">
                  <div className="text-sm text-gray-400">
                    {group.year}年{currentMonth}月{currentDay}日
                  </div>

                  {group.diaries.map((diary) => (
                    <Link
                      key={diary.id}
                      href={`/diary/${diary.id}`}
                      className="block bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 hover:shadow-md hover:border-rose-200 transition-all overflow-hidden group"
                    >
                      {diary.image && (
                        <img
                          src={diary.image}
                          alt={diary.title}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-rose-600 transition-colors mb-2">
                          {diary.title}
                        </h3>
                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                          {diary.content.replace(/##\s*/g, '').replace(/\n\n/g, ' ').substring(0, 120)}...
                        </p>
                        {diary.tags && diary.tags.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {diary.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-1 bg-rose-50 text-rose-600 rounded-full"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {diary.mood && (
                          <div className="mt-3 text-sm text-gray-400">
                            心情：{diary.mood}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">还没有历史记录</h3>
            <p className="text-gray-500 mb-6">
              今天是你开始记录的第一天，继续加油！
            </p>
            <Link
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-shadow"
            >
              <span>✍️</span>
              <span>写下今天的故事</span>
            </Link>
          </div>
        )}

        {/* 相近日期回忆 */}
        {nearbyDiaries.length > 0 && (
          <div className="mt-16 pt-8 border-t border-rose-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
              <span>💫</span>
              <span>那些天的记忆</span>
              <span className="text-sm font-normal text-gray-400">（前后3天）</span>
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {nearbyDiaries.slice(0, 6).map((diary) => (
                <Link
                  key={diary.id}
                  href={`/diary/${diary.id}`}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50 hover:shadow-md hover:border-pink-200 transition-all group"
                >
                  <div className="text-xs text-gray-400 mb-2">{diary.date}</div>
                  <h4 className="font-medium text-gray-800 group-hover:text-pink-600 transition-colors line-clamp-2">
                    {diary.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 时间轴 */}
        {yearGroups.length > 0 && (
          <div className="mt-16 pt-8 border-t border-rose-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
              <span>⏳</span>
              <span>成长时间轴</span>
            </h2>

            <div className="relative">
              {/* 时间线 */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-300 via-pink-300 to-orange-300" />

              <div className="space-y-4">
                {yearGroups.map((group, index) => (
                  <div key={group.year} className="flex items-center gap-4 ml-2">
                    <div className="w-5 h-5 rounded-full bg-white border-2 border-rose-400 flex items-center justify-center z-10">
                      <div className="w-2 h-2 rounded-full bg-rose-400" />
                    </div>
                    <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-gray-800">{group.year}年</span>
                          <span className="text-sm text-gray-400 ml-2">
                            {group.yearsAgo}年前
                          </span>
                        </div>
                        <span className="text-sm text-rose-500">
                          {group.diaries.length} 篇日记
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 今天 */}
                <div className="flex items-center gap-4 ml-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center z-10 shadow-lg">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">{currentYear}年</span>
                        <span className="text-sm text-white/80 ml-2">今天</span>
                      </div>
                      <span className="text-sm">继续书写 →</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 快捷操作 */}
        <div className="mt-12 grid grid-cols-2 gap-4">
          <Link
            href="/timeline"
            className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50 hover:shadow-md transition-shadow"
          >
            <span className="text-2xl">📜</span>
            <div>
              <div className="font-medium text-gray-800">完整时间线</div>
              <div className="text-sm text-gray-500">浏览所有日记</div>
            </div>
          </Link>
          <Link
            href="/create"
            className="flex items-center gap-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl p-4 text-white shadow-md hover:shadow-lg transition-shadow"
          >
            <span className="text-2xl">✍️</span>
            <div>
              <div className="font-medium">写今日日记</div>
              <div className="text-sm text-white/80">记录当下的美好</div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}