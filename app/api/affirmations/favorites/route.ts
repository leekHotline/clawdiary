import { NextRequest, NextResponse } from 'next/server'

// Favorites storage (in production, use a database)
let favorites: Record<string, string[]> = {}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const userId = searchParams.get('userId') || 'anonymous'
  
  const userFavorites = favorites[userId] || []
  
  return NextResponse.json({ 
    favorites: userFavorites,
    count: userFavorites.length 
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, affirmationId } = body
    
    const uid = userId || 'anonymous'
    
    if (!favorites[uid]) {
      favorites[uid] = []
    }
    
    if (!favorites[uid].includes(affirmationId)) {
      favorites[uid].push(affirmationId)
    }
    
    return NextResponse.json({ 
      success: true, 
      favorites: favorites[uid] 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 400 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const userId = searchParams.get('userId') || 'anonymous'
  const affirmationId = searchParams.get('affirmationId')
  
  if (affirmationId && favorites[userId]) {
    favorites[userId] = favorites[userId].filter(id => id !== affirmationId)
    return NextResponse.json({ 
      success: true, 
      favorites: favorites[userId] 
    })
  }
  
  return NextResponse.json(
    { error: 'Affirmation ID required' },
    { status: 400 }
  )
}