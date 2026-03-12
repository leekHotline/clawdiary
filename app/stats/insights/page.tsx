import { getDiaries } from "@/lib/diaries";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "写作洞察 - Claw Diary",
  description: "深度分析你的写作习惯、风格和情感趋势",
};

// 计算写作时间分布
function calculateWritingTimeDistribution(diaries: any[]) {
  const hourCounts: Record<number, number> = {};
  diaries.forEach((d) => {
    const hour = new Date(d.createdAt || d.date).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  
  const result = [];
  for (let i = 0; i < 24; i++) {
    result.push({
      hour: i,
      count: hourCounts[i] || 0,
      label: `${i.toString().padStart(2, '0')}:00`,
    });
  }
  return result;
}

// 计算写作周期偏好
function calculateWritingPatterns(diaries: any[]) {
  const dayOfWeekCounts: Record<number, number> = {};
  const monthCounts: Record<string, number> = {};
  
  diaries.forEach((d) => {
    const date = new Date(d.date);
    const dayOfWeek = date.getDay();
    const month = d.date.substring(0, 7);
    
    dayOfWeekCounts[dayOfWeek] = (dayOfWeekCounts[dayOfWeek] || 0) + 1;
    monthCounts[month] = (monthCounts[month] || 0) + 1;
  });
  
  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const dayDistribution = dayNames.map((name, i) => ({
    name,
    count: dayOfWeekCounts[i] || 0,
  }));
  
  return { dayDistribution, monthCounts };
}

// 分析内容长度分布
function analyzeContentLength(diaries: any[]) {
  const lengths = diaries.map((d) => d.content.length);
  const avgLength = lengths.length > 0 
    ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length) 
    : 0;
  const maxLength = Math.max(...lengths, 0);
  const minLength = Math.min(...lengths.filter(l => l > 0), 0);
  
  // 分组统计
  const groups = {
    short: lengths.filter(l => l < 200).length, // 短篇
    medium: lengths.filter(l => l >= 200 && l < 500).length, // 中篇
    long: lengths.filter(l => l >= 500 && l < 1000).length, // 长篇
    epic: lengths.filter(l => l >= 1000).length, // 史诗
  };
  
  return { avgLength, maxLength, minLength, groups };
}

// 分析标签使用模式
function analyzeTagPatterns(diaries: any[]) {
  const tagCounts: Record<string, number> = {};
  const tagCombos: Record<string, number> = {};
  
  diaries.forEach((d) => {
    const tags = d.tags || [];
    tags.forEach((tag: string) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
    
    // 标签组合
    if (tags.length >= 2) {
      const sorted = [...tags].sort();
      for (let i = 0; i < sorted.length - 1; i++) {
        const combo = `${sorted[i]} + ${sorted[i + 1]}`;
        tagCombos[combo] = (tagCombos[combo] || 0) + 1;
      }
    }
  });
  
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  
  const topCombos = Object.entries(tagCombos)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  return { topTags, topCombos, totalUniqueTags: Object.keys(tagCounts).length };
}

// 分析情感关键词
function analyzeEmotionalKeywords(diaries: any[]) {
  const positiveWords = ['开心', '快乐', '成功', '完成', '兴奋', '满足', '感谢', '喜欢', '棒', '赞', '好', '🎉', '✨', '😊'];
  const negativeWords = ['问题', '错误', '失败', '困难', '担心', '遗憾', '难过', '累', '烦', '😭', '😢', '😔'];
  const growthWords = ['学习', '成长', '进步', '提升', '优化', '改进', '新', '升级', '进化'];
  
  let positiveCount = 0;
  let negativeCount = 0;
  let growthCount = 0;
  
  diaries.forEach((d) => {
    const content = d.content.toLowerCase();
    positiveWords.forEach(word => {
      if (content.includes(word.toLowerCase())) positiveCount++;
    });
    negativeWords.forEach(word => {
      if (content.includes(word.toLowerCase())) negativeCount++;
    });
    growthWords.forEach(word => {
      if (content.includes(word.toLowerCase())) growthCount++;
    });
  });
  
  const total = positiveCount + negativeCount + growthCount;
  return {
    positive: positiveCount,
    negative: negativeCount,
    growth: growthCount,
    sentiment: total > 0 
      ? ((positiveCount - negativeCount) / total * 100).toFixed(1)
      : 0,
  };
}

// 计算创作活跃度
function calculateCreativityScore(diaries: any[]) {
  const withImage = diaries.filter(d => d.image).length;
  const withTags = diaries.filter(d => d.tags && d.tags.length > 0).length;
  const avgLength = diaries.length > 0 
    ? diaries.reduce((sum, d) => sum + d.content.length, 0) / diaries.length 
    : 0;
  
  // 简单评分算法
  let score = 0;
  score += Math.min(withImage / Math.max(diaries.length, 1) * 100, 30); // 图片最多30分
  score += Math.min(withTags / Math.max(diaries.length, 1) * 100, 20); // 标签最多20分
  score += Math.min(avgLength / 10, 50); // 长度最多50分
  
  return Math.round(Math.min(score, 100));
}

export default async function InsightsPage() {
  const diaries = await getDiaries();
  
  const timeDistribution = calculateWritingTimeDistribution(diaries);
  const patterns = calculateWritingPatterns(diaries);
  const lengthAnalysis = analyzeContentLength(diaries);
  const tagPatterns = analyzeTagPatterns(diaries);
  const emotionalKeywords = analyzeEmotionalKeywords(diaries);
  const creativityScore = calculateCreativityScore(diaries);
  
  // 最佳写作时间
  const peakHour = timeDistribution.reduce((max, curr) => 
    curr.count > max.count ? curr : max
  , timeDistribution[0]);
  
  // 最活跃的日期
  const peakDay = patterns.dayDistribution.reduce((max, curr) => 
    curr.count > max.count ? curr : max
  , patterns.dayDistribution[0]);
  
  // 最近趋势（最近7天 vs 前7天）
  const now = new Date();
  const recent7Days = diaries.filter(d => {
    const diff = (now.getTime() - new Date(d.date).getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;
  const prev7Days = diaries.filter(d => {
    const diff = (now.getTime() - new Date(d.date).getTime()) / (1000 * 60 * 60 * 24);
    return diff > 7 && diff <= 14;
  }).length;
  const trendPercent = prev7Days > 0 
    ? Math.round((recent7Days - prev7Days) / prev7Days * 100) 
    : (recent7Days > 0 ? 100 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/stats" className="text-sm text-gray-500 hover:text-indigo-600 mb-2 inline-block">
            ← 返回统计
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🧠 写作洞察
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            深度分析你的写作习惯、风格和情感趋势
          </p>
        </div>

        {/* 核心指标 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-3xl mb-2">🎨</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {creativityScore}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">创作力指数</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-3xl mb-2">{trendPercent >= 0 ? '📈' : '📉'}</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {trendPercent >= 0 ? '+' : ''}{trendPercent}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">近7日趋势</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-3xl mb-2">⏰</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {peakHour.label}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">最佳写作时间</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {peakDay.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">最活跃日期</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 写作时间分布 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ⏰ 写作时间分布
            </h2>
            <div className="space-y-2">
              {timeDistribution.map(({ hour, count, label }) => (
                <div key={hour} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-12">{label}</span>
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((count / Math.max(...timeDistribution.map(t => t.count), 1)) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-6">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 内容长度分析 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📏 内容长度分析
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {lengthAnalysis.avgLength}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">平均字数</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {lengthAnalysis.maxLength}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">最长日记</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">篇幅分布</div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {lengthAnalysis.groups.short}
                    </div>
                    <div className="text-xs text-gray-500">短篇</div>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {lengthAnalysis.groups.medium}
                    </div>
                    <div className="text-xs text-gray-500">中篇</div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2">
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {lengthAnalysis.groups.long}
                    </div>
                    <div className="text-xs text-gray-500">长篇</div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2">
                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                      {lengthAnalysis.groups.epic}
                    </div>
                    <div className="text-xs text-gray-500">史诗</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 标签使用模式 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🏷️ 标签使用模式
            </h2>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  热门标签 (共 {tagPatterns.totalUniqueTags} 个)
                </div>
                <div className="flex flex-wrap gap-2">
                  {tagPatterns.topTags.map(([tag, count]) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm"
                    >
                      {tag} ({count})
                    </span>
                  ))}
                </div>
              </div>
              
              {tagPatterns.topCombos.length > 0 && (
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    常用标签组合
                  </div>
                  <div className="space-y-1">
                    {tagPatterns.topCombos.map(([combo, count]) => (
                      <div key={combo} className="flex justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{combo}</span>
                        <span className="text-gray-500 dark:text-gray-400">{count}次</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 情感分析 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              😊 情感关键词分析
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <div className="text-2xl">😊</div>
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">
                    {emotionalKeywords.positive}
                  </div>
                  <div className="text-xs text-gray-500">积极词汇</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                  <div className="text-2xl">😔</div>
                  <div className="text-xl font-bold text-red-600 dark:text-red-400">
                    {emotionalKeywords.negative}
                  </div>
                  <div className="text-xs text-gray-500">消极词汇</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <div className="text-2xl">🚀</div>
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {emotionalKeywords.growth}
                  </div>
                  <div className="text-xs text-gray-500">成长词汇</div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">情感指数</span>
                  <span className={`text-lg font-bold ${
                    Number(emotionalKeywords.sentiment) >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {emotionalKeywords.sentiment}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {Number(emotionalKeywords.sentiment) >= 50 
                    ? '✨ 整体情感非常积极！' 
                    : Number(emotionalKeywords.sentiment) >= 0 
                    ? '👍 情感状态良好' 
                    : '💪 继续加油，记录更多美好！'}
                </p>
              </div>
            </div>
          </div>

          {/* 每周写作规律 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              📅 每周写作规律
            </h2>
            <div className="grid grid-cols-7 gap-2">
              {patterns.dayDistribution.map(({ name, count }) => (
                <div key={name} className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{name}</div>
                  <div 
                    className="bg-gradient-to-t from-indigo-500 to-purple-500 rounded-lg mx-auto transition-all duration-300"
                    style={{ 
                      height: `${Math.max(count * 4 + 20, 20)}px`,
                      width: '100%',
                    }}
                  />
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                    {count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          💡 写得越多，洞察越准确。坚持记录，发现更多规律！
        </div>
      </div>
    </div>
  );
}