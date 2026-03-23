import { NextRequest, NextResponse } from 'next/server';

const STYLE_PROMPTS: Record<string, string> = {
  luxun: `你是鲁迅。请用鲁迅的写作风格重写以下文字。

鲁迅风格特点：
- 犀利冷峻，一针见血
- 善用反讽和比喻
- 文白夹杂，古雅中带有白话
- 深刻揭示人性与社会
- 常用"然而"、"可是"、"大抵"、"其实"等转折词
- 语调冷静但内涵炽热

请直接输出重写后的文字，不要解释。`,

  sanmao: `你是三毛。请用三毛的写作风格重写以下文字。

三毛风格特点：
- 浪漫洒脱，自由如风
- 真挚感性，充满异域风情
- 文字优美如诗，情感细腻
- 常有对远方和流浪的向往
- 对生活充满热爱与好奇
- 温柔中带着洒脱

请直接输出重写后的文字，不要解释。`,

  murakami: `你是村上春树。请用村上春树的写作风格重写以下文字。

村上春树风格特点：
- 孤独疏离的氛围
- 独特的隐喻和比喻
- "小确幸"的发现
- 细腻的日常描写
- 常用"某种意义上"、"像是"等表达
- 音乐、猫、咖啡等元素
- 超现实的想象

请直接输出重写后的文字，不要解释。`,

  zhangailing: `你是张爱玲。请用张爱玲的写作风格重写以下文字。

张爱玲风格特点：
- 华丽苍凉，洞彻人心
- 精致细腻的感官描写
- 犀利但不失优雅的心理刻画
- 常用颜色、服饰等意象
- 对人情世故的透彻洞察
- 华美的文字下是苍凉的底色

请直接输出重写后的文字，不要解释。`,

  wangxiaobo: `你是王小波。请用王小波的写作风格重写以下文字。

王小波风格特点：
- 黑色幽默，特立独行
- 荒诞但富有智慧
- 理性中的浪漫
- 独特的比喻和想象
- 对自由的向往
- 幽默中带着深刻
- 直白但不粗俗

请直接输出重写后的文字，不要解释。`,

  muyan: `你是莫言。请用莫言的写作风格重写以下文字。

莫言风格特点：
- 魔幻现实主义
- 浓郁的乡土气息
- 感官描写丰富，尤其嗅觉、味觉
- 狂野奔放的想象
- 民间传说与现实交织
- 浓烈的色彩感
- 时间与空间的自由转换

请直接输出重写后的文字，不要解释。`,

  guocheng: `你是郭敬明。请用郭敬明的写作风格重写以下文字。

郭敬明风格特点：
- 华丽忧伤的文字
- 青春疼痛的主题
- 精致的意象堆叠
- 时光、记忆、青春等主题
- 浮华但感性
- 大量使用比喻和排比
- 忧伤唯美的氛围

请直接输出重写后的文字，不要解释。`,

  haizi: `你是海子。请用海子的写作风格重写以下文字。

海子风格特点：
- 纯粹热烈，诗意栖居
- 麦地、太阳、大海等意象
- 对理想和纯粹的追求
- 热情奔放的表达
- 诗歌化的散文
- 明亮而热烈的情感
- 对生命本真的追问

请直接输出重写后的文字，不要解释。`,
};

export async function POST(request: NextRequest) {
  try {
    const { text, styleId, styleName, traits } = await request.json();

    if (!text || !styleId) {
      return NextResponse.json({ error: '缺少必要参数' }, { status: 400 });
    }

    const systemPrompt = STYLE_PROMPTS[styleId];
    
    if (!systemPrompt) {
      return NextResponse.json({ error: '未知风格' }, { status: 400 });
    }

    // 检查是否有 AI API 配置
    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      // 返回离线结果
      const offlineResult = generateOfflineResult(text, styleId, styleName, traits);
      return NextResponse.json(offlineResult);
    }

    // 使用 AI API
    const apiEndpoint = process.env.DEEPSEEK_API_KEY 
      ? 'https://api.deepseek.com/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions';

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_API_KEY ? 'deepseek-chat' : 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const offlineResult = generateOfflineResult(text, styleId, styleName, traits);
      return NextResponse.json(offlineResult);
    }

    const data = await response.json();
    const transformedText = data.choices?.[0]?.message?.content || text;

    // 生成风格洞察
    const insights = generateInsights(styleName, traits, text, transformedText);

    return NextResponse.json({
      originalText: text,
      transformedText,
      style: {
        id: styleId,
        name: styleName,
        traits,
      },
      insights,
    });
  } catch (error) {
    console.error('Style alchemist error:', error);
    return NextResponse.json({ error: '转换失败' }, { status: 500 });
  }
}

function generateOfflineResult(text: string, styleId: string, styleName: string, traits: string[]) {
  // 简单的离线转换逻辑
  const styleAdditions: Record<string, { prefix: string; suffix: string }> = {
    luxun: { prefix: '我想，', suffix: '——这大约就是所谓的人生罢。' },
    sanmao: { prefix: '记得那天的阳光正好，', suffix: '人生就是这样，走着走着就懂了。' },
    murakami: { prefix: '在某种意义上，', suffix: '这或许就是某种宿命。' },
    zhangailing: { prefix: '生命是一袭华美的袍，', suffix: '——可是谁又真正懂得谁呢。' },
    wangxiaobo: { prefix: '说来有趣，', suffix: '——这大概就是生活的荒诞之处。' },
    muyan: { prefix: '那是个炎热的下午，', suffix: '——就像土地知道的一切那样。' },
    guocheng: { prefix: '如果时间可以倒流，', suffix: '那些念念不忘的，就这样遗忘了。' },
    haizi: { prefix: '从明天起，', suffix: '——面朝大海，春暖花开。' },
  };

  const addition = styleAdditions[styleId] || styleAdditions.luxun;
  let transformed = text;
  
  // 简单处理
  if (!text.startsWith(addition.prefix.substring(0, 4))) {
    transformed = addition.prefix + transformed;
  }
  transformed = transformed.replace(/[。！？]?$/, '') + '。' + addition.suffix;

  return {
    originalText: text,
    transformedText: transformed,
    style: { id: styleId, name: styleName, traits },
    insights: generateInsights(styleName, traits, text, transformed),
  };
}

function generateInsights(styleName: string, traits: string[], original: string, transformed: string): string[] {
  const insights = [
    `${styleName}的风格特点：${traits.join('、')}`,
    `原文${original.length}字 → 转换后${transformed.length}字`,
  ];
  
  if (transformed.length > original.length * 1.2) {
    insights.push('风格注入增加了文字的文学性和细节描写');
  }
  
  insights.push(`建议：多读${styleName}的作品，体会其独特的表达方式`);
  
  return insights;
}