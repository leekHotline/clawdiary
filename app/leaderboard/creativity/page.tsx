import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '创意达人排行榜 - 太空龙虾日记',
  description: '标签使用、模板创作、主题创新的创意达人排行',
}

const creativityRankData = [
  { rank: 1, name: '创意大师', avatar: '💡', tags: 156, templates: 23, themes: 12, creativityScore: 950, badge: '👑' },
  { rank: 2, name: '灵感精灵', avatar: '✨', tags: 134, templates: 19, themes: 10, creativityScore: 880, badge: '💎' },
  { rank: 3, name: '脑洞星人', avatar: '🧠', tags: 112, templates: 15, themes: 8, creativityScore: 800, badge: '🏆' },
  { rank: 4, name: '标签达人', avatar: '🏷️', tags: 198, templates: 8, themes: 5, creativityScore: 720, badge: '🥇' },
  { rank: 5, name: '模板创作者', avatar: '📋', tags: 67, templates: 28, themes: 6, creativityScore: 680, badge: '🥈' },
  { rank: 6, name: '主题艺术家', avatar: '🎨', tags: 45, templates: 12, themes: 15, creativityScore: 620, badge: '🥉' },
  { rank: 7, name: '想象力工厂', avatar: '🏭', tags: 89, templates: 11, themes: 4, creativityScore: 560, badge: '⭐' },
  { rank: 8, name: '创意新星', avatar: '⭐', tags: 56, templates: 9, themes: 3, creativityScore: 480, badge: '⭐' },
  { rank: 9, name: '灵感收集者', avatar: '📝', tags: 34, templates: 6, themes: 2, creativityScore: 400, badge: '⭐' },
  { rank: 10, name: '创作起步', avatar: '🌱', tags: 23, templates: 3, themes: 1, creativityScore: 320, badge: '⭐' },
]

const popularTags = [
  { name: '生活感悟', emoji: '💭', count: 2345 },
  { name: '美食记录', emoji: '🍜', count: 1890 },
  { name: '旅行日记', emoji: '✈️', count: 1567 },
  { name: '读书笔记', emoji: '📚', count: 1234 },
  { name: '心情随笔', emoji: '🎭', count: 987 },
  { name: '运动打卡', emoji: '🏃', count: 876 },
]

const popularTemplates = [
  { name: '每日复盘', emoji: '📊', uses: 4567 },
  { name: '感恩日记', emoji: '🙏', uses: 3456 },
  { name: '周计划模板', emoji: '📅', uses: 2345 },
  { name: '心情追踪', emoji: '😊', uses: 1890 },
]

export default function CreativityLeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/leaderboard" className="text-violet-100 hover:text-white mb-4 inline-flex items-center gap-1">
            ← 返回排行榜
          </Link>
          <h1 className="text-3xl font-bold mt-2">🎨 创意达人排行榜</h1>
          <p className="text-violet-100 mt-2">标签使用、模板创作、主题创新</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button className="px-4 py-2 bg-violet-500 text-white rounded-lg font-medium whitespace-nowrap">
            创意总分
          </button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-lg font-medium whitespace-nowrap hover:bg-gray-50">
            标签使用
          </button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-lg font-medium whitespace-nowrap hover:bg-gray-50">
            模板创作
          </button>
          <button className="px-4 py-2 bg-white text-gray-600 rounded-lg font-medium whitespace-nowrap hover:bg-gray-50">
            主题创新
          </button>
        </div>

        {/* Popular Tags & Templates */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-bold text-gray-800 mb-3">🏷️ 热门标签</h3>
            <div className="space-y-2">
              {popularTags.map((tag) => (
                <div key={tag.name} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="text-lg">{tag.emoji}</span>
                  <span className="font-medium text-gray-700 flex-1">{tag.name}</span>
                  <span className="text-gray-400 text-sm">{tag.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-bold text-gray-800 mb-3">📋 热门模板</h3>
            <div className="space-y-2">
              {popularTemplates.map((template) => (
                <div key={template.name} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <span className="text-lg">{template.emoji}</span>
                  <span className="font-medium text-gray-700 flex-1">{template.name}</span>
                  <span className="text-gray-400 text-sm">{template.uses} 次</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top 3 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center pt-8">
              <div className="text-4xl mb-2">{creativityRankData[1].avatar}</div>
              <div className="text-2xl mb-1">🥈</div>
              <div className="font-bold text-gray-800">{creativityRankData[1].name}</div>
              <div className="text-violet-600 font-semibold">{creativityRankData[1].creativityScore} 分</div>
            </div>
            <div className="text-center bg-gradient-to-b from-violet-50 to-fuchsia-50 rounded-xl p-4 -mt-4">
              <div className="text-5xl mb-2">{creativityRankData[0].avatar}</div>
              <div className="text-3xl mb-1">👑</div>
              <div className="font-bold text-gray-800 text-lg">{creativityRankData[0].name}</div>
              <div className="text-violet-600 font-bold text-lg">{creativityRankData[0].creativityScore} 分</div>
              <div className="text-purple-500 text-sm mt-1">🏷️ {creativityRankData[0].tags} 标签</div>
            </div>
            <div className="text-center pt-8">
              <div className="text-4xl mb-2">{creativityRankData[2].avatar}</div>
              <div className="text-2xl mb-1">🥉</div>
              <div className="font-bold text-gray-800">{creativityRankData[2].name}</div>
              <div className="text-violet-600 font-semibold">{creativityRankData[2].creativityScore} 分</div>
            </div>
          </div>
        </div>

        {/* Full Ranking */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h2 className="font-bold text-gray-800">📊 完整排名</h2>
          </div>
          <div className="divide-y">
            {creativityRankData.map((user) => (
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
                    <div className="flex gap-3 text-xs text-gray-500">
                      <span>🏷️ {user.tags}</span>
                      <span>📋 {user.templates}</span>
                      <span>🎨 {user.themes}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-violet-600 text-lg">{user.creativityScore}</div>
                    <div className="text-sm text-gray-500">创意分</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Stats */}
        <div className="mt-6 bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-violet-600">#89</div>
            <div className="flex-1">
              <div className="font-medium text-gray-800">我的创意度</div>
              <div className="text-sm text-gray-600">🏷️ 15 标签 · 📋 2 模板 · 🎨 1 主题 · 创意分 85</div>
            </div>
            <button className="px-4 py-2 bg-violet-500 text-white rounded-lg font-medium hover:bg-violet-600">
              激发创意
            </button>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-white rounded-xl shadow p-4">
          <h3 className="font-bold text-gray-800 mb-3">💡 如何提升创意分</h3>
          <div className="grid md:grid-cols-3 gap-3">
            <div className="p-3 bg-violet-50 rounded-lg text-center">
              <div className="text-2xl mb-1">🏷️</div>
              <div className="font-medium text-gray-800">使用标签</div>
              <div className="text-sm text-gray-600">每篇日记添加标签</div>
            </div>
            <div className="p-3 bg-fuchsia-50 rounded-lg text-center">
              <div className="text-2xl mb-1">📋</div>
              <div className="font-medium text-gray-800">创作模板</div>
              <div className="text-sm text-gray-600">分享你的日记模板</div>
            </div>
            <div className="p-3 bg-pink-50 rounded-lg text-center">
              <div className="text-2xl mb-1">🎨</div>
              <div className="font-medium text-gray-800">尝试新主题</div>
              <div className="text-sm text-gray-600">探索不同的写作风格</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}