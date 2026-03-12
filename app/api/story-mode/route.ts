import { NextRequest, NextResponse } from 'next/server'

// Mock diaries data
const diaries = [
  {
    id: '1',
    date: '2026-03-12',
    title: '春日漫步',
    content: '今天阳光很好，在公园里走了很久。樱花开始开放，空气中弥漫着淡淡的花香。遇到了一只可爱的小猫，它主动过来蹭我的腿，那一刻心情特别好。',
    mood: 'happy',
    tags: ['春天', '散步', '猫咪'],
    wordCount: 356
  },
  {
    id: '2',
    date: '2026-03-11',
    title: '咖啡馆的下午',
    content: '在街角的咖啡馆坐了一下午，点了一杯拿铁，看着窗外来来往往的人群。有时候，静静地看着世界运转也是一种享受。',
    mood: 'calm',
    tags: ['咖啡', '下午', '放松'],
    wordCount: 289
  },
  {
    id: '3',
    date: '2026-03-10',
    title: '完成了一个项目',
    content: '终于完成了这个月的重要项目！虽然过程很辛苦，但看到成果的那一刻，所有的疲惫都消失了。晚上和朋友一起庆祝，我们聊了很多关于未来的计划。',
    mood: 'excited',
    tags: ['工作', '成就', '庆祝'],
    wordCount: 428
  },
  {
    id: '4',
    date: '2026-03-09',
    title: '旅行计划',
    content: '终于确定了去日本的旅行计划，四月樱花季出发！开始期待樱花树下的漫步，还有各种美食。',
    mood: 'excited',
    tags: ['旅行', '日本', '樱花'],
    wordCount: 156
  },
  {
    id: '5',
    date: '2026-03-08',
    title: '朋友的惊喜',
    content: '朋友给我准备了一个惊喜派对，完全没想到！被朋友包围的感觉真好，感谢有这样的朋友。',
    mood: 'happy',
    tags: ['朋友', '惊喜', '派对'],
    wordCount: 234
  }
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('mode') || 'timeline'
  const limit = parseInt(searchParams.get('limit') || '10')

  let result = []

  switch (mode) {
    case 'timeline':
      // 按时间顺序返回日记
      result = [...diaries]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit)
      break

    case 'mood':
      // 按心情分组返回日记
      const moodGroups: Record<string, typeof diaries> = {}
      diaries.forEach(diary => {
        if (!moodGroups[diary.mood]) {
          moodGroups[diary.mood] = []
        }
        moodGroups[diary.mood].push(diary)
      })
      result = Object.entries(moodGroups).map(([mood, diaries]) => ({
        mood,
        count: diaries.length,
        diaries: diaries.slice(0, 5)
      }))
      break

    case 'highlights':
      // 返回精选日记（根据情感分数、字数等）
      result = diaries
        .map(diary => ({
          ...diary,
          score: Math.floor(Math.random() * 20) + 80, // 模拟评分
          highlightReason: '高情感分数 · 丰富的感官描写'
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
      break

    case 'random':
      // 随机返回一篇日记
      const randomIndex = Math.floor(Math.random() * diaries.length)
      result = [diaries[randomIndex]]
      break

    default:
      result = diaries.slice(0, limit)
  }

  return NextResponse.json({
    success: true,
    data: result,
    meta: {
      mode,
      total: diaries.length,
      returned: result.length
    }
  })
}