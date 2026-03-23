import { NextRequest, NextResponse } from 'next/server'
import { aiAction, aiAnalyze } from '@/lib/ai-service'

// AI 写作助手 - 真正的 AI 能力
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, content, mood, tags, previousContent } = body
    
    // 根据类型调用不同的 AI 功能
    switch (type) {
      case 'title':
        return await generateTitleSuggestions(content)
      case 'continue':
        return await generateContinueSuggestions(content)
      case 'mood':
        return await analyzeMood(content)
      case 'tags':
        return await generateTagSuggestions(content)
      case 'improve':
        return await generateImprovementSuggestions(content)
      case 'outline':
        return await generateOutline(mood, tags)
      case 'summary':
        return await generateSummary(content)
      default:
        return NextResponse.json({ success: false, error: 'Unknown type' }, { status: 400 })
    }
  } catch (error) {
    console.error('Writing assistant error:', error)
    return NextResponse.json({ success: false, error: 'Failed to process request' }, { status: 500 })
  }
}

async function generateTitleSuggestions(content: string) {
  const result = await aiAction('generateTitle', { content })
  
  if (!result.success) {
    // Fallback to simple suggestions
    return NextResponse.json({
      success: true,
      data: {
        suggestions: [
          { title: '今日思考', reason: '适合反思类内容' },
          { title: '生活记录', reason: '日常记录风格' },
          { title: '心情随笔', reason: '情感表达类' },
        ],
        tips: ['AI暂时不可用，显示基础建议']
      }
    })
  }
  
  // Parse AI response to extract titles
  const lines = result.content?.split('\n').filter(l => l.trim()) || []
  const suggestions = lines.slice(0, 5).map(line => ({
    title: line.replace(/^\d+[\.\、\)]?\s*/, '').replace(/：.*$/, ''),
    reason: line.includes('：') ? line.split('：')[1] : 'AI推荐'
  }))
  
  return NextResponse.json({
    success: true,
    data: {
      suggestions,
      tips: [
        '好标题应该简洁有力',
        '可以用日期+心情的方式',
        '尝试用一个问题作为标题',
      ],
      poweredBy: 'DeepSeek AI'
    }
  })
}

async function generateContinueSuggestions(content: string) {
  const result = await aiAction('continueWriting', { content })
  
  if (!result.success) {
    return NextResponse.json({
      success: true,
      data: {
        suggestions: [
          { text: '今天让我印象深刻的是...', reason: '引导回忆具体事件' },
          { text: '这让我想起了之前的一次经历...', reason: '关联过往记忆' },
          { text: '从这件事中，我学到了...', reason: '引导总结反思' },
        ],
        currentWordCount: content.length,
        tips: ['AI暂时不可用']
      }
    })
  }
  
  const lines = result.content?.split('\n').filter(l => l.trim()) || []
  const suggestions = lines.slice(0, 5).map(line => ({
    text: line.replace(/^\d+[\.\、\)]?\s*/, ''),
    reason: 'AI续写建议'
  }))
  
  return NextResponse.json({
    success: true,
    data: {
      suggestions,
      currentWordCount: content.length,
      recommendedMinWords: 100,
      tips: ['继续写下去，让思绪自由流动'],
      poweredBy: 'DeepSeek AI'
    }
  })
}

async function analyzeMood(content: string) {
  const result = await aiAnalyze(content, 'mood')
  
  if (!result.success) {
    // Fallback to keyword-based analysis
    return fallbackMoodAnalysis(content)
  }
  
  try {
    // Try to parse JSON from AI response
    const jsonMatch = result.content?.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const moodData = JSON.parse(jsonMatch[0])
      return NextResponse.json({
        success: true,
        data: {
          primaryMood: moodData.primaryMood || 'calm',
          moodScore: moodData.moodScore || 5,
          moodDescription: moodData.moodDescription,
          suggestions: moodData.suggestions || [],
          poweredBy: 'DeepSeek AI'
        }
      })
    }
  } catch {
    // Fall through to fallback
  }
  
  return fallbackMoodAnalysis(content)
}

