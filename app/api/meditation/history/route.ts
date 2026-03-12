import { NextRequest, NextResponse } from 'next/server';

// Mock data generator
const generateMockData = () => {
  const meditations: any[] = [];
  const types = ['mindfulness', 'breathing', 'guided', 'body-scan', 'loving-kindness', 'walking', 'zen'];
  const moods = ['calm', 'refreshed', 'focused', 'relaxed', 'peaceful', 'energized', 'grateful', 'neutral'];
  const techniques = ['深呼吸', '数息法', '观呼吸', '身体觉察', '念头观察', '慈悲观'];
  const notes = [
    '阳光透过窗帘洒进来，感受呼吸的节奏',
    '从纷乱的思绪中回到当下',
    '身体逐渐放松，内心平静',
    '为家人送上祝福，内心充满温暖',
    '感受每一步的落地，与大地连接',
    '专注呼吸，放下杂念'
  ];
  
  for (let i = 0; i < 45; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    if (Math.random() > 0.4) {
      meditations.push({
        id: `history-${i}`,
        title: ['清晨冥想', '午后放松', '睡前静心', '周末深度冥想'][Math.floor(Math.random() * 4)],
        type: types[Math.floor(Math.random() * types.length)],
        duration: Math.floor(Math.random() * 40) + 10,
        date: date.toISOString().split('T')[0],
        mood: moods[Math.floor(Math.random() * moods.length)],
        notes: notes[Math.floor(Math.random() * notes.length)],
        focus_level: Math.floor(Math.random() * 5) + 5,
        techniques: techniques.slice(0, Math.floor(Math.random() * 3) + 1),
        created_at: date.toISOString()
      });
    }
  }
  
  return meditations;
};

// GET - Meditation history with filters
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const mood = searchParams.get('mood');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const limit = parseInt(searchParams.get('limit') || '100');
  
  // Get or generate meditations
  let meditations = globalThis.meditationsData || generateMockData();
  
  // Apply filters
  if (type) {
    meditations = meditations.filter((m: any) => m.type === type);
  }
  
  if (mood) {
    meditations = meditations.filter((m: any) => m.mood === mood);
  }
  
  if (startDate) {
    meditations = meditations.filter((m: any) => new Date(m.date) >= new Date(startDate));
  }
  
  if (endDate) {
    meditations = meditations.filter((m: any) => new Date(m.date) <= new Date(endDate));
  }
  
  // Sort by date descending
  meditations.sort((a: any, b: any) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Apply limit
  const total = meditations.length;
  meditations = meditations.slice(0, limit);
  
  return NextResponse.json({
    meditations,
    total,
    filters: { type, mood, startDate, endDate }
  });
}