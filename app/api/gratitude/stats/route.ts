import { NextRequest, NextResponse } from 'next/server'

// Gratitude statistics and analytics
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const userId = searchParams.get('userId')
  const range = searchParams.get('range') || 'month'
  
  // Generate comprehensive statistics
  const stats = {
    overview: {
      totalEntries: Math.floor(Math.random() * 200) + 50,
      totalItems: Math.floor(Math.random() * 600) + 150,
      currentStreak: Math.floor(Math.random() * 30) + 1,
      longestStreak: Math.floor(Math.random() * 90) + 7,
      averageItemsPerEntry: (Math.random() * 2 + 2.5).toFixed(1)
    },
    
    moodAnalysis: {
      average: (Math.random() * 2 + 3.5).toFixed(1),
      distribution: {
        '😢': Math.floor(Math.random() * 10) + 2,
        '😕': Math.floor(Math.random() * 15) + 5,
        '😐': Math.floor(Math.random() * 20) + 10,
        '🙂': Math.floor(Math.random() * 30) + 20,
        '😊': Math.floor(Math.random() * 40) + 30,
        '😄': Math.floor(Math.random() * 35) + 25,
        '🥰': Math.floor(Math.random() * 25) + 15
      },
      trend: 'improving' as const
    },
    
    wordCloud: [
      { word: '家人', count: Math.floor(Math.random() * 50) + 20 },
      { word: '健康', count: Math.floor(Math.random() * 40) + 15 },
      { word: '朋友', count: Math.floor(Math.random() * 35) + 12 },
      { word: '阳光', count: Math.floor(Math.random() * 30) + 10 },
      { word: '美食', count: Math.floor(Math.random() * 25) + 8 },
      { word: '工作', count: Math.floor(Math.random() * 20) + 6 },
      { word: '学习', count: Math.floor(Math.random() * 18) + 5 },
      { word: '自然', count: Math.floor(Math.random() * 15) + 4 }
    ],
    
    weeklyProgress: generateWeeklyProgress(),
    
    insights: [
      {
        type: 'positive',
        message: '你本周的感恩记录比上周增加了 15%'
      },
      {
        type: 'pattern',
        message: '你通常在晚上记录感恩日记'
      },
      {
        type: 'suggestion',
        message: '尝试在早晨记录感恩，开启美好的一天'
      }
    ],
    
    categoryBreakdown: {
      '人际关系': Math.floor(Math.random() * 30) + 20,
      '健康': Math.floor(Math.random() * 25) + 15,
      '工作': Math.floor(Math.random() * 20) + 10,
      '学习': Math.floor(Math.random() * 18) + 8,
      '自然': Math.floor(Math.random() * 15) + 5,
      '其他': Math.floor(Math.random() * 10) + 3
    }
  }
  
  return NextResponse.json(stats)
}

function generateWeeklyProgress() {
  const data = []
  const today = new Date()
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split('T')[0],
      dayName: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()],
      entries: Math.random() > 0.2 ? 1 : 0,
      items: Math.floor(Math.random() * 5) + 1,
      mood: Math.floor(Math.random() * 7)
    })
  }
  
  return data
}