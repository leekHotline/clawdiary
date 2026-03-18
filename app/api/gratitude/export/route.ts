import { NextRequest, NextResponse } from 'next/server'

// Gratitude export functionality
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const format = searchParams.get('format') || 'json'
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  
  // Mock export data
  const exportData = {
    exportDate: new Date().toISOString(),
    dateRange: {
      start: startDate || '2025-01-01',
      end: endDate || new Date().toISOString().split('T')[0]
    },
    totalEntries: 50,
    entries: generateMockEntries()
  }
  
  if (format === 'csv') {
    const csv = convertToCSV(exportData.entries)
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="gratitude-journal.csv"'
      }
    })
  }
  
  if (format === 'txt') {
    const txt = convertToText(exportData.entries)
    return new NextResponse(txt, {
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': 'attachment; filename="gratitude-journal.txt"'
      }
    })
  }
  
  return NextResponse.json(exportData)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { format, entries, includeReflections } = body
    
    let content = ''
    let filename = ''
    let contentType = ''
    
    switch (format) {
      case 'csv':
        content = convertToCSV(entries)
        filename = 'gratitude-journal.csv'
        contentType = 'text/csv'
        break
      case 'txt':
        content = convertToText(entries, includeReflections)
        filename = 'gratitude-journal.txt'
        contentType = 'text/plain'
        break
      case 'pdf':
        // PDF would need a library like pdfkit
        return NextResponse.json({
          error: 'PDF export requires additional setup',
          alternative: 'Use CSV or TXT format'
        }, { status: 400 })
      default:
        content = JSON.stringify(entries, null, 2)
        filename = 'gratitude-journal.json'
        contentType = 'application/json'
    }
    
    return new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch {
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 400 }
    )
  }
}

function generateMockEntries() {
  const entries = []
  const today = new Date()
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    entries.push({
      date: date.toISOString().split('T')[0],
      items: [
        '今天阳光很好',
        '吃到了美味的早餐',
        '和朋友聊天很开心'
      ],
      mood: 4 + Math.floor(Math.random() * 3),
      reflection: '今天是个美好的一天，感恩生活中的小确幸。'
    })
  }
  
  return entries
}

function convertToCSV(entries: any[]) {
  const headers = ['日期', '心情', '感恩事项1', '感恩事项2', '感恩事项3', '感悟']
  const rows = entries.map(e => [
    e.date,
    e.mood,
    e.items[0] || '',
    e.items[1] || '',
    e.items[2] || '',
    `"${(e.reflection || '').replace(/"/g, '""')}"`
  ])
  
  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
}

function convertToText(entries: any[], includeReflections = true) {
  const lines = entries.map(e => {
    let text = `\n${'='.repeat(40)}\n`
    text += `日期: ${e.date}\n`
    text += `心情: ${['😢', '😕', '😐', '🙂', '😊', '😄', '🥰'][e.mood] || '😐'}\n`
    text += `\n感恩的事:\n`
    e.items.forEach((item: string, i: number) => {
      text += `  ${i + 1}. ${item}\n`
    })
    if (includeReflections && e.reflection) {
      text += `\n感悟:\n${e.reflection}\n`
    }
    return text
  })
  
  return `感恩日记\n导出时间: ${new Date().toLocaleDateString('zh-CN')}\n${lines.join('')}`
}