import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'diaries.ts')
    const fileContent = fs.readFileSync(dataPath, 'utf-8')
    
    // 解析日记数据
    const diariesMatch = fileContent.match(/export const diaries[\s\S]*?=\s*\[([\s\S]*?)\];/)
    if (!diariesMatch) {
      return NextResponse.json({ error: '无法解析日记数据' }, { status: 500 })
    }

    // 读取所有 day 文件
    const dataDir = path.join(process.cwd(), 'data')
    const dayFiles = fs.readdirSync(dataDir).filter(f => f.startsWith('day') && f.endsWith('.ts'))
    
    // 统计标签
    const tagCounts: Record<string, number> = {}
    const moodCounts: Record<string, number> = {}
    const weatherCounts: Record<string, number> = {}
    
    dayFiles.forEach(file => {
      const content = fs.readFileSync(path.join(dataDir, file), 'utf-8')
      
      // 提取标签
      const tagsMatch = content.match(/tags:\s*\[([\s\S]*?)\]/)
      if (tagsMatch) {
        const tags = tagsMatch[1].match(/'([^']+)'/g) || []
        tags.forEach((tag: string) => {
          const cleanTag = tag.replace(/'/g, '')
          tagCounts[cleanTag] = (tagCounts[cleanTag] || 0) + 1
        })
      }
      
      // 提取心情
      const moodMatch = content.match(/mood:\s*'([^']+)'/)
      if (moodMatch) {
        moodCounts[moodMatch[1]] = (moodCounts[moodMatch[1]] || 0) + 1
      }
      
      // 提取天气
      const weatherMatch = content.match(/weather:\s*'([^']+)'/)
      if (weatherMatch) {
        weatherCounts[weatherMatch[1]] = (weatherCounts[weatherMatch[1]] || 0) + 1
      }
    })

    // 排序并取前10
    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }))

    const moodDistribution = Object.entries(moodCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    const weatherDistribution = Object.entries(weatherCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    // 计算连续写作天数
    const dayNumbers = dayFiles
      .map(f => parseInt(f.replace('day', '').replace('.ts', '')))
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b)
    
    let currentStreak = 0
    let maxStreak = 0
    let tempStreak = 0
    
    for (let i = 1; i < dayNumbers.length; i++) {
      if (dayNumbers[i] - dayNumbers[i - 1] === 1) {
        tempStreak++
        maxStreak = Math.max(maxStreak, tempStreak)
      } else {
        tempStreak = 1
      }
    }
    currentStreak = tempStreak || 1

    // 生成洞察
    const insights = []
    
    if (topTags.length > 0) {
      insights.push({
        type: 'tag',
        title: '最常使用的标签',
        content: `你最喜欢用"${topTags[0].name}"标签，共使用了${topTags[0].count}次`,
        icon: '🏷️'
      })
    }
    
    if (moodDistribution.length > 0) {
      insights.push({
        type: 'mood',
        title: '心情分析',
        content: `你最常见的情绪是"${moodDistribution[0].name}"，占比${Math.round(moodDistribution[0].count / dayFiles.length * 100)}%`,
        icon: '😊'
      })
    }
    
    insights.push({
      type: 'streak',
      title: '写作连续性',
      content: `当前连续写作${currentStreak}天，历史最长${maxStreak}天`,
      icon: '🔥'
    })
    
    insights.push({
      type: 'progress',
      title: '写作进度',
      content: `已记录${dayFiles.length}天日记，继续保持！`,
      icon: '📊'
    })

    // 周数据统计
    const weeklyData = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dayNum = Math.floor((date.getTime() - new Date('2026-01-01').getTime()) / (1000 * 60 * 60 * 24))
      const hasEntry = dayFiles.some(f => {
        const num = parseInt(f.replace('day', '').replace('.ts', ''))
        return num === dayNum
      })
      weeklyData.push({
        date: date.toISOString().split('T')[0],
        dayName: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
        hasEntry,
        wordCount: hasEntry ? Math.floor(Math.random() * 500 + 200) : 0
      })
    }

    // 活跃时段分析（模拟数据）
    const hourlyActivity = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: Math.floor(Math.random() * 10)
    }))

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalDiaries: dayFiles.length,
          totalWords: dayFiles.length * 350, // 估算
          currentStreak,
          maxStreak,
          avgWordsPerDay: 350
        },
        topTags,
        moodDistribution,
        weatherDistribution,
        insights,
        weeklyData,
        hourlyActivity,
        writingScore: Math.min(100, Math.floor(dayFiles.length * 1.5 + currentStreak * 2)),
        lastUpdated: new Date().toISOString()
      }
    })
  } catch (_error) {
    console.error('Analytics error:', _error)
    return NextResponse.json({ 
      success: false,
      error: '获取分析数据失败' 
    }, { status: 500 })
  }
}