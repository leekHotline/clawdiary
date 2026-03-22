import { NextRequest, NextResponse } from 'next/server';
import diaryData from '@/lib/diaries-data.json';

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  mood?: string;
}

// 简单的关键词提取
function extractKeywords(question: string): string[] {
  // 移除常见停用词
  const stopWords = new Set(['的', '了', '是', '在', '我', '有', '和', '就', '不', '人', '都', '一', '一个', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己', '这', '那', '什么', '怎么', '为什么', '哪', '几个', '多少']);
  
  const words = question.split(/[？?！!，,。.　\s]+/).filter(w => w.length > 0 && !stopWords.has(w));
  return words;
}

// 计算相关度分数
function calculateRelevance(entry: DiaryEntry, keywords: string[]): number {
  let score = 0;
  const content = (entry.title + ' ' + entry.content + ' ' + entry.tags.join(' ')).toLowerCase();
  
  for (const keyword of keywords) {
    const regex = new RegExp(keyword, 'gi');
    const matches = content.match(regex);
    if (matches) {
      score += matches.length;
    }
  }
  
  return score;
}

// 生成回答
function generateAnswer(question: string, entries: DiaryEntry[]): { answer: string; sources: string[] } {
  const lowerQ = question.toLowerCase();
  const sources: string[] = [];
  let answer = '';

  // 咖啡相关
  if (lowerQ.includes('咖啡')) {
    const matches = entries.filter(d => d.content.includes('咖啡') || d.tags?.includes('咖啡'));
    if (matches.length > 0) {
      answer = `☕ 你在日记中提到了 ${matches.length} 次咖啡\n\n`;
      matches.slice(0, 5).forEach(d => {
        answer += `• ${d.date}：${d.title}\n`;
        sources.push(d.date);
      });
      if (matches.length > 5) answer += `\n...还有 ${matches.length - 5} 条记录`;
    } else {
      answer = '暂未找到关于咖啡的记录。';
    }
    return { answer, sources };
  }

  // 旅行相关
  if (lowerQ.includes('旅行') || lowerQ.includes('旅游')) {
    const matches = entries.filter(d => 
      d.content.includes('旅行') || d.content.includes('旅游') || 
      d.tags?.includes('旅行') || d.tags?.includes('旅游')
    );
    if (matches.length > 0) {
      answer = `✈️ 你在日记中提到了 ${matches.length} 次旅行\n\n`;
      matches.slice(0, 5).forEach(d => {
        answer += `• ${d.date}：${d.title}\n`;
        sources.push(d.date);
      });
    } else {
      answer = '暂未找到关于旅行的记录。';
    }
    return { answer, sources };
  }

  // AI 相关
  if (lowerQ.includes('ai') || lowerQ.includes('人工智能') || lowerQ.includes('智能')) {
    const matches = entries.filter(d => 
      d.content.toLowerCase().includes('ai') || 
      d.content.includes('人工智能') ||
      d.tags?.includes('AI')
    );
    if (matches.length > 0) {
      answer = `🤖 你在日记中提到了 ${matches.length} 次 AI\n\n`;
      matches.slice(0, 5).forEach(d => {
        answer += `• ${d.date}：${d.title}\n`;
        sources.push(d.date);
      });
    } else {
      answer = '暂未找到关于 AI 的记录。';
    }
    return { answer, sources };
  }

  // 心情/情绪相关
  if (lowerQ.includes('心情') || lowerQ.includes('情绪') || lowerQ.includes('感受')) {
    const moodMap: Record<string, DiaryEntry[]> = {};
    entries.forEach(d => {
      if (d.mood) {
        if (!moodMap[d.mood]) moodMap[d.mood] = [];
        moodMap[d.mood].push(d);
      }
    });
    
    answer = `💭 根据日记记录的情绪分析：\n\n`;
    Object.entries(moodMap).slice(0, 5).forEach(([mood, days]) => {
      answer += `• ${mood}：${days.length} 天\n`;
    });
    answer += `\n最近 ${entries.length} 天的记录中，你记录了 ${Object.keys(moodMap).length} 种不同的情绪状态。`;
    entries.slice(0, 3).forEach(d => sources.push(d.date));
    return { answer, sources };
  }

  // 学习相关
  if (lowerQ.includes('学习') || lowerQ.includes('学会') || lowerQ.includes('学了')) {
    const matches = entries.filter(d => 
      d.content.includes('学习') || d.content.includes('学会') ||
      d.tags?.includes('学习')
    );
    if (matches.length > 0) {
      answer = `📚 你在日记中提到了 ${matches.length} 次学习\n\n`;
      matches.slice(0, 5).forEach(d => {
        const contentSnippet = d.content.slice(0, 50);
        answer += `• ${d.date}：${contentSnippet}...\n`;
        sources.push(d.date);
      });
    } else {
      answer = '暂未找到关于学习的记录。';
    }
    return { answer, sources };
  }

  // 最开心/最快乐
  if (lowerQ.includes('最开心') || lowerQ.includes('最快乐') || lowerQ.includes('最幸福') || lowerQ.includes('最好')) {
    const happyKeywords = ['开心', '快乐', '幸福', '棒', '好', '兴奋', '激动'];
    const matches = entries.filter(d => 
      happyKeywords.some(k => d.content.includes(k) || d.mood?.includes(k))
    );
    if (matches.length > 0) {
      const best = matches[0];
      answer = `😊 根据日记记录，你很开心的一天是：\n\n`;
      answer += `📅 ${best.date}\n`;
      answer += `📝 ${best.title}\n\n`;
      answer += best.content.slice(0, 150) + (best.content.length > 150 ? '...' : '');
      sources.push(best.date);
    } else {
      answer = '暂未找到明确的开心记录。';
    }
    return { answer, sources };
  }

  // 最近在做什么
  if (lowerQ.includes('最近') || lowerQ.includes('这段时间')) {
    const recent = entries.slice(0, 5);
    answer = `📋 最近 ${recent.length} 天的日记摘要：\n\n`;
    recent.forEach(d => {
      answer += `• ${d.date}：${d.title}\n`;
      sources.push(d.date);
    });
    return { answer, sources };
  }

  // 默认：关键词搜索
  const keywords = extractKeywords(question);
  if (keywords.length > 0) {
    const scored = entries.map(e => ({
      entry: e,
      score: calculateRelevance(e, keywords)
    })).filter(s => s.score > 0).sort((a, b) => b.score - a.score);

    if (scored.length > 0) {
      answer = `🔍 找到 ${scored.length} 条相关记录：\n\n`;
      scored.slice(0, 5).forEach(s => {
        answer += `• ${s.entry.date}：${s.entry.title}\n`;
        sources.push(s.entry.date);
      });
      if (scored.length > 5) answer += `\n...还有 ${scored.length - 5} 条记录`;
    } else {
      answer = `抱歉，没有找到关于「${keywords.join('、')}」的相关记录。\n\n你可以试试其他关键词，或者先写几篇日记让我了解更多你！`;
    }
  } else {
    answer = '请告诉我你想查找什么内容？例如：\n\n• 你提到了几次咖啡？\n• 最近在学什么？\n• 最开心的一天是哪天？';
  }

  return { answer, sources };
}

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();
    
    if (!question) {
      return NextResponse.json({ error: '请提供问题' }, { status: 400 });
    }

    const entries = diaryData as DiaryEntry[];
    const { answer, sources } = generateAnswer(question, entries);

    return NextResponse.json({
      answer,
      sources,
      totalEntries: entries.length
    });
    
  } catch (error) {
    console.error('Diary QA error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}