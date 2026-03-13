import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface Diary {
  id?: number
  date?: string
  title?: string
  mood?: string
  weather?: string
  wordCount?: number
  tags?: string[]
  content?: string
  contentPreview?: string
  fullContent?: string
}

// 数据导出 API
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') || 'json' // json, csv, markdown
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  
  try {
    const dataDir = path.join(process.cwd(), 'data')
    const dayFiles = fs.readdirSync(dataDir)
      .filter(f => f.startsWith('day') && f.endsWith('.ts'))
      .sort((a, b) => {
        const numA = parseInt(a.replace('day', '').replace('.ts', ''))
        const numB = parseInt(b.replace('day', '').replace('.ts', ''))
        return numA - numB
      })

    const diaries: Diary[] = []
    
    dayFiles.forEach(file => {
      const content = fs.readFileSync(path.join(dataDir, file), 'utf-8')
      
      // 解析日记数据
      const diary: Diary = {}
      
      const idMatch = content.match(/id:\s*(\d+)/)
      const dateMatch = content.match(/date:\s*'([^']+)'/)
      const titleMatch = content.match(/title:\s*'([^']+)'/)
      const moodMatch = content.match(/mood:\s*'([^']+)'/)
      const weatherMatch = content.match(/weather:\s*'([^']+)'/)
      const wordCountMatch = content.match(/wordCount:\s*(\d+)/)
      
      if (idMatch) diary.id = parseInt(idMatch[1])
      if (dateMatch) diary.date = dateMatch[1]
      if (titleMatch) diary.title = titleMatch[1]
      if (moodMatch) diary.mood = moodMatch[1]
      if (weatherMatch) diary.weather = weatherMatch[1]
      if (wordCountMatch) diary.wordCount = parseInt(wordCountMatch[1])
      
      // 提取标签
      const tagsMatch = content.match(/tags:\s*\[([\s\S]*?)\]/)
      if (tagsMatch) {
        diary.tags = (tagsMatch[1].match(/'([^']+)'/g) || [])
          .map((t: string) => t.replace(/'/g, ''))
      }
      
      // 提取内容摘要
      const contentMatch = content.match(/content:\s*`([\s\S]*?)`/)
      if (contentMatch) {
        const fullContent = contentMatch[1]
        diary.contentPreview = fullContent.substring(0, 200) + '...'
        diary.fullContent = fullContent
      }
      
      // 日期过滤
      if (startDate && diary.date && diary.date < startDate) return
      if (endDate && diary.date && diary.date > endDate) return
      
      diaries.push(diary)
    })

    // 根据格式返回数据
    if (format === 'csv') {
      const csvHeader = 'ID,日期,标题,心情,天气,字数,标签\n'
      const csvData = diaries.map(d => 
        `${d.id},${d.date},"${d.title}",${d.mood || ''},${d.weather || ''},${d.wordCount || 0},"${(d.tags || []).join(';')}"`
      ).join('\n')
      
      return new NextResponse(csvHeader + csvData, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="diaries_export.csv"'
        }
      })
    }
    
    if (format === 'markdown') {
      const mdContent = diaries.map(d => {
        let md = `## ${d.title}\n\n`
        md += `📅 ${d.date} | ${d.mood || '心情未记录'} | ${d.weather || '天气未记录'}\n\n`
        md += `**标签:** ${(d.tags || []).map((t: string) => `#${t}`).join(' ')}\n\n`
        md += `${d.fullContent || d.contentPreview}\n\n`
        md += `---\n\n`
        return md
      }).join('')
      
      const fullMd = `# 我的日记导出\n\n导出时间: ${new Date().toLocaleString('zh-CN')}\n\n共 ${diaries.length} 篇日记\n\n---\n\n` + mdContent
      
      return new NextResponse(fullMd, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition': 'attachment; filename="diaries_export.md"'
        }
      })
    }
    
    // 默认返回 JSON
    return NextResponse.json({
      success: true,
      data: {
        total: diaries.length,
        exportedAt: new Date().toISOString(),
        format,
        diaries,
        summary: {
          dateRange: {
            start: diaries[0]?.date || null,
            end: diaries[diaries.length - 1]?.date || null
          },
          totalWords: diaries.reduce((sum, d) => sum + (d.wordCount || 0), 0),
          moods: [...new Set(diaries.map(d => d.mood).filter(Boolean))],
          tags: [...new Set(diaries.flatMap(d => d.tags || []))].slice(0, 20),
        }
      }
    })
  } catch (_error) {
    console.error('Export error:', _error)
    return NextResponse.json({ 
      success: false,
      error: '导出失败' 
    }, { status: 500 })
  }
}