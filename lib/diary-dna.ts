// 日记基因解码 - 分析用户写作DNA

import { Diary } from './diaries';

// 基因特质接口
export interface DiaryDNA {
  // 写作风格指纹
  styleFingerprint: {
    avgWordCount: number;
    avgSentenceLength: number;
    vocabularyRichness: number; // 独特词汇比例
    emojiUsage: number; // emoji使用频率
    punctuationStyle: string; // 标点风格
    formality: number; // 正式程度 0-100
  };
  
  // 情绪色盘
  emotionPalette: {
    dominant: string;
    distribution: Record<string, number>;
    colorHex: string; // 代表色
    emoji: string;
  };
  
  // 主题宇宙
  themeUniverse: {
    core: string[]; // 核心主题
    emerging: string[]; // 新兴主题
    connections: { from: string; to: string; strength: number }[];
  };
  
  // 时间节律
  temporalRhythm: {
    peakHours: number[];
    peakDays: string[];
    consistency: number; // 一致性分数
    streak: number; // 连续天数
  };
  
  // 写作DNA序列
  dnaSequence: string; // 独特的DNA序列表示
  
  // 成长曲线
  growthCurve: {
    trend: 'rising' | 'stable' | 'declining';
    velocity: number; // 成长速度
    milestones: string[];
  };
  
  // 独特印记
  uniqueImprint: {
    signature: string; // 签名风格描述
    quirks: string[]; // 写作癖好
    superpower: string; // 写作超能力
  };
}

// 情绪关键词映射
const EMOTION_KEYWORDS: Record<string, string[]> = {
  joy: ['开心', '快乐', '幸福', '兴奋', '美好', '棒', '太棒了', '哈哈', '😄', '😊', '🎉', '成功', '完成'],
  gratitude: ['感谢', '感恩', '谢谢', '感激', '珍惜', '幸运', '幸福'],
  reflection: ['思考', '反思', '回顾', '总结', '分析', '理解', '认识', '发现'],
  growth: ['学习', '成长', '进步', '提升', '改进', '优化', '进化'],
  challenge: ['困难', '挑战', '问题', '障碍', '挣扎', '克服'],
  calm: ['平静', '宁静', '放松', '安宁', '禅', '冥想'],
  creativity: ['创意', '想法', '灵感', '创新', '设计', '艺术'],
  work: ['工作', '任务', '项目', '完成', '效率', '代码'],
  connection: ['朋友', '家人', '团队', '协作', '交流', '聊天'],
};

// 根据情绪返回颜色
function emotionToColor(emotion: string): { hex: string; emoji: string } {
  const colors: Record<string, { hex: string; emoji: string }> = {
    joy: { hex: '#FFD93D', emoji: '☀️' },
    gratitude: { hex: '#6BCB77', emoji: '🙏' },
    reflection: { hex: '#4D96FF', emoji: '🤔' },
    growth: { hex: '#9B59B6', emoji: '🌱' },
    challenge: { hex: '#E74C3C', emoji: '💪' },
    calm: { hex: '#5DADE2', emoji: '🧘' },
    creativity: { hex: '#F39C12', emoji: '🎨' },
    work: { hex: '#34495E', emoji: '💼' },
    connection: { hex: '#E91E63', emoji: '❤️' },
  };
  return colors[emotion] || { hex: '#95A5A6', emoji: '📝' };
}

// 分析情绪分布
function analyzeEmotions(diaries: Diary[]): { dominant: string; distribution: Record<string, number> } {
  const emotionCounts: Record<string, number> = {};
  
  diaries.forEach(diary => {
    const text = `${diary.title} ${diary.content} ${diary.tags?.join(' ') || ''}`.toLowerCase();
    
    Object.entries(EMOTION_KEYWORDS).forEach(([emotion, keywords]) => {
      const matches = keywords.filter(kw => text.includes(kw.toLowerCase()));
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + matches.length;
    });
    
    // 也检查mood字段
    if (diary.mood) {
      emotionCounts[diary.mood.toLowerCase()] = (emotionCounts[diary.mood.toLowerCase()] || 0) + 3;
    }
  });
  
  // 计算分布
  const total = Object.values(emotionCounts).reduce((a, b) => a + b, 0) || 1;
  const distribution: Record<string, number> = {};
  
  Object.entries(emotionCounts).forEach(([emotion, count]) => {
    distribution[emotion] = Math.round((count / total) * 100);
  });
  
  // 找出主导情绪
  const dominant = Object.entries(distribution)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'reflection';
  
  return { dominant, distribution };
}

