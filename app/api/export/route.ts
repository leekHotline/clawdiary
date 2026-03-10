import { NextRequest, NextResponse } from 'next/server'

// 导出格式类型
type ExportFormat = 'json' | 'markdown' | 'txt' | 'pdf' | 'html'

// 导出范围
type ExportRange = 'all' | 'selected' | 'dateRange'

interface ExportOptions {
  format: ExportFormat
  range: ExportRange
  startDate?: string
  endDate?: string
  diaryIds?: string[]
  includeImages: boolean
  includeComments: boolean
  includeMood: boolean
  includeTags: boolean
  includeWeather: boolean
}

// 模拟日记数据
const mockDiaries = [
  {
    id: '1',
    title: '美好的一天',
    content: '今天阳光明媚，心情很好...',
    mood: 'happy',
    weather: 'sunny',
    tags: ['生活', '开心'],
    createdAt: '2024-03-01T10:00:00Z',
    images: ['/images/photo1.jpg']
  },
  {
    id: '2',
    title: '工作感悟',
    content: '今天学到了很多新知识...',
    mood: 'neutral',
    weather: 'cloudy',
    tags: ['工作', '学习'],
    createdAt: '2024-03-02T18:30:00Z',
    images: []
  }
]

// 转换为 Markdown 格式
const toMarkdown = (
  diaries: typeof mockDiaries,
  options: ExportOptions
): string => {
  let markdown = '# 我的日记\n\n'
  markdown += `> 导出时间: ${new Date().toLocaleString('zh-CN')}\n\n`
  markdown += `> 共 ${diaries.length} 篇日记\n\n---\n\n`

  diaries.forEach((diary, index) => {
    markdown += `## ${index + 1}. ${diary.title}\n\n`
    markdown += `**日期**: ${new Date(diary.createdAt).toLocaleString('zh-CN')}\n\n`

    if (options.includeMood && diary.mood) {
      markdown += `**心情**: ${diary.mood}\n\n`
    }
    if (options.includeWeather && diary.weather) {
      markdown += `**天气**: ${diary.weather}\n\n`
    }
    if (options.includeTags && diary.tags?.length) {
      markdown += `**标签**: ${diary.tags.join(', ')}\n\n`
    }

    markdown += `### 正文\n\n${diary.content}\n\n`

    if (options.includeImages && diary.images?.length) {
      markdown += `### 图片\n\n`
      diary.images.forEach((img, i) => {
        markdown += `![图片${i + 1}](${img})\n\n`
      })
    }

    markdown += `---\n\n`
  })

  return markdown
}

// 转换为纯文本格式
const toText = (diaries: typeof mockDiaries, options: ExportOptions): string => {
  let text = '我的日记\n'
  text += '='.repeat(50) + '\n\n'
  text += `导出时间: ${new Date().toLocaleString('zh-CN')}\n`
  text += `共 ${diaries.length} 篇日记\n\n`

  diaries.forEach((diary, index) => {
    text += `${index + 1}. ${diary.title}\n`
    text += '-'.repeat(30) + '\n'
    text += `日期: ${new Date(diary.createdAt).toLocaleString('zh-CN')}\n`

    if (options.includeMood && diary.mood) {
      text += `心情: ${diary.mood}\n`
    }
    if (options.includeWeather && diary.weather) {
      text += `天气: ${diary.weather}\n`
    }
    if (options.includeTags && diary.tags?.length) {
      text += `标签: ${diary.tags.join(', ')}\n`
    }

    text += `\n${diary.content}\n\n`
  })

  return text
}

