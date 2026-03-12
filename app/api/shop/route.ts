import { NextResponse } from 'next/server'

// 商品定义
interface ShopItem {
  id: string
  name: string
  description: string
  category: 'theme' | 'badge' | 'feature' | 'avatar' | 'special'
  price: number
  originalPrice?: number
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  limited?: boolean
  stock?: number
  expiresAt?: string
  features?: string[]
}

// 积分商城商品
const shopItems: ShopItem[] = [
  // 主题类
  {
    id: 'theme_ocean',
    name: '深海蓝调',
    description: '沉浸式的海洋主题，让你的日记如深海般宁静',
    category: 'theme',
    price: 100,
    icon: '🌊',
    rarity: 'rare',
    features: ['深海背景', '气泡动效', '海洋音效'],
  },
  {
    id: 'theme_sunset',
    name: '日落黄昏',
    description: '温暖的日落配色，记录美好时光',
    category: 'theme',
    price: 80,
    icon: '🌅',
    rarity: 'common',
    features: ['温暖配色', '柔和过渡'],
  },
  {
    id: 'theme_forest',
    name: '森林秘境',
    description: '清新的森林主题，自然之美',
    category: 'theme',
    price: 120,
    originalPrice: 150,
    icon: '🌲',
    rarity: 'epic',
    features: ['森林背景', '鸟鸣音效', '叶落动画'],
  },
  {
    id: 'theme_galaxy',
    name: '星空漫步',
    description: '浩瀚宇宙，无限可能',
    category: 'theme',
    price: 200,
    icon: '🌌',
    rarity: 'legendary',
    limited: true,
    stock: 50,
    features: ['星空背景', '流星动画', '星座特效', '专属音效'],
  },

  // 徽章类
  {
    id: 'badge_early_bird',
    name: '早起鸟徽章',
    description: '连续30天在8点前写日记',
    category: 'badge',
    price: 150,
    icon: '🐦',
    rarity: 'rare',
  },
  {
    id: 'badge_night_owl',
    name: '夜猫子徽章',
    description: '连续30天在23点后写日记',
    category: 'badge',
    price: 150,
    icon: '🦉',
    rarity: 'rare',
  },
  {
    id: 'badge_master',
    name: '写作大师徽章',
    description: '累计写作超过100万字',
    category: 'badge',
    price: 300,
    icon: '🏅',
    rarity: 'legendary',
    limited: true,
    stock: 100,
  },

  // 功能类
  {
    id: 'feature_ai_enhanced',
    name: 'AI 写作增强',
    description: '解锁高级AI写作辅助功能',
    category: 'feature',
    price: 500,
    icon: '🤖',
    rarity: 'epic',
    features: ['AI 润色', '智能续写', '情感分析'],
  },
  {
    id: 'feature_export_pro',
    name: '导出专业版',
    description: '解锁所有导出格式',
    category: 'feature',
    price: 200,
    icon: '📤',
    rarity: 'rare',
    features: ['PDF 导出', 'Word 导出', 'Markdown 导出', '自定义样式'],
  },
  {
    id: 'feature_stats_advanced',
    name: '高级数据分析',
    description: '解锁详细写作数据分析',
    category: 'feature',
    price: 250,
    icon: '📊',
    rarity: 'epic',
    features: ['词频分析', '情感趋势', '写作热力图', '对比分析'],
  },

  // 头像框
  {
    id: 'avatar_frame_gold',
    name: '金色光环',
    description: '闪耀的金色头像框',
    category: 'avatar',
    price: 100,
    icon: '✨',
    rarity: 'rare',
  },
  {
    id: 'avatar_frame_rainbow',
    name: '彩虹边框',
    description: '七彩斑斓的头像边框',
    category: 'avatar',
    price: 180,
    icon: '🌈',
    rarity: 'epic',
  },

  // 特殊道具
  {
    id: 'special_double_points',
    name: '双倍积分卡',
    description: '24小时内所有积分翻倍',
    category: 'special',
    price: 50,
    icon: '⚡',
    rarity: 'common',
    limited: true,
    stock: 999,
  },
  {
    id: 'special_lucky_box',
    name: '幸运盲盒',
    description: '随机获得一件商品或大量积分',
    category: 'special',
    price: 30,
    icon: '🎁',
    rarity: 'common',
  },
  {
    id: 'special_time_capsule_plus',
    name: '时光胶囊增强',
    description: '可创建额外5个时光胶囊',
    category: 'special',
    price: 80,
    icon: '⏳',
    rarity: 'rare',
  },
]

// 用户积分信息
const getUserPoints = (userId: string) => ({
  current: 1250,
  total: 3500,
  spent: 2250,
  history: [
    { date: '2026-03-12', points: 35, reason: '完成任务' },
    { date: '2026-03-11', points: 50, reason: '写作奖励' },
    { date: '2026-03-10', points: -100, reason: '购买主题' },
  ],
})

// GET - 获取商城商品
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || 'default'
  const category = searchParams.get('category')

  let filteredItems = shopItems
  if (category) {
    filteredItems = shopItems.filter(item => item.category === category)
  }

  const userPoints = getUserPoints(userId)

  return NextResponse.json({
    success: true,
    data: {
      items: filteredItems,
      categories: [
        { id: 'theme', name: '主题', icon: '🎨', count: shopItems.filter(i => i.category === 'theme').length },
        { id: 'badge', name: '徽章', icon: '🏆', count: shopItems.filter(i => i.category === 'badge').length },
        { id: 'feature', name: '功能', icon: '⚡', count: shopItems.filter(i => i.category === 'feature').length },
        { id: 'avatar', name: '头像框', icon: '🖼️', count: shopItems.filter(i => i.category === 'avatar').length },
        { id: 'special', name: '特殊道具', icon: '🎁', count: shopItems.filter(i => i.category === 'special').length },
      ],
      userPoints,
      featured: [
        shopItems.find(i => i.id === 'theme_galaxy'),
        shopItems.find(i => i.id === 'feature_ai_enhanced'),
        shopItems.find(i => i.id === 'badge_master'),
      ].filter(Boolean),
      discounts: shopItems.filter(i => i.originalPrice),
      newItems: shopItems.slice(-3),
    }
  })
}

// POST - 购买商品
export async function POST(request: Request) {
  const body = await request.json()
  const { itemId, userId } = body

  const item = shopItems.find(i => i.id === itemId)
  
  if (!item) {
    return NextResponse.json({
      success: false,
      error: '商品不存在',
    }, { status: 404 })
  }

  // 模拟购买成功
  return NextResponse.json({
    success: true,
    data: {
      item,
      transactionId: `txn_${Date.now()}`,
      pointsSpent: item.price,
      remainingPoints: 1250 - item.price,
      message: `成功购买「${item.name}」！`,
    }
  })
}