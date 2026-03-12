import { NextResponse } from 'next/server'

// 成就定义
interface Achievement {
  id: string
  name: string
  description: string
  category: 'writing' | 'social' | 'exploration' | 'creativity' | 'streak' | 'special'
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  requirement: number
  progress: number
  unlocked: boolean
  unlockedAt?: string
  reward: number
}

// 所有成就
const allAchievements: Achievement[] = [
  // 写作成就
  { id: 'first_diary', name: '日记新手', description: '写下第一篇日记', category: 'writing', icon: '📝', rarity: 'common', requirement: 1, progress: 1, unlocked: true, reward: 50 },
  { id: 'diary_10', name: '笔耕不辍', description: '累计写10篇日记', category: 'writing', icon: '✍️', rarity: 'common', requirement: 10, progress: 35, unlocked: true, reward: 100 },
  { id: 'diary_50', name: '写作达人', description: '累计写50篇日记', category: 'writing', icon: '📚', rarity: 'rare', requirement: 50, progress: 35, unlocked: false, reward: 300 },
  { id: 'diary_100', name: '日记大师', description: '累计写100篇日记', category: 'writing', icon: '📖', rarity: 'epic', requirement: 100, progress: 35, unlocked: false, reward: 500 },
  { id: 'diary_365', name: '日记传奇', description: '累计写365篇日记', category: 'writing', icon: '👑', rarity: 'legendary', requirement: 365, progress: 35, unlocked: false, reward: 1000 },
  { id: 'words_10k', name: '万字户', description: '累计写作超过1万字', category: 'writing', icon: '📊', rarity: 'common', requirement: 10000, progress: 15000, unlocked: true, reward: 100 },
  { id: 'words_100k', name: '十万字户', description: '累计写作超过10万字', category: 'writing', icon: '📈', rarity: 'rare', requirement: 100000, progress: 15000, unlocked: false, reward: 500 },
  { id: 'words_1m', name: '百万字巨匠', description: '累计写作超过100万字', category: 'writing', icon: '🏆', rarity: 'legendary', requirement: 1000000, progress: 15000, unlocked: false, reward: 2000 },

  // 社交成就
  { id: 'first_like', name: '首次点赞', description: '给他人日记点赞', category: 'social', icon: '❤️', rarity: 'common', requirement: 1, progress: 28, unlocked: true, reward: 10 },
  { id: 'likes_100', name: '爱心满满', description: '累计点赞100次', category: 'social', icon: '💕', rarity: 'rare', requirement: 100, progress: 28, unlocked: false, reward: 150 },
  { id: 'first_comment', name: '评论新手', description: '发表第一条评论', category: 'social', icon: '💬', rarity: 'common', requirement: 1, progress: 15, unlocked: true, reward: 10 },
  { id: 'comments_50', name: '评论达人', description: '累计发表50条评论', category: 'social', icon: '🗣️', rarity: 'rare', requirement: 50, progress: 15, unlocked: false, reward: 200 },
  { id: 'be_liked_100', name: '人气之星', description: '累计获得100个赞', category: 'social', icon: '⭐', rarity: 'rare', requirement: 100, progress: 45, unlocked: false, reward: 200 },
  { id: 'be_liked_1000', name: '人气爆棚', description: '累计获得1000个赞', category: 'social', icon: '🌟', rarity: 'epic', requirement: 1000, progress: 45, unlocked: false, reward: 500 },

  // 连续打卡成就
  { id: 'streak_7', name: '周坚持者', description: '连续写日记7天', category: 'streak', icon: '🔥', rarity: 'common', requirement: 7, progress: 7, unlocked: true, reward: 100 },
  { id: 'streak_30', name: '月坚持者', description: '连续写日记30天', category: 'streak', icon: '💪', rarity: 'rare', requirement: 30, progress: 7, unlocked: false, reward: 300 },
  { id: 'streak_100', name: '百日坚持', description: '连续写日记100天', category: 'streak', icon: '🏅', rarity: 'epic', requirement: 100, progress: 7, unlocked: false, reward: 800 },
  { id: 'streak_365', name: '年坚持者', description: '连续写日记365天', category: 'streak', icon: '💎', rarity: 'legendary', requirement: 365, progress: 7, unlocked: false, reward: 2000 },

  // 探索成就
  { id: 'explore_5', name: '好奇宝宝', description: '访问5个不同功能', category: 'exploration', icon: '🗺️', rarity: 'common', requirement: 5, progress: 12, unlocked: true, reward: 30 },
  { id: 'explore_20', name: '探索者', description: '访问20个不同功能', category: 'exploration', icon: '🧭', rarity: 'rare', requirement: 20, progress: 12, unlocked: false, reward: 100 },
  { id: 'explore_all', name: '全知全能', description: '访问所有功能模块', category: 'exploration', icon: '🌈', rarity: 'legendary', requirement: 50, progress: 12, unlocked: false, reward: 500 },

  // 创意成就
  { id: 'tags_10', name: '标签新手', description: '使用10个不同的标签', category: 'creativity', icon: '🏷️', rarity: 'common', requirement: 10, progress: 25, unlocked: true, reward: 50 },
  { id: 'tags_50', name: '标签达人', description: '使用50个不同的标签', category: 'creativity', icon: '🎨', rarity: 'rare', requirement: 50, progress: 25, unlocked: false, reward: 150 },
  { id: 'theme_user', name: '主题玩家', description: '切换使用5个不同的主题', category: 'creativity', icon: '🎭', rarity: 'rare', requirement: 5, progress: 2, unlocked: false, reward: 100 },

  // 特殊成就
  { id: 'early_bird', name: '早起鸟', description: '在早上6-8点写日记', category: 'special', icon: '🐦', rarity: 'rare', requirement: 10, progress: 5, unlocked: false, reward: 150 },
  { id: 'night_owl', name: '夜猫子', description: '在晚上11点后写日记', category: 'special', icon: '🦉', rarity: 'rare', requirement: 10, progress: 8, unlocked: false, reward: 150 },
  { id: 'mood_master', name: '心情大师', description: '记录100次心情', category: 'special', icon: '😊', rarity: 'epic', requirement: 100, progress: 35, unlocked: false, reward: 300 },
]

