import { NextRequest, NextResponse } from 'next/server'

// AI 写作助手 - 智能建议生成
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, content, mood, tags, previousContent } = body
    
    // 根据类型生成不同的建议
    switch (type) {
      case 'title':
        return generateTitleSuggestions(content)
      case 'continue':
        return generateContinueSuggestions(content)
      case 'mood':
        return generateMoodAnalysis(content)
      case 'tags':
        return generateTagSuggestions(content)
      case 'improve':
        return generateImprovementSuggestions(content)
      case 'outline':
        return generateOutline(mood, tags)
      case 'summary':
        return generateSummary(content)
      default:
        return NextResponse.json({ success: false, error: 'Unknown type' }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to process request' }, { status: 500 })
  }
}

function generateTitleSuggestions(content: string) {
  // 基于内容的标题建议
  const titles = [
    { title: '今日思考', reason: '适合反思类内容' },
    { title: '生活记录', reason: '日常记录风格' },
    { title: '心情随笔', reason: '情感表达类' },
    { title: '成长日记', reason: '记录进步与成长' },
    { title: '灵感闪现', reason: '创意想法记录' },
    { title: '难忘时刻', reason: '特别事件记录' },
  ]
  
  // 根据内容关键词匹配
  const lowerContent = content.toLowerCase()
  if (lowerContent.includes('学习') || lowerContent.includes('进步')) {
    titles.unshift({ title: '学习笔记', reason: '检测到学习相关内容' })
  }
  if (lowerContent.includes('开心') || lowerContent.includes('快乐')) {
    titles.unshift({ title: '快乐时光', reason: '检测到积极情绪' })
  }
  if (lowerContent.includes('难过') || lowerContent.includes('烦恼')) {
    titles.unshift({ title: '心事记录', reason: '检测到需要倾诉' })
  }
  
  return NextResponse.json({
    success: true,
    data: {
      suggestions: titles.slice(0, 5),
      tips: [
        '好标题应该简洁有力',
        '可以用日期+心情的方式',
        '尝试用一个问题作为标题',
      ]
    }
  })
}

function generateContinueSuggestions(content: string) {
  // 基于现有内容生成续写建议
  const suggestions = [
    {
      text: '今天让我印象深刻的是...',
      reason: '引导回忆具体事件',
    },
    {
      text: '这让我想起了之前的一次经历...',
      reason: '关联过往记忆',
    },
    {
      text: '从这件事中，我学到了...',
      reason: '引导总结反思',
    },
    {
      text: '明天我想做的是...',
      reason: '展望未来',
    },
    {
      text: '这件事让我感到...',
      reason: '引导情感表达',
    },
  ]
  
  // 根据内容长度调整
  if (content.length < 50) {
    suggestions.unshift({
      text: '早上起来，我...',
      reason: '从早晨开始描述',
    })
  }
  
  return NextResponse.json({
    success: true,
    data: {
      suggestions,
      currentWordCount: content.length,
      recommendedMinWords: 100,
      tips: [
        '日记不需要很长，记录真实感受最重要',
        '可以描述具体的场景和细节',
        '记录自己的思考和感受比事实更重要',
      ]
    }
  })
}

