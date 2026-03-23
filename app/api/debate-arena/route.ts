import { NextRequest, NextResponse } from 'next/server'

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY
const API_BASE = process.env.DEEPSEEK_API_KEY ? 'https://api.deepseek.com' : 'https://api.openai.com/v1'
const MODEL = process.env.DEEPSEEK_API_KEY ? 'deepseek-chat' : 'gpt-4o-mini'

interface DebateRequest {
  topic: string
  stance: 'pro' | 'con' | 'neutral'
  perspective: 'pro' | 'con' | 'judge'
  context: string
}

const PERSPECTIVE_PROMPTS = {
  pro: `你是一位善于发现机会和积极面的辩论者。你的任务是：
1. 给出支持这个决定的强有力论点（3-4个）
2. 分析这样做的好处和机会
3. 提供成功案例或类比
4. 用乐观但有理有据的语气
5. 保持在150字以内，简洁有力

注意：要真实可信，不要过度美化，承认风险但强调收益。`,

  con: `你是一位谨慎的批判性思考者。你的任务是：
1. 给出反对这个决定的论点（3-4个）
2. 分析潜在风险和代价
3. 提醒可能被忽视的问题
4. 用严肃但建设性的语气
5. 保持在150字以内，简洁有力

注意：要客观理性，不要过度悲观，承认好处但强调风险。`,

  judge: `你是一位睿智的裁判，需要给出平衡的总结。你的任务是：
1. 总结正反双方最有说服力的论点
2. 分析这个决定的关键因素
3. 给出具体可行的建议
4. 帮助提问者思考下一步
5. 保持在200字以内

语气要公正、有洞察力，帮助提问者做出更明智的选择。`
}

export async function POST(request: NextRequest) {
  try {
    const body: DebateRequest = await request.json()
    const { topic, stance, perspective, context } = body

    if (!topic) {
      return NextResponse.json({ error: '话题不能为空' }, { status: 400 })
    }

    const systemPrompt = PERSPECTIVE_PROMPTS[perspective]
    
    const userPrompt = perspective === 'judge'
      ? `话题：${topic}
用户初步立场：${stance === 'pro' ? '支持' : stance === 'con' ? '反对' : '中立/犹豫'}

辩论记录：
${context || '（暂无）'}

请作为裁判给出你的总结和建议。`
      : `话题：${topic}
用户初步立场：${stance === 'pro' ? '支持' : stance === 'con' ? '反对' : '中立/犹豫'}

${context ? `之前的辩论：\n${context}\n\n请继续提供新的论点。` : '请给出你的第一轮论点。'}`

    const response = await fetch(`${API_BASE}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('API Error:', error)
      return NextResponse.json({ error: 'API 调用失败' }, { status: 500 })
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content || '抱歉，无法生成回复。'

    return NextResponse.json({ response: aiResponse })

  } catch (error) {
    console.error('Debate arena error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}