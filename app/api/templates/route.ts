import { NextRequest, NextResponse } from 'next/server'

// 日记模板
interface DiaryTemplate {
  id: string
  name: string
  description: string
  category: 'daily' | 'gratitude' | 'reflection' | 'travel' | 'work' | 'creative' | 'health' | 'custom'
  icon: string
  structure: {
    sections: {
      title: string
      placeholder: string
      required: boolean
      type: 'text' | 'list' | 'rating' | 'mood' | 'weather'
    }[]
  }
  prompts?: string[]
  tags: string[]
  isDefault: boolean
  usageCount: number
  createdAt: string
}

// 预定义模板
const templates: DiaryTemplate[] = [
  {
    id: 'daily-basic',
    name: '日常日记',
    description: '记录每天的生活点滴',
    category: 'daily',
    icon: '📝',
    structure: {
      sections: [
        { title: '今天发生了什么', placeholder: '描述今天发生的事情...', required: true, type: 'text' },
        { title: '心情', placeholder: '选择今天的心情', required: true, type: 'mood' },
        { title: '天气', placeholder: '选择今天的天气', required: false, type: 'weather' }
      ]
    },
    tags: ['日常', '生活'],
    isDefault: true,
    usageCount: 1256,
    createdAt: '2024-01-01'
  },
  {
    id: 'gratitude',
    name: '感恩日记',
    description: '记录生活中值得感恩的事',
    category: 'gratitude',
    icon: '🙏',
    structure: {
      sections: [
        { title: '今天感恩的三件事', placeholder: '列出今天让你感恩的三件事...', required: true, type: 'list' },
        { title: '为什么感恩', placeholder: '写下你的感受...', required: false, type: 'text' },
        { title: '心情评分', placeholder: '给今天的感恩心情打个分', required: false, type: 'rating' }
      ]
    },
    prompts: [
      '今天谁帮助了你？',
      '今天有什么小确幸？',
      '最近有什么值得感恩的变化？'
    ],
    tags: ['感恩', '正能量', '心理健康'],
    isDefault: false,
    usageCount: 892,
    createdAt: '2024-01-01'
  },
  {
    id: 'reflection',
    name: '反思日记',
    description: '深度思考与自我反省',
    category: 'reflection',
    icon: '🤔',
    structure: {
      sections: [
        { title: '今天的收获', placeholder: '今天学到了什么...', required: true, type: 'text' },
        { title: '可以改进的地方', placeholder: '有什么可以做得更好的...', required: false, type: 'text' },
        { title: '明天的计划', placeholder: '明天想做的事情...', required: false, type: 'list' },
        { title: '心情评分', placeholder: '给今天打个分', required: false, type: 'rating' }
      ]
    },
    prompts: [
      '今天有什么决定让你后悔？',
      '如果重来一次，你会怎么做？',
      '今天最让你自豪的事情是什么？'
    ],
    tags: ['反思', '成长', '自我提升'],
    isDefault: false,
    usageCount: 567,
    createdAt: '2024-01-01'
  },
  {
    id: 'travel',
    name: '旅行日记',
    description: '记录旅途中的精彩瞬间',
    category: 'travel',
    icon: '✈️',
    structure: {
      sections: [
        { title: '目的地', placeholder: '你在哪里？', required: true, type: 'text' },
        { title: '今天的行程', placeholder: '描述今天的行程安排...', required: true, type: 'text' },
        { title: '印象最深刻的事', placeholder: '今天最难忘的瞬间...', required: false, type: 'text' },
        { title: '美食记录', placeholder: '今天吃了什么好吃的...', required: false, type: 'text' },
        { title: '心情', placeholder: '旅途心情如何', required: false, type: 'mood' },
        { title: '天气', placeholder: '当地天气如何', required: false, type: 'weather' }
      ]
    },
    prompts: [
      '今天看到了什么美景？',
      '遇到了什么有趣的人？',
      '有什么想推荐给其他旅行者的？'
    ],
    tags: ['旅行', '探索', '美食'],
    isDefault: false,
    usageCount: 423,
    createdAt: '2024-01-01'
  },
  {
    id: 'work',
    name: '工作日志',
    description: '记录工作进展与思考',
    category: 'work',
    icon: '💼',
    structure: {
      sections: [
        { title: '今日完成', placeholder: '列出今天完成的任务...', required: true, type: 'list' },
        { title: '遇到的问题', placeholder: '今天遇到了什么困难...', required: false, type: 'text' },
        { title: '解决方案', placeholder: '如何解决这些问题...', required: false, type: 'text' },
        { title: '明日计划', placeholder: '明天的待办事项...', required: true, type: 'list' },
        { title: '工作状态', placeholder: '今天的工作状态如何', required: false, type: 'rating' }
      ]
    },
    tags: ['工作', '效率', '职场'],
    isDefault: false,
    usageCount: 678,
    createdAt: '2024-01-01'
  },
  {
    id: 'creative',
    name: '创意灵感',
    description: '捕捉灵光一闪的创意',
    category: 'creative',
    icon: '💡',
    structure: {
      sections: [
        { title: '创意主题', placeholder: '这个创意是关于什么的...', required: true, type: 'text' },
        { title: '灵感来源', placeholder: '什么触发了这个想法...', required: false, type: 'text' },
        { title: '详细描述', placeholder: '详细描述这个创意...', required: true, type: 'text' },
        { title: '可能的应用', placeholder: '这个创意可以用在哪里...', required: false, type: 'list' }
      ]
    },
    prompts: [
      '如果没有任何限制，你会创造什么？',
      '最近有什么让你感到好奇的事物？',
      '如果把两个不相关的东西结合会怎样？'
    ],
    tags: ['创意', '灵感', '想法'],
    isDefault: false,
    usageCount: 234,
    createdAt: '2024-01-01'
  },
  {
    id: 'health',
    name: '健康日志',
    description: '记录身心健康状态',
    category: 'health',
    icon: '💪',
    structure: {
      sections: [
        { title: '睡眠质量', placeholder: '昨晚睡得怎么样...', required: true, type: 'rating' },
        { title: '运动记录', placeholder: '今天做了什么运动...', required: false, type: 'text' },
        { title: '饮食记录', placeholder: '今天吃了什么...', required: false, type: 'text' },
        { title: '身体感受', placeholder: '身体有什么感觉...', required: false, type: 'text' },
        { title: '心理状态', placeholder: '心理状态如何...', required: true, type: 'mood' }
      ]
    },
    prompts: [
      '今天感觉精力充沛吗？',
      '有没有什么身体不适？',
      '今天的心情如何影响身体？'
    ],
    tags: ['健康', '运动', '睡眠', '心理'],
    isDefault: false,
    usageCount: 345,
    createdAt: '2024-01-01'
  },
  {
    id: 'morning-pages',
    name: '晨间写作',
    description: '早起后的意识流写作',
    category: 'creative',
    icon: '🌅',
    structure: {
      sections: [
        { title: '今天的想法', placeholder: '起床后的第一个念头...', required: true, type: 'text' },
        { title: '昨夜梦境', placeholder: '记得的梦境片段...', required: false, type: 'text' },
        { title: '今日意图', placeholder: '今天想创造什么样的体验...', required: false, type: 'text' }
      ]
    },
    prompts: [
      '现在的感觉如何？',
      '什么在困扰你？',
      '什么让你期待？'
    ],
    tags: ['晨间', '写作', '意识流'],
    isDefault: false,
    usageCount: 189,
    createdAt: '2024-01-01'
  },
  {
    id: 'dream',
    name: '梦境日记',
    description: '记录和分析梦境',
    category: 'creative',
    icon: '🌙',
    structure: {
      sections: [
        { title: '梦境描述', placeholder: '详细描述你的梦境...', required: true, type: 'text' },
        { title: '梦境情绪', placeholder: '梦里的感受如何...', required: true, type: 'mood' },
        { title: '可能的含义', placeholder: '你觉得这个梦意味着什么...', required: false, type: 'text' },
        { title: '现实联想', placeholder: '梦境和现实有什么联系...', required: false, type: 'text' }
      ]
    },
    prompts: [
      '梦境里的场景是怎样的？',
      '梦中出现了哪些人物？',
      '醒来后有什么感觉？'
    ],
    tags: ['梦境', '潜意识', '心理'],
    isDefault: false,
    usageCount: 156,
    createdAt: '2024-01-01'
  }
]