function generateMoodAnalysis(content: string) {
  // 简单的情感分析
  const moodKeywords = {
    happy: ['开心', '快乐', '高兴', '幸福', '满足', '兴奋', '期待'],
    sad: ['难过', '伤心', '失落', '沮丧', '忧伤', '悲伤'],
    anxious: ['焦虑', '担心', '紧张', '不安', '害怕'],
    calm: ['平静', '放松', '安宁', '满足', '惬意'],
    angry: ['生气', '愤怒', '烦躁', '恼火'],
    grateful: ['感谢', '感恩', '珍惜', '幸运'],
  }
  
  const scores: Record<string, number> = {}
  const detectedKeywords: string[] = []
  
  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    let score = 0
    for (const keyword of keywords) {
      if (content.includes(keyword)) {
        score++
        detectedKeywords.push(keyword)
      }
    }
    scores[mood] = score
  }
  
  // 找出主要情绪
  let primaryMood = 'calm'
  let maxScore = 0
  for (const [mood, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score
      primaryMood = mood
    }
  }
  
  const moodEmojis: Record<string, string> = {
    happy: '😊',
    sad: '😢',
    anxious: '😰',
    calm: '😌',
    angry: '😤',
    grateful: '🙏',
  }
  
  const moodColors: Record<string, string> = {
    happy: 'text-yellow-500',
    sad: 'text-blue-500',
    anxious: 'text-purple-500',
    calm: 'text-green-500',
    angry: 'text-red-500',
    grateful: 'text-pink-500',
  }
  
  return NextResponse.json({
    success: true,
    data: {
      primaryMood,
      emoji: moodEmojis[primaryMood],
      color: moodColors[primaryMood],
      scores,
      detectedKeywords,
      suggestion: getMoodSuggestion(primaryMood),
    }
  })
}

function getMoodSuggestion(mood: string): string {
  const suggestions: Record<string, string> = {
    happy: '今天心情不错！继续保持积极的心态吧~',
    sad: '每个人都会有低落的时候，记录下来也是一种释放。',
    anxious: '尝试深呼吸，把担心的事情写下来会更清晰。',
    calm: '平静的状态很适合思考和规划。',
    angry: '写下让你不快的事情，把情绪释放出来。',
    grateful: '感恩是一种美好的品质，继续发现生活中的美好吧！',
  }
  return suggestions[mood] || '继续记录你的感受吧~'
}

function generateTagSuggestions(content: string) {
  const tagRules: Record<string, string[]> = {
    '学习': ['学习', '读书', '课程', '知识', '理解'],
    '工作': ['工作', '会议', '项目', '任务', '汇报'],
    '生活': ['生活', '日常', '吃饭', '睡觉', '作息'],
    '情感': ['心情', '感受', '情绪', '想法', '思考'],
    '健康': ['运动', '健身', '身体', '健康', '跑步'],
    '家庭': ['家人', '父母', '孩子', '亲情'],
    '朋友': ['朋友', '聚会', '社交', '聊天'],
    '旅行': ['旅行', '出游', '风景', '景点'],
    '美食': ['美食', '好吃', '餐厅', '烹饪'],
    '阅读': ['阅读', '书籍', '书', '小说'],
    '电影': ['电影', '剧', '看', '观后感'],
    '音乐': ['音乐', '歌', '听', '演唱会'],
    '成长': ['成长', '进步', '改变', '提升', '努力'],
    '目标': ['目标', '计划', '愿望', '梦想'],
  }
  
  const suggestedTags: string[] = []
  const lowerContent = content.toLowerCase()
  
  for (const [tag, keywords] of Object.entries(tagRules)) {
    for (const keyword of keywords) {
      if (lowerContent.includes(keyword)) {
        if (!suggestedTags.includes(tag)) {
          suggestedTags.push(tag)
        }
        break
      }
    }
  }
  
  // 总是添加一些常用标签
  const commonTags = ['日记', '记录']
  for (const tag of commonTags) {
    if (!suggestedTags.includes(tag)) {
      suggestedTags.push(tag)
    }
  }
  
  return NextResponse.json({
    success: true,
    data: {
      suggestedTags: suggestedTags.slice(0, 8),
      allTags: Object.keys(tagRules),
      tips: [
        '选择2-5个标签最合适',
        '标签可以帮助日后查找相关日记',
        '可以创建自己的专属标签',
      ]
    }
  })
}

