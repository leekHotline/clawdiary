import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '探索者排行榜 - 太空龙虾日记',
  description: '使用功能数量、探索新功能的先驱者排行',
}

const explorerRankData = [
  { rank: 1, name: '功能探险家', avatar: '🧭', features: 45, achievements: 32, exploreScore: 980, badge: '👑' },
  { rank: 2, name: '尝鲜达人', avatar: '🌱', features: 42, achievements: 28, exploreScore: 920, badge: '💎' },
  { rank: 3, name: '探索先锋', avatar: '🚀', features: 38, achievements: 25, exploreScore: 850, badge: '🏆' },
  { rank: 4, name: '新功能猎手', avatar: '🎯', features: 35, achievements: 22, exploreScore: 780, badge: '🥇' },
  { rank: 5, name: '好奇宝宝', avatar: '🔍', features: 32, achievements: 20, exploreScore: 720, badge: '🥈' },
  { rank: 6, name: '功能收藏家', avatar: '📚', features: 28, achievements: 18, exploreScore: 650, badge: '🥉' },
  { rank: 7, name: '尝新族', avatar: '✨', features: 25, achievements: 15, exploreScore: 580, badge: '⭐' },
  { rank: 8, name: '探索者', avatar: '🌟', features: 22, achievements: 12, exploreScore: 520, badge: '⭐' },
  { rank: 9, name: '新手探索', avatar: '🌟', features: 18, achievements: 10, exploreScore: 450, badge: '⭐' },
  { rank: 10, name: '开始冒险', avatar: '🌟', features: 15, achievements: 8, exploreScore: 380, badge: '⭐' },
]

const newFeatures = [
  { name: '心情追踪', icon: '😊', users: 234, status: 'hot' },
  { name: '番茄钟', icon: '🍅', users: 189, status: 'new' },
  { name: '习惯打卡', icon: '✅', users: 156, status: 'trending' },
  { name: '睡眠记录', icon: '😴', users: 98, status: 'new' },
  { name: '感恩日记', icon: '🙏', users: 87, status: 'hot' },
]

export default function ExplorerLeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/leaderboard" className="text-emerald-100 hover:text-white mb-4 inline-flex items-center gap-1">
            ← 返回排行榜
          </Link>
          <h1 className="text-3xl font-bold mt-2">🗺️ 探索者排行榜</h1>
          <p className="text-emerald-100 mt-2">使用功能数量、探索新功能的先驱者</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium whitespace-nowrap">
            探索总分
          </button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-lg font-medium whitespace-nowrap hover:bg-gray-50">
            功能解锁
          </button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-lg font-medium whitespace-nowrap hover:bg-gray-50">
            成就获得
          </button>
        </div>

        {/* Hot Features */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h3 className="font-bold text-gray-800 mb-3">🔥 热门新功能</h3>
          <div className="flex flex-wrap gap-2">
            {newFeatures.map((feature) => (
              <div key={feature.name} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                <span className="text-xl">{feature.icon}</span>
                <span className="font-medium text-gray-700">{feature.name}</span>
                <span className="text-xs text-gray-400">{feature.users}人使用</span>
                {feature.status === 'hot' && <span className="text-xs text-red-500">🔥</span>}
                {feature.status === 'new' && <span className="text-xs text-green-500">NEW</span>}
                {feature.status === 'trending' && <span className="text-xs text-blue-500">📈</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Top 3 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center pt-8">
              <div className="text-4xl mb-2">{explorerRankData[1].avatar}</div>
              <div className="text-2xl mb-1">🥈</div>
              <div className="font-bold text-gray-800">{explorerRankData[1].name}</div>
              <div className="text-emerald-600 font-semibold">{explorerRankData[1].features} 功能</div>
            </div>
            <div className="text-center bg-gradient-to-b from-emerald-50 to-teal-50 rounded-xl p-4 -mt-4">
              <div className="text-5xl mb-2">{explorerRankData[0].avatar}</div>
              <div className="text-3xl mb-1">👑</div>
              <div className="font-bold text-gray-800 text-lg">{explorerRankData[0].name}</div>
              <div className="text-emerald-600 font-bold text-lg">{explorerRankData[0].features} 功能</div>
              <div className="text-amber-500 text-sm mt-1">探索分 {explorerRankData[0].exploreScore}</div>
            </div>
            <div className="text-center pt-8">
              <div className="text-4xl mb-2">{explorerRankData[2].avatar}</div>
              <div className="text-2xl mb-1">🥉</div>
              <div className="font-bold text-gray-800">{explorerRankData[2].name}</div>
              <div className="text-emerald-600 font-semibold">{explorerRankData[2].features} 功能</div>
            </div>
          </div>
        </div>

        {/* Full Ranking */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-bold text-gray-800">📊 完整排名</h2>
          </div>
          <div className="divide-y">
            {explorerRankData.map((user) => (
              <div key={user.rank} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center">
                    {user.rank <= 3 ? (
                      <span className="text-xl">{user.badge}</span>
                    ) : (
                      <span className="font-bold text-gray-400">#{user.rank}</span>
                    )}
                  </div>
                  <div className="text-3xl">{user.avatar}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">{user.name}</div>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>功能 <span className="text-emerald-500 font-medium">{user.features}</span></span>
                      <span>成就 <span className="text-amber-500 font-medium">{user.achievements}</span></span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-600 text-lg">{user.exploreScore}</div>
                    <div className="text-sm text-gray-500">探索分</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Stats */}
        <div className="mt-6 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-emerald-600">#128</div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">我的探索度</div>
              <div className="text-sm text-gray-600">功能 12 · 成就 5 · 探索分 180</div>
            </div>
            <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600">
              去探索
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}