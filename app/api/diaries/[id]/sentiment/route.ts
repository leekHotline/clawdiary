import { NextRequest, NextResponse } from 'next/server';

// 情感关键词库
const positiveWords = ['开心', '快乐', '幸福', '满足', '兴奋', '期待', '成功', '完成', '达成', '进步', '成长', '收获', '美好', '精彩', '感谢', '喜欢', '爱', '希望', '阳光', '灿烂', '棒', '好', '优秀', '完美'];
const negativeWords = ['难过', '悲伤', '痛苦', '焦虑', '担心', '压力', '困难', '失败', '挫折', '疲惫', '无聊', '沮丧', '愤怒', '失望', '孤独', '迷茫', '黑暗', '糟糕', '差', '烦'];
const thinkingWords = ['思考', '反思', '感悟', '想法', '理解', '认识', '发现', '意识到', '明白', '懂得', '学习', '总结', '回顾'];
const calmWords = ['平静', '宁静', '安详', '放松', '舒适', '惬意', '简单', '纯粹', '安静', '从容'];

// 情感分析函数
function analyzeSentiment(text: string) {
  const fullText = text.toLowerCase();
  
  let positiveCount = 0;
  let negativeCount = 0;
  let thinkingCount = 0;
  let calmCount = 0;
  let neutralCount = 0;
  
  positiveWords.forEach(word => {
    const regex = new RegExp(word, 'g');
    const matches = fullText.match(regex);
    if (matches) positiveCount += matches.length;
  });
  
  negativeWords.forEach(word => {
    const regex = new RegExp(word, 'g');
    const matches = fullText.match(regex);
    if (matches) negativeCount += matches.length;
  });
  
  thinkingWords.forEach(word => {
    const regex = new RegExp(word, 'g');
    const matches = fullText.match(regex);
    if (matches) thinkingCount += matches.length;
  });
  
  calmWords.forEach(word => {
    const regex = new RegExp(word, 'g');
    const matches = fullText.match(regex);
    if (matches) calmCount += matches.length;
  });
  
  // 计算中性词（简单处理）
  neutralCount = Math.max(1, Math.floor(fullText.length / 100));
  
  const total = positiveCount + negativeCount + thinkingCount + calmCount + neutralCount + 1;
  
  return {
    positive: Math.round((positiveCount / total) * 100),
    negative: Math.round((negativeCount / total) * 100),
    thinking: Math.round((thinkingCount / total) * 100),
    calm: Math.round((calmCount / total) * 100),
    neutral: Math.round((neutralCount / total) * 100),
    positiveCount,
    negativeCount,
    thinkingCount,
    calmCount
  };
}

// 提取关键词
function extractKeywords(text: string) {
  const keywords: { word: string; type: string; count: number }[] = [];
  
  const allWords = [
    ...positiveWords.map(w => ({ word: w, type: 'positive' })),
    ...negativeWords.map(w => ({ word: w, type: 'negative' })),
    ...thinkingWords.map(w => ({ word: w, type: 'thinking' })),
    ...calmWords.map(w => ({ word: w, type: 'calm' }))
  ];
  
  allWords.forEach(({ word, type }) => {
    const regex = new RegExp(word, 'g');
    const matches = text.match(regex);
    if (matches && matches.length > 0) {
      keywords.push({ word, type, count: matches.length });
    }
  });
  
  // 按出现次数排序并取前 10 个
  return keywords
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

// 获取主导情感
function getDominantEmotion(result: ReturnType<typeof analyzeSentiment>) {
  const emotions = [
    { name: '快乐', value: result.positive, emoji: '😊', color: 'yellow' },
    { name: '悲伤', value: result.negative, emoji: '😢', color: 'blue' },
    { name: '思考', value: result.thinking, emoji: '🤔', color: 'purple' },
    { name: '平静', value: result.calm, emoji: '😌', color: 'green' }
  ];
  
  emotions.sort((a, b) => b.value - a.value);
  return emotions[0];
}

// 获取情感强度
function getIntensity(result: ReturnType<typeof analyzeSentiment>) {
  const emotionalRatio = (result.positiveCount + result.negativeCount) / 
    (result.positiveCount + result.negativeCount + result.thinkingCount + result.calmCount + 1);
  
  if (emotionalRatio > 0.3) return { level: '强烈', score: 5, description: '情感表达非常强烈' };
  if (emotionalRatio > 0.15) return { level: '中等', score: 4, description: '有明显的情感表达' };
  if (emotionalRatio > 0.05) return { level: '轻微', score: 3, description: '有一些情感色彩' };
  return { level: '平静', score: 2, description: '情感表达较为平静' };
}

// 生成心理洞察
function generateInsights(result: ReturnType<typeof analyzeSentiment>) {
  const insights: { emoji: string; title: string; description: string; type: string }[] = [];
  
  if (result.positive > 30) {
    insights.push({
      emoji: '🌞',
      title: '积极情绪充沛',
      description: '你的日记充满了正能量，继续保持乐观的心态！',
      type: 'positive'
    });
  }
  
  if (result.thinking > 20) {
    insights.push({
      emoji: '🧠',
      title: '深度思考者',
      description: '你善于反思和总结，这是成长的阶梯。',
      type: 'thinking'
    });
  }
  
  if (result.calm > 15) {
    insights.push({
      emoji: '🍃',
      title: '内心平和',
      description: '你保持着宁静的心态，这是难得的品质。',
      type: 'calm'
    });
  }
  
  if (result.negative > 20) {
    insights.push({
      emoji: '🤗',
      title: '情绪需要关注',
      description: '日记中有一些负面情绪，记得关爱自己。',
      type: 'negative'
    });
  }
  
  if (insights.length === 0) {
    insights.push({
      emoji: '📝',
      title: '情感表达平衡',
      description: '你的日记情感表达较为均衡，保持这种状态。',
      type: 'neutral'
    });
  }
  
  return insights;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const diaryId = parseInt(id);
  
  // 模拟获取日记内容（实际应从数据库获取）
  const sampleContent = `
    今天是一个特别的日子。我完成了很多目标，感到非常开心和满足。
    回顾这段时间的成长，我发现自己学会了很多东西。
    虽然过程中遇到了一些困难，但最终还是成功了。
    思考让我更加明白自己想要什么。
    内心平静是我最大的收获。
  `;
  
  const text = sampleContent;
  const result = analyzeSentiment(text);
  const dominant = getDominantEmotion(result);
  const intensity = getIntensity(result);
  const keywords = extractKeywords(text);
  const insights = generateInsights(result);
  
  return NextResponse.json({
    diaryId,
    sentiment: {
      distribution: {
        positive: result.positive,
        negative: result.negative,
        thinking: result.thinking,
        calm: result.calm,
        neutral: result.neutral
      },
      dominant,
      intensity,
      keywords,
      insights
    },
    analyzedAt: new Date().toISOString()
  });
}