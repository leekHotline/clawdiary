import Link from 'next/link'

export default function AchievementsPage() {
  const achievements = [
    { id: 'first_diary', name: '日记新手', description: '写下第一篇日记', category: 'writing', icon: '📝', rarity: 'common', requirement: 1, progress: 1, unlocked: true, reward: 50 },
    { id: 'diary_10', name: '笔耕不辍', description: '累计写10篇日记', category: 'writing', icon: '✍️', rarity: 'common', requirement: 10, progress: 10, unlocked: true, reward: 100 },
    { id: 'words_10k', name: '万字户', description: '累计写作超过1万字', category: 'writing', icon: '📊', rarity: 'common', requirement: 10000, progress: 15000, unlocked: true, reward: 100 },
    { id: 'first_like', name: '首次点赞', description: '给他人日记点赞', category: 'social', icon: '❤️', rarity: 'common', requirement: 1, progress: 1, unlocked: true, reward: 10 },
    { id: 'first_comment', name: '评论新手', description: '发表第一条评论', category: 'social', icon: '💬', rarity: 'common', requirement: 1, progress: 1, unlocked: true, reward: 10 },
    { id: 'streak_7', name: '周坚持者', description: '连续写日记7天', category: 'streak', icon: '🔥', rarity: 'common', requirement: 7, progress: 7, unlocked: true, reward: 100 },
    { id: 'explore_5', name: '好奇宝宝', description: '访问5个不同功能', category: 'exploration', icon: '🗺️', rarity: 'common', requirement: 5, progress: 12, unlocked: true, reward: 30 },
    { id: 'tags_10', name: '标签新手', description: '使用10个不同的标签', category: 'creativity', icon: '🏷️', rarity: 'common', requirement: 10, progress: 25, unlocked: true, reward: 50 },
    { id: 'diary_50', name: '写作达人', description: '累计写50篇日记', category: 'writing', icon: '📚', rarity: 'rare', requirement: 50, progress: 35, unlocked: false, reward: 300 },
    { id: 'streak_30', name: '月坚持者', description: '连续写日记30天', category: 'streak', icon: '💪', rarity: 'rare', requirement: 30, progress: 7, unlocked: false, reward: 300 },
    { id: 'likes_100', name: '爱心满满', description: '累计点赞100次', category: 'social', icon: '💕', rarity: 'rare', requirement: 100, progress: 28, unlocked: false, reward: 150 },
    { id: 'diary_100', name: '日记大师', description: '累计写100篇日记', category: 'writing', icon: '📖', rarity: 'epic', requirement: 100, progress: 35, unlocked: false, reward: 500 },
    { id: 'streak_100', name: '百日坚持', description: '连续写日记100天', category: 'streak', icon: '🏅', rarity: 'epic', requirement: 100, progress: 7, unlocked: false, reward: 800 },
    { id: 'diary_365', name: '日记传奇', description: '累计写365篇日记', category: 'writing', icon: '👑', rarity: 'legendary', requirement: 365, progress: 35, unlocked: false, reward: 1000 },
    { id: 'words_1m', name: '百万字巨匠', description: '累计写作超过100万字', category: 'writing', icon: '🏆', rarity: 'legendary', requirement: 1000000, progress: 15000, unlocked: false, reward: 2000 },
    { id: 'streak_365', name: '年坚持者', description: '连续写日记365天', category: 'streak', icon: '💎', rarity: 'legendary', requirement: 365, progress: 7, unlocked: false, reward: 2000 },
  ]

  const categories = [
    { id: 'writing', name: '写作', icon: '✍️', count: 6 },
    { id: 'social', name: '社交', icon: '💬', count: 3 },
    { id: 'streak', name: '连续', icon: '🔥', count: 4 },
    { id: 'exploration', name: '探索', icon: '🗺️', count: 1 },
    { id: 'creativity', name: '创意', icon: '🎨', count: 1 },
    { id: 'special', name: '特殊', icon: '⭐', count: 1 },
  ]

  const rarityColors: Record<string, string> = {
    common: 'bg-gray-100 text-gray-600 border-gray-300',
    rare: 'bg-blue-50 text-blue-600 border-blue-300',
    epic: 'bg-purple-50 text-purple-600 border-purple-300',
    legendary: 'bg-amber-50 text-amber-600 border-amber-400',
  }

  const rarityGlow: Record<string, string> = {
    common: '',
    rare: 'shadow-blue-200',
    epic: 'shadow-purple-300',
    legendary: 'shadow-amber-400 shadow-lg',
  }

  const unlocked = achievements.filter(a => a.unlocked)
  const locked = achievements.filter(a => !a.unlocked)

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🏆 成就系统</h1>
            <p className="text-gray-600 mt-1">记录你的成长轨迹</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-amber-500">{unlocked.length}/{achievements.length}</div>
            <div className="text-sm text-gray-500">已解锁</div>
          </div>
        </div>

        {/* 进度概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-1">✅</div>
            <div className="text-2xl font-bold text-gray-800">{unlocked.length}</div>
            <div className="text-sm text-gray-500">已解锁</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-1">🔒</div>
            <div className="text-2xl font-bold text-gray-800">{locked.length}</div>
            <div className="text-sm text-gray-500">待解锁</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-1">💎</div>
            <div className="text-2xl font-bold text-amber-500">{unlocked.reduce((s, a) => s + a.reward, 0)}</div>
            <div className="text-sm text-gray-500">获得积分</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-2xl font-bold text-blue-500">{((unlocked.length / achievements.length) * 100).toFixed(0)}%</div>
            <div className="text-sm text-gray-500">完成度</div>
          </div>
        </div>

        {/* 分类标签 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button className="px-4 py-2 bg-amber-500 text-white rounded-full whitespace-nowrap">
            全部
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="px-4 py-2 bg-white text-gray-600 rounded-full whitespace-nowrap hover:bg-gray-100 transition flex items-center gap-1"
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* 已解锁成就 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>✨</span> 已解锁
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unlocked.map((achievement) => (
              <div
                key={achievement.id}
                className={`bg-white rounded-xl p-4 border-2 ${rarityColors[achievement.rarity]} ${rarityGlow[achievement.rarity]} transition hover:scale-[1.02]`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">{achievement.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-600">
                        已解锁
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                    <div className="text-amber-500 text-sm mt-2">+{achievement.reward} 积分</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 即将解锁 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>🔥</span> 即将解锁
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locked.filter(a => a.progress / a.requirement > 0.5).slice(0, 3).map((achievement) => (
              <div
                key={achievement.id}
                className="bg-white rounded-xl p-4 border-2 border-gray-200 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="text-4xl opacity-50">{achievement.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{achievement.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                    <div className="mt-2">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-amber-500 rounded-full h-2 transition"
                          style={{ width: `${Math.min(100, (achievement.progress / achievement.requirement) * 100)}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {achievement.progress}/{achievement.requirement}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 锁定的成就 */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>🔒</span> 待解锁
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locked.filter(a => a.progress / a.requirement <= 0.5).map((achievement) => (
              <div
                key={achievement.id}
                className={`bg-white rounded-xl p-4 border-2 ${rarityColors[achievement.rarity]} opacity-60`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-4xl grayscale">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">{achievement.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500">
                        {achievement.rarity === 'common' ? '普通' : achievement.rarity === 'rare' ? '稀有' : achievement.rarity === 'epic' ? '史诗' : '传说'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{achievement.description}</p>
                    <div className="bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gray-400 rounded-full h-2"
                        style={{ width: `${(achievement.progress / achievement.requirement) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}