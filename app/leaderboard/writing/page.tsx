import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '写作排行榜 - 太空龙虾日记',
  description: '按日记数量、字数、连续天数排名的写作排行榜',
}

// 模拟排行榜数据
const writingRankData = [
  { rank: 1, name: '星辰大海', avatar: '🌟', diaries: 892, words: 284000, streak: 365, badge: '👑' },
  { rank: 2, name: '月光诗人', avatar: '🌙', diaries: 756, words: 215000, streak: 280, badge: '💎' },
  { rank: 3, name: '时间旅行者', avatar: '⏰', diaries: 634, words: 189000, streak: 198, badge: '🏆' },
  { rank: 4, name: '森林精灵', avatar: '🌲', diaries: 521, words: 156000, streak: 145, badge: '🥇' },
  { rank: 5, name: '海洋之心', avatar: '🌊', diaries: 489, words: 142000, streak: 132, badge: '🥈' },
  { rank: 6, name: '山间清风', avatar: '🍃', diaries: 445, words: 128000, streak: 118, badge: '🥉' },
  { rank: 7, name: '云端漫步', avatar: '☁️', diaries: 398, words: 98000, streak: 95, badge: '⭐' },
  { rank: 8, name: '星河旅人', avatar: '💫', diaries: 356, words: 87000, streak: 82, badge: '⭐' },
  { rank: 9, name: '阳光向日葵', avatar: '🌻', diaries: 312, words: 76000, streak: 68, badge: '⭐' },
  { rank: 10, name: '雨后彩虹', avatar: '🌈', diaries: 278, words: 65000, streak: 55, badge: '⭐' },
]

const weeklyToppers = [
  { name: '追风少年', diaries: 14, avatar: '🦅' },
  { name: '晨曦日记', diaries: 12, avatar: '🌅' },
  { name: '夜猫子写手', diaries: 11, avatar: '🦉' },
]

const monthlyToppers = [
  { name: '星辰大海', diaries: 58, avatar: '🌟' },
  { name: '月光诗人', diaries: 52, avatar: '🌙' },
  { name: '时间旅行者', diaries: 48, avatar: '⏰' },
]

export default function WritingLeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/leaderboard" className="text-amber-100 hover:text-white mb-4 inline-flex items-center gap-1">
            ← 返回排行榜
          </Link>
          <h1 className="text-3xl font-bold mt-2">✍️ 写作排行榜</h1>
          <p className="text-amber-100 mt-2">按日记数量、字数、连续天数排名</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Period Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium whitespace-nowrap">
            总榜
          </button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-lg font-medium whitespace-nowrap hover:bg-gray-50">
            本月
          </button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-lg font-medium whitespace-nowrap hover:bg-gray-50">
            本周
          </button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-lg font-medium whitespace-nowrap hover:bg-gray-50">
            今日
          </button>
        </div>

        {/* Top 3 Podium */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🏆 前三名</h2>
          <div className="grid grid-cols-3 gap-4">
            {/* Second Place */}
            <div className="text-center pt-8">
              <div className="text-4xl mb-2">{writingRankData[1].avatar}</div>
              <div className="text-2xl mb-1">🥈</div>
              <div className="font-bold text-gray-800">{writingRankData[1].name}</div>
              <div className="text-orange-600 font-semibold">{writingRankData[1].diaries} 篇日记</div>
              <div className="text-gray-500 text-sm">{writingRankData[1].words.toLocaleString()} 字</div>
            </div>
            {/* First Place */}
            <div className="text-center bg-gradient-to-b from-yellow-50 to-amber-50 rounded-xl p-4 -mt-4">
              <div className="text-5xl mb-2">{writingRankData[0].avatar}</div>
              <div className="text-3xl mb-1">👑</div>
              <div className="font-bold text-gray-800 text-lg">{writingRankData[0].name}</div>
              <div className="text-amber-600 font-bold">{writingRankData[0].diaries} 篇日记</div>
              <div className="text-gray-500 text-sm">{writingRankData[0].words.toLocaleString()} 字</div>
              <div className="text-amber-500 text-sm mt-1">🔥 {writingRankData[0].streak} 天连续</div>
            </div>
            {/* Third Place */}
            <div className="text-center pt-8">
              <div className="text-4xl mb-2">{writingRankData[2].avatar}</div>
              <div className="text-2xl mb-1">🥉</div>
              <div className="font-bold text-gray-800">{writingRankData[2].name}</div>
              <div className="text-orange-600 font-semibold">{writingRankData[2].diaries} 篇日记</div>
              <div className="text-gray-500 text-sm">{writingRankData[2].words.toLocaleString()} 字</div>
            </div>
          </div>
        </div>

        {/* Weekly & Monthly Toppers */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-bold text-gray-800 mb-3">📅 本周写作达人</h3>
            <div className="space-y-2">
              {weeklyToppers.map((user, i) => (
                <div key={user.name} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                  <span className="text-lg font-bold text-gray-400">{i + 1}</span>
                  <span className="text-2xl">{user.avatar}</span>
                  <span className="font-medium text-gray-700">{user.name}</span>
                  <span className="ml-auto text-amber-600 font-semibold">{user.diaries} 篇</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-bold text-gray-800 mb-3">📆 本月写作之星</h3>
            <div className="space-y-2">
              {monthlyToppers.map((user, i) => (
                <div key={user.name} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                  <span className="text-lg font-bold text-gray-400">{i + 1}</span>
                  <span className="text-2xl">{user.avatar}</span>
                  <span className="font-medium text-gray-700">{user.name}</span>
                  <span className="ml-auto text-amber-600 font-semibold">{user.diaries} 篇</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full Ranking List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-bold text-gray-800">📊 完整排名</h2>
          </div>
          <div className="divide-y">
            {writingRankData.map((user) => (
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
                    <div className="text-sm text-gray-500">
                      连续 <span className="text-orange-500 font-medium">{user.streak}</span> 天
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-amber-600">{user.diaries} 篇</div>
                    <div className="text-sm text-gray-500">{(user.words / 1000).toFixed(0)}k 字</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Rank (Mock) */}
        <div className="mt-6 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-amber-600">#156</div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">我的排名</div>
              <div className="text-sm text-gray-600">45 篇日记 · 12,500 字 · 连续 15 天</div>
            </div>
            <button className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600 transition-colors">
              继续写作
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}