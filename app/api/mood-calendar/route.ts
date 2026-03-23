import { NextResponse } from 'next/server';

// 模拟获取月度心情数据
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
  const month = parseInt(searchParams.get('month') || new Date().getMonth().toString());
  
  // 心情类型
  const moods = ['happy', 'calm', 'excited', 'grateful', 'sad', 'anxious', 'angry', 'tired'];
  
  // 生成模拟数据
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const data: Record<string, string> = {};
  
  for (let day = 1; day <= daysInMonth; day++) {
    // 70% 概率有心情记录
    if (Math.random() > 0.3) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      data[dateStr] = moods[Math.floor(Math.random() * moods.length)];
    }
  }
  
  // 统计
  const counts: Record<string, number> = {};
  Object.values(data).forEach(mood => {
    counts[mood] = (counts[mood] || 0) + 1;
  });
  
  return NextResponse.json({
    year,
    month,
    data,
    stats: {
      total: Object.keys(data).length,
      counts,
      topMood: Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null,
    }
  });
}