function fallbackMoodAnalysis(content: string) {
  const moodKeywords = {
    happy: ['开心', '快乐', '高兴', '幸福', '满足', '兴奋', '期待'],
    sad: ['难过', '伤心', '失落', '沮丧', '忧伤', '悲伤'],
    anxious: ['焦虑', '担心', '紧张', '不安', '害怕'],
    calm: ['平静', '放松', '安宁', '满足', '惬意'],
    angry: ['生气', '愤怒', '烦躁', '恼火'],
    grateful: ['感谢', '感恩', '珍惜', '幸运'],
  }
  
  const scores: Record<string, number> = {}
  
  for (const [mood, keywords] of Object.entries(moodKeywords)) {
    scores[mood] = keywords.filter(k => content.includes(k)).length
  }
  
  let primaryMood = 'calm'
  let maxScore = 0
  for (const [mood, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score
      primaryMood = mood
    }
  }
  
  const moodEmojis: Record<string, string> = {
    happy: '😊', sad: '😢', anxious: '😰', calm: '😌', angry: '😤', grateful: '🙏'
  }
  
  return NextResponse.json({
    success: true,
    data: {
      primaryMood,
      emoji: moodEmojis[primaryMood],
      scores,
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

async function generateTagSuggestions(content: string) {
  const result = await aiAction('generateTags', { content })
  
  if (!result.success) {
    return NextResponse.json({
      success: true,
      data: {
        suggestedTags: ['日记', '记录'],
        tips: ['AI暂时不可用']
      }
    })
  }
  
  // Parse tags from AI response
  const tags = result.content?.split(/[,，、\n]/).map(t => t.trim()).filter(t => t.length > 0 && t.length < 10) || []
  
  return NextResponse.json({
    success: true,
    data: {
      suggestedTags: tags.slice(0, 8),
      tips: [
        '选择2-5个标签最合适',
        '标签可以帮助日后查找相关日记',
      ],
      poweredBy: 'DeepSeek AI'
    }
  })
}

async function generateImprovementSuggestions(content: string) {
  const result = await aiAnalyze(content, 'writing')
  
  if (!result.success) {
    return NextResponse.json({
      success: true,
      data: {
        suggestions: [{ type: 'general', message: '继续写下去！', suggestion: '保持写作习惯' }],
        score: 50,
        wordCount: content.length,
        tips: ['真实比完美更重要']
      }
    })
  }
  
  try {
    const jsonMatch = result.content?.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0])
      return NextResponse.json({
        success: true,
        data: {
          suggestions: data.improvements?.map((i: string) => ({
            type: 'improvement',
            message: i,
            suggestion: i
          })) || [],
          score: data.score || 70,
          strengths: data.strengths || [],
          wordCount: content.length,
          poweredBy: 'DeepSeek AI'
        }
      })
    }
  } catch {
    // Fall through
  }
  
  return NextResponse.json({
    success: true,
    data: {
      suggestions: [{ type: 'general', message: 'AI分析完成', suggestion: result.content }],
      score: 70,
      wordCount: content.length,
      poweredBy: 'DeepSeek AI'
    }
  })
}

async function generateOutline(mood?: string, tags?: string[]) {
  const result = await aiAction('generateOutline', { mood: mood || 'normal', tags: tags || [] })
  
  if (!result.success) {
    // Fallback outline
    return NextResponse.json({
      success: true,
      data: {
        outline: [
          { section: '开场', prompt: '今天发生了什么？' },
          { section: '细节', prompt: '描述具体的事件' },
          { section: '感受', prompt: '你有什么感受？' },
          { section: '总结', prompt: '今天的收获是什么？' },
        ],
        tips: ['自由发挥，不用拘泥于格式']
      }
    })
  }
  
  const lines = result.content?.split('\n').filter(l => l.trim()) || []
  const outline = lines.slice(0, 6).map((line, idx) => ({
    section: `第${idx + 1}部分`,
    prompt: line.replace(/^\d+[\.\、\)]?\s*/, '')
  }))
  
  return NextResponse.json({
    success: true,
    data: {
      outline,
      tips: ['可以根据自己的想法调整'],
      poweredBy: 'DeepSeek AI'
    }
  })
}

async function generateSummary(content: string) {
  const result = await aiAction('generateSummary', { content })
  
  if (!result.success) {
    const sentences = content.split(/[。！？\n]/).filter(s => s.trim().length > 0)
    return NextResponse.json({
      success: true,
      data: {
        summary: sentences.slice(0, 3).join('。'),
        wordCount: content.length,
        sentenceCount: sentences.length,
      }
    })
  }
  
  return NextResponse.json({
    success: true,
    data: {
      summary: result.content,
      wordCount: content.length,
      poweredBy: 'DeepSeek AI'
    }
  })
}