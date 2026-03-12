import { NextRequest, NextResponse } from 'next/server';

// 模拟日记数据
const diaries = [
  { id: 1, title: '开始写日记', content: '今天开始了写日记的旅程...', date: '2026-01-01', author: '太空龙虾', tags: ['开始', '日记'], wordCount: 256, likes: 5 },
  { id: 2, title: '第二天', content: '继续写日记...', date: '2026-01-02', author: '太空龙虾', tags: ['日记'], wordCount: 180, likes: 3 },
];

// 计算日记评分
function calculateScore(diary: any) {
  let score = 0;
  const details: { category: string; score: number; max: number; items: string[] }[] = [];

  // 内容质量 (40分)
  let contentScore = 0;
  const contentItems: string[] = [];
  
  if (diary.wordCount >= 500) { contentScore += 15; contentItems.push('字数丰富 (+15)'); }
  else if (diary.wordCount >= 300) { contentScore += 12; contentItems.push('字数充实 (+12)'); }
  else if (diary.wordCount >= 150) { contentScore += 8; contentItems.push('字数适中 (+8)'); }
  else { contentScore += 5; contentItems.push('字数较少 (+5)'); }
  
  if (diary.title && diary.title.length > 5) { contentScore += 8; contentItems.push('标题完整 (+8)'); }
  else { contentScore += 3; contentItems.push('标题简短 (+3)'); }
  
  if (diary.content?.includes('##') || diary.content?.includes('**')) { 
    contentScore += 10; 
    contentItems.push('结构清晰 (+10)'); 
  } else { 
    contentScore += 5; 
    contentItems.push('可优化结构 (+5)'); 
  }
  
  if (diary.tags?.length >= 3) { contentScore += 7; contentItems.push('标签丰富 (+7)'); }
  else if (diary.tags?.length >= 1) { contentScore += 4; contentItems.push('有标签 (+4)'); }
  else { contentItems.push('建议添加标签 (+0)'); }
  
  details.push({ category: '内容质量', score: contentScore, max: 40, items: contentItems });
  score += contentScore;

  // 情感丰富度 (25分)
  let emotionScore = 0;
  const emotionItems: string[] = [];
  
  if (diary.mood) { emotionScore += 8; emotionItems.push('记录心情 (+8)'); }
  else { emotionItems.push('建议记录心情 (+0)'); }
  
  if (diary.content?.match(/[😀-🙏🌀-🗿🚀-🛿]/)) { 
    emotionScore += 7; 
    emotionItems.push('情感表达丰富 (+7)'); 
  } else { 
    emotionScore += 3; 
    emotionItems.push('可增加情感表达 (+3)'); 
  }
  
  if (diary.weather) { emotionScore += 5; emotionItems.push('记录天气 (+5)'); }
  else { emotionItems.push('建议记录天气 (+0)'); }
  
  if (diary.location) { emotionScore += 5; emotionItems.push('记录位置 (+5)'); }
  else { emotionItems.push('建议记录位置 (+0)'); }
  
  details.push({ category: '情感丰富度', score: emotionScore, max: 25, items: emotionItems });
  score += emotionScore;

  // 完整性 (20分)
  let completeScore = 0;
  const completeItems: string[] = [];
  
  if (diary.title) { completeScore += 5; completeItems.push('有标题 (+5)'); }
  else { completeItems.push('缺少标题 (+0)'); }
  
  if (diary.tags?.length > 0) { completeScore += 5; completeItems.push('有标签 (+5)'); }
  else { completeItems.push('缺少标签 (+0)'); }
  
  if (diary.author) { completeScore += 5; completeItems.push('有作者 (+5)'); }
  else { completeItems.push('缺少作者 (+0)'); }
  
  if (diary.createdAt) { completeScore += 5; completeItems.push('有时间戳 (+5)'); }
  else { completeItems.push('缺少时间戳 (+0)'); }
  
  details.push({ category: '完整性', score: completeScore, max: 20, items: completeItems });
  score += completeScore;

  // 互动性 (15分)
  let interactScore = 0;
  const interactItems: string[] = [];
  
  const likes = diary.likes || 0;
  if (likes >= 10) { interactScore += 8; interactItems.push(`受欢迎 (${likes}赞) (+8)`); }
  else if (likes >= 5) { interactScore += 6; interactItems.push(`互动良好 (${likes}赞) (+6)`); }
  else if (likes >= 1) { interactScore += 3; interactItems.push(`有互动 (${likes}赞) (+3)`); }
  else { interactItems.push('暂无点赞 (+0)'); }
  
  const comments = diary.comments?.length || 0;
  if (comments >= 5) { interactScore += 7; interactItems.push(`讨论热烈 (${comments}评) (+7)`); }
  else if (comments >= 1) { interactScore += 3; interactItems.push(`有评论 (${comments}评) (+3)`); }
  else { interactItems.push('暂无评论 (+0)'); }
  
  details.push({ category: '互动性', score: interactScore, max: 15, items: interactItems });
  score += interactScore;

  return { total: score, details };
}

// 获取等级和徽章
function getGrade(score: number) {
  if (score >= 90) return { grade: '杰出', badge: '💎', color: 'purple' };
  if (score >= 80) return { grade: '优秀', badge: '🏆', color: 'yellow' };
  if (score >= 70) return { grade: '良好', badge: '⭐', color: 'blue' };
  if (score >= 60) return { grade: '及格', badge: '✅', color: 'green' };
  return { grade: '待提升', badge: '📝', color: 'gray' };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const diaryId = parseInt(id);
  
  // 查找日记（这里使用模拟数据，实际应从数据库获取）
  const diary = diaries.find(d => d.id === diaryId) || {
    id: diaryId,
    title: `日记 #${diaryId}`,
    content: '日记内容...',
    date: new Date().toISOString().split('T')[0],
    author: '太空龙虾',
    tags: ['日记'],
    wordCount: Math.floor(Math.random() * 500) + 100,
    likes: Math.floor(Math.random() * 10),
    comments: [],
    createdAt: new Date().toISOString()
  };
  
  const scoreResult = calculateScore(diary);
  const gradeInfo = getGrade(scoreResult.total);
  
  return NextResponse.json({
    diaryId: diary.id,
    title: diary.title,
    score: scoreResult.total,
    grade: gradeInfo,
    details: scoreResult.details,
    suggestions: generateSuggestions(scoreResult)
  });
}

function generateSuggestions(scoreResult: { total: number; details: { category: string; score: number; max: number }[] }) {
  const suggestions: string[] = [];
  
  scoreResult.details.forEach(detail => {
    if (detail.score < detail.max * 0.5) {
      suggestions.push(`提升「${detail.category}」可以显著改善整体评分`);
    }
  });
  
  if (suggestions.length === 0 && scoreResult.total >= 90) {
    suggestions.push('这篇日记已经非常优秀，继续保持！');
  }
  
  return suggestions;
}