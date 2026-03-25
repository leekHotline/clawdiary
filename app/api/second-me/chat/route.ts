import { NextRequest, NextResponse } from 'next/server'

interface Memory {
  id: string
  date: string
  content: string
  mood?: string
  tags?: string[]
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
}

interface Personality {
  traits: string[]
  values: string[]
  patterns: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, memories, personality, history }: {
      message: string
      memories: Memory[]
      personality: Personality | null
      history: Message[]
    } = body

    // Generate response based on user's memories and personality
    const response = generateSecondMeResponse(message, memories, personality, history)

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { response: '抱歉，我暂时无法回应。请稍后再试。' },
      { status: 500 }
    )
  }
}

function generateSecondMeResponse(
  message: string,
  memories: Memory[],
  personality: Personality | null,
  history: Message[]
): string {
  const lowerMessage = message.toLowerCase()
  
  // Find relevant memories
  const relevantMemories = findRelevantMemories(message, memories)
  
  // Build context from personality
  const personalityContext = personality 
    ? `我的特质：${personality.traits.join('、')}。我的价值观：${personality.values.join('、')}。`
    : ''
  
  // Generate contextual response
  if (lowerMessage.includes('应该') || lowerMessage.includes('关注')) {
    return generateFocusResponse(relevantMemories, personality)
  }
  
  if (lowerMessage.includes('变化') || lowerMessage.includes('成长')) {
    return generateGrowthResponse(memories, personality)
  }
  
  if (lowerMessage.includes('提醒') || lowerMessage.includes('过去')) {
    return generateReminderResponse(memories, personality)
  }
  
  if (lowerMessage.includes('情绪') || lowerMessage.includes('心情')) {
    return generateEmotionAnalysis(memories, personality)
  }
  
  // Default: reflective response based on memories
  return generateReflectiveResponse(message, relevantMemories, personality)
}

function findRelevantMemories(query: string, memories: Memory[]): Memory[] {
  const keywords = query.split('').filter(c => c.match(/[\u4e00-\u9fa5]/) || c.match(/[a-zA-Z]/))
  
  return memories.filter(memory => {
    const content = memory.content.toLowerCase()
    const tags = memory.tags?.join(' ').toLowerCase() || ''
    
    return keywords.some(keyword => 
      content.includes(keyword) || tags.includes(keyword)
    )
  }).slice(0, 3)
}

function generateFocusResponse(memories: Memory[], personality: Personality | null): string {
  const recentMemory = memories[0]
  const trait = personality?.traits[0] || '成长'
  
  return `基于你最近的记录，我建议你今天关注以下几个方面：

📌 **当下重点**
${recentMemory ? `你的最新日记提到："${recentMemory.content.slice(0, 50)}..."` : '继续保持记录的习惯'}

📌 **${trait}特质提醒**
作为一个${trait}的人，你通常会深入思考问题。今天可以：
- 花10分钟整理一下想法
- 写下3件让你感激的事
- 对自己说一声"做得好"

📌 **行动建议**
根据你的记录模式，你在下午通常精力充沛，可以利用这段时间处理重要任务。`
}

function generateGrowthResponse(memories: Memory[], personality: Personality | null): string {
  if (memories.length < 2) {
    return '我需要更多日记来分析你的成长轨迹。继续记录吧！'
  }
  
  const oldMemory = memories[memories.length - 1]
  const newMemory = memories[0]
  
  return `📊 **你的成长轨迹分析**

🔮 **一周前的你**
"${oldMemory.content.slice(0, 60)}..."
那时的情绪：${oldMemory.mood || '平静'}

🔮 **现在的你**
"${newMemory.content.slice(0, 60)}..."
现在的情绪：${newMemory.mood || '平静'}

🌱 **观察到的变化**
- 你在情绪管理上有所进步
- 对工作/生活的平衡有了新的理解
- 保持了持续学习和反思的习惯

💫 **建议**
继续保持记录，观察自己的成长模式。你正在成为更好的自己。`
}

function generateReminderResponse(memories: Memory[], personality: Personality | null): string {
  const randomMemory = memories[Math.floor(Math.random() * memories.length)]
  
  return `📮 **来自过去的提醒**

我记得在 ${randomMemory.date}，你写过：
"${randomMemory.content}"

${randomMemory.mood ? `那时候你的心情是 ${randomMemory.mood}` : ''}

💡 **这个记忆想对现在的你说**
有时候回顾过去能帮助我们看到自己的成长轨迹。你当时担心的事现在看来怎么样了？那些目标达成了吗？

${personality?.patterns[0] ? `作为一个"${personality.patterns[0]}"的人，你总是能从过去中学习。` : ''}`
}

function generateEmotionAnalysis(memories: Memory[], personality: Personality | null): string {
  const moods = memories.map(m => m.mood).filter(Boolean)
  
  const positiveEmojis = ['😊', '💡', '😌', '🎯', '🧠', '🤔', '💪', '🌟']
  const positiveCount = moods.filter(m => positiveEmojis.includes(m || '')).length
  const negativeEmojis = ['😔', '😢', '😤', '😰']
  const negativeCount = moods.filter(m => negativeEmojis.includes(m || '')).length
  
  const total = moods.length || 1
  const positivePercent = Math.round((positiveCount / total) * 100)
  
  return `🌈 **情绪模式分析**

📊 **情绪分布**
- 积极情绪占比：${positivePercent}%
- 需要关注的天数：${negativeCount} 天

📈 **观察到的模式**
${personality?.patterns.join('；') || '你正在建立自己的情绪记录模式'}

💡 **情绪洞察**
${positivePercent > 60 
  ? '整体上你保持着积极的心态。当你遇到困难时，能够调整自己并继续前进。'
  : '最近似乎有一些情绪波动。记住，低落也是正常的，重要的是接纳自己。'
}

🎯 **今日建议**
- 记录一件让你开心的小事
- 如果有烦恼，试着写下来分析
- 给自己一个微笑 😊`
}

function generateReflectiveResponse(
  message: string,
  relevantMemories: Memory[],
  personality: Personality | null
): string {
  if (relevantMemories.length > 0) {
    const memory = relevantMemories[0]
    return `关于你的问题，我找到了相关的记忆：

📅 ${memory.date} 你写过：
"${memory.content}"

${personality?.traits[0] 
  ? `作为一个${personality.traits[0]}的人，你的思考总是有深度。` 
  : ''}

思考这个问题时，不妨问自己：
- 当时是什么触发了这个想法？
- 现在的看法有变化吗？
- 这个经历教会了我什么？`
  }
  
  return `我理解你在思考这个问题。作为你的数字分身，我观察到：

${personality?.traits.length 
  ? `你是一个${personality.traits.join('、')}的人。` 
  : '你正在建立自己的记录习惯。'}

${personality?.values.length 
  ? `这些价值观对你很重要：${personality.values.join('、')}` 
  : ''}

💡 建议：
继续记录你的想法和感受，这样我能更好地理解你，帮助你看到自己的成长轨迹。

你想聊聊具体什么话题？`
}