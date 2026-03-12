import { NextRequest, NextResponse } from 'next/server';

// 字数趋势 API - 日均字数变化曲线
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const period = searchParams.get('period') || 'month'; // week, month, year

  let data: any[];

  switch (period) {
    case 'week':
      data = generateWeekData();
      break;
    case 'year':
      data = generateYearData();
      break;
    default:
      data = generateMonthData();
  }

  // 计算统计数据
  const stats = {
    total: data.reduce((sum, d) => sum + d.wordCount, 0),
    average: Math.round(data.reduce((sum, d) => sum + d.wordCount, 0) / data.length),
    max: Math.max(...data.map(d => d.wordCount)),
    min: Math.min(...data.map(d => d.wordCount)),
    trend: calculateTrend(data)
  };

  // 字数区间分布
  const distribution = {
    short: data.filter(d => d.wordCount < 200).length,      // < 200 字
    medium: data.filter(d => d.wordCount >= 200 && d.wordCount < 500).length, // 200-500 字
    long: data.filter(d => d.wordCount >= 500 && d.wordCount < 1000).length,  // 500-1000 字
    epic: data.filter(d => d.wordCount >= 1000).length       // > 1000 字
  };

  return NextResponse.json({
    success: true,
    data: {
      timeline: data,
      stats,
      distribution,
      period,
      insights: generateInsights(stats, distribution)
    }
  });
}

function generateWeekData() {
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  return days.map((day, index) => ({
    date: day,
    wordCount: 200 + Math.floor(Math.random() * 600),
    entryCount: Math.floor(Math.random() * 3) + 1,
    dayOfWeek: index
  }));
}

function generateMonthData() {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      wordCount: 150 + Math.floor(Math.random() * 700) + (Math.random() > 0.7 ? 200 : 0),
      entryCount: Math.floor(Math.random() * 3) + 1,
      dayOfWeek: date.getDay()
    });
  }
  return data;
}

function generateYearData() {
  const months = ['一月', '二月', '三月', '四月', '五月', '六月', 
                 '七月', '八月', '九月', '十月', '十一月', '十二月'];
  return months.map((month, index) => ({
    date: month,
    wordCount: 3000 + Math.floor(Math.random() * 5000) + (index >= 6 ? 1000 : 0),
    entryCount: 20 + Math.floor(Math.random() * 15),
    month: index + 1
  }));
}

function calculateTrend(data: any[]) {
  if (data.length < 2) return 'stable';
  
  const recent = data.slice(-7);
  const previous = data.slice(-14, -7);
  
  const recentAvg = recent.reduce((sum, d) => sum + d.wordCount, 0) / recent.length;
  const previousAvg = previous.length > 0 
    ? previous.reduce((sum, d) => sum + d.wordCount, 0) / previous.length 
    : recentAvg;
  
  const change = (recentAvg - previousAvg) / previousAvg;
  
  if (change > 0.1) return 'rising';
  if (change < -0.1) return 'falling';
  return 'stable';
}

function generateInsights(stats: any, distribution: any) {
  const insights = [];
  
  if (stats.trend === 'rising') {
    insights.push('📈 字数趋势上升，写作热情高涨！');
  } else if (stats.trend === 'falling') {
    insights.push('📉 最近字数有所下降，需要激励自己吗？');
  } else {
    insights.push('📊 写作量稳定，保持规律是好习惯');
  }
  
  if (distribution.epic > distribution.short * 2) {
    insights.push('📝 你喜欢写长文，表达细腻深入');
  } else if (distribution.short > distribution.epic * 2) {
    insights.push('✨ 简短记录风格，重在坚持');
  } else {
    insights.push('📚 长短结合，张弛有度');
  }
  
  insights.push(`🏆 最高纪录: ${stats.max} 字，继续突破！`);
  
  return insights;
}