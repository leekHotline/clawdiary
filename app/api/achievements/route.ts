import { NextRequest, NextResponse } from 'next/server'

// 成就类型定义
interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: 'diary' | 'social' | 'streak' | 'exploration' | 'special'
  requirement: {
    type: 'count' | 'streak' | 'unique' | 'special'
    target: number
    metric: string
  }
  points: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  createdAt: string
}

// 预定义成就列表
const ACHIEVEMENTS: Achievement[] = [
  // 日记类成就
  {
    id: 'first-diary',
    name: '初出茅庐',
    description: '写下第一篇日记',
    icon: '📝',
    category: 'diary',
    requirement: { type: 'count', target: 1, metric: 'diaries' },
    points: 10,
    rarity: 'common',
    createdAt: '2024-01-01'
  },
  {
    id: 'diary-10',
    name: '日记新手',
    description: '累计写下10篇日记',
    icon: '📔',
    category: 'diary',
    requirement: { type: 'count', target: 10, metric: 'diaries' },
    points: 30,
    rarity: 'common',
    createdAt: '2024-01-01'
  },
  {
    id: 'diary-50',
    name: '日记达人',
    description: '累计写下50篇日记',
    icon: '📚',
    category: 'diary',
    requirement: { type: 'count', target: 50, metric: 'diaries' },
    points: 100,
    rarity: 'rare',
    createdAt: '2024-01-01'
  },
  {
    id: 'diary-100',
    name: '日记大师',
    description: '累计写下100篇日记',
    icon: '👑',
    category: 'diary',
    requirement: { type: 'count', target: 100, metric: 'diaries' },
    points: 200,
    rarity: 'epic',
    createdAt: '2024-01-01'
  },
  {
    id: 'diary-365',
    name: '日记传奇',
    description: '累计写下365篇日记',
    icon: '🏆',
    category: 'diary',
    requirement: { type: 'count', target: 365, metric: 'diaries' },
    points: 500,
    rarity: 'legendary',
    createdAt: '2024-01-01'
  },
  // 连续记录成就
  {
    id: 'streak-7',
    name: '一周坚持',
    description: '连续写日记7天',
    icon: '🔥',
    category: 'streak',
    requirement: { type: 'streak', target: 7, metric: 'days' },
    points: 50,
    rarity: 'common',
    createdAt: '2024-01-01'
  },
  {
    id: 'streak-30',
    name: '月度达人',
    description: '连续写日记30天',
    icon: '⭐',
    category: 'streak',
    requirement: { type: 'streak', target: 30, metric: 'days' },
    points: 150,
    rarity: 'rare',
    createdAt: '2024-01-01'
  },
  {
    id: 'streak-100',
    name: '百日坚持',
    description: '连续写日记100天',
    icon: '💫',
    category: 'streak',
    requirement: { type: 'streak', target: 100, metric: 'days' },
    points: 400,
    rarity: 'epic',
    createdAt: '2024-01-01'
  },
  {
    id: 'streak-365',
    name: '年度毅力王',
    description: '连续写日记365天',
    icon: '🌟',
    category: 'streak',
    requirement: { type: 'streak', target: 365, metric: 'days' },
    points: 1000,
    rarity: 'legendary',
    createdAt: '2024-01-01'
  },
  // 社交成就
  {
    id: 'first-like',
    name: '初获认可',
    description: '获得第一个点赞',
    icon: '❤️',
    category: 'social',
    requirement: { type: 'count', target: 1, metric: 'likes_received' },
    points: 20,
    rarity: 'common',
    createdAt: '2024-01-01'
  },
  {
    id: 'likes-100',
    name: '人气小生',
    description: '累计获得100个点赞',
    icon: '💖',
    category: 'social',
    requirement: { type: 'count', target: 100, metric: 'likes_received' },
    points: 100,
    rarity: 'rare',
    createdAt: '2024-01-01'
  },
  {
    id: 'first-comment',
    name: '互动起点',
    description: '收到第一条评论',
    icon: '💬',
    category: 'social',
    requirement: { type: 'count', target: 1, metric: 'comments_received' },
    points: 20,
    rarity: 'common',
    createdAt: '2024-01-01'
  },
  {
    id: 'comments-50',
    name: '互动达人',
    description: '收到50条评论',
    icon: '🗣️',
    category: 'social',
    requirement: { type: 'count', target: 50, metric: 'comments_received' },
    points: 80,
    rarity: 'rare',
    createdAt: '2024-01-01'
  },
  {
    id: 'followers-10',
    name: '小有名气',
    description: '获得10个关注者',
    icon: '👥',
    category: 'social',
    requirement: { type: 'count', target: 10, metric: 'followers' },
    points: 60,
    rarity: 'common',
    createdAt: '2024-01-01'
  },
  {
    id: 'followers-100',
    name: '人气之星',
    description: '获得100个关注者',
    icon: '⭐',
    category: 'social',
    requirement: { type: 'count', target: 100, metric: 'followers' },
    points: 200,
    rarity: 'epic',
    createdAt: '2024-01-01'
  },
  // 探索成就
  {
    id: 'tags-10',
    name: '标签收集者',
    description: '使用10个不同的标签',
    icon: '🏷️',
    category: 'exploration',
    requirement: { type: 'unique', target: 10, metric: 'tags' },
    points: 40,
    rarity: 'common',
    createdAt: '2024-01-01'
  },
  {
    id: 'mood-5',
    name: '情绪多面手',
    description: '记录5种不同的心情',
    icon: '🎭',
    category: 'exploration',
    requirement: { type: 'unique', target: 5, metric: 'moods' },
    points: 30,
    rarity: 'common',
    createdAt: '2024-01-01'
  },
  {
    id: 'weather-10',
    name: '天气记录员',
    description: '记录10种不同天气下的日记',
    icon: '🌤️',
    category: 'exploration',
    requirement: { type: 'unique', target: 10, metric: 'weathers' },
    points: 50,
    rarity: 'rare',
    createdAt: '2024-01-01'
  },
  // 特殊成就
  {
    id: 'early-bird',
    name: '早起鸟儿',
    description: '在早上6点前写日记',
    icon: '🐦',
    category: 'special',
    requirement: { type: 'special', target: 1, metric: 'early_diary' },
    points: 30,
    rarity: 'rare',
    createdAt: '2024-01-01'
  },
  {
    id: 'night-owl',
    name: '夜猫子',
    description: '在凌晨2点后写日记',
    icon: '🦉',
    category: 'special',
    requirement: { type: 'special', target: 1, metric: 'late_diary' },
    points: 30,
    rarity: 'rare',
    createdAt: '2024-01-01'
  },
  {
    id: 'long-diary',
    name: '长篇大论',
    description: '写一篇超过1000字的日记',
    icon: '📜',
    category: 'special',
    requirement: { type: 'special', target: 1000, metric: 'word_count' },
    points: 50,
    rarity: 'rare',
    createdAt: '2024-01-01'
  },
  {
    id: 'first-share',
    name: '分享先锋',
    description: '首次分享日记',
    icon: '🔗',
    category: 'social',
    requirement: { type: 'count', target: 1, metric: 'shares' },
    points: 25,
    rarity: 'common',
    createdAt: '2024-01-01'
  },
  {
    id: 'collection-5',
    name: '收藏家',
    description: '创建5个收藏夹',
    icon: '📁',
    category: 'exploration',
    requirement: { type: 'count', target: 5, metric: 'collections' },
    points: 60,
    rarity: 'rare',
    createdAt: '2024-01-01'
  }
]

// GET: 获取所有成就列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const rarity = searchParams.get('rarity')

    let filteredAchievements = [...ACHIEVEMENTS]

    if (category) {
      filteredAchievements = filteredAchievements.filter(
        a => a.category === category
      )
    }

    if (rarity) {
      filteredAchievements = filteredAchievements.filter(
        a => a.rarity === rarity
      )
    }

    // 按稀有度和积分排序
    filteredAchievements.sort((a, b) => {
      const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 }
      const rarityDiff = rarityOrder[a.rarity] - rarityOrder[b.rarity]
      if (rarityDiff !== 0) return rarityDiff
      return b.points - a.points
    })

    return NextResponse.json({
      success: true,
      data: filteredAchievements,
      total: filteredAchievements.length,
      categories: ['diary', 'social', 'streak', 'exploration', 'special'],
      rarities: ['common', 'rare', 'epic', 'legendary']
    })
  } catch (error) {
    console.error('获取成就列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取成就列表失败' },
      { status: 500 }
    )
  }
}