// GET - 获取成就列表
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const userId = searchParams.get('userId') || 'default'

  let filtered = allAchievements
  if (category) {
    filtered = allAchievements.filter(a => a.category === category)
  }

  const unlockedCount = filtered.filter(a => a.unlocked).length
  const totalPoints = filtered.filter(a => a.unlocked).reduce((sum, a) => sum + a.reward, 0)

  return NextResponse.json({
    success: true,
    data: {
      achievements: filtered,
      stats: {
        total: filtered.length,
        unlocked: unlockedCount,
        locked: filtered.length - unlockedCount,
        totalPointsEarned: totalPoints,
        completionRate: ((unlockedCount / filtered.length) * 100).toFixed(1),
      },
      categories: [
        { id: 'writing', name: '写作', icon: '✍️', count: allAchievements.filter(a => a.category === 'writing').length },
        { id: 'social', name: '社交', icon: '💬', count: allAchievements.filter(a => a.category === 'social').length },
        { id: 'streak', name: '连续', icon: '🔥', count: allAchievements.filter(a => a.category === 'streak').length },
        { id: 'exploration', name: '探索', icon: '🗺️', count: allAchievements.filter(a => a.category === 'exploration').length },
        { id: 'creativity', name: '创意', icon: '🎨', count: allAchievements.filter(a => a.category === 'creativity').length },
        { id: 'special', name: '特殊', icon: '⭐', count: allAchievements.filter(a => a.category === 'special').length },
      ],
      recentUnlocked: filtered.filter(a => a.unlocked).slice(0, 5),
      nearCompletion: filtered.filter(a => !a.unlocked && a.progress / a.requirement > 0.7).slice(0, 5),
    }
  })
}

// POST - 解锁成就
export async function POST(request: Request) {
  const body = await request.json()
  const { achievementId } = body

  const achievement = allAchievements.find(a => a.id === achievementId)
  
  if (!achievement) {
    return NextResponse.json({ success: false, error: '成就不存在' }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    data: {
      achievement: {
        ...achievement,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      },
      reward: achievement.reward,
      message: `恭喜解锁成就「${achievement.name}」！获得 ${achievement.reward} 积分`,
    }
  })
}