// 用户自定义模板
const userTemplates: DiaryTemplate[] = []

// GET: 获取模板列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const includeUser = searchParams.get('includeUser') !== 'false'

    let allTemplates = [...templates]
    if (includeUser) {
      allTemplates = [...allTemplates, ...userTemplates]
    }

    if (category) {
      allTemplates = allTemplates.filter(t => t.category === category)
    }

    // 按使用次数排序
    allTemplates.sort((a, b) => b.usageCount - a.usageCount)

    return NextResponse.json({
      success: true,
      data: {
        templates: allTemplates,
        categories: [
          { value: 'daily', label: '日常', icon: '📝' },
          { value: 'gratitude', label: '感恩', icon: '🙏' },
          { value: 'reflection', label: '反思', icon: '🤔' },
          { value: 'travel', label: '旅行', icon: '✈️' },
          { value: 'work', label: '工作', icon: '💼' },
          { value: 'creative', label: '创意', icon: '💡' },
          { value: 'health', label: '健康', icon: '💪' },
          { value: 'custom', label: '自定义', icon: '✨' }
        ]
      }
    })
  } catch (error) {
    console.error('获取模板列表失败:', error)
    return NextResponse.json(
      { success: false, error: '获取模板列表失败' },
      { status: 500 }
    )
  }
}

// POST: 创建自定义模板
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, category, icon, structure, prompts, tags, userId } = body

    if (!name || !structure) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      )
    }

    const newTemplate: DiaryTemplate = {
      id: `custom-${Date.now()}`,
      name,
      description: description || '',
      category: category || 'custom',
      icon: icon || '✨',
      structure,
      prompts: prompts || [],
      tags: tags || [],
      isDefault: false,
      usageCount: 0,
      createdAt: new Date().toISOString()
    }

    userTemplates.push(newTemplate)

    return NextResponse.json({
      success: true,
      data: newTemplate,
      message: '模板创建成功'
    })
  } catch (error) {
    console.error('创建模板失败:', error)
    return NextResponse.json(
      { success: false, error: '创建模板失败' },
      { status: 500 }
    )
  }
}