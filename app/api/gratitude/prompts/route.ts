import { NextResponse } from 'next/server'

const PROMPTS = [
  { text: '今天让你微笑的事情是什么？', category: 'joy' },
  { text: '你今天学到的新东西是什么？', category: 'growth' },
  { text: '谁让你今天感到温暖？', category: 'relationship' },
  { text: '今天的某个小确幸是什么？', category: 'joy' },
  { text: '你为自己的什么感到骄傲？', category: 'achievement' },
  { text: '今天有什么事情让你感到平静？', category: 'peace' },
  { text: '你最享受今天的哪个时刻？', category: 'mindfulness' },
  { text: '有什么你今天视为理所当然的好事？', category: 'perspective' },
  { text: '今天有什么挑战让你变得更好？', category: 'growth' },
  { text: '你今天收到的善意是什么？', category: 'relationship' },
  { text: '今天的天气给你带来了什么感受？', category: 'nature' },
  { text: '你今天做出的一个小小的进步是什么？', category: 'achievement' },
  { text: '今天有什么事情让你感到安心？', category: 'peace' },
  { text: '你今天帮助了谁？', category: 'kindness' },
  { text: '今天的食物让你感到满足了吗？', category: 'simple' },
  { text: '今天你有什么健康的好状态？', category: 'health' },
  { text: '你今天看到了什么美好的事物？', category: 'beauty' },
  { text: '今天有什么让你感到惊喜？', category: 'surprise' },
  { text: '你今天克服了什么小困难？', category: 'resilience' },
  { text: '今天有什么让你感到踏实？', category: 'security' }
]

export async function GET() {
  // Return a random prompt
  const randomPrompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)]
  
  return NextResponse.json({
    prompt: randomPrompt,
    allPrompts: PROMPTS,
    categories: [...new Set(PROMPTS.map(p => p.category))]
  })
}