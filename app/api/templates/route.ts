import { NextResponse } from 'next/server'

// 模板类型
interface DiaryTemplate {
  id: string
  name: string
  description: string
  icon: string
  category: 'daily' | 'gratitude' | 'work' | 'travel' | 'health' | 'creative' | 'custom'
  content: string
  sections: TemplateSection[]
  tags: string[]
  isPublic: boolean
  isOfficial: boolean
  useCount: number
  creator: {
    id: string
    name: string
    avatar: string
  }
  createdAt: string
}

interface TemplateSection {
  id: string
  title: string
  placeholder: string
  required: boolean
  type: 'text' | 'list' | 'rating' | 'mood' | 'checkbox'
}

// 预设模板
const templates: DiaryTemplate[] = [
  {
    id: 'tpl_daily',
    name: '每日记录',
    description: '简洁的日常日记模板',
    icon: '📝',
    category: 'daily',
    content: '',
    sections: [
      { id: 's1', title: '今日心情', placeholder: '选择今天的心情...', required: true, type: 'mood' },
      { id: 's2', title: '今日重点', placeholder: '今天发生了什么重要的事？', required: true, type: 'text' },
      { id: 's3', title: '明日计划', placeholder: '明天想要做什么？', required: false, type: 'list' },
    ],
    tags: ['日常', '日记'],
    isPublic: true,
    isOfficial: true,
    useCount: 1256,
    creator: { id: 'official', name: '官方模板', avatar: '⭐' },
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tpl_gratitude',
    name: '感恩日记',
    description: '记录每天值得感恩的事',
    icon: '🙏',
    category: 'gratitude',
    content: '',
    sections: [
      { id: 's1', title: '今天最感恩的事', placeholder: '写下3件值得感恩的事...', required: true, type: 'list' },
      { id: 's2', title: '感恩的人', placeholder: '今天谁让你感到温暖？', required: false, type: 'text' },
      { id: 's3', title: '感恩感悟', placeholder: '记录你的感受...', required: false, type: 'text' },
    ],
    tags: ['感恩', '正能量'],
    isPublic: true,
    isOfficial: true,
    useCount: 892,
    creator: { id: 'official', name: '官方模板', avatar: '⭐' },
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tpl_work',
    name: '工作日志',
    description: '记录工作进展和成果',
    icon: '💼',
    category: 'work',
    content: '',
    sections: [
      { id: 's1', title: '今日完成', placeholder: '列出今天完成的工作...', required: true, type: 'list' },
      { id: 's2', title: '遇到的问题', placeholder: '有什么困难或挑战？', required: false, type: 'text' },
      { id: 's3', title: '明日计划', placeholder: '明天的工作安排...', required: false, type: 'list' },
      { id: 's4', title: '工作心情', placeholder: '给今天的工作打分', required: false, type: 'rating' },
    ],
    tags: ['工作', '效率'],
    isPublic: true,
    isOfficial: true,
    useCount: 654,
    creator: { id: 'official', name: '官方模板', avatar: '⭐' },
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tpl_travel',
    name: '旅行日记',
    description: '记录旅途中的美好',
    icon: '✈️',
    category: 'travel',
    content: '',
    sections: [
      { id: 's1', title: '目的地', placeholder: '今天去了哪里？', required: true, type: 'text' },
      { id: 's2', title: '精彩瞬间', placeholder: '记录今天的精彩时刻...', required: true, type: 'list' },
      { id: 's3', title: '美食记录', placeholder: '吃了什么好吃的？', required: false, type: 'text' },
      { id: 's4', title: '旅行感受', placeholder: '今天的感受...', required: false, type: 'text' },
    ],
    tags: ['旅行', '探索'],
    isPublic: true,
    isOfficial: true,
    useCount: 423,
    creator: { id: 'official', name: '官方模板', avatar: '⭐' },
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tpl_health',
    name: '健康追踪',
    description: '记录健康相关数据',
    icon: '💪',
    category: 'health',
    content: '',
    sections: [
      { id: 's1', title: '睡眠质量', placeholder: '昨晚睡得怎么样？', required: true, type: 'rating' },
      { id: 's2', title: '运动记录', placeholder: '今天的运动...', required: false, type: 'text' },
      { id: 's3', title: '饮食情况', placeholder: '今天吃了什么？', required: false, type: 'text' },
      { id: 's4', title: '身体感受', placeholder: '身体状况如何？', required: false, type: 'text' },
    ],
    tags: ['健康', '运动'],
    isPublic: true,
    isOfficial: true,
    useCount: 312,
    creator: { id: 'official', name: '官方模板', avatar: '⭐' },
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tpl_creative',
    name: '创意灵感',
    description: '捕捉灵感火花',
    icon: '💡',
    category: 'creative',
    content: '',
    sections: [
      { id: 's1', title: '灵感来源', placeholder: '灵感从何而来？', required: true, type: 'text' },
      { id: 's2', title: '创意想法', placeholder: '详细描述你的想法...', required: true, type: 'text' },
      { id: 's3', title: '下一步', placeholder: '如何实现这个创意？', required: false, type: 'list' },
    ],
    tags: ['创意', '灵感'],
    isPublic: true,
    isOfficial: true,
    useCount: 278,
    creator: { id: 'official', name: '官方模板', avatar: '⭐' },
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'tpl_reflection',
    name: '每日反思',
    description: '深度反思与成长',
    icon: '🤔',
    category: 'daily',
    content: '',
    sections: [
      { id: 's1', title: '做得好的', placeholder: '今天哪些事做得好？', required: true, type: 'list' },
      { id: 's2', title: '需要改进的', placeholder: '哪些地方可以更好？', required: true, type: 'list' },
      { id: 's3', title: '学到的教训', placeholder: '今天学到了什么？', required: false, type: 'text' },
      { id: 's4', title: '明天的改变', placeholder: '明天想要如何改进？', required: false, type: 'text' },
    ],
    tags: ['反思', '成长'],
    isPublic: true,
    isOfficial: true,
    useCount: 198,
    creator: { id: 'official', name: '官方模板', avatar: '⭐' },
    createdAt: '2026-01-01T00:00:00Z',
  },
]