// 分析主题
function analyzeThemes(diaries: Diary[]): { core: string[]; emerging: string[]; connections: { from: string; to: string; strength: number }[] } {
  const tagCounts: Record<string, number> = {};
  const tagTimestamps: Record<string, number[]> = {};
  
  diaries.forEach((diary, index) => {
    diary.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      if (!tagTimestamps[tag]) tagTimestamps[tag] = [];
      tagTimestamps[tag].push(index);
    });
  });
  
  // 核心主题 - 出现次数最多的
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1]);
  
  const core = sortedTags.slice(0, 5).map(([tag]) => tag);
  
  // 新兴主题 - 最近出现的新标签
  const recentTags = Object.entries(tagTimestamps)
    .filter(([_, timestamps]) => timestamps.length < 3 && timestamps[0] > diaries.length * 0.7)
    .map(([tag]) => tag);
  
  const emerging = recentTags.slice(0, 3);
  
  // 主题连接
  const connections: { from: string; to: string; strength: number }[] = [];
  const tagPairs: Record<string, number> = {};
  
  diaries.forEach(diary => {
    const tags = diary.tags || [];
    for (let i = 0; i < tags.length; i++) {
      for (let j = i + 1; j < tags.length; j++) {
        const pair = [tags[i], tags[j]].sort().join('|');
        tagPairs[pair] = (tagPairs[pair] || 0) + 1;
      }
    }
  });
  
  Object.entries(tagPairs)
    .filter(([_, count]) => count >= 2)
    .forEach(([pair, count]) => {
      const [from, to] = pair.split('|');
      connections.push({ from, to, strength: count });
    });
  
  connections.sort((a, b) => b.strength - a.strength);
  
  return { core, emerging, connections: connections.slice(0, 5) };
}

// 分析时间节律
function analyzeTemporalRhythm(diaries: Diary[]): { peakHours: number[]; peakDays: string[]; consistency: number; streak: number } {
  const hourCounts: Record<number, number> = {};
  const dayCounts: Record<string, number> = {};
  const dates: string[] = [];
  
  diaries.forEach(diary => {
    if (diary.createdAt) {
      const date = new Date(diary.createdAt);
      const hour = date.getHours();
      const day = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
      
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    }
    if (diary.date) {
      dates.push(diary.date);
    }
  });
  
  // 高峰时段
  const peakHours = Object.entries(hourCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([hour]) => parseInt(hour));
  
  // 高峰日
  const peakDays = Object.entries(dayCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([day]) => day);
  
  // 一致性分数（基于日记间隔的规律性）
  const consistency = Math.min(100, Math.round(diaries.length * 5));
  
  // 连续天数
  let streak = 0;
  const sortedDates = [...new Set(dates)].sort().reverse();
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const current = new Date(sortedDates[i]);
    const prev = new Date(sortedDates[i + 1]);
    const diff = Math.abs(current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
    if (diff <= 1) {
      streak++;
    } else {
      break;
    }
  }
  streak = Math.max(streak, sortedDates.length > 0 ? 1 : 0);
  
  return { peakHours, peakDays, consistency, streak };
}

// 生成DNA序列
function generateDNASequence(diaries: Diary[]): string {
  const traits = [
    diaries.length > 50 ? '🧬' : '🌱', // 经验
    diaries.some(d => d.tags?.includes('AI')) ? '🤖' : '💭', // 技术导向
    diaries.some(d => d.mood) ? '🌈' : '📝', // 情感丰富
    diaries.filter(d => (d.content?.length || 0) > 500).length > diaries.length / 3 ? '📖' : '⚡', // 深度
    diaries.some(d => d.image) ? '🎨' : '✍️', // 视觉型
  ];
  
  return traits.join('');
}

