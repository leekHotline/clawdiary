import { NextRequest, NextResponse } from 'next/server'

// Daily wellness check-in
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const userId = searchParams.get('userId')
  
  // Get today's check-in status
  const today = new Date().toISOString().split('T')[0]
  
  const checkInStatus = {
    date: today,
    completed: Math.random() > 0.5,
    tasks: [
      { id: 'gratitude', name: '感恩日记', completed: Math.random() > 0.3, points: 10 },
      { id: 'affirmation', name: '每日肯定语', completed: Math.random() > 0.4, points: 5 },
      { id: 'meditation', name: '冥想练习', completed: Math.random() > 0.6, points: 15 },
      { id: 'pomodoro', name: '番茄钟专注', completed: Math.random() > 0.5, points: 10 },
      { id: 'reflection', name: '每日反思', completed: Math.random() > 0.7, points: 8 }
    ],
    totalPoints: Math.floor(Math.random() * 50),
    streak: Math.floor(Math.random() * 14) + 1
  }
  
  return NextResponse.json(checkInStatus)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const checkIn = {
      id: Date.now().toString(),
      userId: body.userId || 'anonymous',
      date: new Date().toISOString().split('T')[0],
      
      // Morning check-in
      morning: {
        mood: body.morningMood || 5,
        energy: body.morningEnergy || 5,
        intention: body.morningIntention || '',
        sleepQuality: body.sleepQuality || 5
      },
      
      // Evening check-in
      evening: body.evening ? {
        mood: body.evening.mood,
        energy: body.evening.energy,
        highlights: body.evening.highlights || [],
        challenges: body.evening.challenges || [],
        gratitude: body.evening.gratitude || []
      } : null,
      
      // Overall assessment
      overallScore: calculateOverallScore(body),
      
      timestamp: new Date().toISOString()
    }
    
    return NextResponse.json({
      success: true,
      checkIn,
      insights: generateInsights(checkIn)
    })
  } catch {
    return NextResponse.json(
      { error: 'Check-in failed' },
      { status: 400 }
    )
  }
}

function calculateOverallScore(body: any): number {
  let score = 50
  
  // Morning factors
  if (body.morningMood) score += (body.morningMood - 5) * 3
  if (body.morningEnergy) score += (body.morningEnergy - 5) * 2
  if (body.sleepQuality) score += (body.sleepQuality - 5) * 2
  
  // Evening factors
  if (body.evening) {
    score += (body.evening.mood - 5) * 3
    score += body.evening.gratitude?.length * 2 || 0
  }
  
  return Math.min(100, Math.max(0, Math.round(score)))
}

function generateInsights(checkIn: any) {
  const insights = []
  
  if (checkIn.morning.sleepQuality < 3) {
    insights.push({
      type: 'sleep',
      message: '睡眠质量较低，建议调整作息时间',
      priority: 'high'
    })
  }
  
  if (checkIn.morning.mood >= 7) {
    insights.push({
      type: 'positive',
      message: '今天开始得不错，继续保持积极心态！',
      priority: 'info'
    })
  }
  
  if (!checkIn.evening) {
    insights.push({
      type: 'reminder',
      message: '别忘了在晚上完成今日回顾',
      priority: 'medium'
    })
  }
  
  return insights
}