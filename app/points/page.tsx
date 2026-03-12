import Link from 'next/link'

export default function PointsPage() {
  const history = [
    { id: 1, points: 30, type: 'earn', description: '日记字数超过800', time: '30分钟前' },
    { id: 2, points: 10, type: 'earn', description: '创建日记', time: '35分钟前' },
    { id: 3, points: 5, type: 'earn', description: '点赞他人日记', time: '1小时前' },
    { id: 4, points: -120, type: 'spend', description: '购买主题「森林秘境」', time: '2小时前' },
    { id: 5, points: 50, type: 'bonus', description: '连续写作7天奖励', time: '昨天' },
    { id: 6, points: 15, type: 'earn', description: '完成中等任务', time: '昨天' },
    { id: 7, points: 5, type: 'earn', description: '点赞他人日记', time: '昨天' },
    { id: 8, points: 10, type: 'earn', description: '创建日记', time: '2天前' },
  ]

  const rules = [
    { action: '创建日记', points: 10, icon: '✍️' },
    { action: '日记超过100字', points: 5, icon: '📝' },
    { action: '日记超过300字', points: 15, icon: '📄' },
    { action: '日记超过800字', points: 30, icon: '📚' },
    { action: '连续7天打卡', points: 50, icon: '🔥' },
    { action: '连续30天打卡', points: 200, icon: '🏆' },
    { action: '发表评论', points: 2, icon: '💬' },
    { action: '获得点赞', points: 1, icon: '❤️' },
    { action: '分享日记', points: 5, icon: '📤' },
    { action: '邀请好友', points: 50, icon: '👥' },
  ]

  const levelProgress = 75

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">💎 积分中心</h1>
            <p className="text-gray-600 mt-1">管理你的积分和等级</p>
          </div>
          <Link href="/quests" className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition">
            🎯 每日任务
          </Link>
        </div>

        {/* 积分卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl p-6 text-white">
            <div className="text-sm opacity-80">当前积分</div>
            <div className="text-5xl font-bold mt-2">1,250</div>
            <div className="flex items-center gap-4 mt-4">
              <div>
                <div className="text-sm opacity-80">今日获得</div>
                <div className="text-xl font-semibold">+85</div>
              </div>
              <div>
                <div className="text-sm opacity-80">可继续获得</div>
                <div className="text-xl font-semibold">115</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-500">等级进度</div>
              <div className="text-sm text-cyan-500">Lv.12</div>
            </div>
            <div className="bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full h-3 transition"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <div className="text-sm text-gray-500">
              还需 <span className="text-cyan-500 font-semibold">250</span> 积分升级到 Lv.13
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div>
                <div className="text-xs text-gray-400">总积分</div>
                <div className="text-lg font-semibold text-gray-800">3,500</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">已消费</div>
                <div className="text-lg font-semibold text-gray-800">2,250</div>
              </div>
              <div>
                <div className="text-xs text-gray-400">全站排名</div>
                <div className="text-lg font-semibold text-gray-800">#156</div>
              </div>
            </div>
          </div>
        </div>

        {/* 积分历史 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">📜 积分历史</h2>
          </div>
          <div className="divide-y">
            {history.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                    item.type === 'earn' ? 'bg-green-100' : 
                    item.type === 'spend' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {item.type === 'earn' ? '💰' : item.type === 'spend' ? '🛒' : '🎁'}
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{item.description}</div>
                    <div className="text-sm text-gray-500">{item.time}</div>
                  </div>
                </div>
                <div className={`text-lg font-semibold ${
                  item.points > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {item.points > 0 ? '+' : ''}{item.points}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t">
            <button className="w-full text-center text-cyan-500 hover:text-cyan-600 text-sm">
              查看全部历史 →
            </button>
          </div>
        </div>

        {/* 积分规则 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">📋 获取积分方式</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
            {rules.map((rule, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{rule.icon}</span>
                  <span className="text-gray-700">{rule.action}</span>
                </div>
                <span className="text-cyan-500 font-semibold">+{rule.points}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 底部链接 */}
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/shop" className="px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition">
            🛒 去商城消费
          </Link>
          <Link href="/quests" className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition">
            🎯 做任务赚积分
          </Link>
        </div>
      </div>
    </div>
  )
}