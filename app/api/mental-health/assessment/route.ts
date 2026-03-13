import { NextRequest, NextResponse } from 'next/server'

// Mental health assessment and recommendations
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const userId = searchParams.get('userId')
  const type = searchParams.get('type') || 'overview'
  
  const assessment = {
    overallScore: Math.floor(Math.random() * 30) + 70,
    categories: {
      emotional: {
        score: Math.floor(Math.random() * 30) + 65,
        label: '情绪健康',
        status: 'good' as const,
        trend: 'stable'
      },
      social: {
        score: Math.floor(Math.random() * 30) + 60,
        label: '社交健康',
        status: 'good' as const,
        trend: 'improving'
      },
      physical: {
        score: Math.floor(Math.random() * 30) + 70,
        label: '身体健康',
        status: 'good' as const,
        trend: 'stable'
      },
      mindfulness: {
        score: Math.floor(Math.random() * 30) + 55,
        label: '正念水平',
        status: 'moderate' as const,
        trend: 'improving'
      },
      productivity: {
        score: Math.floor(Math.random() * 30) + 65,
        label: '生产力',
        status: 'good' as const,
        trend: 'stable'
      }
    },
    
    recommendations: [
      {
        type: 'meditation',
        priority: 'high',
        title: '每日冥想练习',
        description: '建议每天进行5-10分钟的冥想练习',
        duration: '5-10分钟'
      },
      {
        type: 'gratitude',
        priority: 'medium',
        title: '感恩日记',
        description: '记录每天感恩的事可以提升幸福感',
        duration: '5分钟'
      },
      {
        type: 'exercise',
        priority: 'medium',
        title: '适度运动',
        description: '每周进行3-4次适度运动',
        duration: '30分钟'
      },
      {
        type: 'sleep',
        priority: 'high',
        title: '规律作息',
        description: '保持规律的睡眠时间',
        duration: '每日'
      }
    ],
    
    recentActivities: [
      {
        date: new Date().toISOString().split('T')[0],
        type: 'gratitude',
        impact: '+5'
      },
      {
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        type: 'meditation',
        impact: '+8'
      },
      {
        date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
        type: 'pomodoro',
        impact: '+3'
      }
    ],
    
    weeklyTrend: generateWeeklyTrend()
  }
  
  return NextResponse.json(assessment)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Calculate mental health score based on activities
    const activities = body.activities || []
    
    let score = 50 // Base score
    
    activities.forEach((activity: any) => {
      switch (activity.type) {
        case 'meditation':
          score += activity.duration * 0.5
          break
        case 'gratitude':
          score += 5
          break
        case 'exercise':
          score += activity.duration * 0.3
          break
        case 'pomodoro':
          score += 2
          break
      }
    })
    
    score = Math.min(100, Math.max(0, score))
    
    const assessment = {
      score: Math.round(score),
      level: getScoreLevel(score),
      recommendations: generateRecommendations(score, activities),
      nextSteps: getNextSteps(score)
    }
    
    return NextResponse.json(assessment)
  } catch (_error) {
    return NextResponse.json(
      { error: 'Assessment failed' },
      { status: 400 }
    )
  }
}

function generateWeeklyTrend() {
  const data = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split('T')[0],
      score: Math.floor(Math.random() * 20) + 70
    })
  }
  return data
}

function getScoreLevel(score: number): string {
  if (score >= 80) return 'excellent'
  if (score >= 60) return 'good'
  if (score >= 40) return 'moderate'
  return 'needs_attention'
}

function generateRecommendations(score: number, activities: any[]) {
  const recommendations = []
  
  if (!activities.some((a: any) => a.type === 'meditation')) {
    recommendations.push({
      type: 'meditation',
      reason: '冥想可以帮助提升专注力和情绪管理'
    })
  }
  
  if (score < 60) {
    recommendations.push({
      type: 'support',
      reason: '考虑寻求专业心理健康支持'
    })
  }
  
  return recommendations
}

function getNextSteps(score: number) {
  if (score >= 70) {
    return ['继续保持当前习惯', '尝试新的心理健康活动']
  }
  return ['从简单的冥想开始', '建立规律的作息时间', '与朋友或家人交流']
}