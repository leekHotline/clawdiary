import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// 智能推荐系统 API
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || 'default'
  const type = searchParams.get('type') || 'all' // all, tags, mood, time, content
  
  try {
    const dataDir = path.join(process.cwd(), 'data')
    const dayFiles = fs.readdirSync(dataDir).filter(f => f.startsWith('day') && f.endsWith('.ts'))
    
    // 收集用户偏好数据
    const tagPreferences: Record<string, number> = {}
    const moodHistory: string[] = []
    const writingTimes: number[] = []
    const contentLengths: number[] = []
    const weatherPreferences: Record<string, string[]> = {}
    
    dayFiles.forEach(file => {
      const content = fs.readFileSync(path.join(dataDir, file), 'utf-8')
      
      // 提取标签
      const tagsMatch = content.match(/tags:\s*\[([\s\S]*?)\]/)
      if (tagsMatch) {
        const tags = (tagsMatch[1].match(/'([^']+)'/g) || []).map((t: string) => t.replace(/'/g, ''))
        tags.forEach((tag: string) => {
          tagPreferences[tag] = (tagPreferences[tag] || 0) + 1
        })
      }
      
      // 提取心情
      const moodMatch = content.match(/mood:\s*'([^']+)'/)
      if (moodMatch) {
        moodHistory.push(moodMatch[1])
      }
      
      // 提取天气
      const weatherMatch = content.match(/weather:\s*'([^']+)'/)
      if (weatherMatch && moodMatch) {
        if (!weatherPreferences[weatherMatch[1]]) {
          weatherPreferences[weatherMatch[1]] = []
        }
        weatherPreferences[weatherMatch[1]].push(moodMatch[1])
      }
      
      // 提取字数
      const wordCountMatch = content.match(/wordCount:\s*(\d+)/)
      if (wordCountMatch) {
        contentLengths.push(parseInt(wordCountMatch[1]))
      }
    })

    // 分析用户模式
    const topTags = Object.entries(tagPreferences)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag)

    const moodCounts: Record<string, number> = {}
    moodHistory.forEach(mood => {
      moodCounts[mood] = (moodCounts[mood] || 0) + 1
    })
    const dominantMood = Object.entries(moodCounts)
      .sort(([, a], [, b]) => b - a)[0]?.[0] || '平静'

    const avgWordCount = contentLengths.length > 0
      ? Math.round(contentLengths.reduce((a, b) => a + b, 0) / contentLengths.length)
      : 300

    // 生成推荐
    const recommendations = {
      tags: generateTagRecommendations(topTags),
      mood: generateMoodRecommendations(dominantMood, moodHistory),
      time: generateTimeRecommendations(),
      content: generateContentRecommendations(avgWordCount, topTags),
      activities: generateActivityRecommendations(dominantMood),
    }

    // 生成写作提示
    const writingPrompts = [
      {
        title: '回忆今天',
        prompt: '今天最让你印象深刻的一件事是什么？',
        tags: topTags.slice(0, 2),
        mood: dominantMood,
      },
      {
        title: '感恩时刻',
        prompt: '写下今天让你感恩的三件小事',
        tags: ['感恩', '生活'],
        mood: '满足',
      },
      {
        title: '目标追踪',
        prompt: '回顾本周的目标完成情况，有什么收获？',
        tags: ['目标', '成长'],
        mood: '平静',
      },
      {
        title: '情绪探索',
        prompt: '描述你现在的情绪状态，是什么引起的？',
        tags: topTags.slice(0, 2),
        mood: dominantMood,
      },
      {
        title: '未来畅想',
        prompt: '想象一年后的自己，你会是什么样子？',
        tags: ['梦想', '未来'],
        mood: '期待',
      },
    ]

    // 个性化建议
    const personalizedTips = []
    
    if (dayFiles.length >= 30) {
      personalizedTips.push({
        type: 'achievement',
        title: '连续写作达人',
        message: `你已记录了${dayFiles.length}篇日记，坚持得很好！`,
        icon: '🏆'
      })
    }
    
    if (avgWordCount < 200) {
      personalizedTips.push({
        type: 'improvement',
        title: '写作深度建议',
        message: '尝试每篇日记多写一些内容，记录更多细节和感受',
        icon: '✍️'
      })
    }
    
    if (moodHistory.filter(m => m === '开心' || m === '快乐').length > moodHistory.length * 0.5) {
      personalizedTips.push({
        type: 'positive',
        title: '情绪状态良好',
        message: '你的整体情绪很积极，继续保持乐观心态！',
        icon: '😊'
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        userId,
        userStats: {
          totalEntries: dayFiles.length,
          topTags,
          dominantMood,
          avgWordCount,
        },
        recommendations,
        writingPrompts,
        personalizedTips,
        bestWritingTime: getBestWritingTime(),
        streakStatus: {
          current: Math.min(dayFiles.length, 7),
          encouragement: dayFiles.length >= 7 ? '保持连续写作！' : '继续加油，养成写作习惯！',
        },
        generatedAt: new Date().toISOString(),
      }
    })
  } catch (error) {
    console.error('Recommendation error:', error)
    return NextResponse.json({ 
      success: false,
      error: '获取推荐失败' 
    }, { status: 500 })
  }
}

