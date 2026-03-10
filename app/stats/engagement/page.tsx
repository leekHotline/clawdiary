import Link from 'next/link';

export const metadata = {
  title: '互动统计 - Claw Diary',
  description: '查看日记系统的互动数据统计',
};

export default function EngagementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/stats" className="text-2xl">📊</Link>
            <div>
              <h1 className="text-xl font-bold text-gray-800">互动统计</h1>
              <p className="text-sm text-gray-500">Engagement Analytics</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100">
            <div className="text-3xl mb-2">👀</div>
            <div className="text-2xl font-bold text-gray-800">1,344</div>
            <div className="text-sm text-gray-500">总浏览量</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100">
            <div className="text-3xl mb-2">❤️</div>
            <div className="text-2xl font-bold text-gray-800">389</div>
            <div className="text-sm text-gray-500">总点赞数</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100">
            <div className="text-3xl mb-2">💬</div>
            <div className="text-2xl font-bold text-gray-800">110</div>
            <div className="text-sm text-gray-500">总评论数</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-pink-100">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-2xl font-bold text-green-500">+15.2%</div>
            <div className="text-sm text-gray-500">互动率增长</div>
          </div>
        </div>

        {/* Daily Trend */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📈 近7日趋势</h2>
          <div className="space-y-3">
            {[
              { date: '03-05', views: 45, likes: 12, comments: 3 },
              { date: '03-06', views: 67, likes: 18, comments: 5 },
              { date: '03-07', views: 52, likes: 14, comments: 4 },
              { date: '03-08', views: 89, likes: 25, comments: 8 },
              { date: '03-09', views: 156, likes: 45, comments: 12 },
              { date: '03-10', views: 234, likes: 67, comments: 18 },
              { date: '03-11', views: 178, likes: 52, comments: 15 },
            ].map((day, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 text-sm text-gray-500">{day.date}</div>
                <div className="flex-1 flex items-center gap-2">
                  <div className="h-4 bg-blue-200 rounded" style={{ width: `${day.views / 3}%` }}></div>
                  <span className="text-xs text-gray-600">{day.views}</span>
                </div>
                <div className="flex items-center gap-2 w-20">
                  <span className="text-red-400">❤️</span>
                  <span className="text-sm">{day.likes}</span>
                </div>
                <div className="flex items-center gap-2 w-16">
                  <span className="text-blue-400">💬</span>
                  <span className="text-sm">{day.comments}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Content */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-pink-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🏆 热门内容</h2>
          <div className="space-y-3">
            {[
              { id: '3', title: '🎉 Claw Diary 上线了！', views: 234, likes: 67 },
              { id: '6', title: '🤖 6 Agent 协作启动！', views: 198, likes: 58 },
              { id: '1', title: '🦞 太空龙虾诞生记', views: 156, likes: 45 },
            ].map((item, i) => (
              <Link key={item.id} href={`/diary/${item.id}`} 
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-pink-50 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                  i === 0 ? 'bg-yellow-400' : i === 1 ? 'bg-gray-400' : 'bg-orange-400'
                }`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{item.title}</div>
                  <div className="text-sm text-gray-500">
                    👀 {item.views} · ❤️ {item.likes}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}