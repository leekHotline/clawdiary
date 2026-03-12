import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '心情排行榜 - 太空龙虾日记',
  description: '按心情指数、情绪稳定性排名的心情排行榜',
}

const moodRankData = [
  { rank: 1, name: '阳光向日葵', avatar: '🌻', avgMood: 9.8, stability: 95, positive: 98, badge: '👑' },
  { rank: 2, name: '快乐小熊', avatar: '🐻', avgMood: 9.5, stability: 92, positive: 95, badge: '💎' },
  { rank: 3, name: '彩虹糖', avatar: '🌈', avgMood: 9.3, stability: 88, positive: 93, badge: '🏆' },
  { rank: 4, name: '微笑天使', avatar: '😊', avgMood: 9.1, stability: 85, positive: 90, badge: '🥇' },
  { rank: 5, name: '幸福猫咪', avatar: '🐱', avgMood: 8.9, stability: 82, positive: 88, badge: '🥈' },
  { rank: 6, name: '甜蜜蜜蜂', avatar: '🐝', avgMood: 8.7, stability: 80, positive: 86, badge: '🥉' },
  { rank: 7, name: '开心果', avatar: '🥜', avgMood: 8.5, stability: 78, positive: 84, badge: '⭐' },
  { rank: 8, name: '阳光少年', avatar: '☀️', avgMood: 8.3, stability: 75, positive: 82, badge: '⭐' },
  { rank: 9, name: '快乐星球', avatar: '🪐', avgMood: 8.1, stability: 72, positive: 80, badge: '⭐' },
  { rank: 10, name: '微笑精灵', avatar: '🧚', avgMood: 7.9, stability: 70, positive: 78, badge: '⭐' },
]

const moodCategories = [
  { emoji: '😊', label: '开心', count: 1234, percent: 45 },
  { emoji: '😌', label: '平静', count: 856, percent: 31 },
  { emoji: '🥰', label: '幸福', count: 432, percent: 16 },
  { emoji: '🤔', label: '思考', count: 156, percent: 6 },
  { emoji: '😢', label: '难过', count: 45, percent: 2 },
]

export default function MoodLeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-pink-500 to-purple-500 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/leaderboard" className="text-pink-100 hover:text-white mb-4 inline-flex items-center gap-1">
            ← 返回排行榜
          </Link>
          <h1 className="text-3xl font-bold mt-2">😊 心情排行榜</h1>
          <p className="text-pink-100 mt-2">按心情指数、情绪稳定性排名</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Period Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button className="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium whitespace-nowrap">
            总榜
          </button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-lg font-medium whitespace-nowrap hover:bg-gray-50">
            本月
          </button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-lg font-medium whitespace-nowrap hover:bg-gray-50">
            本周
          </button>
        </div>

        {/* Top 3 Podium */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🏆 心情达人</h2>
          <div className="grid grid-cols-3 gap-4">
            {/* Second Place */}
            <div className="text-center pt-8">
              <div className="text-4xl mb-2">{moodRankData[1].avatar}</div>
              <div className="text-2xl mb-1">🥈</div>
              <div className="font-bold text-gray-800">{moodRankData[1].name}</div>
              <div className="text-pink-600 font-semibold">心情 {moodRankData[1].avgMood}</div>
              <div className="text-gray-500 text-sm">稳定度 {moodRankData[1].stability}%</div>
            </div>
            {/* First Place */}
            <div className="text-center bg-gradient-to-b from-pink-50 to-purple-50 rounded-xl p-4 -mt-4">
              <div className="text-5xl mb-2">{moodRankData[0].avatar}</div>
              <div className="text-3xl mb-1">👑</div>
              <div className="font-bold text-gray-800 text-lg">{moodRankData[0].name}</div>
              <div className="text-pink-600 font-bold text-lg">心情 {moodRankData[0].avgMood}</div>
              <div className="text-gray-500 text-sm">稳定度 {moodRankData[0].stability}%</div>
              <div className="text-green-500 text-sm mt-1">✨ 积极指数 {moodRankData[0].positive}%</div>
            </div>
            {/* Third Place */}
            <div className="text-center pt-8">
              <div className="text-4xl mb-2">{moodRankData[2].avatar}</div>
              <div className="text-2xl mb-1">🥉</div>
              <div className="font-bold text-gray-800">{moodRankData[2].name}</div>
              <div className="text-pink-600 font-semibold">心情 {moodRankData[2].avgMood}</div>
              <div className="text-gray-500 text-sm">稳定度 {moodRankData[2].stability}%</div>
            </div>
          </div>
        </div>

        {/* Mood Distribution */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">📊 社区心情分布</h3>
          <div className="space-y-3">
            {moodCategories.map((cat) => (
              <div key={cat.label} className="flex items-center gap-3">
                <span className="text-2xl">{cat.emoji}</span>
                <span className="w-16 text-gray-600">{cat.label}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
                    style={{ width: `${cat.percent}%` }}
                  />
                </div>
                <span className="text-gray-500 text-sm w-16 text-right">{cat.count} 人</span>
              </div>
            ))}
          </div>
        </div>

        {/* Full Ranking List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-bold text-gray-800">📊 完整排名</h2>
          </div>
          <div className="divide-y">
            {moodRankData.map((user) => (
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
                    <div className="flex gap-4 text-sm">
                      <span className="text-gray-500">稳定 <span className="text-purple-500 font-medium">{user.stability}%</span></span>
                      <span className="text-gray-500">积极 <span className="text-green-500 font-medium">{user.positive}%</span></span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-pink-600 text-lg">{user.avgMood}</div>
                    <div className="text-sm text-gray-500">心情指数</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Rank */}
        <div className="mt-6 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-pink-600">#89</div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">我的排名</div>
              <div className="text-sm text-gray-600">心情指数 7.5 · 稳定度 68% · 积极指数 72%</div>
            </div>
            <button className="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium hover:bg-pink-600 transition-colors">
              记录心情
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}