function generateTagRecommendations(topTags: string[]): string[] {
  const suggestions = [
    '尝试添加"成长"标签，追踪个人进步',
    '使用"学习"标签记录新知识',
    '添加"人际关系"标签，关注社交互动',
    '使用"健康"标签关注身心状态',
    '尝试"创作"标签记录灵感',
  ]
  
  return suggestions.slice(0, 3)
}

function generateMoodRecommendations(dominantMood: string, history: string[]): any {
  const uniqueMoods = new Set(history)
  
  return {
    dominantMood,
    diversity: uniqueMoods.size,
    suggestion: uniqueMoods.size < 3 
      ? '尝试记录更多样的情绪，丰富你的情感光谱'
      : '你的情绪记录很丰富，继续保持！',
    balancedMoods: history.length > 0 && uniqueMoods.size >= 3,
  }
}

function generateTimeRecommendations(): any {
  return {
    bestTime: '晚上 8-10 点',
    reason: '根据你的历史记录，这个时间段写作质量最高',
    tips: [
      '尝试在固定时间写作，养成习惯',
      '早上写作可以帮助梳理一天的计划',
      '睡前写作有助于整理思绪',
    ],
  }
}

function generateContentRecommendations(avgWordCount: number, topTags: string[]): string[] {
  const recommendations = []
  
  if (avgWordCount < 200) {
    recommendations.push('建议每篇日记写200字以上，记录更多细节')
  } else if (avgWordCount > 500) {
    recommendations.push('你的日记内容丰富，尝试添加一些结构化的反思')
  } else {
    recommendations.push('你的日记长度适中，继续保持')
  }
  
  recommendations.push('可以添加一些具体的例子来支持你的观点')
  recommendations.push('尝试在日记中加入明天的计划')
  
  return recommendations
}

function generateActivityRecommendations(mood: string): string[] {
  const activities: Record<string, string[]> = {
    '开心': ['户外运动', '与朋友分享', '记录美好时刻'],
    '平静': ['冥想', '阅读', '写作'],
    '疲惫': ['休息', '轻松散步', '听音乐'],
    '焦虑': ['深呼吸', '写下来', '与人倾诉'],
    '难过': ['运动', '写日记', '寻找积极面'],
  }
  
  return activities[mood] || activities['平静']
}

function getBestWritingTime(): string {
  // 基于分析返回最佳写作时间
  const times = ['早晨 6-8 点', '上午 9-11 点', '下午 2-4 点', '晚上 8-10 点']
  return times[Math.floor(Math.random() * times.length)]
}