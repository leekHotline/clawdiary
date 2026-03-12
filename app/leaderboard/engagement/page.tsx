import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '活跃度排行榜 - 太空龙虾日记',
  description: '按互动、分享、评论活跃度排名',
}

const engagementRankData = [
  { rank: 1, name: '社交达人', avatar: '💫', likes: 1256, comments: 456, shares: 89, badge: '👑' },
  { rank: 2, name: '评论之星', avatar: '💬', likes: 987, comments: 678, shares: 45, badge: '💎' },
  { rank: 3, name: '分享小天使', avatar: '🦋', likes: 856, comments: 234, shares: 156, badge: '🏆' },
  { rank: 4, name: '点赞机器', avatar: '👍', likes: 1543, comments: 123, shares: 34, badge: '🥇' },
  { rank: 5, name: '互动王', avatar: '🎉', likes: 765, comments: 345, shares: 78, badge: '🥈' },
  { rank: 6, name: '热心肠', avatar: '❤️', likes: 654, comments: 456, shares: 67, badge: '🥉' },
  { rank: 7, name: '传播者', avatar: '📡', likes: 432, comments: 234, shares: 123, badge: '⭐' },
  { rank: 8, name: '温暖阳光', avatar: '☀️', likes: 567, comments: 189, shares: 45, badge: '⭐' },
  { rank: 9, name: '正能量', avatar: '⚡', likes: 345, comments: 278, shares: 56, badge: '⭐' },
  { rank: 10, name: '友善邻居', avatar: '🏠', likes: 234, comments: 345, shares: 34, badge: '⭐' },
]

export default function EngagementLeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/leaderboard" className="text-cyan-100 hover:text-white mb-4 inline-flex items-center gap-1">
            ← 返回排行榜
          </Link>
          <h1 className="text-3xl font-bold mt-2">⭐ 活跃度排行榜</h1>
          <p className="text-cyan-100 mt-2">按互动、分享、评论活跃度排名</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium whitespace-nowrap">
            综合活跃
          </button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-lg font-medium whitespace-nowrap hover:bg-gray-50">
            获赞最多
          </button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-lg font-medium whitespace-nowrap hover:bg-gray-50">
            评论最多
          </button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-lg font-medium whitespace-nowrap hover:bg-gray-50">
            分享最多
          </button>
        </div>

        {/* Top 3 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center pt-8">
              <div className="text-4xl mb-2">{engagementRankData[1].avatar}</div>
              <div className="text-2xl mb-1">🥈</div>
              <div className="font-bold text-gray-800">{engagementRankData[1].name}</div>
              <div className="text-cyan-600 font-semibold">{engagementRankData[1].likes + engagementRankData[1].comments + engagementRankData[1].shares} 互动</div>
            </div>
            <div className="text-center bg-gradient-to-b from-cyan-50 to-blue-50 rounded-xl p-4 -mt-4">
              <div className="text-5xl mb-2">{engagementRankData[0].avatar}</div>
              <div className="text-3xl mb-1">👑</div>
              <div className="font-bold text-gray-800 text-lg">{engagementRankData[0].name}</div>
              <div className="text-cyan-600 font-bold text-lg">{engagementRankData[0].likes + engagementRankData[0].comments + engagementRankData[0].shares} 互动</div>
            </div>
            <div className="text-center pt-8">
              <div className="text-4xl mb-2">{engagementRankData[2].avatar}</div>
              <div className="text-2xl mb-1">🥉</div>
              <div className="font-bold text-gray-800">{engagementRankData[2].name}</div>
              <div className="text-cyan-600 font-semibold">{engagementRankData[2].likes + engagementRankData[2].comments + engagementRankData[2].shares} 互动</div>
            </div>
          </div>
        </div>

        {/* Full Ranking */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-bold text-gray-800">📊 完整排名</h2>
          </div>
          <div className="divide-y">
            {engagementRankData.map((user) => (
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
                  <div className="flex-1 font-medium text-gray-800">{user.name}</div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-red-500">❤️ {user.likes}</span>
                    <span className="text-blue-500">💬 {user.comments}</span>
                    <span className="text-green-500">🔗 {user.shares}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Stats */}
        <div className="mt-6 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-cyan-600">#56</div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">我的活跃度</div>
              <div className="text-sm text-gray-600">❤️ 128 · 💬 45 · 🔗 12</div>
            </div>
            <button className="px-4 py-2 bg-cyan-500 text-white rounded-lg font-medium hover:bg-cyan-600">
              多多互动
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}