// 转换为 HTML 格式
const toHtml = (diaries: typeof mockDiaries, options: ExportOptions): string => {
  let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>我的日记</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    h1 { color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }
    h2 { color: #444; margin-top: 30px; }
    .meta { color: #666; font-size: 0.9em; margin-bottom: 10px; }
    .tag { display: inline-block; background: #e0e0e0; padding: 2px 8px; border-radius: 12px; font-size: 0.8em; margin-right: 5px; }
    .diary { margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
    .content { white-space: pre-wrap; }
    .images { margin-top: 15px; }
    .images img { max-width: 100%; margin-bottom: 10px; border-radius: 8px; }
  </style>
</head>
<body>
  <h1>📔 我的日记</h1>
  <p class="meta">导出时间: ${new Date().toLocaleString('zh-CN')} | 共 ${diaries.length} 篇</p>
`

  diaries.forEach(diary => {
    html += `
  <div class="diary">
    <h2>${diary.title}</h2>
    <div class="meta">
      📅 ${new Date(diary.createdAt).toLocaleString('zh-CN')}
      ${options.includeMood && diary.mood ? ` | 😊 ${diary.mood}` : ''}
      ${options.includeWeather && diary.weather ? ` | 🌤️ ${diary.weather}` : ''}
    </div>
`
    if (options.includeTags && diary.tags?.length) {
      html += `    <div class="tags">${diary.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>\n`
    }
    html += `    <div class="content">${diary.content}</div>\n`
    if (options.includeImages && diary.images?.length) {
      html += `    <div class="images">${diary.images.map(img => `<img src="${img}" alt="日记图片">`).join('')}</div>\n`
    }
    html += `  </div>\n`
  })

  html += `</body></html>`
  return html
}

// GET: 获取导出选项预览
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    // 统计可导出的内容
    const stats = {
      totalDiaries: 42,
      totalImages: 128,
      totalComments: 56,
      dateRange: {
        earliest: '2024-01-01',
        latest: '2024-03-11'
      },
      estimatedSize: {
        json: '2.5 MB',
        markdown: '1.8 MB',
        txt: '1.2 MB',
        html: '2.0 MB',
        pdf: '5.0 MB'
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        formats: [
          { value: 'json', label: 'JSON', description: '结构化数据，适合备份和迁移' },
          { value: 'markdown', label: 'Markdown', description: '纯文本格式，适合阅读和编辑' },
          { value: 'txt', label: '纯文本', description: '最简单的格式，兼容性最好' },
          { value: 'html', label: 'HTML', description: '网页格式，可直接在浏览器查看' },
          { value: 'pdf', label: 'PDF', description: '文档格式，适合打印和分享' }
        ],
        stats
      }
    })
  } catch (error) {
    console.error('获取导出选项失败:', error)
    return NextResponse.json(
      { success: false, error: '获取导出选项失败' },
      { status: 500 }
    )
  }
}

// POST: 执行导出
export async function POST(request: NextRequest) {
  try {
    const body: ExportOptions = await request.json()
    const {
      format = 'markdown',
      range = 'all',
      includeImages = true,
      includeComments = false,
      includeMood = true,
      includeTags = true,
      includeWeather = true
    } = body

    // 获取日记数据（实际从数据库获取）
    let diaries = [...mockDiaries]
    if (range === 'dateRange') {
      // 根据日期筛选
    } else if (range === 'selected' && body.diaryIds) {
      diaries = diaries.filter(d => body.diaryIds!.includes(d.id))
    }

    // 根据格式生成内容
    let content: string
    let mimeType: string
    let filename: string

    switch (format) {
      case 'json':
        content = JSON.stringify(diaries, null, 2)
        mimeType = 'application/json'
        filename = `diaries_${Date.now()}.json`
        break
      case 'markdown':
        content = toMarkdown(diaries, body)
        mimeType = 'text/markdown'
        filename = `diaries_${Date.now()}.md`
        break
      case 'txt':
        content = toText(diaries, body)
        mimeType = 'text/plain'
        filename = `diaries_${Date.now()}.txt`
        break
      case 'html':
        content = toHtml(diaries, body)
        mimeType = 'text/html'
        filename = `diaries_${Date.now()}.html`
        break
      case 'pdf':
        // PDF 需要额外的库支持，这里返回占位
        content = 'PDF export requires additional processing'
        mimeType = 'application/pdf'
        filename = `diaries_${Date.now()}.pdf`
        break
      default:
        content = toMarkdown(diaries, body)
        mimeType = 'text/markdown'
        filename = `diaries_${Date.now()}.md`
    }

    return NextResponse.json({
      success: true,
      data: {
        content,
        mimeType,
        filename,
        size: Buffer.byteLength(content, 'utf-8'),
        diaryCount: diaries.length,
        exportedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('导出日记失败:', error)
    return NextResponse.json(
      { success: false, error: '导出日记失败' },
      { status: 500 }
    )
  }
}