import { NextRequest, NextResponse } from 'next/server'

// Mock templates data
const templates = [
  {
    id: '1',
    name: '感恩日记',
    description: '每天记录值得感恩的三件事',
    category: 'daily',
    questions: [
      '今天发生了什么值得感恩的事？',
      '谁让你感到温暖？',
      '有什么小确幸被你忽略了？'
    ],
    tags: ['感恩', '正能量', '日常'],
    usageCount: 1234,
    rating: 4.8
  },
  {
    id: '2',
    name: '情绪日记',
    description: '深入探索你的情绪变化',
    category: 'mental',
    questions: [
      '今天最主要的情绪是什么？',
      '是什么触发了这种情绪？',
      '你是如何应对的？'
    ],
    tags: ['情绪', '心理健康', '自我觉察'],
    usageCount: 856,
    rating: 4.6
  },
  {
    id: '3',
    name: '工作反思',
    description: '每日工作总结与反思',
    category: 'work',
    questions: [
      '今天完成了什么？',
      '有什么可以做得更好的？',
      '明天的计划是什么？'
    ],
    tags: ['工作', '效率', '反思'],
    usageCount: 2103,
    rating: 4.9
  },
  {
    id: '4',
    name: '旅行日记',
    description: '记录旅途中的精彩瞬间',
    category: 'travel',
    questions: [
      '今天去了哪里？',
      '印象最深的是什么？',
      '有什么特别的收获？'
    ],
    tags: ['旅行', '回忆', '探索'],
    usageCount: 567,
    rating: 4.7
  },
  {
    id: '5',
    name: '读书笔记',
    description: '记录阅读心得与摘抄',
    category: 'learning',
    questions: [
      '今天读了什么书？',
      '有哪些精彩的句子？',
      '给你带来了什么启发？'
    ],
    tags: ['读书', '学习', '成长'],
    usageCount: 1456,
    rating: 4.8
  },
  {
    id: '6',
    name: '健康日志',
    description: '追踪饮食、运动和睡眠',
    category: 'health',
    questions: [
      '今天吃了什么？',
      '运动了吗？做了什么运动？',
      '昨晚睡得好吗？'
    ],
    tags: ['健康', '运动', '睡眠'],
    usageCount: 789,
    rating: 4.5
  },
  {
    id: '7',
    name: '创意灵感',
    description: '捕捉灵感与创意想法',
    category: 'creative',
    questions: [
      '今天有什么有趣的想法？',
      '有什么问题想要解决？',
      '如何实现这个创意？'
    ],
    tags: ['创意', '灵感', '想法'],
    usageCount: 423,
    rating: 4.6
  },
  {
    id: '8',
    name: '亲子时光',
    description: '记录与孩子的美好时光',
    category: 'family',
    questions: [
      '今天和孩子一起做了什么？',
      '孩子有什么有趣的话或行为？',
      '你有什么感受？'
    ],
    tags: ['亲子', '家庭', '孩子'],
    usageCount: 678,
    rating: 4.9
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const search = searchParams.get('search')?.toLowerCase()
  const sort = searchParams.get('sort') || 'popular'
  const limit = parseInt(searchParams.get('limit') || '20')

  let result = [...templates]

  // Filter by category
  if (category && category !== 'all') {
    result = result.filter(t => t.category === category)
  }

  // Search
  if (search) {
    result = result.filter(t => 
      t.name.toLowerCase().includes(search) ||
      t.description.toLowerCase().includes(search) ||
      t.tags.some(tag => tag.toLowerCase().includes(search))
    )
  }

  // Sort
  switch (sort) {
    case 'popular':
      result.sort((a, b) => b.usageCount - a.usageCount)
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'newest':
      result.reverse()
      break
  }

  return NextResponse.json({
    success: true,
    data: result.slice(0, limit),
    meta: {
      total: templates.length,
      filtered: result.length,
      categories: ['all', 'daily', 'mental', 'work', 'travel', 'learning', 'health', 'creative', 'family']
    }
  })
}