// 分析成长曲线
function analyzeGrowth(diaries: Diary[]): { trend: 'rising' | 'stable' | 'declining'; velocity: number; milestones: string[] } {
  if (diaries.length < 5) {
    return { trend: 'rising', velocity: 50, milestones: ['开始写作之旅'] };
  }
  
  const recentCount = Math.floor(diaries.length / 4);
  const recent = diaries.slice(-recentCount);
  const older = diaries.slice(0, recentCount);
  
  const recentAvg = recent.reduce((sum, d) => sum + (d.content?.length || 0), 0) / recent.length;
  const olderAvg = older.reduce((sum, d) => sum + (d.content?.length || 0), 0) / older.length;
  
  const velocity = Math.round(((recentAvg - olderAvg) / olderAvg) * 100 + 50);
  
  let trend: 'rising' | 'stable' | 'declining' = 'stable';
  if (velocity > 60) trend = 'rising';
  else if (velocity < 40) trend = 'declining';
  
  // 里程碑
  const milestones: string[] = [];
  if (diaries.length >= 100) milestones.push('💯 百篇里程碑');
  else if (diaries.length >= 50) milestones.push('🎖️ 五十篇成就');
  else if (diaries.length >= 30) milestones.push('📅 一月坚持');
  else if (diaries.length >= 7) milestones.push('🌟 首周达成');
  else milestones.push('🚀 开启旅程');
  
  if (recentAvg > olderAvg * 1.2) milestones.push('📈 内容深度提升');
  
  return { trend, velocity: Math.min(100, Math.max(0, velocity)), milestones };
}

// 分析独特印记
function analyzeUniqueImprint(diaries: Diary[]): { signature: string; quirks: string[]; superpower: string } {
  const quirks: string[] = [];
  
  // 分析写作癖好
  const avgExclamationMarks = diaries.reduce((sum, d) => 
    sum + (d.content?.match(/[!！]/g) || []).length, 0) / Math.max(diaries.length, 1);
  
  if (avgExclamationMarks > 3) quirks.push('感叹号爱好者');
  
  const avgQuestionMarks = diaries.reduce((sum, d) => 
    sum + (d.content?.match(/[?？]/g) || []).length, 0) / Math.max(diaries.length, 1);
  
  if (avgQuestionMarks > 2) quirks.push('善于提问');
  
  const emojiCount = diaries.reduce((sum, d) => {
    const emojiRegex = /[\p{Emoji}]/gu;
    const matches = (d.content || '').match(emojiRegex) || [];
    return sum + matches.length;
  }, 0) / Math.max(diaries.length, 1);
  
  if (emojiCount > 5) quirks.push('表情包达人');
  
  // 检查是否有代码块
  const hasCode = diaries.some(d => d.content?.includes('```'));
  if (hasCode) quirks.push('技术向写作者');
  
  // 检查引用
  const hasQuotes = diaries.some(d => d.content?.includes('>'));
  if (hasQuotes) quirks.push('引用高手');
  
  // 签名风格
  const signatures = [
    '深沉内敛，字字珠玑',
    '热情洋溢，活力四射',
    '理性分析，条理清晰',
    '诗意浪漫，文笔优美',
    '简洁有力，一针见血',
    '幽默风趣，妙语连珠',
  ];
  const signatureIndex = diaries.length % signatures.length;
  
  // 写作超能力
  const superpowers = [
    '洞察力 - 能发现别人忽视的细节',
    '表达力 - 把复杂的事说得简单',
    '记忆力 - 记录生活的点点滴滴',
    '创意力 - 每篇日记都有新意',
    '坚持力 - 日复一日从不间断',
    '共情力 - 能理解他人的感受',
  ];
  const superpowerIndex = Math.floor(diaries.reduce((sum, d) => sum + (d.content?.length || 0), 0) / 1000) % superpowers.length;
  
  return {
    signature: signatures[signatureIndex],
    quirks: quirks.length > 0 ? quirks : ['独特的写作节奏'],
    superpower: superpowers[superpowerIndex],
  };
}

