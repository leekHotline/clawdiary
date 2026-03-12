import Link from 'next/link'

export default function QuestsPage() {
  const quests = [
    { id: 1, title: '日记新手', description: '完成今天的日记', type: 'writing', difficulty: 'easy', target: 1, progress: 1, reward: 10, icon: '✍️', completed: true },
    { id: 2, title: '热心邻居', description: '给3篇日记点赞', type: 'social', difficulty: 'easy', target: 3, progress: 2, reward: 5, icon: '👍', completed: false },
    { id: 3, title: '探险家', description: '访问3个不同的页面', type: 'exploration', difficulty: 'easy', target: 3, progress: 3, reward: 5, icon: '🗺️', completed: true },
    { id: 4, title: '标签爱好者', description: '为日记添加3个标签', type: 'creativity', difficulty: 'easy', target: 3, progress: 1, reward: 8, icon: '🏷️', completed: false },
    { id: 5, title: '心情记录者', description: '记录今天的心情', type: 'mindfulness', difficulty: 'easy', target: 1, progress: 1, reward: 5, icon: '😊', completed: true },
    { id: 6, title: '文字工匠', description: '写一篇至少300字的日记', type: 'writing', difficulty: 'medium', target: 300, progress: 250, reward: 25, icon: '📝', completed: false },
    { id: 7, title: '评论达人', description: '发表5条评论', type: 'social', difficulty: 'medium', target: 5, progress: 3, reward: 15, icon: '💬', completed: false },
    { id: 8, title: '故事大师', description: '写一篇至少800字的长篇日记', type: 'writing', difficulty: 'hard', target: 800, progress: 0, reward: 50, bonusReward: 20, icon: '📚', completed: false },
  ]

  const typeColors: Record<string, string> = {
    writing: 'bg-blue-500',
    social: 'bg-pink-500',
    exploration: 'bg-green-500',
    creativity: 'bg-purple-500',
    mindfulness: 'bg-yellow-500',
  }

  const difficultyColors: Record<string, string> = {
    easy: 'text-green-500',
    medium: 'text-yellow-500',
    hard: 'text-red-500',
  }

  const completedCount = quests.filter(q => q.completed).length
  const totalReward = quests.reduce((sum, q) => sum + q.reward + (q.bonusReward || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* 头部 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">🎯 每日任务</h1>
              <p className="text-gray-600 mt-1">完成任务，赢取积分！</p>
            </div>
            <Link href="/shop" className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition">
              🛒 积分商城
            </Link>
          </div>

          {/* 进度概览 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl mb-1">✅</div>
              <div className="text-2xl font-bold text-gray-800">{completedCount}/{quests.length}</div>
              <div className="text-sm text-gray-500">已完成</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl mb-1">⏳</div>
              <div className="text-2xl font-bold text-gray-800">{quests.length - completedCount}</div>
              <div className="text-sm text-gray-500">进行中</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl mb-1">💰</div>
              <div className="text-2xl font-bold text-amber-500">{totalReward}</div>
              <div className="text-sm text-gray-500">可获得积分</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl mb-1">🔥</div>
              <div className="text-2xl font-bold text-orange-500">7</div>
              <div className="text-sm text-gray-500">连续完成天数</div>
            </div>
          </div>
        </div>

        {/* 任务分类 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['全部', '写作', '社交', '探索', '创意', '正念'].map((cat, i) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                i === 0 ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 任务列表 */}
        <div className="space-y-4">
          {quests.map((quest) => (
            <div
              key={quest.id}
              className={`bg-white rounded-xl p-5 shadow-sm border-2 transition ${
                quest.completed ? 'border-green-200 bg-green-50' : 'border-transparent hover:border-amber-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                  quest.completed ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {quest.completed ? '✅' : quest.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800">{quest.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[quest.difficulty]}`}>
                      {quest.difficulty === 'easy' ? '简单' : quest.difficulty === 'medium' ? '中等' : '困难'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full text-white ${typeColors[quest.type]}`}>
                      {quest.type === 'writing' ? '写作' : quest.type === 'social' ? '社交' : quest.type === 'exploration' ? '探索' : quest.type === 'creativity' ? '创意' : '正念'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{quest.description}</p>
                  
                  {/* 进度条 */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition ${
                          quest.completed ? 'bg-green-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, (quest.progress / quest.target) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">
                      {quest.progress}/{quest.target}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-amber-500">+{quest.reward}</div>
                  {quest.bonusReward && (
                    <div className="text-xs text-green-500">+{quest.bonusReward} 额外</div>
                  )}
                  {!quest.completed && quest.progress >= quest.target && (
                    <button className="mt-2 px-3 py-1 bg-amber-500 text-white text-sm rounded-lg hover:bg-amber-600 transition">
                      领取
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>任务每天 00:00 重置 · 完成所有任务可获得额外奖励 🎁</p>
        </div>
      </div>
    </div>
  )
}