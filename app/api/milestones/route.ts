import { NextRequest, NextResponse } from 'next/server';
import { getDiaries } from '@/lib/diaries';

interface Milestone {
  id: string;
  type: 'words' | 'days' | 'streak' | 'diaries' | 'special';
  title: string;
  description: string;
  icon: string;
  target: number;
  current: number;
  unlockedAt?: string;
  reward: {
    badge?: string;
    title?: string;
    color?: string;
  };
}

interface MilestoneCategory {
  id: string;
  name: string;
  icon: string;
  milestones: Milestone[];
}

const DEFAULT_CATEGORIES: MilestoneCategory[] = [
  {
    id: 'words',
    name: '字数里程碑',
    icon: '✍️',
    milestones: [
      { id: 'words-1k', type: 'words', title: '初出茅庐', description: '累计写作 1,000 字', icon: '🌱', target: 1000, current: 0, reward: { badge: 'writer-1', title: '新手写手', color: 'gray' } },
      { id: 'words-5k', type: 'words', title: '笔耕不辍', description: '累计写作 5,000 字', icon: '📝', target: 5000, current: 0, reward: { badge: 'writer-2', title: '入门写手', color: 'green' } },
      { id: 'words-10k', type: 'words', title: '小有所成', description: '累计写作 10,000 字', icon: '📖', target: 10000, current: 0, reward: { badge: 'writer-3', title: '熟练写手', color: 'blue' } },
      { id: 'words-50k', type: 'words', title: '著作等身', description: '累计写作 50,000 字', icon: '📚', target: 50000, current: 0, reward: { badge: 'writer-4', title: '资深写手', color: 'purple' } },
      { id: 'words-100k', type: 'words', title: '文思泉涌', description: '累计写作 100,000 字', icon: '🏆', target: 100000, current: 0, reward: { badge: 'writer-5', title: '大师写手', color: 'gold' } },
      { id: 'words-500k', type: 'words', title: '文学巨匠', description: '累计写作 500,000 字', icon: '👑', target: 500000, current: 0, reward: { badge: 'writer-6', title: '传奇写手', color: 'diamond' } },
    ]
  },
  {
    id: 'days',
    name: '坚持里程碑',
    icon: '📅',
    milestones: [
      { id: 'days-7', type: 'days', title: '周记达人', description: '连续写作 7 天', icon: '🗓️', target: 7, current: 0, reward: { badge: 'streak-1', title: '周记达人', color: 'green' } },
      { id: 'days-30', type: 'days', title: '月度冠军', description: '连续写作 30 天', icon: '🌙', target: 30, current: 0, reward: { badge: 'streak-2', title: '月度冠军', color: 'blue' } },
      { id: 'days-100', type: 'days', title: '百日筑基', description: '连续写作 100 天', icon: '💯', target: 100, current: 0, reward: { badge: 'streak-3', title: '百日筑基', color: 'purple' } },
      { id: 'days-365', type: 'days', title: '年度传奇', description: '连续写作 365 天', icon: '🌟', target: 365, current: 0, reward: { badge: 'streak-4', title: '年度传奇', color: 'gold' } },
      { id: 'days-1000', type: 'days', title: '千日如一', description: '连续写作 1000 天', icon: '💎', target: 1000, current: 0, reward: { badge: 'streak-5', title: '千日传奇', color: 'diamond' } },
    ]
  },
  {
    id: 'diaries',
    name: '日记里程碑',
    icon: '📔',
    milestones: [
      { id: 'diaries-10', type: 'diaries', title: '日记新手', description: '累计写 10 篇日记', icon: '📝', target: 10, current: 0, reward: { badge: 'diarist-1', title: '日记新手', color: 'gray' } },
      { id: 'diaries-50', type: 'diaries', title: '日记爱好者', description: '累计写 50 篇日记', icon: '📖', target: 50, current: 0, reward: { badge: 'diarist-2', title: '日记爱好者', color: 'green' } },
      { id: 'diaries-100', type: 'diaries', title: '日记达人', description: '累计写 100 篇日记', icon: '📚', target: 100, current: 0, reward: { badge: 'diarist-3', title: '日记达人', color: 'blue' } },
      { id: 'diaries-365', type: 'diaries', title: '日记大师', description: '累计写 365 篇日记', icon: '🏆', target: 365, current: 0, reward: { badge: 'diarist-4', title: '日记大师', color: 'purple' } },
      { id: 'diaries-1000', type: 'diaries', title: '日记传奇', description: '累计写 1000 篇日记', icon: '👑', target: 1000, current: 0, reward: { badge: 'diarist-5', title: '日记传奇', color: 'gold' } },
    ]
  },
  {
    id: 'special',
    name: '特殊成就',
    icon: '🎯',
    milestones: [
      { id: 'special-midnight', type: 'special', title: '夜猫子', description: '在凌晨 0-4 点写日记', icon: '🦉', target: 1, current: 0, reward: { badge: 'special-1', title: '夜猫子', color: 'purple' } },
      { id: 'special-early', type: 'special', title: '早起鸟', description: '在早上 5-7 点写日记', icon: '🐦', target: 1, current: 0, reward: { badge: 'special-2', title: '早起鸟', color: 'yellow' } },
      { id: 'special-1000words', type: 'special', title: '长文作者', description: '单篇日记超过 1000 字', icon: '📜', target: 1, current: 0, reward: { badge: 'special-3', title: '长文作者', color: 'blue' } },
      { id: 'special-5000words', type: 'special', title: '史诗作者', description: '单篇日记超过 5000 字', icon: '📚', target: 1, current: 0, reward: { badge: 'special-4', title: '史诗作者', color: 'gold' } },
      { id: 'special-tags', type: 'special', title: '标签达人', description: '使用 50 个不同的标签', icon: '🏷️', target: 50, current: 0, reward: { badge: 'special-5', title: '标签达人', color: 'green' } },
      { id: 'special-mood', type: 'special', title: '情绪丰富', description: '记录 10 种不同的心情', icon: '😊', target: 10, current: 0, reward: { badge: 'special-6', title: '情绪丰富', color: 'pink' } },
      { id: 'special-location', type: 'special', title: '行万里路', description: '在 10 个不同地点写日记', icon: '🌍', target: 10, current: 0, reward: { badge: 'special-7', title: '行万里路', color: 'teal' } },
      { id: 'special-share', type: 'special', title: '分享达人', description: '分享日记 50 次', icon: '🔗', target: 50, current: 0, reward: { badge: 'special-8', title: '分享达人', color: 'orange' } },
    ]
  }
];