// GET - 获取模板列表
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  let filteredTemplates = templates

  if (category && category !== 'all') {
    filteredTemplates = filteredTemplates.filter(t => t.category === category)
  }

  if (search) {
    const searchLower = search.toLowerCase()
    filteredTemplates = filteredTemplates.filter(t => 
      t.name.toLowerCase().includes(searchLower) ||
      t.description.toLowerCase().includes(searchLower) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
  }

  return NextResponse.json({
    success: true,
    data: {
      templates: filteredTemplates,
      categories: [
        { id: 'all', name: '全部', icon: '📋' },
        { id: 'daily', name: '日常', icon: '📝' },
        { id: 'gratitude', name: '感恩', icon: '🙏' },
        { id: 'work', name: '工作', icon: '💼' },
        { id: 'travel', name: '旅行', icon: '✈️' },
        { id: 'health', name: '健康', icon: '💪' },
        { id: 'creative', name: '创意', icon: '💡' },
        { id: 'custom', name: '自定义', icon: '🎨' },
      ],
      stats: {
        total: templates.length,
        official: templates.filter(t => t.isOfficial).length,
        totalUses: templates.reduce((sum, t) => sum + t.useCount, 0),
      },
    }
  })
}

// POST - 创建自定义模板
export async function POST(request: Request) {
  const body = await request.json()
  const { name, description, icon, category, sections, tags, userId = 'default', userName = '用户' } = body

  const newTemplate: DiaryTemplate = {
    id: `tpl_${Date.now()}`,
    name: name || '我的模板',
    description: description || '',
    icon: icon || '📄',
    category: category || 'custom',
    content: '',
    sections: sections || [],
    tags: tags || [],
    isPublic: false,
    isOfficial: false,
    useCount: 0,
    creator: { id: userId, name: userName, avatar: '🦞' },
    createdAt: new Date().toISOString(),
  }

  return NextResponse.json({
    success: true,
    data: {
      template: newTemplate,
      message: '模板创建成功！',
    }
  })
}