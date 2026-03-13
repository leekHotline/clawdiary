import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action } = body;
    
    // In a real app, this would update the database
    // For demo, just return success
    
    return NextResponse.json({
      success: true,
      action,
      habitId: id,
      timestamp: new Date().toISOString(),
    });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to update habit' },
      { status: 500 }
    );
  }
}