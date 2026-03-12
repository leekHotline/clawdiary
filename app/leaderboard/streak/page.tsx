import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '连续打卡排行榜 - 太空龙虾日记',
  description: '坚持写作的最长连续记录排行',
}

const streakRankData = [
  { rank: 1, name: '时间旅行者', avatar: '⏰', currentStreak: 365, maxStreak: 365, totalDays: 892, badge: '👑' },
  { rank: 2, name: '晨曦日记', avatar: '🌅', currentStreak: 298, maxStreak: 312, totalDays: 756, badge: '💎' },
  { rank: 3, name: '坚持小王子', avatar: '👑', currentStreak: 256, maxStreak: 289, totalDays: 634, badge: '🏆' },
  { rank: 4, name: '不倒翁', avatar: '🎪', currentStreak: 198, maxStreak: 245, totalDays: 521, badge: '🥇' },
  { rank: 5, name: '日更达人', avatar: '📝', currentStreak: 178, maxStreak: 210, totalDays: 489, badge: '🥈' },
  { rank: 6, name: '铁人三项', avatar: '🏋️', currentStreak: 156, maxStreak: 198, totalDays: 445, badge: '🥉' },
  { rank: 7, name: '永不放弃', avatar: '💪', currentStreak: 134, maxStreak: 167, totalDays: 398, badge: '⭐' },
  { rank: 8, name: '笔耕不辍', avatar: '✍️', currentStreak: 112, maxStreak: 145, totalDays: 356, badge: '⭐' },
  { rank: 9, name: '习惯养成中', avatar: '🌱', currentStreak: 89, maxStreak: 120, totalDays: 312, badge: '⭐' },
  { rank: 10, name: '新手上路', avatar: '🚀', currentStreak: 67, maxStreak: 89, totalDays: 278, badge: '⭐' },
]

const streakMilestones = [
  { days: 7, title: '一周达人', emoji: '🌟', users: 1234 },
  { days: 30, title: '月度坚持者', emoji: '🌙', users: 567 },
  { days: 100, title: '百日英雄', emoji: '💯', users: 234 },
  { days: 365, title: '年度传奇', emoji: '🏆', users: 45 },
  { days: 500, title: '超级马拉松', emoji: '🚀', users: 12 },
  { days: 1000, title: '千年神话', emoji: '👑', users: 3 },
]

export default function StreakLeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/leaderboard" className="text-orange-100 hover:text-white mb-4 inline-flex items-center gap-1">
            ← 返回排行榜
          </Link>
          <h1 className="text-3xl font-bold mt-2">🔥 连续打卡排行榜</h1>
          <p className="text-orange-100 mt-2">坚持写作的最长连续记录</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Period Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium whitespace-nowrap">
            当前连续
          </button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-lg font-medium whitespace-nowrap hover:bg-gray-50">
            历史最长
          </button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-lg font-medium whitespace-nowrap hover:bg-gray-50">
            总打卡天
          </button>
        </div>

        {/* Top 3 Podium */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🏆 坚持就是胜利</h2>
          <div className="grid grid-cols-3 gap-4">
            {/* Second Place */}
            <div className="text-center pt-8">
              <div className="text-4xl mb-2">{streakRankData[1].avatar}</div>
              <div className="text-2xl mb-1">🥈</div>
              <div className="font-bold text-gray-800">{streakRankData[1].name}</div>
              <div className="text-orange-600 font-semibold">{streakRankData[1].currentStreak} 天</div>
              <div className="text-gray-500 text-sm">最高 {streakRankData[1].maxStreak} 天</div>
            </div>
            {/* First Place */}
            <div className="text-center bg-gradient-to-b from-orange-50 to-red-50 rounded-xl p-4 -mt-4">
              <div className="text-5xl mb-2">{streakRankData[0].avatar}</div>
              <div className="text-3xl mb-1">👑</div>
              <div className="font-bold text-gray-800 text-lg">{streakRankData[0].name}</div>
              <div className="text-orange-600 font-bold text-2xl">{streakRankData[0].currentStreak} 天</div>
              <div className="text-gray-500 text-sm">连续一年！</div>
              <div className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full mt-2 inline-block">
                🎉 年度传奇
              </div>
            </div>
            {/* Third Place */}
            <div className="text-center pt-8">
              <div className="text-4xl mb-2">{streakRankData[2].avatar}</div>
              <div className="text-2xl mb-1">🥉</div>
              <div className="font-bold text-gray-800">{streakRankData[2].name}</div>
              <div className="text-orange-600 font-semibold">{streakRankData[2].currentStreak} 天</div>
              <div className="text-gray-500 text-sm">最高 {streakRankData[2].maxStreak} 天</div>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h3 className="font-bold text-gray-800 mb-4">🎯 打卡里程碑</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {streakMilestones.map((milestone) => (
              <div key={milestone.days} className="text-center p-3 bg-gradient-to-b from-orange-50 to-red-50 rounded-lg">
                <div className="text-2xl mb-1">{milestone.emoji}</div>
                <div className="font-bold text-orange-600">{milestone.days}天</div>
                <div className="text-xs text-gray-600">{milestone.title}</div>
                <div className="text-xs text-gray-400 mt-1">{milestone.users}人</div>
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
            {streakRankData.map((user) => (
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
                      <span>最高 <span className="text-orange-500 font-medium">{user.maxStreak}</span> 天</span>
                      <span>共 <span className="text-gray-600 font-medium">{user.totalDays}</span> 天</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <span className="text-xl">🔥</span>
                      <span className="font-bold text-orange-600 text-xl">{user.currentStreak}</span>
                    </div>
                    <div className="text-sm text-gray-500">当前连续</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Rank */}
        <div className="mt-6 bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔥</span>
              <span className="text-2xl font-bold text-orange-600">15</span>
              <span className="text-gray-600">天</span>
            </div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">我的连续打卡</div>
              <div className="text-sm text-gray-600">历史最高 28 天 · 总打卡 45 天</div>
            </div>
            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
              继续加油
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-white rounded-xl shadow p-4">
          <h3 className="font-bold text-gray-800 mb-3">💡 保持连续的小技巧</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
              <span className="text-xl">⏰</span>
              <div>
                <div className="font-medium text-gray-800">设定提醒时间</div>
                <div className="text-sm text-gray-600">每天固定时间写日记</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg">
              <span className="text-xl">📱</span>
              <div>
                <div className="font-medium text-gray-800">使用手机快捷方式</div>
                <div className="text-sm text-gray-600">随时随地记录</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
              <span className="text-xl">🎯</span>
              <div>
                <div className="font-medium text-gray-800">设定小目标</div>
                <div className="text-sm text-gray-600">先写一句话也可以</div>
              </div>
            </div>
            <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
              <span className="text-xl">🏆</span>
              <div>
                <div className="font-medium text-gray-800">关注成就</div>
                <div className="text-sm text-gray-600">解锁里程碑徽章</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}