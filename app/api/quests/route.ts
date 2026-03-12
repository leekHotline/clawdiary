import { NextResponse } from 'next/server'

// 任务类型定义
type QuestType = 'writing' | 'social' | 'exploration' | 'creativity' | 'mindfulness'
type QuestDifficulty = 'easy' | 'medium' | 'hard'

interface Quest {
  id: string
  title: string
  description: string
  type: QuestType
  difficulty: QuestDifficulty
  target: number
  progress: number
  reward: number
  bonusReward?: number
  icon: string
  category: string
  expiresAt: string
  completedAt?: string
}

interface QuestTemplate {
  title: string
  description: string
  type: QuestType
  difficulty: QuestDifficulty
  target: number
  reward: number
  bonusReward?: number
  icon: string
  category: string
}

// 生成每日任务
const generateDailyQuests = (): Quest[] => {
  const now = new Date()
  const endOfDay = new Date(now)
  endOfDay.setHours(23, 59, 59, 999)

  const questTemplates: QuestTemplate[] = [
    // 写作任务
    { title: '日记新手', description: '完成今天的日记', type: 'writing', difficulty: 'easy', target: 1, reward: 10, icon: '✍️', category: '写作' },
    { title: '文字工匠', description: '写一篇至少300字的日记', type: 'writing', difficulty: 'medium', target: 300, reward: 25, icon: '📝', category: '写作' },
    { title: '故事大师', description: '写一篇至少800字的长篇日记', type: 'writing', difficulty: 'hard', target: 800, reward: 50, bonusReward: 20, icon: '📚', category: '写作' },
    
    // 社交任务
    { title: '热心邻居', description: '给3篇日记点赞', type: 'social', difficulty: 'easy', target: 3, reward: 5, icon: '👍', category: '社交' },
    { title: '评论达人', description: '发表5条评论', type: 'social', difficulty: 'medium', target: 5, reward: 15, icon: '💬', category: '社交' },
    { title: '社交蝴蝶', description: '给10篇日记点赞并发表5条评论', type: 'social', difficulty: 'hard', target: 15, reward: 40, icon: '🦋', category: '社交' },
    
    // 探索任务
    { title: '探险家', description: '访问3个不同的页面', type: 'exploration', difficulty: 'easy', target: 3, reward: 5, icon: '🗺️', category: '探索' },
    { title: '功能猎人', description: '使用5个不同的功能模块', type: 'exploration', difficulty: 'medium', target: 5, reward: 20, icon: '🎯', category: '探索' },
    { title: '全知全能', description: '访问10个不同的页面', type: 'exploration', difficulty: 'hard', target: 10, reward: 35, bonusReward: 15, icon: '🌟', category: '探索' },
    
    // 创意任务
    { title: '标签爱好者', description: '为日记添加3个标签', type: 'creativity', difficulty: 'easy', target: 3, reward: 8, icon: '🏷️', category: '创意' },
    { title: '主题创造者', description: '创建或使用一个自定义主题', type: 'creativity', difficulty: 'medium', target: 1, reward: 20, icon: '🎨', category: '创意' },
    { title: '模板大师', description: '创建一个日记模板', type: 'creativity', difficulty: 'hard', target: 1, reward: 30, icon: '📋', category: '创意' },
    
    // 正念任务
    { title: '心情记录者', description: '记录今天的心情', type: 'mindfulness', difficulty: 'easy', target: 1, reward: 5, icon: '😊', category: '正念' },
    { title: '感恩之心', description: '写一条感恩日记', type: 'mindfulness', difficulty: 'medium', target: 1, reward: 15, icon: '🙏', category: '正念' },
    { title: '冥想新手', description: '完成一次5分钟冥想', type: 'mindfulness', difficulty: 'medium', target: 5, reward: 20, icon: '🧘', category: '正念' },
    { title: '番茄专注', description: '完成3个番茄钟', type: 'mindfulness', difficulty: 'hard', target: 3, reward: 30, icon: '🍅', category: '正念' },
  ]

  // 随机选择8个任务（每种类型至少1个）
  const shuffled = [...questTemplates].sort(() => Math.random() - 0.5)
  const selectedQuests: Quest[] = []
  const types = ['writing', 'social', 'exploration', 'creativity', 'mindfulness']
  
  // 确保每种类型至少1个
  types.forEach(type => {
    const typeQuests = shuffled.filter(q => q.type === type)
    if (typeQuests.length > 0) {
      const quest = typeQuests[0]
      selectedQuests.push({
        ...quest,
        id: `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        progress: 0,
        expiresAt: endOfDay.toISOString(),
      })
    }
  })

  // 填充剩余任务
  while (selectedQuests.length < 8) {
    const remaining = shuffled.filter(q => !selectedQuests.find(s => s.title === q.title))
    if (remaining.length === 0) break
    const quest = remaining[0]
    selectedQuests.push({
      ...quest,
      id: `quest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      progress: 0,
      expiresAt: endOfDay.toISOString(),
    })
  }

  return selectedQuests
}

// GET - 获取每日任务
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || 'default'

  // 模拟获取用户的每日任务（实际应该从数据库获取）
  const quests = generateDailyQuests()

  return NextResponse.json({
    success: true,
    data: {
      quests,
      stats: {
        total: quests.length,
        completed: quests.filter(q => q.progress >= q.target).length,
        inProgress: quests.filter(q => q.progress > 0 && q.progress < q.target).length,
        notStarted: quests.filter(q => q.progress === 0).length,
      },
      summary: {
        totalReward: quests.reduce((sum, q) => sum + q.reward + (q.bonusReward || 0), 0),
        earnedToday: 0,
        streak: 7,
      },
      updatedAt: new Date().toISOString(),
    }
  })
}

// POST - 完成任务/更新进度
export async function POST(request: Request) {
  const body = await request.json()
  const { questId, progress, action } = body

  if (action === 'complete') {
    return NextResponse.json({
      success: true,
      data: {
        questId,
        completed: true,
        reward: 25,
        bonusReward: 10,
        message: '恭喜完成任务！获得25积分 + 10奖励积分',
      }
    })
  }

  return NextResponse.json({
    success: true,
    data: {
      questId,
      progress: progress || 1,
      message: '任务进度已更新',
    }
  })
}