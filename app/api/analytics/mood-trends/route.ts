import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface MoodEntry {
  date: string
  mood: string
  score: number
  factors: string[]
}

interface MoodTrend {
  period: string
  avgScore: number
  dominantMood: string
  count: number
}

const moodScores: Record<string, number> = {
  '开心': 5,
  '快乐': 5,
  '兴奋': 5,
  '幸福': 5,
  '满足': 4,
  '平静': 4,
  '放松': 4,
  '一般': 3,
  '无聊': 2,
  '疲惫': 2,
  '焦虑': 2,
  '沮丧': 2,
  '难过': 1,
  '悲伤': 1,
  '愤怒': 1,
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  // period param available for future filtering (week, month, year)
  
  try {
    const dataDir = path.join(process.cwd(), 'data')
    const dayFiles = fs.readdirSync(dataDir).filter(f => f.startsWith('day') && f.endsWith('.ts'))
    
    const moodData: MoodEntry[] = []
    
    dayFiles.forEach(file => {
      const content = fs.readFileSync(path.join(dataDir, file), 'utf-8')
      const moodMatch = content.match(/mood:\s*'([^']+)'/)
      const dateMatch = content.match(/date:\s*'([^']+)'/)
      
      if (moodMatch && dateMatch) {
        const mood = moodMatch[1]
        const date = dateMatch[1]
        
        // 提取因素（从标签中）
        const tagsMatch = content.match(/tags:\s*\[([\s\S]*?)\]/)
        const factors = tagsMatch 
          ? (tagsMatch[1].match(/'([^']+)'/g) || []).map(t => t.replace(/'/g, '')).slice(0, 3)
          : []
        
        moodData.push({
          date,
          mood,
          score: moodScores[mood] || 3,
          factors
        })
      }
    })

    // 按日期排序
    moodData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // 计算趋势
    const recentData = moodData.slice(-30)
    const avgScore = recentData.length > 0
      ? recentData.reduce((sum, d) => sum + d.score, 0) / recentData.length
      : 3

    // 心情分布
    const moodCounts: Record<string, number> = {}
    moodData.forEach(d => {
      moodCounts[d.mood] = (moodCounts[d.mood] || 0) + 1
    })

    const moodDistribution = Object.entries(moodCounts)
      .map(([mood, count]) => ({ mood, count, percentage: Math.round(count / moodData.length * 100) }))
      .sort((a, b) => b.count - a.count)

    // 周趋势
    const weeklyTrends: MoodTrend[] = []
    for (let i = 0; i < 4; i++) {
      const weekStart = moodData.length - (i + 1) * 7
      const weekEnd = moodData.length - i * 7
      const weekData = moodData.slice(Math.max(0, weekStart), weekEnd)
      
      if (weekData.length > 0) {
        const weekMoods: Record<string, number> = {}
        weekData.forEach(d => {
          weekMoods[d.mood] = (weekMoods[d.mood] || 0) + 1
        })
        const dominantMood = Object.entries(weekMoods).sort((a, b) => b[1] - a[1])[0]?.[0] || '一般'
        
        weeklyTrends.unshift({
          period: `第${4 - i}周`,
          avgScore: weekData.reduce((sum, d) => sum + d.score, 0) / weekData.length,
          dominantMood,
          count: weekData.length
        })
      }
    }

    // 情绪因素分析
    const factorCounts: Record<string, number> = {}
    moodData.forEach(d => {
      d.factors.forEach(f => {
        factorCounts[f] = (factorCounts[f] || 0) + 1
      })
    })

    const topFactors = Object.entries(factorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([factor, count]) => ({ factor, count }))

    // 心情波动
    const moodVariability = recentData.length > 1
      ? Math.sqrt(recentData.reduce((sum, d) => sum + Math.pow(d.score - avgScore, 2), 0) / recentData.length)
      : 0

    // 情绪预测（简单移动平均）
    const predictedMood = recentData.length >= 3
      ? recentData.slice(-3).reduce((sum, d) => sum + d.score, 0) / 3
      : avgScore

    // 建议
    const recommendations = []
    if (avgScore < 3) {
      recommendations.push({
        type: 'warning',
        message: '近期情绪偏低，建议多进行户外活动或与朋友交流',
        icon: '💭'
      })
    }
    if (moodVariability > 1.5) {
      recommendations.push({
        type: 'info',
        message: '情绪波动较大，建议保持规律作息，尝试冥想放松',
        icon: '🧘'
      })
    }
    if (moodData.length >= 7) {
      const recentWeek = moodData.slice(-7)
      const weekAvg = recentWeek.reduce((sum, d) => sum + d.score, 0) / 7
      if (weekAvg > avgScore) {
        recommendations.push({
          type: 'positive',
          message: '本周情绪状态比平均水平更好，继续保持！',
          icon: '✨'
        })
      }
    }
    if (recommendations.length === 0) {
      recommendations.push({
        type: 'positive',
        message: '情绪状态稳定，继续保持积极心态！',
        icon: '🌟'
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalEntries: moodData.length,
          averageScore: Math.round(avgScore * 10) / 10,
          dominantMood: moodDistribution[0]?.mood || '一般',
          moodVariability: Math.round(moodVariability * 10) / 10,
          predictedMood: Math.round(predictedMood * 10) / 10
        },
        moodDistribution,
        weeklyTrends,
        topFactors,
        recentMoods: moodData.slice(-14),
        recommendations,
        lastUpdated: new Date().toISOString()
      }
    })
  } catch (_error) {
    console.error('Mood trend error:', _error)
    return NextResponse.json({ 
      success: false,
      error: '获取情绪趋势失败' 
    }, { status: 500 })
  }
}