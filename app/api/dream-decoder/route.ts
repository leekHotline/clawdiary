import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { dream } = await request.json();

    if (!dream || typeof dream !== 'string') {
      return NextResponse.json({ error: '请提供梦境描述' }, { status: 400 });
    }

    // AI 分析提示词
    const systemPrompt = `你是一位专业的梦境分析师，擅长解读梦境中的符号、情绪和心理暗示。请用温暖、专业的语气分析用户的梦境。

分析框架：
1. 梦境符号：识别主要符号及其象征意义
2. 情绪色彩：梦境中的情绪及其心理含义
3. 核心主题：梦境探讨的主要生命主题
4. 深度解读：结合心理学视角的解读
5. 行动建议：帮助用户理解自我的建议

请以 JSON 格式返回：
{
  "symbols": [
    { "name": "符号名称", "emoji": "表情", "meaning": "象征意义" }
  ],
  "emotion": { "name": "情绪名称", "emoji": "表情", "insight": "心理洞察" },
  "themes": ["主题1", "主题2"],
  "suggestions": ["建议1", "建议2", "建议3"],
  "reflection": "深度解读文字..."
}`;

    const userPrompt = `请分析以下梦境：

"${dream}"

请用中文进行分析，给出专业、温暖、有帮助的解读。`;

    // 尝试调用 AI API
    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
    const apiBase = process.env.DEEPSEEK_API_BASE || 'https://api.deepseek.com';
    
    if (apiKey) {
      try {
        const response = await fetch(`${apiBase}/v1/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            temperature: 0.7,
            response_format: { type: 'json_object' },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          
          if (content) {
            try {
              const parsed = JSON.parse(content);
              return NextResponse.json(parsed);
            } catch {
              // 解析失败，使用离线分析
            }
          }
        }
      } catch (error) {
        console.error('AI API error:', error);
      }
    }

    // 离线分析后备方案
    const offlineAnalysis = performOfflineAnalysis(dream);
    return NextResponse.json(offlineAnalysis);
  } catch (error) {
    console.error('Dream decoder error:', error);
    return NextResponse.json({ error: '分析失败，请稍后重试' }, { status: 500 });
  }
}

function performOfflineAnalysis(dream: string) {
  const lowerDream = dream.toLowerCase();
  
  // 符号库
  const symbolLibrary = [
    { name: '水', emoji: '💧', meaning: '情绪、潜意识、净化、变化', keywords: ['水', '河', '海', '湖', '雨', '泳'] },
    { name: '飞行', emoji: '🦅', meaning: '自由、超越、逃避、雄心', keywords: ['飞', '天空', '飘', '翱翔'] },
    { name: '坠落', emoji: '⬇️', meaning: '失控、焦虑、不安全感', keywords: ['坠落', '掉', '摔', '跌'] },
    { name: '蛇', emoji: '🐍', meaning: '转变、隐藏的力量、恐惧', keywords: ['蛇', '蟒', '毒蛇'] },
    { name: '死亡', emoji: '💀', meaning: '结束、新生、转变', keywords: ['死', '去世', '亡', '葬礼'] },
    { name: '追逃', emoji: '🏃', meaning: '逃避问题、压力、未解决的冲突', keywords: ['追', '逃', '跑', '追赶'] },
    { name: '房子', emoji: '🏠', meaning: '自我、安全感、家庭', keywords: ['房子', '家', '房间', '屋'] },
    { name: '牙齿', emoji: '🦷', meaning: '自我形象焦虑、失去感', keywords: ['牙齿', '牙', '掉牙'] },
    { name: '考试', emoji: '📝', meaning: '压力、自我评估、害怕失败', keywords: ['考试', '考', '试卷', '答题'] },
    { name: '婴儿', emoji: '👶', meaning: '新开始、纯真、创造力', keywords: ['婴儿', '宝宝', '小孩', '新生儿'] },
    { name: '动物', emoji: '🐾', meaning: '本能、直觉、原始自我', keywords: ['动物', '狗', '猫', '鸟', '鱼', '马'] },
    { name: '火', emoji: '🔥', meaning: '激情、愤怒、净化', keywords: ['火', '烧', '火焰', '燃烧'] },
    { name: '树', emoji: '🌳', meaning: '成长、生命力、家族', keywords: ['树', '森林', '树林'] },
    { name: '镜子', emoji: '🪞', meaning: '自我认知、真相、反思', keywords: ['镜子', '镜', '照'] },
  ];

  // 检测到的符号
  const detectedSymbols = symbolLibrary
    .filter(s => s.keywords.some(k => lowerDream.includes(k)))
    .map(s => ({ name: s.name, emoji: s.emoji, meaning: s.meaning }))
    .slice(0, 3);

  // 默认符号
  const symbols = detectedSymbols.length > 0 ? detectedSymbols : [
    { name: '梦境', emoji: '💭', meaning: '潜意识的投射、内心的声音' },
    { name: '旅程', emoji: '🛤️', meaning: '人生道路、探索、成长' },
    { name: '光', emoji: '✨', meaning: '希望、启示、觉醒' },
  ];

  // 情绪检测
  const emotionLibrary = [
    { name: '恐惧', emoji: '😨', insight: '可能反映现实中的焦虑或逃避', keywords: ['害怕', '恐惧', '吓', '惊'] },
    { name: '喜悦', emoji: '😊', insight: '内心深处的渴望得到满足', keywords: ['开心', '快乐', '高兴', '笑'] },
    { name: '困惑', emoji: '😕', insight: '面临选择或方向不明确', keywords: '困惑,迷茫,不知道,不明白' },
    { name: '悲伤', emoji: '😢', insight: '未处理的情感或失去', keywords: ['悲伤', '难过', '哭', '泪'] },
    { name: '愤怒', emoji: '😠', insight: '压抑的情绪需要释放', keywords: ['愤怒', '生气', '怒', '火'] },
    { name: '平静', emoji: '😌', insight: '内心和谐、接受现状', keywords: ['平静', '宁静', '安详', '安'] },
  ];

  const detectedEmotion = emotionLibrary.find(e => {
    const keywords = Array.isArray(e.keywords) ? e.keywords : [e.keywords];
    return keywords.some(k => lowerDream.includes(k));
  }) || { name: '好奇', emoji: '🤔', insight: '对未知事物的探索欲望' };

  // 主题分析
  const themes: string[] = [];
  if (lowerDream.includes('飞') || lowerDream.includes('天空')) themes.push('超越与自由');
  if (lowerDream.includes('水') || lowerDream.includes('海') || lowerDream.includes('河')) themes.push('情感流动');
  if (lowerDream.includes('追') || lowerDream.includes('逃') || lowerDream.includes('跑')) themes.push('压力与逃避');
  if (lowerDream.includes('死') || lowerDream.includes('失去')) themes.push('转变与告别');
  if (lowerDream.includes('家') || lowerDream.includes('房子')) themes.push('安全与归属');
  if (lowerDream.includes('爱') || lowerDream.includes('恋')) themes.push('情感关系');
  if (themes.length === 0) themes.push('内在探索', '潜意识信息');

  // 建议生成
  const suggestions = [
    '记录梦境细节，寻找重复出现的元素',
    '思考最近生活中是否有相关的事件或情绪',
    '问问自己：这个梦境想告诉我什么？',
    '梦境往往反映内心深处的渴望或担忧',
    '尝试在日记中与梦境对话',
    '关注梦境中的情绪，而非具体情节',
    '如果梦境重复出现，可能需要关注相关议题',
  ].sort(() => Math.random() - 0.5).slice(0, 3);

  // 深度解读
  const reflection = `这个梦境探索了"${themes[0]}"的主题。

梦境中的${symbols.map(s => s.name).join('、')}象征着${symbols[0]?.meaning.split('、')[0]}等深层含义。从心理学角度看，这些符号是我们潜意识的投射，帮助我们看到内心深处的想法和感受。

从${detectedEmotion.name}的情绪色彩来看，这个梦境可能在处理内心深处的某些情感。梦境是我们与潜意识对话的桥梁，它往往通过象征和隐喻来传递信息。

建议您：
1. 留意这个梦境是否与最近的生活事件有关
2. 思考梦境中的符号对您个人的特殊意义
3. 允许自己感受梦境带来的情绪，不必急于解读`;

  return {
    symbols,
    emotion: detectedEmotion,
    themes,
    suggestions,
    reflection,
  };
}