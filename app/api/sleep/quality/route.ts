import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Demo sleep quality assessment
  const assessment = {
    overallScore: 72,
    grade: 'B',
    dimensions: {
      duration: {
        score: 75,
        status: 'good',
        target: 8,
        actual: 7.4,
        message: '睡眠时长接近目标，建议再增加0.6小时',
      },
      consistency: {
        score: 65,
        status: 'fair',
        variance: '1.5h',
        message: '入睡时间波动较大，建议保持规律作息',
      },
      quality: {
        score: 72,
        status: 'good',
        average: 3.6,
        message: '睡眠质量良好，继续保持',
      },
      efficiency: {
        score: 80,
        status: 'excellent',
        ratio: 0.92,
        message: '睡眠效率很高，入睡快，醒来精神好',
      },
      timing: {
        score: 68,
        status: 'fair',
        optimalBedtime: '23:00',
        actualBedtime: '23:45',
        message: '入睡时间偏晚，建议提前45分钟',
      },
    },
    recommendations: [
      {
        priority: 'high',
        title: '提前入睡时间',
        description: '建议在23:00前入睡，这样可以更好地配合生物钟',
        impact: '可能提高睡眠质量15%',
      },
      {
        priority: 'medium',
        title: '减少睡前屏幕时间',
        description: '睡前1小时避免使用手机和电脑',
        impact: '可能缩短入睡时间10分钟',
      },
      {
        priority: 'medium',
        title: '保持规律作息',
        description: '周末和工作日保持相似的睡眠时间',
        impact: '可能提高睡眠效率10%',
      },
      {
        priority: 'low',
        title: '优化睡眠环境',
        description: '保持卧室温度18-22°C，使用遮光窗帘',
        impact: '可能提高睡眠质量5%',
      },
    ],
    goals: [
      { goal: '连续7天早睡', progress: 3, target: 7 },
      { goal: '平均睡眠达到8小时', progress: 7.4, target: 8 },
      { goal: '睡眠质量达到4星', progress: 3.6, target: 4 },
    ],
    generatedAt: new Date().toISOString(),
  };
  
  return NextResponse.json(assessment);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { date, factors } = body;
    
    // Calculate quality based on factors
    let score = 50; // base score
    
    if (factors?.includes('冥想')) score += 10;
    if (factors?.includes('运动')) score += 8;
    if (factors?.includes('早睡')) score += 12;
    if (factors?.includes('手机')) score -= 10;
    if (factors?.includes('咖啡')) score -= 8;
    if (factors?.includes('压力')) score -= 15;
    
    score = Math.max(0, Math.min(100, score));
    
    return NextResponse.json({
      score,
      grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F',
      date,
      analyzedAt: new Date().toISOString(),
    });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Failed to assess sleep quality' },
      { status: 500 }
    );
  }
}