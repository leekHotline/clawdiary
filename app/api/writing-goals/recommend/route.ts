import { NextRequest, NextResponse } from 'next/server'

// 推荐的目标模板
const goalTemplates = [
  {
    id: 'daily-500',
    title: '每日500字',
    description: '每天写500字，培养写作习惯',
    type: 'daily',
    target: 500,
    unit: 'words',
    icon: '✍️',
    difficulty: 'easy',
    category: 'habit'
  },
  {
    id: 'daily-1000',
    title: '每日1000字',
    description: '每天写1000字，适合有一定基础的写作者',
    type: 'daily',
    target: 1000,
    unit: 'words',
    icon: '📝',
    difficulty: 'medium',
    category: 'habit'
  },
  {
    id: 'daily-entry',
    title: '每日一篇',
    description: '每天写一篇日记，记录生活点滴',
    type: 'daily',
    target: 1,
    unit: 'entries',
    icon: '📖',
    difficulty: 'easy',
    category: 'habit'
  },
  {
    id: 'weekly-3000',
    title: '每周3000字',
    description: '每周写3000字，适合工作日忙碌的人',
    type: 'weekly',
    target: 3000,
    unit: 'words',
    icon: '📚',
    difficulty: 'medium',
    category: 'flexible'
  },
  {
    id: 'weekly-entries',
    title: '每周5篇',
    description: '每周写5篇日记，保持写作节奏',
    type: 'weekly',
    target: 5,
    unit: 'entries',
    icon: '📅',
    difficulty: 'easy',
    category: 'flexible'
  },
  {
    id: 'monthly-10000',
    title: '月度万字挑战',
    description: '每月写10000字，挑战自己的极限',
    type: 'monthly',
    target: 10000,
    unit: 'words',
    icon: '🏆',
    difficulty: 'hard',
    category: 'challenge'
  },
  {
    id: 'monthly-entries',
    title: '每月20篇',
    description: '每月写20篇日记，养成写作习惯',
    type: 'monthly',
    target: 20,
    unit: 'entries',
    icon: '📊',
    difficulty: 'medium',
    category: 'habit'
  },
  {
    id: 'yearly-book',
    title: '年度出书计划',
    description: '一年写10万字，完成一本书的初稿',
    type: 'yearly',
    target: 100000,
    unit: 'words',
    icon: '📕',
    difficulty: 'hard',
    category: 'challenge'
  },
  {
    id: 'yearly-365',
    title: '365天日记挑战',
    description: '一年365天，每天写一篇日记',
    type: 'yearly',
    target: 365,
    unit: 'entries',
    icon: '🗓️',
    difficulty: 'hard',
    category: 'challenge'
  },
  {
    id: 'morning-pages',
    title: '晨间书写',
    description: '每天早上写3页，开启美好的一天',
    type: 'daily',
    target: 3,
    unit: 'pages',
    icon: '🌅',
    difficulty: 'medium',
    category: 'creative'
  },
  {
    id: 'night-reflection',
    title: '夜间反思',
    description: '每晚写15分钟，反思一天的收获',
    type: 'daily',
    target: 15,
    unit: 'minutes',
    icon: '🌙',
    difficulty: 'easy',
    category: 'mindfulness'
  },
  {
    id: 'creative-sprint',
    title: '创意冲刺',
    description: '每周写2小时，专注于创意写作',
    type: 'weekly',
    target: 120,
    unit: 'minutes',
    icon: '💡',
    difficulty: 'medium',
    category: 'creative'
  }
]

// GET /api/writing-goals/recommend - 获取推荐的目标模板
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') // habit, flexible, challenge, creative, mindfulness
  const difficulty = searchParams.get('difficulty') // easy, medium, hard
  const type = searchParams.get('type') // daily, weekly, monthly, yearly
  const limit = parseInt(searchParams.get('limit') || '12')

  let filtered = [...goalTemplates]

  // 按分类过滤
  if (category) {
    filtered = filtered.filter(t => t.category === category)
  }

  // 按难度过滤
  if (difficulty) {
    filtered = filtered.filter(t => t.difficulty === difficulty)
  }

  // 按类型过滤
  if (type) {
    filtered = filtered.filter(t => t.type === type)
  }

  // 限制数量
  filtered = filtered.slice(0, limit)

  // 按难度排序
  const difficultyOrder = { easy: 1, medium: 2, hard: 3 }
  filtered.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])

  // 分类统计
  const categories = {
    habit: goalTemplates.filter(t => t.category === 'habit').length,
    flexible: goalTemplates.filter(t => t.category === 'flexible').length,
    challenge: goalTemplates.filter(t => t.category === 'challenge').length,
    creative: goalTemplates.filter(t => t.category === 'creative').length,
    mindfulness: goalTemplates.filter(t => t.category === 'mindfulness').length
  }

  const difficulties = {
    easy: goalTemplates.filter(t => t.difficulty === 'easy').length,
    medium: goalTemplates.filter(t => t.difficulty === 'medium').length,
    hard: goalTemplates.filter(t => t.difficulty === 'hard').length
  }

  const types = {
    daily: goalTemplates.filter(t => t.type === 'daily').length,
    weekly: goalTemplates.filter(t => t.type === 'weekly').length,
    monthly: goalTemplates.filter(t => t.type === 'monthly').length,
    yearly: goalTemplates.filter(t => t.type === 'yearly').length
  }

  return NextResponse.json({
    success: true,
    data: filtered,
    meta: {
      total: goalTemplates.length,
      filtered: filtered.length,
      categories,
      difficulties,
      types
    }
  })
}