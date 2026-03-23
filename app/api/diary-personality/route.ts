import { NextRequest, NextResponse } from 'next/server';

interface Diary {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  mood?: string;
}

interface PersonalityReport {
  archetype: {
    name: string;
    emoji: string;
    description: string;
    traits: string[];
  };
  writingStyle: {
    name: string;
    description: string;
    indicators: string[];
  };
  emotionalProfile: {
    dominantEmotion: string;
    emotionEmoji: string;
    emotionalRange: string;
    patterns: string[];
  };
  themes: {
    primary: string[];
    secondary: string[];
    insights: string;
  };
  growthJourney: {
    stage: string;
    description: string;
    nextStep: string;
  };
  funFacts: string[];
  compatibility: {
    types: string[];
    description: string;
  };
  stats: {
    totalEntries: number;
    totalWords: number;
    avgWordsPerEntry: number;
    mostProductiveDay: string;
    writingConsistency: number;
  };
}

// 人格原型库
const ARCHETYPES = [
  { name: '哲学思考者', emoji: '🧠', traits: ['深度思考', '善于反思', '追求意义'] },
  { name: '情感诗人', emoji: '💝', traits: ['情感丰富', '表达细腻', '感性写作'] },
  { name: '效率达人', emoji: '⚡', traits: ['目标导向', '高效记录', '简洁有力'] },
  { name: '成长猎手', emoji: '🎯', traits: ['持续进步', '自我驱动', '行动力强'] },
  { name: '生活观察家', emoji: '🔍', traits: ['善于发现', '记录细节', '好奇心强'] },
  { name: '梦想编织者', emoji: '✨', traits: ['富有想象', '憧憬未来', '创意无限'] },
  { name: '情感疗愈师', emoji: '🌸', traits: ['温柔自愈', '情绪觉察', '善解人意'] },
  { name: '探索冒险家', emoji: '🧭', traits: ['勇于尝试', '记录冒险', '开放心态'] },
];

const WRITING_STYLES = [
  { name: '叙事型', description: '擅长讲述故事，条理清晰，让读者身临其境', indicators: ['时间线明确', '因果叙述', '完整故事'] },
  { name: '情感型', description: '注重情感表达，文字温暖，容易引起共鸣', indicators: ['多用形容词', '情感词汇丰富', '表达细腻'] },
  { name: '分析型', description: '善于分析总结，逻辑性强，观点鲜明', indicators: ['结构清晰', '观点明确', '数据支撑'] },
  { name: '意识流', description: '自由书写，随性真实，展现内心世界', indicators: ['跳跃性强', '真实感', '即兴创作'] },
  { name: '诗意型', description: '文字优美，意象丰富，有艺术感', indicators: ['比喻多', '意象丰富', '节奏感强'] },
];

function analyzeContent(content: string): { 
  hasReflection: boolean; 
  hasEmotion: boolean; 
  hasGrowth: boolean;
  hasObservation: boolean;
  hasDream: boolean;
  hasHealing: boolean;
} {
  const lower = content.toLowerCase();
  return {
    hasReflection: /思考|反思|意义|为什么|深入|分析/.test(lower),
    hasEmotion: /感觉|心情|情绪|开心|难过|感动/.test(lower),
    hasGrowth: /成长|目标|学习|进步|挑战|突破/.test(lower),
    hasObservation: /发现|观察|今天|看到|注意到|细节/.test(lower),
    hasDream: /梦想|希望|未来|想象|计划|愿望/.test(lower),
    hasHealing: /治愈|疗愈|平静|接纳|原谅|释怀/.test(lower),
  };
}

function selectArchetype(diaries: Diary[], avgWords: number): typeof ARCHETYPES[0] {
  const allContent = diaries.map(d => d.content || '').join(' ');
  const analysis = analyzeContent(allContent);
  
  // 基于内容特征打分
  const scores = [
    { archetype: ARCHETYPES[0], score: analysis.hasReflection ? 3 : 0 },
    { archetype: ARCHETYPES[1], score: analysis.hasEmotion ? 3 : 0 },
    { archetype: ARCHETYPES[2], score: avgWords < 200 ? 2 : 0 },
    { archetype: ARCHETYPES[3], score: analysis.hasGrowth ? 3 : 0 },
    { archetype: ARCHETYPES[4], score: analysis.hasObservation ? 3 : 0 },
    { archetype: ARCHETYPES[5], score: analysis.hasDream ? 3 : 0 },
    { archetype: ARCHETYPES[6], score: analysis.hasHealing ? 3 : 0 },
    { archetype: ARCHETYPES[7], score: diaries.length > 10 && analysis.hasObservation ? 2 : 0 },
  ];
  
  // 选择得分最高的
  const top = scores.sort((a, b) => b.score - a.score)[0];
  return top.archetype;
}

