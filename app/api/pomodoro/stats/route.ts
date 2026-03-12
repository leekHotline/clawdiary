import { NextRequest, NextResponse } from 'next/server'

// Pomodoro statistics
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const userId = searchParams.get('userId') || 'anonymous'
  const period = searchParams.get('period') || 'week' // day, week, month, year
  
  // Calculate date range
  const now = new Date()
  const startDate = new Date()
  
  switch (period) {
    case 'day':
      startDate.setHours(0, 0, 0, 0)
      break
    case 'week':
      startDate.setDate(startDate.getDate() - 7)
      break
    case 'month':
      startDate.setMonth(startDate.getMonth() - 1)
      break
    case 'year':
      startDate.setFullYear(startDate.getFullYear() - 1)
      break
  }
  
  // Mock stats (in production, fetch from database)
  const stats = {
    period,
    startDate: startDate.toISOString(),
    endDate: now.toISOString(),
    summary: {
      totalSessions: Math.floor(Math.random() * 50) + 10,
      totalFocusTime: Math.floor(Math.random() * 1200) + 200, // minutes
      totalBreakTime: Math.floor(Math.random() * 300) + 50,
      averageSessionLength: 25,
      completionRate: Math.floor(Math.random() * 30) + 70 // percentage
    },
    daily: Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      return {
        date: date.toISOString().split('T')[0],
        sessions: Math.floor(Math.random() * 8),
        focusTime: Math.floor(Math.random() * 120) + 20
      }
    }).reverse(),
    hourly: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      sessions: Math.floor(Math.random() * 5)
    })),
    tasks: [
      { task: '写作', sessions: 12, focusTime: 300 },
      { task: '阅读', sessions: 8, focusTime: 200 },
      { task: '编程', sessions: 15, focusTime: 375 },
      { task: '学习', sessions: 10, focusTime: 250 }
    ],
    streak: {
      current: Math.floor(Math.random() * 14) + 1,
      longest: Math.floor(Math.random() * 30) + 7
    }
  }
  
  return NextResponse.json(stats)
}