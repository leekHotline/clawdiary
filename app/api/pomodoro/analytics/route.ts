import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const userId = searchParams.get('userId')
  const range = searchParams.get('range') || 'week' // week, month, year
  
  // Generate mock statistics
  const now = new Date()
  const stats = {
    totalSessions: Math.floor(Math.random() * 100) + 50,
    totalFocusTime: Math.floor(Math.random() * 2000) + 500,
    averageDaily: Math.floor(Math.random() * 10) + 3,
    longestStreak: Math.floor(Math.random() * 30) + 5,
    currentStreak: Math.floor(Math.random() * 14) + 1,
    mostProductiveDay: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][Math.floor(Math.random() * 5)],
    mostProductiveHour: Math.floor(Math.random() * 12) + 8,
    
    weeklyData: generateWeeklyData(),
    hourlyDistribution: generateHourlyDistribution(),
    categoryBreakdown: {
      work: Math.floor(Math.random() * 50) + 20,
      study: Math.floor(Math.random() * 30) + 10,
      writing: Math.floor(Math.random() * 25) + 15,
      other: Math.floor(Math.random() * 20) + 5
    }
  }
  
  return NextResponse.json(stats)
}

function generateWeeklyData() {
  const data = []
  const today = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split('T')[0],
      sessions: Math.floor(Math.random() * 12),
      focusTime: Math.floor(Math.random() * 180) + 30
    })
  }
  
  return data
}

function generateHourlyDistribution() {
  const distribution: Record<number, number> = {}
  
  for (let i = 0; i < 24; i++) {
    // Most activity during work hours (9-12, 14-18)
    if ((i >= 9 && i <= 12) || (i >= 14 && i <= 18)) {
      distribution[i] = Math.floor(Math.random() * 15) + 5
    } else if (i >= 7 && i <= 22) {
      distribution[i] = Math.floor(Math.random() * 5)
    } else {
      distribution[i] = 0
    }
  }
  
  return distribution
}