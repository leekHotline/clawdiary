import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { quote, author, reflection } = await request.json()
    
    if (!quote || !author || !reflection) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 获取 API 配置
    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY
    const apiBase = process.env.DEEPSEEK_API_KEY 
      ? 'https://api.deepseek.com/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions'
    
    if (!apiKey) {
      // 没有API key时返回预设解读
      const insights = [
        `${author}的这句话与你的反思产生了美妙的共鸣。当你思考"${reflection.slice(0, 30)}..."时，实际上是在践行这位哲学家的核心思想。哲学不是遥远的理论，而是日常生活的指南针。`,
        `你的思考展现了深刻的自我觉察。${author}会欣赏你将这句名言内化的方式。每一次真诚的反思，都是与这些伟大思想家的对话。`,
        `这个反思很有价值！${author}的思想在这里找到了现代的回响。继续保持这种思考的习惯，你会发现自己的内心世界越来越丰富。`,
        `你把古人的智慧融入了当下的生活体验。这正是${author}希望我们做的——不是背诵名言，而是让它成为我们生活的一部分。`,
      ]
      
      return NextResponse.json({
        insight: insights[Math.floor(Math.random() * insights.length)]
      })
    }

    // 调用 AI API
    const response = await fetch(apiBase, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_API_KEY ? 'deepseek-chat' : 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `你是一位智慧哲学导师，擅长将古代哲学思想与现代生活连接起来。你的解读温暖、深刻且实用，能够帮助用户将哲学名言与自己的日常体验产生共鸣。
请用中文回答，保持温和友好的语气。回答要简洁有力，不超过200字。`
          },
          {
            role: 'user',
            content: `${author}的名言："${quote}"

用户写下了这样的思考："${reflection}"

请给用户一个温暖的深度解读，帮助他们将这句哲学名言与自己的生活体验更深地连接起来。解读应该：
1. 肯定用户的思考深度
2. 提供一个新的视角或洞见
3. 鼓励用户继续这种反思习惯`
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    })

    if (!response.ok) {
      throw new Error('AI API request failed')
    }

    const data = await response.json()
    const insight = data.choices?.[0]?.message?.content || '暂时无法生成解读，请稍后再试。'

    return NextResponse.json({ insight })
  } catch (error) {
    console.error('Generate insight error:', error)
    return NextResponse.json(
      { error: 'Failed to generate insight' },
      { status: 500 }
    )
  }
}