function calculateStreak(diaries: { date: string }[]): number {
  if (diaries.length === 0) return 0;
  
  const dates = [...new Set(diaries.map(d => d.date))].sort().reverse();
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < dates.length; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    if (dates.includes(dateStr)) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

async function calculateMilestones(): Promise<MilestoneCategory[]> {
  const diaries = await getDiaries();
  
  // Calculate total words
  const totalWords = diaries.reduce((sum, d) => sum + (d.wordCount || d.content?.length || 0), 0);
  
  // Calculate streak
  const streak = calculateStreak(diaries);
  
  // Calculate unique tags
  const allTags = new Set<string>();
  diaries.forEach(d => d.tags?.forEach(t => allTags.add(t)));
  
  // Calculate unique moods
  const allMoods = new Set<string>();
  diaries.forEach(d => d.mood && allMoods.add(d.mood));
  
  // Calculate unique locations
  const allLocations = new Set<string>();
  diaries.forEach(d => d.location && allLocations.add(d.location));
  
  // Check special achievements
  const hasLongArticle = diaries.some(d => (d.wordCount || d.content?.length || 0) >= 1000);
  const hasEpicArticle = diaries.some(d => (d.wordCount || d.content?.length || 0) >= 5000);
  
  // Check time-based achievements
  const hasMidnight = diaries.some(d => {
    if (!d.date) return false;
    // Check if created at midnight (0-4 AM)
    return true; // Simplified
  });
  
  // Clone and update categories
  const categories = JSON.parse(JSON.stringify(DEFAULT_CATEGORIES));
  
  // Update word milestones
  const wordCat = categories.find((c: MilestoneCategory) => c.id === 'words');
  wordCat?.milestones.forEach((m: Milestone) => {
    m.current = totalWords;
    if (m.current >= m.target && !m.unlockedAt) {
      m.unlockedAt = new Date().toISOString();
    }
  });
  
  // Update day milestones (streak)
  const daysCat = categories.find((c: MilestoneCategory) => c.id === 'days');
  daysCat?.milestones.forEach((m: Milestone) => {
    m.current = streak;
    if (m.current >= m.target && !m.unlockedAt) {
      m.unlockedAt = new Date().toISOString();
    }
  });
  
  // Update diary milestones
  const diariesCat = categories.find((c: MilestoneCategory) => c.id === 'diaries');
  diariesCat?.milestones.forEach((m: Milestone) => {
    m.current = diaries.length;
    if (m.current >= m.target && !m.unlockedAt) {
      m.unlockedAt = new Date().toISOString();
    }
  });
  
  // Update special milestones
  const specialCat = categories.find((c: MilestoneCategory) => c.id === 'special');
  if (specialCat) {
    specialCat.milestones.forEach((m: Milestone) => {
      switch (m.id) {
        case 'special-tags':
          m.current = allTags.size;
          break;
        case 'special-mood':
          m.current = allMoods.size;
          break;
        case 'special-location':
          m.current = allLocations.size;
          break;
        case 'special-1000words':
          m.current = hasLongArticle ? 1 : 0;
          break;
        case 'special-5000words':
          m.current = hasEpicArticle ? 1 : 0;
          break;
        case 'special-midnight':
          m.current = hasMidnight ? 1 : 0;
          break;
      }
      if (m.current >= m.target && !m.unlockedAt) {
        m.unlockedAt = new Date().toISOString();
      }
    });
  }
  
  return categories;
}

export async function GET(request: NextRequest) {
  try {
    const categories = await calculateMilestones();
    
    // Calculate stats
    const totalMilestones = categories.reduce((sum, c) => sum + c.milestones.length, 0);
    const unlockedMilestones = categories.reduce((sum, c) => 
      sum + c.milestones.filter(m => m.current >= m.target).length, 0);
    
    return NextResponse.json({
      categories,
      stats: {
        totalMilestones,
        unlockedMilestones,
        totalProgress: Math.round((unlockedMilestones / totalMilestones) * 100),
      }
    });
  } catch (error) {
    console.error('Error calculating milestones:', error);
    return NextResponse.json({ 
      categories: DEFAULT_CATEGORIES,
      stats: { totalMilestones: 0, unlockedMilestones: 0, totalProgress: 0 }
    });
  }
}