function selectWritingStyle(diaries: Diary[], avgWords: number): typeof WRITING_STYLES[0] {
  const allContent = diaries.map(d => d.content || '').join(' ');
  
  // 分析标点符号使用
  const questionMarks = (allContent.match(/\?|？/g) || []).length;
  const exclamationMarks = (allContent.match(/!|！/g) || []).length;
  const commas = (allContent.match(/,|，/g) || []).length;
  
  // 分析句子结构
  const sentences = allContent.split(/[。！？\n]/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.length > 0 
    ? sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length 
    : 0;
  
  // 选择风格
  if (avgSentenceLength > 50 && commas > sentences.length * 2) {
    return WRITING_STYLES[0]; // 叙事型
  } else if (exclamationMarks > sentences.length * 0.2 || allContent.includes('感觉')) {
    return WRITING_STYLES[1]; // 情感型
  } else if (questionMarks > sentences.length * 0.15 || allContent.includes('分析')) {
    return WRITING_STYLES[2]; // 分析型
  } else if (avgWords < 150) {
    return WRITING_STYLES[3]; // 意识流
  } else {
    return WRITING_STYLES[4]; // 诗意型
  }
}

export async function POST(request: NextRequest) {
  try {
    const { diaries } = await request.json() as { diaries: Diary[] };
    
    if (!diaries || diaries.length === 0) {
      return NextResponse.json({ error: 'No diaries provided' }, { status: 400 });
    }

    // 基础统计
    const totalWords = diaries.reduce((sum, d) => sum + (d.content?.length || 0), 0);
    const avgWords = Math.round(totalWords / diaries.length);
    
    // 标签分析
    const tagCounts: Record<string, number> = {};
    diaries.forEach(d => {
      d.tags?.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([tag]) => tag);

    // 心情分析
    const moodCounts: Record<string, number> = {};
    diaries.filter(d => d.mood).forEach(d => {
      moodCounts[d.mood!] = (moodCounts[d.mood!] || 0) + 1;
    });
    const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

    // 日期分析
    const dayCounts: Record<string, number> = {};
    diaries.forEach(d => {
      const day = new Date(d.date).getDay();
      const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      dayCounts[dayNames[day]] = (dayCounts[dayNames[day]] || 0) + 1;
    });
    const mostProductiveDay = Object.entries(dayCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || '未知';

    // 选择人格和风格
    const archetype = selectArchetype(diaries, avgWords);
    const writingStyle = selectWritingStyle(diaries, avgWords);

    // 生成报告
    const report: PersonalityReport = {
      archetype: {
        ...archetype,
        description: `你的日记展现出${archetype.traits.join('、')}的特质，这是非常珍贵的写作风格！`
      },
      writingStyle: {
        ...writingStyle,
        indicators: writingStyle.indicators.map(i => `✓ ${i}`)
      },
      emotionalProfile: {
        dominantEmotion: topMood?.[0] || '平静',
        emotionEmoji: topMood?.[0] === '😊' ? '😊' : topMood?.[0] === '😢' ? '😢' : '😌',
        emotionalRange: Object.keys(moodCounts).length > 5 ? '丰富多变' : Object.keys(moodCounts).length > 2 ? '稳定温和' : '专注深入',
        patterns: ['情绪与事件关联紧密', '善于觉察内心变化', '表达真实自然流畅']
      },
      themes: {
        primary: topTags.slice(0, 3),
        secondary: topTags.slice(3, 6),
        insights: `你关注的核心主题反映了你的价值观和生活重心，持续记录这些主题会带来更深的自我认知和成长。`
      },
      growthJourney: {
        stage: diaries.length > 50 ? '深耕期' : diaries.length > 20 ? '成长期' : diaries.length > 10 ? '探索期' : '萌芽期',
        description: diaries.length > 20 
          ? '你已经建立了稳定的日记习惯，正在向更深层次的自我认知迈进。继续保持！' 
          : '日记之旅刚刚开始，每一天的记录都在塑造更好的你。坚持就是胜利！',
        nextStep: diaries.length > 20 
          ? '尝试探索新的写作主题，挑战更深的自我对话，让日记成为成长加速器' 
          : '坚持每天记录，培养写作的肌肉记忆，让日记成为习惯'
      },
      funFacts: [
        `📝 你总共写了 ${totalWords.toLocaleString()} 字，相当于 ${Math.round(totalWords / 800)} 篇作文！`,
        `📅 ${mostProductiveDay}是你最勤奋的日子，灵感满满`,
        `🏷️ "${topTags[0] || '生活'}"是你最关心的话题`,
        `⏱️ 平均每篇${avgWords}字，${avgWords > 300 ? '细节丰富，善于表达' : avgWords > 150 ? '简洁有力，重点突出' : '精炼表达，言简意赅'}`
      ],
      compatibility: {
        types: ['成长伙伴型', '深度对话型', '创意激发型'],
        description: '你的写作风格适合与善于倾听、能够深度交流的人互动'
      },
      stats: {
        totalEntries: diaries.length,
        totalWords,
        avgWordsPerEntry: avgWords,
        mostProductiveDay,
        writingConsistency: Math.min(Math.round(diaries.length * 2), 100)
      }
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error('Personality analysis error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}