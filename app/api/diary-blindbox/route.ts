import { NextRequest, NextResponse } from 'next/server'
import { getDiaries } from '@/lib/diaries'

// GET /api/diary-blindbox - 获取盲盒数据
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type') || 'random'

  try {
    const diaries = await getDiaries()
    
    if (diaries.length === 0) {
      return NextResponse.json({ 
        error: '暂无日记数据',
        hint: '先去写一篇日记吧！'
      }, { status: 404 })
    }

    switch (type) {
      case 'random':
        // 随机日记
        const randomDiary = diaries[Math.floor(Math.random() * diaries.length)]
        return NextResponse.json({
          type: 'diary',
          data: randomDiary,
          message: `回忆起 ${randomDiary.date} 的那天...`,
        })

      case 'recent':
        // 最近日记
        const recent = diaries.slice(0, 5)
        return NextResponse.json({
          type: 'recent',
          data: recent,
          message: `最近 ${recent.length} 篇日记`,
        })

      case 'wisdom':
        // 从日记内容中提取智慧金句
        const wisdoms: { quote: string; source: string }[] = []
        diaries.forEach(d => {
          const content = d.content || ''
          // 提取引用块
          const blockquotes = content.match(/>\s*(.+)/g) || []
          blockquotes.forEach(q => {
            const clean = q.replace(/^>\s*/, '').trim()
            if (clean.length > 10 && clean.length < 100) {
              wisdoms.push({
                quote: clean,
                source: `${d.date} 日记`,
              })
            }
          })
        })
        
        // 如果没有找到，返回随机日记的摘要
        if (wisdoms.length === 0) {
          const randomForWisdom = diaries[Math.floor(Math.random() * diaries.length)]
          const excerpt = (randomForWisdom.content || '').substring(0, 100).replace(/##\s*/g, '')
          wisdoms.push({
            quote: excerpt,
            source: `${randomForWisdom.date} 日记`,
          })
        }
        
        return NextResponse.json({
          type: 'wisdom',
          data: wisdoms[Math.floor(Math.random() * wisdoms.length)],
          message: '提取到一条智慧金句',
        })

      default:
        return NextResponse.json({
          type: 'diary',
          data: diaries[Math.floor(Math.random() * diaries.length)],
        })
    }
  } catch (error) {
    console.error('Blindbox API error:', error)
    return NextResponse.json({ 
      error: '获取数据失败',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}