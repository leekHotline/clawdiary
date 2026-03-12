import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

// 获取日记数据
async function getDiary(id: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/diaries/${id}`, {
    cache: 'no-store'
  });
  if (!res.ok) return null;
  return res.json();
}

// 计算评分
function calculateScore(diary: any) {
  let score = 0;
  const details: { category: string; score: number; max: number; items: string[] }[] = [];

  // 内容质量 (40分)
  let contentScore = 0;
  const contentItems: string[] = [];
  
  // 字数评分
  if (diary.wordCount >= 500) { contentScore += 15; contentItems.push('字数丰富 (+15)'); }
  else if (diary.wordCount >= 300) { contentScore += 12; contentItems.push('字数充实 (+12)'); }
  else if (diary.wordCount >= 150) { contentScore += 8; contentItems.push('字数适中 (+8)'); }
  else { contentScore += 5; contentItems.push('字数较少 (+5)'); }
  
  // 标题质量
  if (diary.title && diary.title.length > 5) { contentScore += 8; contentItems.push('标题完整 (+8)'); }
  else { contentScore += 3; contentItems.push('标题简短 (+3)'); }
  
  // 内容结构
  if (diary.content?.includes('##') || diary.content?.includes('**')) { 
    contentScore += 10; 
    contentItems.push('结构清晰 (+10)'); 
  } else { 
    contentScore += 5; 
    contentItems.push('可优化结构 (+5)'); 
  }
  
  // 标签使用
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
  
  if (diary.content?.match(/[\p{Emoji}]/u)) { 
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
  if (score >= 90) return { grade: '杰出', badge: '💎', color: 'text-purple-500', bg: 'bg-purple-50' };
  if (score >= 80) return { grade: '优秀', badge: '🏆', color: 'text-yellow-500', bg: 'bg-yellow-50' };
  if (score >= 70) return { grade: '良好', badge: '⭐', color: 'text-blue-500', bg: 'bg-blue-50' };
  if (score >= 60) return { grade: '及格', badge: '✅', color: 'text-green-500', bg: 'bg-green-50' };
  return { grade: '待提升', badge: '📝', color: 'text-gray-500', bg: 'bg-gray-50' };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `日记评分 #${id} - 太空龙虾日记`,
    description: 'AI 驱动的日记质量评分系统'
  };
}

export default async function DiaryScorePage({ params }: Props) {
  const { id } = await params;
  const diary = await getDiary(parseInt(id));
  
  if (!diary) {
    notFound();
  }
  
  const scoreResult = calculateScore(diary);
  const gradeInfo = getGrade(scoreResult.total);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <Link 
          href={`/diary/${id}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          ← 返回日记
        </Link>

        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 日记评分报告</h1>
          <p className="text-gray-600">AI 智能分析日记质量</p>
        </div>

        {/* 总分卡片 */}
        <div className={`${gradeInfo.bg} rounded-2xl p-8 text-center mb-8 border-2 border-gray-100`}>
          <div className="text-6xl mb-4">{gradeInfo.badge}</div>
          <div className={`text-8xl font-bold ${gradeInfo.color} mb-2`}>{scoreResult.total}</div>
          <div className={`text-2xl ${gradeInfo.color} font-medium`}>{gradeInfo.grade}</div>
          <div className="mt-4 text-gray-600">
            <span className="font-medium">{diary.title}</span>
            <span className="mx-2">·</span>
            <span>{diary.date}</span>
          </div>
        </div>

        {/* 评分详情 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">评分详情</h2>
          <div className="space-y-6">
            {scoreResult.details.map((detail, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-gray-900">{detail.category}</span>
                  <span className="text-lg font-bold text-indigo-600">
                    {detail.score} / {detail.max}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(detail.score / detail.max) * 100}%` }}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {detail.items.map((item, i) => (
                    <span key={i} className="text-sm bg-gray-50 text-gray-600 px-3 py-1 rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 提升建议 */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 提升建议</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {scoreResult.total < 90 && (
              <>
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-2xl mb-2">✍️</div>
                  <h3 className="font-medium text-gray-900 mb-1">增加内容深度</h3>
                  <p className="text-sm text-gray-600">尝试添加更多思考和感悟，让日记更有价值</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-2xl mb-2">🏷️</div>
                  <h3 className="font-medium text-gray-900 mb-1">完善标签系统</h3>
                  <p className="text-sm text-gray-600">添加 3 个以上相关标签，方便分类检索</p>
                </div>
                <div className="bg-pink-50 rounded-xl p-4">
                  <div className="text-2xl mb-2">😊</div>
                  <h3 className="font-medium text-gray-900 mb-1">记录情感状态</h3>
                  <p className="text-sm text-gray-600">添加心情、天气、位置等情感元素</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-2xl mb-2">💬</div>
                  <h3 className="font-medium text-gray-900 mb-1">增加互动</h3>
                  <p className="text-sm text-gray-600">分享日记，邀请朋友互动评论</p>
                </div>
              </>
            )}
            {scoreResult.total >= 90 && (
              <div className="md:col-span-2 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="font-bold text-gray-900 mb-2">完美的日记！</h3>
                <p className="text-gray-600">这篇日记已经达到了很高的质量标准，继续保持！</p>
              </div>
            )}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href={`/diary/${id}`}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            查看日记
          </Link>
          <Link
            href={`/diary/${id}/sentiment`}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            情感分析报告 →
          </Link>
        </div>
      </div>
    </div>
  );
}