import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Demo sleep pattern analysis
  const patterns = {
    bedtimePattern: {
      mostCommon: '23:30',
      average: '23:45',
      earliest: '22:00',
      latest: '01:00',
      variance: '1.5h',
    },
    wakeTimePattern: {
      mostCommon: '07:00',
      average: '07:15',
      earliest: '06:00',
      latest: '09:00',
      variance: '1h',
    },
    durationPattern: {
      average: 7.4,
      min: 5.5,
      max: 9,
      target: 8,
      deficit: 0.6,
    },
    weekdayVsWeekend: {
      weekday: {
        avgDuration: 7.2,
        avgBedtime: '23:45',
      },
      weekend: {
        avgDuration: 8.1,
        avgBedtime: '00:30',
      },
    },
    factorsImpact: [
      { factor: '冥想', impact: '+0.5质量', recommendation: '继续保持' },
      { factor: '运动', impact: '+0.3质量', recommendation: '建议下午运动' },
      { factor: '手机', impact: '-0.5质量', recommendation: '睡前1小时避免' },
      { factor: '咖啡', impact: '-0.3质量', recommendation: '下午3点后避免' },
    ],
    circadianRhythm: {
      type: 'nightOwl', // or earlyBird
      optimalBedtime: '23:30',
      optimalWakeTime: '07:30',
      description: '你属于夜猫子型，最佳睡眠时间是23:30-07:30',
    },
    insights: [
      '你的睡眠时间比目标少0.6小时',
      '冥想显著提高了你的睡眠质量',
      '周末睡眠时间比工作日长0.9小时',
      '建议调整作息，减少睡前手机使用',
    ],
    generatedAt: new Date().toISOString(),
  };
  
  return NextResponse.json(patterns);
}