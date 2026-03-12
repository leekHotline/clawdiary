import Link from 'next/link'

export default function ShopPage() {
  const items = [
    { id: 'theme_ocean', name: '深海蓝调', description: '沉浸式的海洋主题', category: 'theme', price: 100, icon: '🌊', rarity: 'rare', owned: false },
    { id: 'theme_sunset', name: '日落黄昏', description: '温暖的日落配色', category: 'theme', price: 80, icon: '🌅', rarity: 'common', owned: true },
    { id: 'theme_forest', name: '森林秘境', description: '清新的森林主题', category: 'theme', price: 120, originalPrice: 150, icon: '🌲', rarity: 'epic', owned: false },
    { id: 'theme_galaxy', name: '星空漫步', description: '浩瀚宇宙主题', category: 'theme', price: 200, icon: '🌌', rarity: 'legendary', limited: true, stock: 50, owned: false },
    { id: 'badge_early_bird', name: '早起鸟徽章', description: '连续30天早起', category: 'badge', price: 150, icon: '🐦', rarity: 'rare', owned: false },
    { id: 'badge_night_owl', name: '夜猫子徽章', description: '连续30天深夜写作', category: 'badge', price: 150, icon: '🦉', rarity: 'rare', owned: false },
    { id: 'badge_master', name: '写作大师徽章', description: '累计写作100万字', category: 'badge', price: 300, icon: '🏅', rarity: 'legendary', limited: true, stock: 100, owned: false },
    { id: 'feature_ai_enhanced', name: 'AI 写作增强', description: '解锁高级AI辅助功能', category: 'feature', price: 500, icon: '🤖', rarity: 'epic', owned: false },
    { id: 'feature_export_pro', name: '导出专业版', description: '解锁所有导出格式', category: 'feature', price: 200, icon: '📤', rarity: 'rare', owned: true },
    { id: 'feature_stats_advanced', name: '高级数据分析', description: '详细写作数据分析', category: 'feature', price: 250, icon: '📊', rarity: 'epic', owned: false },
    { id: 'avatar_frame_gold', name: '金色光环', description: '闪耀的金色头像框', category: 'avatar', price: 100, icon: '✨', rarity: 'rare', owned: false },
    { id: 'avatar_frame_rainbow', name: '彩虹边框', description: '七彩头像边框', category: 'avatar', price: 180, icon: '🌈', rarity: 'epic', owned: false },
    { id: 'special_double_points', name: '双倍积分卡', description: '24小时内积分翻倍', category: 'special', price: 50, icon: '⚡', rarity: 'common', limited: true, owned: false },
    { id: 'special_lucky_box', name: '幸运盲盒', description: '随机获得商品或积分', category: 'special', price: 30, icon: '🎁', rarity: 'common', owned: false },
  ]

  const categories = [
    { id: 'theme', name: '主题', icon: '🎨', count: 4 },
    { id: 'badge', name: '徽章', icon: '🏆', count: 3 },
    { id: 'feature', name: '功能', icon: '⚡', count: 3 },
    { id: 'avatar', name: '头像框', icon: '🖼️', count: 2 },
    { id: 'special', name: '特殊道具', icon: '🎁', count: 2 },
  ]

  const rarityColors: Record<string, string> = {
    common: 'bg-gray-100 text-gray-600',
    rare: 'bg-blue-100 text-blue-600',
    epic: 'bg-purple-100 text-purple-600',
    legendary: 'bg-amber-100 text-amber-600',
  }

  const rarityBorders: Record<string, string> = {
    common: 'border-gray-200',
    rare: 'border-blue-300',
    epic: 'border-purple-300',
    legendary: 'border-amber-400',
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">🛒 积分商城</h1>
            <p className="text-gray-600 mt-1">用积分兑换专属商品</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/points" className="text-sm text-violet-600 hover:underline">
              📊 积分明细
            </Link>
            <Link href="/quests" className="text-sm text-violet-600 hover:underline">
              🎯 赚取积分
            </Link>
          </div>
        </div>

        {/* 积分余额 */}
        <div className="bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-80">当前积分</div>
              <div className="text-4xl font-bold mt-1">💎 1,250</div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-80">等级</div>
              <div className="text-2xl font-bold mt-1">Lv.12</div>
              <div className="text-sm opacity-80 mt-1">排名 #156</div>
            </div>
          </div>
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div className="bg-white rounded-full h-2" style={{ width: '75%' }} />
          </div>
          <div className="text-sm mt-1 opacity-80">距离下一等级还需 250 积分</div>
        </div>

        {/* 分类标签 */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button className="px-4 py-2 bg-violet-500 text-white rounded-full whitespace-nowrap">
            全部
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="px-4 py-2 bg-white text-gray-600 rounded-full whitespace-nowrap hover:bg-gray-100 transition flex items-center gap-1"
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span className="text-xs text-gray-400">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* 限时折扣 */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">🔥 限时折扣</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.filter(i => i.originalPrice).map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl p-4 border-2 ${rarityBorders[item.rarity]} shadow-sm hover:shadow-md transition`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-4xl">{item.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded ${rarityColors[item.rarity]}`}>
                        {item.rarity === 'common' ? '普通' : item.rarity === 'rare' ? '稀有' : item.rarity === 'epic' ? '史诗' : '传说'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-violet-500">💎 {item.price}</span>
                      <span className="text-sm text-gray-400 line-through">{item.originalPrice}</span>
                      <span className="text-xs text-red-500 bg-red-50 px-1 rounded">
                        -{Math.round((1 - item.price / item.originalPrice!) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 商品列表 */}
        <h2 className="text-lg font-semibold text-gray-800 mb-4">全部商品</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl p-4 border-2 ${rarityBorders[item.rarity]} shadow-sm hover:shadow-md transition ${
                item.owned ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-4xl">{item.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${rarityColors[item.rarity]}`}>
                      {item.rarity === 'common' ? '普通' : item.rarity === 'rare' ? '稀有' : item.rarity === 'epic' ? '史诗' : '传说'}
                    </span>
                    {item.limited && (
                      <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-600">
                        限量 {item.stock}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-violet-500">💎 {item.price}</span>
                    {item.owned ? (
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-lg">
                        已拥有
                      </span>
                    ) : (
                      <button className="px-3 py-1 bg-violet-500 text-white text-sm rounded-lg hover:bg-violet-600 transition">
                        购买
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>虚拟商品一经购买，概不退换 · 积分可通过完成任务获得</p>
        </div>
      </div>
    </div>
  )
}