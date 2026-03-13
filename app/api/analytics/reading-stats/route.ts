import { NextResponse } from 'next/server'

// 获取单个用户的阅读统计
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || 'default'
  
  try {
    // 模拟用户阅读数据
    const readingStats = {
      totalReadingTime: Math.floor(Math.random() * 5000 + 1000), // 分钟
      totalArticles: Math.floor(Math.random() * 100 + 50),
      avgReadingTime: Math.floor(Math.random() * 20 + 5), // 分钟/篇
      favoriteCategory: ['技术', '生活', '旅行', '美食', '读书'][Math.floor(Math.random() * 5)],
      readingStreak: Math.floor(Math.random() * 30 + 1),
      longestSession: Math.floor(Math.random() * 120 + 30), // 分钟
    }

    // 每周阅读时间
    const weeklyReading = Array.from({ length: 7 }, (_, i) => ({
      day: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i],
      minutes: Math.floor(Math.random() * 60 + 10)
    }))

    // 阅读偏好分析
    const preferences = {
      preferredTime: ['早晨', '上午', '下午', '晚上', '深夜'][Math.floor(Math.random() * 5)],
      preferredDevice: ['手机', '平板', '电脑'][Math.floor(Math.random() * 3)],
      avgScrollDepth: Math.floor(Math.random() * 40 + 60) + '%', // 滚动深度
      bookmarkRate: (Math.random() * 0.3 + 0.1).toFixed(2), // 收藏率
    }

    // 阅读速度估算
    const readingSpeed = {
      wordsPerMinute: Math.floor(Math.random() * 100 + 250),
      comprehension: Math.floor(Math.random() * 20 + 80) + '%',
    }

    // 最近阅读记录
    const recentReads = [
      { title: '如何高效管理时间', duration: 15, date: '2026-03-12' },
      { title: '极简生活指南', duration: 22, date: '2026-03-11' },
      { title: '深度工作', duration: 45, date: '2026-03-10' },
      { title: '番茄工作法实践', duration: 18, date: '2026-03-09' },
    ]

    return NextResponse.json({
      success: true,
      data: {
        userId,
        stats: readingStats,
        weeklyReading,
        preferences,
        readingSpeed,
        recentReads,
        achievements: [
          { id: 1, name: '阅读达人', desc: '累计阅读超过100篇文章', unlocked: readingStats.totalArticles > 100 },
          { id: 2, name: '早起鸟', desc: '连续7天早上阅读', unlocked: Math.random() > 0.5 },
          { id: 3, name: '夜猫子', desc: '深夜阅读超过50次', unlocked: Math.random() > 0.7 },
        ],
        lastUpdated: new Date().toISOString()
      }
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      error: '获取阅读统计失败' 
    }, { status: 500 })
  }
}