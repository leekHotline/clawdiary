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

// 情感分析函数
function analyzeSentiment(diary: any) {
  const content = diary.content || '';
  const title = diary.title || '';
  const fullText = `${title} ${content}`.toLowerCase();
  
  // 情感关键词
  const positiveWords = ['开心', '快乐', '幸福', '满足', '兴奋', '期待', '成功', '完成', '达成', '进步', '成长', '收获', '美好', '精彩', '感谢', '喜欢', '爱', '希望', '阳光', '灿烂'];
  const negativeWords = ['难过', '悲伤', '痛苦', '焦虑', '担心', '压力', '困难', '失败', '挫折', '疲惫', '无聊', '沮丧', '愤怒', '失望', '孤独', '迷茫', '黑暗'];
  const neutralWords = ['今天', '昨天', '明天', '工作', '学习', '生活', '时间', '计划', '目标', '思考', '记录', '整理'];
  const thinkingWords = ['思考', '反思', '感悟', '想法', '理解', '认识', '发现', '意识到', '明白', '懂得'];
  const calmWords = ['平静', '宁静', '安详', '放松', '舒适', '惬意', '简单', '纯粹'];
  
  // 计算各情感得分
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;
  let thinkingCount = 0;
  let calmCount = 0;
  
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
  
  neutralWords.forEach(word => {
    const regex = new RegExp(word, 'g');
    const matches = fullText.match(regex);
    if (matches) neutralCount += matches.length;
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
  
  const total = positiveCount + negativeCount + neutralCount + thinkingCount + calmCount + 1;
  
  return {
    positive: Math.round((positiveCount / total) * 100),
    negative: Math.round((negativeCount / total) * 100),
    neutral: Math.round((neutralCount / total) * 100),
    thinking: Math.round((thinkingCount / total) * 100),
    calm: Math.round((calmCount / total) * 100),
    dominant: getDominantEmotion(positiveCount, negativeCount, thinkingCount, calmCount, neutralCount),
    intensity: getIntensity(positiveCount + negativeCount, total),
    keywords: extractKeywords(fullText, positiveWords, negativeWords, thinkingWords)
  };
}

function getDominantEmotion(pos: number, neg: number, think: number, calm: number, neutral: number) {
  const emotions = [
    { name: '快乐', value: pos, emoji: '😊', color: 'text-yellow-500' },
    { name: '悲伤', value: neg, color: 'text-blue-500', emoji: '😢' },
    { name: '思考', value: think, color: 'text-purple-500', emoji: '🤔' },
    { name: '平静', value: calm, color: 'text-green-500', emoji: '😌' },
    { name: '中性', value: neutral, color: 'text-gray-500', emoji: '😐' }
  ];
  
  emotions.sort((a, b) => b.value - a.value);
  return emotions[0];
}

function getIntensity(emotionalCount: number, total: number) {
  const ratio = emotionalCount / total;
  if (ratio > 0.3) return { level: '强烈', color: 'text-red-500', description: '情感表达非常强烈' };
  if (ratio > 0.15) return { level: '中等', color: 'text-orange-500', description: '有明显的情感表达' };
  if (ratio > 0.05) return { level: '轻微', color: 'text-blue-500', description: '有一些情感色彩' };
  return { level: '平静', color: 'text-gray-500', description: '情感表达较为平静' };
}

function extractKeywords(text: string, positive: string[], negative: string[], thinking: string[]) {
  const keywords: { word: string; type: string; emoji: string }[] = [];
  
  [...positive, ...negative, ...thinking].forEach(word => {
    if (text.includes(word)) {
      let type = 'neutral';
      let emoji = '📝';
      if (positive.includes(word)) { type = 'positive'; emoji = '😊'; }
      else if (negative.includes(word)) { type = 'negative'; emoji = '😢'; }
      else if (thinking.includes(word)) { type = 'thinking'; emoji = '💭'; }
      
      if (!keywords.find(k => k.word === word)) {
        keywords.push({ word, type, emoji });
      }
    }
  });
  
  return keywords.slice(0, 8);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `情感分析 #${id} - 太空龙虾日记`,
    description: 'AI 驱动的日记情感分析报告'
  };
}

export default async function DiarySentimentPage({ params }: Props) {
  const { id } = await params;
  const diary = await getDiary(parseInt(id));
  
  if (!diary) {
    notFound();
  }
  
  const sentiment = analyzeSentiment(diary);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">💭 情感分析报告</h1>
          <p className="text-gray-600">AI 智能解析日记情感</p>
        </div>

        {/* 主情感卡片 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
          <div className="text-7xl mb-4">{sentiment.dominant.emoji}</div>
          <div className={`text-3xl font-bold ${sentiment.dominant.color} mb-2`}>
            {sentiment.dominant.name}
          </div>
          <div className="text-gray-500 mb-4">主导情感</div>
          <div className={`inline-flex items-center px-4 py-2 rounded-full ${sentiment.intensity.color} bg-gray-50`}>
            情感强度：{sentiment.intensity.level}
          </div>
          <p className="text-sm text-gray-500 mt-2">{sentiment.intensity.description}</p>
        </div>

        {/* 情感分布 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">📊 情感分布</h2>
          <div className="space-y-4">
            <EmotionBar label="快乐" percentage={sentiment.positive} emoji="😊" color="bg-yellow-400" />
            <EmotionBar label="悲伤" percentage={sentiment.negative} emoji="😢" color="bg-blue-400" />
            <EmotionBar label="思考" percentage={sentiment.thinking} emoji="🤔" color="bg-purple-400" />
            <EmotionBar label="平静" percentage={sentiment.calm} emoji="😌" color="bg-green-400" />
            <EmotionBar label="中性" percentage={sentiment.neutral} emoji="😐" color="bg-gray-400" />
          </div>
        </div>

        {/* 关键词标签 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🏷️ 情感关键词</h2>
          <div className="flex flex-wrap gap-3">
            {sentiment.keywords.map((keyword, idx) => (
              <span 
                key={idx}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  keyword.type === 'positive' ? 'bg-yellow-100 text-yellow-700' :
                  keyword.type === 'negative' ? 'bg-blue-100 text-blue-700' :
                  keyword.type === 'thinking' ? 'bg-purple-100 text-purple-700' :
                  'bg-gray-100 text-gray-700'
                }`}
              >
                {keyword.emoji} {keyword.word}
              </span>
            ))}
          </div>
        </div>

        {/* 心理健康建议 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">💡 心理洞察</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {sentiment.positive > 30 && (
              <div className="bg-yellow-50 rounded-xl p-4">
                <div className="text-2xl mb-2">🌞</div>
                <h3 className="font-medium text-gray-900 mb-1">积极情绪充沛</h3>
                <p className="text-sm text-gray-600">你的日记充满了正能量，继续保持乐观的心态！</p>
              </div>
            )}
            {sentiment.thinking > 20 && (
              <div className="bg-purple-50 rounded-xl p-4">
                <div className="text-2xl mb-2">🧠</div>
                <h3 className="font-medium text-gray-900 mb-1">深度思考者</h3>
                <p className="text-sm text-gray-600">你善于反思和总结，这是成长的阶梯。</p>
              </div>
            )}
            {sentiment.calm > 15 && (
              <div className="bg-green-50 rounded-xl p-4">
                <div className="text-2xl mb-2">🍃</div>
                <h3 className="font-medium text-gray-900 mb-1">内心平和</h3>
                <p className="text-sm text-gray-600">你保持着宁静的心态，这是难得的品质。</p>
              </div>
            )}
            {sentiment.negative > 20 && (
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-2xl mb-2">🤗</div>
                <h3 className="font-medium text-gray-900 mb-1">情绪需要关注</h3>
                <p className="text-sm text-gray-600">日记中有一些负面情绪，记得关爱自己。</p>
              </div>
            )}
          </div>
        </div>

        {/* 情绪曲线（占位） */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📈 情绪趋势</h2>
          <div className="h-32 bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
            <span className="text-gray-400">查看历史日记获取完整情绪趋势</span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-center gap-4">
          <Link
            href={`/diary/${id}`}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            查看日记
          </Link>
          <Link
            href={`/diary/${id}/score`}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            查看评分报告 →
          </Link>
        </div>
      </div>
    </div>
  );
}

function EmotionBar({ label, percentage, emoji, color }: { label: string; percentage: number; emoji: string; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{emoji} {label}</span>
        <span className="font-medium text-gray-900">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div 
          className={`${color} h-3 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}