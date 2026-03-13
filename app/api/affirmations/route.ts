import { NextRequest, NextResponse } from 'next/server'

interface Affirmation {
  id: string
  text: string
  category: string
  isCustom: boolean
  createdAt?: string
}

// Affirmations storage (in production, use a database)
let affirmations: Affirmation[] = []

const DEFAULT_AFFIRMATIONS = {
  confidence: [
    '我相信自己有能力实现目标',
    '我值得拥有美好的事物',
    '我越来越自信，越来越有力量',
    '我的价值不取决于他人的看法',
    '我每天都在进步，成为更好的自己',
    '我有能力克服任何挑战',
    '我相信自己的直觉和判断',
    '我是独一无二的存在'
  ],
  peace: [
    '我的内心平静而安宁',
    '我选择放下焦虑，拥抱当下',
    '我值得拥有内心的宁静',
    '每一次呼吸都让我更加平静',
    '我释放所有不必要的担忧',
    '我的心灵是一片宁静的海洋',
    '我接纳此刻的自己',
    '平静是我自然的状态'
  ],
  success: [
    '我正在走向成功',
    '每一天我都在创造价值',
    '我的努力终将得到回报',
    '我拥有成功的所有品质',
    '机会总是眷顾有准备的我',
    '我的潜力是无限的',
    '我值得拥有富足的人生',
    '成功是我生活的一部分'
  ],
  love: [
    '我值得被爱',
    '我的心中充满爱与温暖',
    '我先爱自己，然后爱他人',
    '爱是我生命中最强大的力量',
    '我吸引真诚的爱进入我的生活',
    '我是一个有爱心的人',
    '我接受他人的爱',
    '我用爱对待每一个人'
  ],
  health: [
    '我的身体越来越健康',
    '我珍惜并照顾我的身体',
    '每一天我都在变得更加强壮',
    '我的身体有强大的自愈能力',
    '我选择健康的生活方式',
    '我充满活力和能量',
    '我的每一个细胞都充满活力',
    '健康是我最珍贵的财富'
  ],
  abundance: [
    '我的人生丰盛富足',
    '财富从四面八方流向我的生活',
    '我值得拥有丰盛的一切',
    '我敞开心扉接受宇宙的馈赠',
    '我的生活充满了美好',
    '我感恩我所拥有的一切',
    '丰盛是我的自然状态',
    '我创造自己的繁荣'
  ],
  gratitude: [
    '我感恩生命中的每一个美好瞬间',
    '我的心中充满感激',
    '我珍惜身边的每一个人',
    '感恩让我的生活更加美好',
    '我为拥有的一切感到幸福',
    '我每天都发现值得感恩的事',
    '感恩是我生活的一部分',
    '我感谢宇宙的眷顾'
  ],
  growth: [
    '每一天我都在成长',
    '我拥抱变化和挑战',
    '我的潜力是无限的',
    '我从每一次经历中学习',
    '我正在成为最好的自己',
    '我欢迎新的可能性',
    '我的未来充满希望',
    '我相信自己能够不断进步'
  ]
}

// Initialize default affirmations if empty
function initializeDefaults() {
  if (affirmations.length === 0) {
    Object.entries(DEFAULT_AFFIRMATIONS).forEach(([category, texts]) => {
      texts.forEach(text => {
        affirmations.push({
          id: `default-${category}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text,
          category,
          isCustom: false,
          createdAt: new Date().toISOString()
        })
      })
    })
  }
}

export async function GET(request: NextRequest) {
  initializeDefaults()
  
  const { searchParams } = request.nextUrl
  const category = searchParams.get('category')
  const userId = searchParams.get('userId')
  const daily = searchParams.get('daily')
  
  let filtered = [...affirmations]
  
  if (category) {
    filtered = filtered.filter(a => a.category === category)
  }
  
  if (daily === 'true') {
    // Return a random affirmation for daily use
    const random = filtered[Math.floor(Math.random() * filtered.length)]
    return NextResponse.json({ 
      affirmation: random,
      total: filtered.length 
    })
  }
  
  return NextResponse.json({ 
    affirmations: filtered,
    total: filtered.length 
  })
}

export async function POST(request: NextRequest) {
  initializeDefaults()
  
  try {
    const body = await request.json()
    const { userId, text, category } = body
    
    if (!text || !category) {
      return NextResponse.json(
        { error: 'Text and category are required' },
        { status: 400 }
      )
    }
    
    const affirmation = {
      id: `custom-${Date.now()}`,
      userId: userId || 'anonymous',
      text,
      category,
      isCustom: true,
      createdAt: new Date().toISOString()
    }
    
    affirmations.push(affirmation)
    
    return NextResponse.json({ 
      success: true, 
      affirmation 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create affirmation' },
      { status: 400 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const id = searchParams.get('id')
  
  if (id) {
    const affirmation = affirmations.find(a => a.id === id)
    if (affirmation && !affirmation.isCustom) {
      return NextResponse.json(
        { error: 'Cannot delete default affirmations' },
        { status: 403 }
      )
    }
    affirmations = affirmations.filter(a => a.id !== id)
    return NextResponse.json({ success: true })
  }
  
  return NextResponse.json(
    { error: 'Affirmation ID required' },
    { status: 400 }
  )
}