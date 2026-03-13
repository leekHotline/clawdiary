import { NextRequest, NextResponse } from 'next/server'

interface HistoryEntry {
  id: string
  userId: string
  affirmationId: string
  affirmationText: string
  category: string
  reflection: string
  date: string
  mood: string | null
}

// Affirmation history storage
let history: HistoryEntry[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const userId = searchParams.get('userId')
  const limit = parseInt(searchParams.get('limit') || '30')
  
  let filteredHistory = history
  
  if (userId) {
    filteredHistory = filteredHistory.filter(h => h.userId === userId)
  }
  
  // Sort by date descending
  filteredHistory.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  return NextResponse.json({
    history: filteredHistory.slice(0, limit),
    total: filteredHistory.length
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const entry = {
      id: Date.now().toString(),
      userId: body.userId || 'anonymous',
      affirmationId: body.affirmationId,
      affirmationText: body.affirmationText,
      category: body.category,
      reflection: body.reflection || '',
      date: new Date().toISOString(),
      mood: body.mood || null
    }
    
    history.push(entry)
    
    return NextResponse.json({
      success: true,
      entry
    })
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to save history' },
      { status: 400 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, reflection } = body
    
    const index = history.findIndex(h => h.id === id)
    if (index !== -1) {
      history[index].reflection = reflection
      return NextResponse.json({
        success: true,
        entry: history[index]
      })
    }
    
    return NextResponse.json(
      { error: 'Entry not found' },
      { status: 404 }
    )
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to update entry' },
      { status: 400 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const id = searchParams.get('id')
  
  if (id) {
    history = history.filter(h => h.id !== id)
    return NextResponse.json({ success: true })
  }
  
  return NextResponse.json(
    { error: 'Entry ID required' },
    { status: 400 }
  )
}