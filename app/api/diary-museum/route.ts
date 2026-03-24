import { NextResponse } from 'next/server';
import { getDiaries } from '@/lib/diaries';

// 博物馆展区定义
const EXHIBIT_DEFINITIONS = [
  {
    id: 'happy',
    title: '快乐时光馆',
    description: '收藏所有充满阳光和欢笑的日子',
    emoji: '😊',
    color: 'from-yellow-400 to-orange-400',
    keywords: ['开心', '快乐', '高兴', '喜悦', '笑', '幸福', '美好', '惊喜', '庆祝', '成功']
  },
  {
    id: 'growth',
    title: '成长足迹厅',
    description: '每一个挑战都是成长的垫脚石',
    emoji: '🌱',
    color: 'from-green-400 to-emerald-500',
    keywords: ['学习', '成长', '进步', '突破', '学会', '克服', '挑战', '努力', '坚持', '目标']
  },
  {
    id: 'love',
    title: '爱与温暖展区',
    description: '记录生命中最珍贵的连接',
    emoji: '❤️',
    color: 'from-pink-400 to-rose-500',
    keywords: ['爱', '感谢', '感动', '温暖', '家人', '朋友', '陪伴', '拥抱', '关心', '珍惜']
  },
  {
    id: 'dreams',
    title: '梦想星空馆',
    description: '仰望星空，追逐心中的光芒',
    emoji: '✨',
    color: 'from-purple-400 to-indigo-500',
    keywords: ['梦想', '目标', '希望', '未来', '计划', '愿望', '期待', '想象', '憧憬', '追求']
  },
  {
    id: 'insights',
    title: '顿悟时刻阁',
    description: '那些让世界突然变清晰的瞬间',
    emoji: '💡',
    color: 'from-cyan-400 to-blue-500',
    keywords: ['明白', '领悟', '发现', '意识到', '突然', '原来', '终于', '理解', '顿悟', '启发']
  },
  {
    id: 'nature',
    title: '自然漫步廊',
    description: '与大自然相遇的美好时刻',
    emoji: '🌿',
    color: 'from-teal-400 to-green-500',
    keywords: ['阳光', '天气', '雨', '花', '树', '天空', '风景', '自然', '户外', '旅行']
  }
];

export async function GET() {
  try {
    const diaries = await getDiaries();
    
    // 计算统计数据
    const totalDiaries = diaries.length;
    const totalWords = diaries.reduce((sum, d) => sum + (d.content?.length || 0), 0);
    
    // 计算写作天数
    const uniqueDates = new Set(diaries.map(d => d.date?.split('T')[0]));
    const totalDays = uniqueDates.size;
    
    // 计算开始日期
    const sortedDiaries = [...diaries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const startDate = sortedDiaries[0]?.date?.split('T')[0] || '2026-03-01';
    
    // 统计情绪数量（基于常见表情符号）
    const totalEmotions = diaries.reduce((sum, d) => {
      const content = (d.content || '') + (d.title || '');
      const emojiMatches = content.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}]/gu) || [];
      return sum + emojiMatches.length;
    }, 0);
    
    // 分析每个展区的日记数量和预览
    const exhibits = EXHIBIT_DEFINITIONS.map(def => {
      const matchedDiaries = diaries.filter(d => {
        const content = (d.content || '') + (d.title || '');
        return def.keywords.some(keyword => content.includes(keyword));
      });
      
      const preview = matchedDiaries
        .slice(0, 3)
        .map(d => d.title?.substring(0, 30) || '日记');
      
      return {
        id: def.id,
        title: def.title,
        description: def.description,
        emoji: def.emoji,
        color: def.color,
        count: matchedDiaries.length,
        preview: preview.length > 0 ? preview : ['还没有展品，快去写日记吧！', '...', '...']
      };
    });
    
    return NextResponse.json({
      success: true,
      stats: {
        totalDiaries,
        totalDays,
        totalWords,
        totalEmotions,
        startDate
      },
      exhibits,
      treasure: {
        title: '坚持的力量',
        description: `连续 ${totalDays} 天记录生活`,
        quote: '每一篇日记都是你与未来自己的一次对话。坚持本身就是最大的成就。'
      }
    });
  } catch (error) {
    console.error('Error fetching museum data:', error);
    
    // 返回默认数据
    return NextResponse.json({
      success: false,
      stats: {
        totalDiaries: 0,
        totalDays: 0,
        totalWords: 0,
        totalEmotions: 0,
        startDate: '2026-03-01'
      },
      exhibits: EXHIBIT_DEFINITIONS.map(def => ({
        id: def.id,
        title: def.title,
        description: def.description,
        emoji: def.emoji,
        color: def.color,
        count: 0,
        preview: ['还没有展品', '快去写日记吧', '博物馆等你来填满']
      }))
    });
  }
}