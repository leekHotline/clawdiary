import { NextRequest, NextResponse } from 'next/server'

// Pomodoro session storage (in production, use a database)
let sessions: any[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const userId = searchParams.get('userId')
  const date = searchParams.get('date')
  
  let filteredSessions = sessions
  
  if (userId) {
    filteredSessions = filteredSessions.filter(s => s.userId === userId)
  }
  
  if (date) {
    filteredSessions = filteredSessions.filter(s => 
      new Date(s.timestamp).toDateString() === new Date(date).toDateString()
    )
  }
  
  // Calculate stats
  const today = new Date().toDateString()
  const todaySessions = sessions.filter(s => 
    new Date(s.timestamp).toDateString() === today && s.type === 'work'
  )
  
  const stats = {
    todayPomodoros: todaySessions.length,
    todayFocusTime: todaySessions.reduce((acc, s) => acc + s.duration, 0),
    totalSessions: sessions.length,
    totalFocusTime: sessions
      .filter(s => s.type === 'work')
      .reduce((acc, s) => acc + s.duration, 0)
  }
  
  return NextResponse.json({
    sessions: filteredSessions.slice(-50),
    stats
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const session = {
      id: Date.now().toString(),
      userId: body.userId || 'anonymous',
      type: body.type || 'work', // work, shortBreak, longBreak
      duration: body.duration || 25,
      task: body.task || '',
      timestamp: new Date().toISOString(),
      completed: true
    }
    
    sessions.push(session)
    
    return NextResponse.json({
      success: true,
      session
    })
  } catch (error) {
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