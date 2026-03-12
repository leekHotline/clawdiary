import { NextRequest, NextResponse } from 'next/server'

interface WritingPrompt {
  id: string
  prompt: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: number // minutes
  tips: string[]
  examples: string[]
}

const prompts: WritingPrompt[] = [
  {
    id: '1',
    prompt: '描述一个让你印象深刻的童年记忆',
    category: 'memory',
    difficulty: 'easy',
    estimatedTime: 15,
    tips: ['可以从感官体验开始', '描述当时的情绪', '思考这件事对你的影响'],
    examples: ['夏天吃西瓜的滋味', '第一次学骑自行车']
  },
  {
    id: '2',
    prompt: '如果你可以和任何人共进晚餐，你会选择谁？为什么？',
    category: 'imagination',
    difficulty: 'easy',
    estimatedTime: 10,
    tips: ['可以是现实中的人或历史人物', '想象你们会聊什么', '描述用餐的环境'],
    examples: ['与爱因斯坦讨论宇宙', '与未来的自己对话']
  },
  {
    id: '3',
    prompt: '写下最近让你感到骄傲的一件事',
    category: 'reflection',
    difficulty: 'easy',
    estimatedTime: 10,
    tips: ['事情大小不重要', '描述你付出的努力', '这件事让你有什么改变'],
    examples: ['坚持运动一个月', '学会了一道新菜']
  },
  {
    id: '4',
    prompt: '如果你能回到过去改变一个决定，你会选择什么？',
    category: 'reflection',
    difficulty: 'medium',
    estimatedTime: 20,
    tips: ['描述当时的情境', '你会做出什么不同的选择', '思考这个改变会带来什么'],
    examples: ['大学专业的选择', '一次搬家的决定']
  },
  {
    id: '5',
    prompt: '描述一个你一直想做但还没开始的事情',
    category: 'goals',
    difficulty: 'medium',
    estimatedTime: 15,
    tips: ['为什么想做这件事', '是什么阻止了你', '你打算什么时候开始'],
    examples: ['学习一门乐器', '开始写一本书']
  },
  {
    id: '6',
    prompt: '写一封给未来自己的信（5年后）',
    category: 'imagination',
    difficulty: 'medium',
    estimatedTime: 25,
    tips: ['描述现在的自己', '对未来的期望', '你想问未来自己的问题'],
    examples: ['职业发展', '家庭生活']
  },
  {
    id: '7',
    prompt: '描述一个你最近克服的恐惧或挑战',
    category: 'growth',
    difficulty: 'medium',
    estimatedTime: 20,
    tips: ['描述恐惧或挑战的本质', '你是如何面对的', '这件事教会了你什么'],
    examples: ['公开演讲', '独自旅行']
  },
  {
    id: '8',
    prompt: '如果你有一个小时可以随意使用，没有任何限制，你会做什么？',
    category: 'imagination',
    difficulty: 'easy',
    estimatedTime: 10,
    tips: ['不要考虑现实限制', '描述你的感受', '这个选择说明了什么'],
    examples: ['环游世界', '与亲人团聚']
  },
  {
    id: '9',
    prompt: '写下三件你现在拥有但曾经以为无法获得的东西',
    category: 'gratitude',
    difficulty: 'easy',
    estimatedTime: 15,
    tips: ['可以是物质或非物质的', '描述你是如何获得的', '这些对你意味着什么'],
    examples: ['一份满意的工作', '真正的朋友']
  },
  {
    id: '10',
    prompt: '描述一个改变你人生观的重要时刻',
    category: 'reflection',
    difficulty: 'hard',
    estimatedTime: 30,
    tips: ['描述事件的全貌', '你当时的反应', '这个改变如何影响你至今'],
    examples: ['一次失败', '一次意外的相遇']
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const difficulty = searchParams.get('difficulty') as WritingPrompt['difficulty'] | null
  const random = searchParams.get('random') === 'true'
  const limit = parseInt(searchParams.get('limit') || '5')

  let result = [...prompts]

  // Filter by category
  if (category && category !== 'all') {
    result = result.filter(p => p.category === category)
  }

  // Filter by difficulty
  if (difficulty) {
    result = result.filter(p => p.difficulty === difficulty)
  }

  // Random selection
  if (random) {
    const shuffled = result.sort(() => Math.random() - 0.5)
    result = shuffled.slice(0, limit)
  } else {
    result = result.slice(0, limit)
  }

  // Get a random prompt
  if (random && result.length > 0) {
    return NextResponse.json({
      success: true,
      data: result[0],
      meta: {
        totalPrompts: prompts.length,
        categories: ['all', 'memory', 'imagination', 'reflection', 'goals', 'growth', 'gratitude'],
        difficulties: ['easy', 'medium', 'hard']
      }
    })
  }

  return NextResponse.json({
    success: true,
    data: result,
    meta: {
      total: prompts.length,
      filtered: result.length,
      categories: ['all', 'memory', 'imagination', 'reflection', 'goals', 'growth', 'gratitude'],
      difficulties: ['easy', 'medium', 'hard']
    }
  })
}