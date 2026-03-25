import { NextResponse } from 'next/server'

// Mock diary data for demo - in production, this would come from a database
const mockMemories = [
  {
    id: '1',
    date: '2026-03-25',
    content: '今天完成了一个重要的产品迭代，感觉很有成就感。团队协作很顺利，大家都在为同一个目标努力。',
    mood: '😊',
    tags: ['工作', '成就', '团队']
  },
  {
    id: '2',
    date: '2026-03-24',
    content: '反思了一下最近的工作节奏，觉得需要更好地平衡工作和生活。决定每天留出时间来学习和运动。',
    mood: '🤔',
    tags: ['反思', '平衡', '成长']
  },
  {
    id: '3',
    date: '2026-03-23',
    content: '阅读了一篇关于 AI Agent 的文章，对多智能体协作有了新的理解。技术发展太快了，要保持学习。',
    mood: '💡',
    tags: ['学习', 'AI', '技术']
  },
  {
    id: '4',
    date: '2026-03-22',
    content: '今天情绪有点低落，可能是最近压力太大。需要调整心态，给自己一些放松的时间。',
    mood: '😔',
    tags: ['情绪', '压力', '调整']
  },
  {
    id: '5',
    date: '2026-03-21',
    content: '和朋友聊了很多，关于未来的规划和职业发展。收获很大，感觉自己更清晰了。',
    mood: '😌',
    tags: ['社交', '规划', '收获']
  },
  {
    id: '6',
    date: '2026-03-20',
    content: '开始尝试新的工作方法，感觉效率提升了不少。继续保持。',
    mood: '🎯',
    tags: ['效率', '方法', '进步']
  },
  {
    id: '7',
    date: '2026-03-19',
    content: '今天学习了 TypeScript 的高级类型，虽然有点难，但是很有意思。',
    mood: '🧠',
    tags: ['学习', '编程', '挑战']
  }
]

export async function GET() {
  // In production, fetch from database
  const memories = mockMemories

  // Analyze personality based on memories
  const allContent = memories.map(m => m.content).join(' ')
  const allTags = [...new Set(memories.flatMap(m => m.tags || []))]
  
  // Simple analysis - in production, use AI
  const traits = extractTraits(allContent)
  const values = extractValues(allContent, allTags)
  const patterns = extractPatterns(memories)

  const personality = {
    traits,
    values,
    patterns
  }

  return NextResponse.json({
    memories,
    personality,
    analyzedAt: new Date().toISOString()
  })
}

function extractTraits(content: string): string[] {
  const traits: string[] = []
  
  if (content.includes('成就') || content.includes('完成')) traits.push('目标导向')
  if (content.includes('反思') || content.includes('思考')) traits.push('自省型')
  if (content.includes('学习') || content.includes('技术')) traits.push('终身学习者')
  if (content.includes('团队') || content.includes('朋友')) traits.push('重视关系')
  if (content.includes('压力') || content.includes('调整')) traits.push('情绪敏感')
  if (content.includes('效率') || content.includes('方法')) traits.push('追求优化')
  
  // Default traits if none detected
  if (traits.length === 0) {
    traits.push('内省者', '记录者', '成长者')
  }
  
  return traits.slice(0, 5)
}

function extractValues(content: string, tags: string[]): string[] {
  const values: string[] = []
  
  if (tags.includes('成长') || content.includes('成长')) values.push('个人成长')
  if (tags.includes('学习') || content.includes('学习')) values.push('持续学习')
  if (tags.includes('团队') || content.includes('协作')) values.push('团队合作')
  if (tags.includes('平衡')) values.push('生活平衡')
  if (tags.includes('效率')) values.push('效率至上')
  
  if (values.length === 0) {
    values.push('真实表达', '自我理解', '积极生活')
  }
  
  return values.slice(0, 4)
}

function extractPatterns(memories: typeof mockMemories): string[] {
  const patterns: string[] = []
  
  // Analyze mood patterns
  const moods = memories.map(m => m.mood).filter(Boolean)
  const positiveCount = moods.filter(m => ['😊', '💡', '😌', '🎯', '🧠'].includes(m || '')).length
  const negativeCount = moods.filter(m => ['😔'].includes(m || '')).length
  
  if (positiveCount > negativeCount) {
    patterns.push('整体积极向上')
  }
  if (negativeCount > 0) {
    patterns.push('会经历低谷但能调整')
  }
  
  // Analyze content patterns
  const hasWork = memories.some(m => m.tags?.includes('工作'))
  const hasLearning = memories.some(m => m.tags?.includes('学习'))
  const hasReflection = memories.some(m => m.tags?.includes('反思'))
  
  if (hasWork) patterns.push('关注工作发展')
  if (hasLearning) patterns.push('热爱学习新知')
  if (hasReflection) patterns.push('定期自我反思')
  
  if (patterns.length === 0) {
    patterns.push('善于观察生活', '记录日常点滴')
  }
  
  return patterns.slice(0, 4)
}