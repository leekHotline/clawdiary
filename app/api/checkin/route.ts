import { NextResponse } from 'next/server'

// 签到记录类型
interface CheckInRecord {
  id: string
  date: string
  userId: string
  points: number
  continuousDays: number
  totalDays: number
  bonus: string | null
  createdAt: string
}

// 签到奖励配置
const CHECKIN_CONFIG = {
  basePoints: 10,
  continuousBonus: [
    { days: 7, points: 50, name: '周坚持奖励' },
    { days: 14, points: 100, name: '双周坚持奖励' },
    { days: 30, points: 300, name: '月坚持奖励' },
    { days: 60, points: 600, name: '双月坚持奖励' },
    { days: 100, points: 1000, name: '百日坚持奖励' },
    { days: 365, points: 5000, name: '年度坚持奖励' },
  ],
  specialDays: [
    { month: 1, day: 1, points: 100, name: '新年快乐' },
    { month: 2, day: 14, points: 50, name: '情人节' },
    { month: 5, day: 1, points: 50, name: '劳动节' },
    { month: 10, day: 1, points: 100, name: '国庆节' },
    { month: 12, day: 25, points: 50, name: '圣诞节' },
  ],
}

// 生成模拟签到数据
const generateCheckInData = () => {
  const records: CheckInRecord[] = []
  const today = new Date()
  
  // 生成过去30天的签到记录
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // 随机跳过一些天（模拟非连续签到）
    if (i > 7 && Math.random() < 0.3) continue
    
    const continuousDays = i === 0 ? 7 : Math.floor(Math.random() * 10) + 1
    const isSpecialDay = CHECKIN_CONFIG.specialDays.some(
      s => s.month === date.getMonth() + 1 && s.day === date.getDate()
    )
    
    records.push({
      id: `checkin_${date.toISOString().split('T')[0]}`,
      date: date.toISOString().split('T')[0],
      userId: 'default',
      points: CHECKIN_CONFIG.basePoints + (isSpecialDay ? 50 : 0),
      continuousDays,
      totalDays: records.length + 1,
      bonus: isSpecialDay ? CHECKIN_CONFIG.specialDays.find(
        s => s.month === date.getMonth() + 1 && s.day === date.getDate()
      )?.name || null : null,
      createdAt: date.toISOString(),
    })
  }
  
  return records.reverse()
}

// GET - 获取签到信息
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || 'default'
  const action = searchParams.get('action')

  const records = generateCheckInData()
  const today = new Date().toISOString().split('T')[0]
  const todayRecord = records.find(r => r.date === today)
  const latestRecord = records[records.length - 1]

  // 签到日历数据
  const calendarData = records.slice(-30).map(r => ({
    date: r.date,
    checked: true,
    points: r.points,
  }))

  // 填充未签到的日期
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    if (!calendarData.find(d => d.date === dateStr)) {
      calendarData.push({
        date: dateStr,
        checked: false,
        points: 0,
      })
    }
  }

  // 排序
  calendarData.sort((a, b) => a.date.localeCompare(b.date))

  // 统计数据
  const stats = {
    totalPoints: records.reduce((sum, r) => sum + r.points, 0),
    totalDays: records.length,
    currentStreak: latestRecord?.continuousDays || 0,
    maxStreak: Math.max(...records.map(r => r.continuousDays)),
    thisMonth: records.filter(r => {
      const d = new Date(r.date)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length,
  }

  // 今日是否已签到
  if (action === 'check') {
    return NextResponse.json({
      success: true,
      data: {
        hasCheckedIn: !!todayRecord,
        todayPoints: todayRecord?.points || 0,
        continuousDays: latestRecord?.continuousDays || 0,
      }
    })
  }

  // 排行榜数据
  if (action === 'leaderboard') {
    return NextResponse.json({
      success: true,
      data: {
        leaderboard: [
          { rank: 1, userId: 'user_1', userName: '星辰大海', avatar: '🌟', continuousDays: 156, totalDays: 280 },
          { rank: 2, userId: 'user_2', userName: '月光诗人', avatar: '🌙', continuousDays: 98, totalDays: 245 },
          { rank: 3, userId: 'user_3', userName: '森林精灵', avatar: '🌲', continuousDays: 67, totalDays: 189 },
          { rank: 4, userId: 'user_4', userName: '海洋之心', avatar: '🌊', continuousDays: 45, totalDays: 156 },
          { rank: 5, userId: 'default', userName: '我', avatar: '🦞', continuousDays: stats.currentStreak, totalDays: stats.totalDays },
        ]
      }
    })
  }

  return NextResponse.json({
    success: true,
    data: {
      hasCheckedIn: !!todayRecord,
      todayRecord,
      records: records.slice(-10),
      calendar: calendarData,
      stats,
      config: CHECKIN_CONFIG,
      nextBonus: CHECKIN_CONFIG.continuousBonus.find(
        b => b.days > (stats.currentStreak || 0)
      ) || null,
    }
  })
}

// POST - 执行签到
export async function POST(request: Request) {
  const body = await request.json()
  const { userId = 'default' } = body

  const today = new Date().toISOString().split('T')[0]
  const records = generateCheckInData()
  const todayRecord = records.find(r => r.date === today)

  if (todayRecord) {
    return NextResponse.json({
      success: false,
      error: '今日已签到',
      data: { alreadyCheckedIn: true }
    }, { status: 400 })
  }

  // 计算签到奖励
  const latestRecord = records[records.length - 1]
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().split('T')[0]
  
  const isContinuous = latestRecord?.date === yesterdayStr
  const continuousDays = isContinuous ? (latestRecord?.continuousDays || 0) + 1 : 1
  
  let points = CHECKIN_CONFIG.basePoints
  let bonusName: string | null = null

  // 检查连续签到奖励
  const continuousBonus = CHECKIN_CONFIG.continuousBonus.find(b => b.days === continuousDays)
  if (continuousBonus) {
    points += continuousBonus.points
    bonusName = continuousBonus.name
  }

  // 检查特殊节日
  const now = new Date()
  const specialDay = CHECKIN_CONFIG.specialDays.find(
    s => s.month === now.getMonth() + 1 && s.day === now.getDate()
  )
  if (specialDay) {
    points += specialDay.points
    bonusName = specialDay.name
  }

  // 创建新签到记录
  const newRecord: CheckInRecord = {
    id: `checkin_${today}`,
    date: today,
    userId,
    points,
    continuousDays,
    totalDays: records.length + 1,
    bonus: bonusName,
    createdAt: new Date().toISOString(),
  }

  return NextResponse.json({
    success: true,
    data: {
      record: newRecord,
      message: bonusName 
        ? `签到成功！获得 ${points} 积分（${bonusName}奖励）` 
        : `签到成功！获得 ${points} 积分`,
      isMilestone: !!continuousBonus,
      milestone: continuousBonus || null,
    }
  })
}