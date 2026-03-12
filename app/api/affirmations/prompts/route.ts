import { NextRequest, NextResponse } from 'next/server'

const AFFIRMATION_PROMPTS = [
  { category: 'confidence', prompts: [
    '回想一次你成功克服困难的经历',
    '想象一年后更好的自己',
    '写下你最欣赏自己的三个特质'
  ]},
  { category: 'peace', prompts: [
    '描述一个让你感到平静的地方',
    '想象你是天空中的云朵',
    '感受此刻呼吸的节奏'
  ]},
  { category: 'success', prompts: [
    '定义你心目中的成功',
    '回顾一个小小的成就',
    '想象你已经实现了目标'
  ]},
  { category: 'love', prompts: [
    '想一个你爱的人，感受温暖',
    '写一封给自己的情书',
    '回忆被爱的一个瞬间'
  ]},
  { category: 'health', prompts: [
    '感谢你的身体为你做的一切',
    '想象身体每一个细胞都充满活力',
    '写下你对健康的承诺'
  ]},
  { category: 'abundance', prompts: [
    '列出你已经拥有的美好事物',
    '想象财富像水一样流向你',
    '感谢宇宙的丰盛'
  ]},
  { category: 'gratitude', prompts: [
    '今天最让你感恩的三件事',
    '感谢一个帮助过你的人',
    '发现生活中的小确幸'
  ]},
  { category: 'growth', prompts: [
    '你从最近的挑战中学到了什么',
    '描述你想培养的一个新习惯',
    '想象自己正在茁壮成长'
  ]}
]

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const category = searchParams.get('category')
  
  if (category) {
    const found = AFFIRMATION_PROMPTS.find(p => p.category === category)
    if (found) {
      return NextResponse.json({
        category,
        prompts: found.prompts
      })
    }
  }
  
  // Return all prompts
  return NextResponse.json({
    prompts: AFFIRMATION_PROMPTS
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Generate a personalized prompt
    const mood = body.mood || 'neutral'
    const timeOfDay = getTimeOfDay()
    
    let suggestedPrompts = []
    
    switch (mood) {
      case 'stressed':
        suggestedPrompts = [
          '此刻，我选择释放所有的紧张',
          '我的内心有一片宁静的绿洲',
          '每一次呼吸都让我更加放松'
        ]
        break
      case 'tired':
        suggestedPrompts = [
          '我的身体正在恢复能量',
          '休息也是一种生产力',
          '明天的我会更加精力充沛'
        ]
        break
      case 'happy':
        suggestedPrompts = [
          '我感恩此刻的幸福',
          '美好的事物正在不断向我走来',
          '我值得拥有这份快乐'
        ]
        break
      default:
        suggestedPrompts = AFFIRMATION_PROMPTS[Math.floor(Math.random() * AFFIRMATION_PROMPTS.length)].prompts
    }
    
    return NextResponse.json({
      mood,
      timeOfDay,
      suggestedPrompts
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate prompts' },
      { status: 400 }
    )
  }
}

function getTimeOfDay(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}