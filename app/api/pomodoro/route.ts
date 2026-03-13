import { NextRequest, NextResponse } from 'next/server'

// Pomodoro sessions storage (in production, use a database)
let sessions: any[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const userId = searchParams.get('userId')
  const date = searchParams.get('date')
  
  if (date) {
    // Get sessions for a specific date
    const filtered = sessions.filter(s => {
      const sessionDate = new Date(s.timestamp).toDateString()
      return sessionDate === new Date(date).toDateString() && 
             (!userId || s.userId === userId)
    })
    return NextResponse.json({ sessions: filtered })
  }
  
  // Get all sessions for user
  const userSessions = userId 
    ? sessions.filter(s => s.userId === userId)
    : sessions
    
  return NextResponse.json({ sessions: userSessions })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, duration, task, completed } = body
    
    const session = {
      id: `pomodoro-${Date.now()}`,
      userId: userId || 'anonymous',
      type: type || 'work', // work, shortBreak, longBreak
      duration: duration || 25, // minutes
      task: task || '',
      completed: completed !== false,
      timestamp: new Date().toISOString()
    }
    
    sessions.push(session)
    
    // Calculate stats
    const userSessions = sessions.filter(s => s.userId === session.userId)
    const today = new Date().toDateString()
    const todaySessions = userSessions.filter(s => 
      new Date(s.timestamp).toDateString() === today
    )
    
    const stats = {
      totalSessions: userSessions.length,
      todaySessions: todaySessions.length,
      totalFocusTime: userSessions
        .filter(s => s.type === 'work')
        .reduce((acc, s) => acc + s.duration, 0),
      todayFocusTime: todaySessions
        .filter(s => s.type === 'work')
        .reduce((acc, s) => acc + s.duration, 0)
    }
    
    return NextResponse.json({ 
      success: true, 
      session,
      stats 
    })
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 400 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const sessionId = searchParams.get('id')
  
  if (sessionId) {
    sessions = sessions.filter(s => s.id !== sessionId)
    return NextResponse.json({ success: true })
  }
  
  return NextResponse.json(
    { error: 'Session ID required' },
    { status: 400 }
  )
}