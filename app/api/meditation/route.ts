import { NextRequest, NextResponse } from 'next/server';

// Mock data store (in production, use database)
let meditations: any[] = [
  {
    id: '1',
    title: '清晨正念冥想',
    type: 'mindfulness',
    duration: 20,
    date: '2026-03-12',
    mood: 'calm',
    notes: '阳光透过窗帘洒进来，感受呼吸的节奏，内心非常平静',
    focus_level: 8,
    techniques: ['深呼吸', '观呼吸', '念头观察'],
    created_at: '2026-03-12T06:00:00Z'
  },
  {
    id: '2',
    title: '睡前放松',
    type: 'body-scan',
    duration: 15,
    date: '2026-03-11',
    mood: 'relaxed',
    notes: '从头到脚慢慢放松，感觉身体越来越轻',
    focus_level: 7,
    techniques: ['身体觉察', '深呼吸'],
    created_at: '2026-03-11T22:00:00Z'
  },
  {
    id: '3',
    title: '慈心冥想',
    type: 'loving-kindness',
    duration: 25,
    date: '2026-03-10',
    mood: 'grateful',
    notes: '为家人和朋友送上祝福，内心充满温暖',
    focus_level: 9,
    techniques: ['慈悲观', '持咒'],
    created_at: '2026-03-10T07:30:00Z'
  }
];

// GET - List all meditations
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20');
  
  const sortedMeditations = [...meditations]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  return NextResponse.json({
    meditations: sortedMeditations,
    total: meditations.length
  });
}

// POST - Create new meditation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newMeditation = {
      id: Date.now().toString(),
      title: body.title || '',
      type: body.type || 'mindfulness',
      duration: parseInt(body.duration) || 15,
      date: body.date || new Date().toISOString().split('T')[0],
      mood: body.mood || 'calm',
      notes: body.notes || '',
      focus_level: parseInt(body.focus_level) || 7,
      techniques: body.techniques || [],
      created_at: new Date().toISOString()
    };

    meditations.unshift(newMeditation);

    return NextResponse.json({
      success: true,
      meditation: newMeditation
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create meditation' },
      { status: 500 }
    );
  }
}