// 日记世界地图页面 - 按地点展示日记
export const dynamic = 'force-dynamic';

import { getDiaries } from "@/lib/diaries";
import Link from "next/link";

export const metadata = {
  title: '日记地图 - Claw Diary',
  description: '按地点浏览你的日记'
};

export default async function MapPage() {
  const diaries = await getDiaries();
  
  // 提取有地点的日记
  const diariesWithLocation = diaries.filter(d => (d as any).location);
  
  // 按地点分组
  const locationGroups: Record<string, typeof diaries> = {};
  diariesWithLocation.forEach(d => {
    const loc = (d as any).location!;
    if (!locationGroups[loc]) {
      locationGroups[loc] = [];
    }
    locationGroups[loc].push(d);
  });

  // 排序地点
  const sortedLocations = Object.entries(locationGroups)
    .map(([location, diaries]) => ({
      location,
      count: diaries.length,
      diaries: diaries.sort((a, b) => b.date.localeCompare(a.date)),
      moods: [...new Set(diaries.map(d => d.mood).filter(Boolean))],
      latestDate: diaries.sort((a, b) => b.date.localeCompare(a.date))[0]?.date || ''
    }))
    .sort((a, b) => b.count - a.count);

  // 地点类型分类
  const locationTypes: Record<string, typeof sortedLocations> = {
    '工作空间': [],
    '户外': [],
    '休闲': [],
    '其他': []
  };

  sortedLocations.forEach(loc => {
    const locLower = loc.location.toLowerCase();
    if (locLower.includes('办公室') || locLower.includes('工坊') || locLower.includes('公司') || locLower.includes('工作室')) {
      locationTypes['工作空间'].push(loc);
    } else if (locLower.includes('公园') || locLower.includes('山') || locLower.includes('海边') || locLower.includes('户外')) {
      locationTypes['户外'].push(loc);
    } else if (locLower.includes('咖啡') || locLower.includes('书店') || locLower.includes('家') || locLower.includes('休息')) {
      locationTypes['休闲'].push(loc);
    } else {
      locationTypes['其他'].push(loc);
    }
  });

  // 统计
  const totalLocations = sortedLocations.length;
  const totalDiariesWithLocation = diariesWithLocation.length;
  const mostActiveLocation = sortedLocations[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* 头部 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl">🦞</Link>
              <div>
                <h1 className="text-xl font-bold text-gray-800">日记地图</h1>
                <p className="text-sm text-gray-500">按地点探索你的日记</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/timeline"
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ⏳ 时间线
              </Link>
              <Link
                href="/explore"
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                🔍 探索
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 概览卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl mb-2">📍</div>
            <div className="text-2xl font-bold text-gray-800">{totalLocations}</div>
            <div className="text-sm text-gray-500">地点数量</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-2xl font-bold text-gray-800">{totalDiariesWithLocation}</div>
            <div className="text-sm text-gray-500">有地点的日记</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-lg font-bold text-emerald-600 truncate px-2">
              {mostActiveLocation?.location || '-'}
            </div>
            <div className="text-sm text-gray-500">最常去地点</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-gray-800">
              {totalLocations > 0 ? (totalDiariesWithLocation / totalLocations).toFixed(1) : 0}
            </div>
            <div className="text-sm text-gray-500">平均每地点日记数</div>
          </div>
        </div>

        {/* 地点分布可视化 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🗺️ 地点热力图</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sortedLocations.slice(0, 12).map((loc, idx) => {
              const size = Math.min(100, Math.max(40, loc.count * 5));
              const opacity = Math.min(1, Math.max(0.3, loc.count / 10));
              return (
                <Link
                  key={loc.location}
                  href={`#${encodeURIComponent(loc.location)}`}
                  className="relative flex flex-col items-center justify-center p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  style={{ minHeight: '120px' }}
                >
                  <div
                    className="absolute inset-4 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500"
                    style={{ opacity: opacity * 0.3 }}
                  />
                  <div className="relative z-10 text-center">
                    <div className="text-2xl mb-1">📍</div>
                    <div className="font-medium text-gray-800 text-sm truncate max-w-full">
                      {loc.location}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {loc.count} 篇日记
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 按类型分类 */}
        {Object.entries(locationTypes).map(([type, locations]) => {
          if (locations.length === 0) return null;
          return (
            <div key={type} className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                {type === '工作空间' && '💼 '}
                {type === '户外' && '🌳 '}
                {type === '休闲' && '☕ '}
                {type === '其他' && '📌 '}
                {type}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locations.map(loc => (
                  <div
                    key={loc.location}
                    id={encodeURIComponent(loc.location)}
                    className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">📍</span>
                        <span className="font-medium text-gray-800">{loc.location}</span>
                      </div>
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                        {loc.count} 篇
                      </span>
                    </div>
                    
                    {/* 心情标签 */}
                    {loc.moods.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {loc.moods.slice(0, 4).map(mood => (
                          <span
                            key={mood}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            {mood}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 最近日记 */}
                    <div className="space-y-2">
                      {loc.diaries.slice(0, 3).map(d => (
                        <Link
                          key={d.id}
                          href={`/diary/${d.id}`}
                          className="block text-sm text-gray-600 hover:text-gray-800 truncate"
                        >
                          <span className="text-gray-400 mr-2">{d.date}</span>
                          {d.title}
                        </Link>
                      ))}
                      {loc.diaries.length > 3 && (
                        <div className="text-sm text-gray-400">
                          还有 {loc.diaries.length - 3} 篇...
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* 无地点日记统计 */}
        {diaries.length - totalDiariesWithLocation > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800">📝 未标记地点的日记</h2>
                <p className="text-sm text-gray-500 mt-1">
                  共 {diaries.length - totalDiariesWithLocation} 篇日记没有标记地点
                </p>
              </div>
              <Link
                href="/diary"
                className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
              >
                查看全部
              </Link>
            </div>
          </div>
        )}

        {/* 地点统计表格 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📊 地点排行</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">排名</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">地点</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">日记数</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-gray-500">最近日期</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">常见心情</th>
                </tr>
              </thead>
              <tbody>
                {sortedLocations.map((loc, idx) => (
                  <tr key={loc.location} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                        idx === 0 ? 'bg-yellow-100 text-yellow-700' :
                        idx === 1 ? 'bg-gray-100 text-gray-700' :
                        idx === 2 ? 'bg-orange-100 text-orange-700' :
                        'text-gray-400'
                      }`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-800">{loc.location}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                        {loc.count}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-sm text-gray-500">
                      {loc.latestDate}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {loc.moods.slice(0, 3).map(mood => (
                          <span
                            key={mood}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            {mood}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}