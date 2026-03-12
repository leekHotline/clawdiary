import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '排行榜 - 太空龙虾日记',
  description: '查看写作排行榜、心情排行榜、打卡排行榜，与社区成员一起进步',
}

const categories = [
  {
    id: 'writing',
    title: '✍️ 写作排行榜',
    description: '按日记数量、字数、连续天数排名',
    icon: '📝',
    href: '/leaderboard/writing',
    stats: ['日记数量', '总字数', '连续天数'],
  },
  {
    id: 'mood',
    title: '😊 心情排行榜',
    description: '按心情指数、情绪稳定性排名',
    icon: '🎭',
    href: '/leaderboard/mood',
    stats: ['平均心情', '情绪稳定', '积极指数'],
  },
  {
    id: 'streak',
    title: '🔥 连续打卡',
    description: '坚持写作的最长连续记录',
    icon: '🏆',
    href: '/leaderboard/streak',
    stats: ['当前连续', '最长连续', '总打卡天'],
  },
  {
    id: 'engagement',
    title: '⭐ 活跃度排行',
    description: '按互动、分享、评论活跃度排名',
    icon: '💫',
    href: '/leaderboard/engagement',
    stats: ['获赞数量', '评论数', '分享数'],
  },
  {
    id: 'explorer',
    title: '🗺️ 探索者排行',
    description: '使用功能数量、探索新功能的先驱者',
    icon: '🧭',
    href: '/leaderboard/explorer',
    stats: ['功能解锁', '成就获得', '探索分'],
  },
  {
    id: 'creativity',
    title: '🎨 创意达人',
    description: '标签使用、模板创作、主题创新',
    icon: '💡',
    href: '/leaderboard/creativity',
    stats: ['标签使用', '模板创作', '创意分'],
  },
]

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">🏆 排行榜</h1>
          <p className="text-purple-100 text-lg">
            与社区成员一起进步，见证成长轨迹
          </p>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-purple-600">1,234</div>
            <div className="text-gray-500 text-sm">活跃用户</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-pink-600">56,789</div>
            <div className="text-gray-500 text-sm">日记总数</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-orange-600">892</div>
            <div className="text-gray-500 text-sm">今日活跃</div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">选择排行榜类型</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{category.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-1">
                    {category.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3">
                    {category.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {category.stats.map((stat) => (
                      <span
                        key={stat}
                        className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded"
                      >
                        {stat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-4xl mx-auto px-4 pb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 本周热点</h2>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
              <div className="text-4xl mb-2">🥇</div>
              <div className="font-bold text-gray-800">写作之星</div>
              <div className="text-orange-600 font-semibold">@星辰大海</div>
              <div className="text-gray-500 text-sm">7天写 42 篇日记</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
              <div className="text-4xl mb-2">😊</div>
              <div className="font-bold text-gray-800">心情达人</div>
              <div className="text-pink-600 font-semibold">@阳光向日葵</div>
              <div className="text-gray-500 text-sm">心情指数 9.8</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg">
              <div className="text-4xl mb-2">🔥</div>
              <div className="font-bold text-gray-800">连续打卡王</div>
              <div className="text-teal-600 font-semibold">@时间旅行者</div>
              <div className="text-gray-500 text-sm">连续 365 天</div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Tips */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6">
          <h3 className="text-lg font-bold text-purple-800 mb-3">
            💡 如何提升排名
          </h3>
          <ul className="space-y-2 text-purple-700">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              每天坚持写日记，保持连续打卡
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              记录真实心情，提高情绪稳定性
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              使用标签和模板，展示创意
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              与社区互动，分享正能量
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}