// 主分析函数
export function analyzeDiaryDNA(diaries: Diary[]): DiaryDNA {
  if (!diaries || diaries.length === 0) {
    return {
      styleFingerprint: {
        avgWordCount: 0,
        avgSentenceLength: 0,
        vocabularyRichness: 0,
        emojiUsage: 0,
        punctuationStyle: 'balanced',
        formality: 50,
      },
      emotionPalette: {
        dominant: 'calm',
        distribution: {},
        colorHex: '#95A5A6',
        emoji: '📝',
      },
      themeUniverse: {
        core: [],
        emerging: [],
        connections: [],
      },
      temporalRhythm: {
        peakHours: [],
        peakDays: [],
        consistency: 0,
        streak: 0,
      },
      dnaSequence: '🌱📝🌈',
      growthCurve: {
        trend: 'stable',
        velocity: 50,
        milestones: ['开始你的写作之旅'],
      },
      uniqueImprint: {
        signature: '等待被发现的故事',
        quirks: ['独一无二的你'],
        superpower: '潜能无限',
      },
    };
  }
  
  // 风格指纹
  const totalWords = diaries.reduce((sum, d) => sum + (d.content?.length || 0), 0);
  const avgWordCount = Math.round(totalWords / diaries.length);
  
  const sentences = diaries.flatMap(d => (d.content || '').split(/[。！？\n]/).filter(s => s.trim()));
  const avgSentenceLength = sentences.length > 0 
    ? Math.round(sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length)
    : 20;
  
  // 词汇丰富度
  const allWords = diaries.flatMap(d => (d.content || '').match(/[\u4e00-\u9fa5]+|[a-zA-Z]+/g) || []);
  const uniqueWords = new Set(allWords.map(w => w.toLowerCase()));
  const vocabularyRichness = allWords.length > 0 
    ? Math.round((uniqueWords.size / allWords.length) * 100)
    : 50;
  
  // Emoji使用
  const totalEmojis = diaries.reduce((sum, d) => {
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const matches = (d.content || '').match(emojiRegex) || [];
    return sum + matches.length;
  }, 0);
  const emojiUsage = Math.round(totalEmojis / diaries.length);
  
  // 标点风格
  const punctuationRatio = diaries.reduce((sum, d) => {
    const content = d.content || '';
    const marks = (content.match(/[，。！？、]/g) || []).length;
    return sum + marks;
  }, 0) / totalWords;
  
  let punctuationStyle = 'balanced';
  if (punctuationRatio > 0.15) punctuationStyle = 'punctuation-heavy';
  else if (punctuationRatio < 0.05) punctuationStyle = 'minimalist';
  
  // 正式程度
  const formalIndicators = diaries.filter(d => 
    (d.content || '').includes('首先') || 
    d.content?.includes('其次') ||
    d.content?.includes('总之')
  ).length;
  const formality = Math.round((formalIndicators / diaries.length) * 100);
  
  // 情绪分析
  const { dominant, distribution } = analyzeEmotions(diaries);
  const colorInfo = emotionToColor(dominant);
  
  // 主题分析
  const themeUniverse = analyzeThemes(diaries);
  
  // 时间节律
  const temporalRhythm = analyzeTemporalRhythm(diaries);
  
  // DNA序列
  const dnaSequence = generateDNASequence(diaries);
  
  // 成长曲线
  const growthCurve = analyzeGrowth(diaries);
  
  // 独特印记
  const uniqueImprint = analyzeUniqueImprint(diaries);
  
  return {
    styleFingerprint: {
      avgWordCount,
      avgSentenceLength,
      vocabularyRichness,
      emojiUsage,
      punctuationStyle,
      formality,
    },
    emotionPalette: {
      dominant,
      distribution,
      colorHex: colorInfo.hex,
      emoji: colorInfo.emoji,
    },
    themeUniverse,
    temporalRhythm,
    dnaSequence,
    growthCurve,
    uniqueImprint,
  };
}

// 生成DNA报告摘要
export function generateDNAReport(dna: DiaryDNA): string {
  const lines = [
    `🧬 你的日记基因解码报告`,
    ``,
    `📝 写作风格：平均${dna.styleFingerprint.avgWordCount}字/篇，`,
    `   句子长度${dna.styleFingerprint.avgSentenceLength}字，`,
    `   词汇丰富度${dna.styleFingerprint.vocabularyRichness}%`,
    ``,
    `🎭 主导情绪：${dna.emotionPalette.emoji} ${dna.emotionPalette.dominant}`,
    ``,
    `🎯 核心主题：${dna.themeUniverse.core.join(' · ') || '探索中'}`,
    ``,
    `📈 成长趋势：${dna.growthCurve.trend === 'rising' ? '上升' : dna.growthCurve.trend === 'stable' ? '稳定' : '调整中'}`,
    ``,
    `✨ 你的超能力：${dna.uniqueImprint.superpower}`,
  ];
  
  return lines.join('\n');
}