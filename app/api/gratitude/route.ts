import { NextRequest, NextResponse } from 'next/server'

// Gratitude entries storage (in production, use a database)
let entries: any[] = []

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const userId = searchParams.get('userId')
  const date = searchParams.get('date')
  const limit = parseInt(searchParams.get('limit') || '30')
  
  let filtered = userId 
    ? entries.filter(e => e.userId === userId)
    : entries
  
  if (date) {
    const targetDate = new Date(date).toDateString()
    filtered = filtered.filter(e => 
      new Date(e.date).toDateString() === targetDate
    )
  }
  
  // Sort by date descending
  filtered.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  return NextResponse.json({ 
    entries: filtered.slice(0, limit),
    total: filtered.length
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, items, mood, reflection } = body
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'At least one gratitude item is required' },
        { status: 400 }
      )
    }
    
    const entry = {
      id: `gratitude-${Date.now()}`,
      userId: userId || 'anonymous',
      items: items.filter((item: string) => item.trim()),
      mood: mood || 4, // 0-6 scale
      reflection: reflection || '',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }
    
    entries.push(entry)
    
    // Calculate streak
    const userEntries = entries
      .filter(e => e.userId === entry.userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    let streak = 0
    const checkDate = new Date()
    checkDate.setHours(0, 0, 0, 0)
    
    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toDateString()
      const hasEntry = userEntries.some(e => 
        new Date(e.date).toDateString() === dateStr
      )
      
      if (hasEntry) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else if (i > 0) {
        break
      } else {
        checkDate.setDate(checkDate.getDate() - 1)
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      entry,
      streak 
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create entry' },
      { status: 400 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, items, mood, reflection } = body
    
    const index = entries.findIndex(e => e.id === id)
    if (index === -1) {
      return NextResponse.json(
        { error: 'Entry not found' },
        { status: 404 }
      )
    }
    
    entries[index] = {
      ...entries[index],
      items: items || entries[index].items,
      mood: mood ?? entries[index].mood,
      reflection: reflection ?? entries[index].reflection,
      updatedAt: new Date().toISOString()
    }
    
    return NextResponse.json({ 
      success: true, 
      entry: entries[index] 
    })
  } catch {
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
    entries = entries.filter(e => e.id !== id)
    return NextResponse.json({ success: true })
  }
  
  return NextResponse.json(
    { error: 'Entry ID required' },
    { status: 400 }
  )
}