function generateImprovementSuggestions(content: string) {
  const suggestions = []
  
  // 检查长度
  if (content.length < 50) {
    suggestions.push({
      type: 'length',
      message: '内容较短，可以添加更多细节',
      suggestion: '尝试描述更多场景或感受',
    })
  }
  
  // 检查是否有情感词汇
  const emotionWords = ['开心', '难过', '高兴', '伤心', '感动', '愤怒']
  const hasEmotion = emotionWords.some(word => content.includes(word))
  if (!hasEmotion) {
    suggestions.push({
      type: 'emotion',
      message: '可以加入更多情感描述',
      suggestion: '记录这件事让你有什么感受',
    })
  }
  
  // 检查是否有时间标记
  const timeWords = ['今天', '早上', '下午', '晚上', '昨天', '明天']
  const hasTime = timeWords.some(word => content.includes(word))
  if (!hasTime) {
    suggestions.push({
      type: 'time',
      message: '可以添加时间标记',
      suggestion: '描述事件发生的时间',
    })
  }
  
  // 检查是否有具体细节
  if (!content.includes('觉得') && !content.includes('认为') && !content.includes('想')) {
    suggestions.push({
      type: 'thought',
      message: '可以加入你的思考',
      suggestion: '分享你对这件事的想法',
    })
  }
  
  return NextResponse.json({
    success: true,
    data: {
      suggestions,
      score: calculateWritingScore(content),
      wordCount: content.length,
      tips: [
        '好的日记要有"看见、感受、思考"',
        '细节让回忆更鲜活',
        '真实比完美更重要',
      ]
    }
  })
}

function calculateWritingScore(content: string): number {
  let score = 50 // 基础分
  
  // 长度加分
  if (content.length >= 100) score += 10
  if (content.length >= 200) score += 10
  if (content.length >= 500) score += 10
  
  // 有标点符号
  if (/[，。！？]/.test(content)) score += 5
  
  // 有情感词
  const emotionWords = ['开心', '难过', '高兴', '感动', '期待', '满足', '担心']
  if (emotionWords.some(w => content.includes(w))) score += 10
  
  // 有时间词
  if (/今天|昨天|明天|早上|晚上|下午/.test(content)) score += 5
  
  // 有思考词
  if (/觉得|认为|感觉|想|思考|反思/.test(content)) score += 10
  
  return Math.min(100, score)
}

function generateOutline(mood?: string, tags?: string[]) {
  const templates = {
    happy: [
      { section: '开场', prompt: '今天发生了什么让你开心的事？' },
      { section: '细节', prompt: '描述那个精彩的瞬间' },
      { section: '感受', prompt: '这件事为什么让你开心？' },
      { section: '总结', prompt: '你希望明天是怎样的？' },
    ],
    sad: [
      { section: '事件', prompt: '今天发生了什么让你难过的事？' },
      { section: '感受', prompt: '描述你此刻的心情' },
      { section: '思考', prompt: '这件事让你想到了什么？' },
      { section: '希望', prompt: '你希望接下来会怎样？' },
    ],
    normal: [
      { section: '天气/时间', prompt: '今天是什么天气？你的一天怎么开始的？' },
      { section: '主要事件', prompt: '今天最重要的事是什么？' },
      { section: '感受', prompt: '你今天的心情如何？' },
      { section: '收获', prompt: '今天有什么收获或感悟？' },
    ],
  }
  
  const selectedMood = mood || 'normal'
  const outline = templates[selectedMood as keyof typeof templates] || templates.normal
  
  return NextResponse.json({
    success: true,
    data: {
      outline,
      tips: [
        '不需要每个部分都写，选择你喜欢的',
        '可以自由调整顺序',
        '记录真实感受最重要',
      ]
    }
  })
}

function generateSummary(content: string) {
  // 简单的内容摘要
  const sentences = content.split(/[。！？\n]/).filter(s => s.trim().length > 0)
  const summary = sentences.slice(0, 3).join('。')
  
  // 提取关键词
  const keywords: string[] = []
  const wordPatterns = [
    /今天/g, /开心/g, /难过/g, /学习/g, /工作/g,
    /朋友/g, /家人/g, /目标/g, /计划/g,
  ]
  
  for (const pattern of wordPatterns) {
    const matches = content.match(pattern)
    if (matches) {
      keywords.push(matches[0])
    }
  }
  
  return NextResponse.json({
    success: true,
    data: {
      summary: summary + (sentences.length > 3 ? '...' : ''),
      wordCount: content.length,
      sentenceCount: sentences.length,
      keywords: [...new Set(keywords)].slice(0, 5),
    }
  })
}