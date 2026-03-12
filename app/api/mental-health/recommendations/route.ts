import { NextRequest, NextResponse } from 'next/server'

// Activity recommendations based on mood and context
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const mood = searchParams.get('mood') || 'neutral'
  const timeOfDay = getTimeOfDay()
  const weather = searchParams.get('weather') || 'sunny'
  
  const recommendations = generateRecommendations(mood, timeOfDay, weather)
  
  return NextResponse.json({
    mood,
    timeOfDay,
    weather,
    recommendations
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const context = {
      mood: body.mood || 'neutral',
      energy: body.energy || 5,
      timeAvailable: body.timeAvailable || 15,
      location: body.location || 'home',
      previousActivities: body.previousActivities || []
    }
    
    const recommendations = getPersonalizedRecommendations(context)
    
    return NextResponse.json({
      context,
      recommendations,
      quickActions: getQuickActions(context)
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 400 }
    )
  }
}

function generateRecommendations(mood: string, timeOfDay: string, weather: string) {
  const baseRecommendations = {
    happy: [
      { activity: '感恩日记', reason: '记录美好的时刻', duration: 5, type: 'gratitude' },
      { activity: '分享快乐', reason: '与朋友分享你的喜悦', duration: 10, type: 'social' },
      { activity: '创意写作', reason: '灵感满满的好时机', duration: 15, type: 'writing' }
    ],
    stressed: [
      { activity: '深呼吸练习', reason: '帮助放松身心', duration: 5, type: 'meditation' },
      { activity: '短途散步', reason: '接触自然缓解压力', duration: 10, type: 'exercise' },
      { activity: '正念冥想', reason: '让思绪平静下来', duration: 10, type: 'meditation' }
    ],
    tired: [
      { activity: '小憩一下', reason: '休息是必要的', duration: 20, type: 'rest' },
      { activity: '轻柔伸展', reason: '活动身体提神', duration: 5, type: 'exercise' },
      { activity: '听音乐', reason: '让音乐治愈疲惫', duration: 10, type: 'relaxation' }
    ],
    sad: [
      { activity: '感恩日记', reason: '找到值得感恩的事', duration: 5, type: 'gratitude' },
      { activity: '与朋友聊天', reason: '倾诉可以缓解情绪', duration: 15, type: 'social' },
      { activity: '写下感受', reason: '把情绪变成文字', duration: 10, type: 'writing' }
    ],
    anxious: [
      { activity: '呼吸练习', reason: '缓解焦虑感', duration: 5, type: 'meditation' },
      { activity: '身体扫描', reason: '感受当下的身体', duration: 10, type: 'meditation' },
      { activity: '专注一件事', reason: '转移注意力', duration: 15, type: 'focus' }
    ],
    neutral: [
      { activity: '每日肯定语', reason: '激发积极能量', duration: 3, type: 'affirmation' },
      { activity: '番茄钟', reason: '高效利用时间', duration: 25, type: 'productivity' },
      { activity: '感恩练习', reason: '培养感恩习惯', duration: 5, type: 'gratitude' }
    ]
  }
  
  return baseRecommendations[mood as keyof typeof baseRecommendations] || baseRecommendations.neutral
}

function getPersonalizedRecommendations(context: any) {
  const { mood, energy, timeAvailable, location, previousActivities } = context
  
  let recommendations = generateRecommendations(mood, 'afternoon', 'sunny')
  
  // Filter by time available
  recommendations = recommendations.filter(r => r.duration <= timeAvailable)
  
  // Avoid repeating recent activities
  if (previousActivities.length > 0) {
    recommendations = recommendations.filter(r => 
      !previousActivities.slice(-3).includes(r.activity)
    )
  }
  
  // Adjust for energy level
  if (energy < 3) {
    recommendations = recommendations.map(r => ({
      ...r,
      duration: Math.round(r.duration * 0.7),
      reason: '低能量版本：' + r.reason
    }))
  }
  
  return recommendations.slice(0, 3)
}

function getQuickActions(context: any) {
  return [
    { action: 'start_meditation', label: '开始冥想', icon: '🧘' },
    { action: 'write_gratitude', label: '感恩日记', icon: '🙏' },
    { action: 'start_pomodoro', label: '番茄钟', icon: '🍅' },
    { action: 'view_affirmation', label: '肯定语', icon: '✨' }
  ]
}

function getTimeOfDay(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 21) return 'evening'
  return 'night'
}