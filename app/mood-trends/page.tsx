// 心情趋势分析页面
export const dynamic = 'force-dynamic';

import { getDiaries } from "@/lib/diaries";
import Link from "next/link";

export const metadata = {
  title: '心情趋势 - Claw Diary',
  description: '分析你的心情变化趋势'
};

// 心情映射到数值
const moodToValue: Record<string, number> = {
  'happy': 5,
  'excited': 5,
  'joyful': 5,
  'cheerful': 4.5,
  'good': 4,
  'calm': 3.5,
  'neutral': 3,
  'okay': 3,
  'tired': 2.5,
  'bored': 2,
  'sad': 1.5,
  'anxious': 1.5,
  'stressed': 1,
  'angry': 1,
  'frustrated': 1,
  'productive': 4,
  'creative': 4.5,
  'inspired': 4.5,
  'satisfied': 4,
  'grateful': 4.5,
  'peaceful': 4,
  'melancholy': 2,
  'nostalgic': 2.5,
  'hopeful': 4,
  'determined': 4,
};

const moodEmoji: Record<string, string> = {
  'happy': '😊',
  'excited': '🤩',
  'joyful': '😄',
  'cheerful': '😁',
  'good': '🙂',
  'calm': '😌',
  'neutral': '😐',
  'okay': '😐',
  'tired': '😴',
  'bored': '😑',
  'sad': '😢',
  'anxious': '😰',
  'stressed': '😫',
  'angry': '😠',
  'frustrated': '😤',
  'productive': '💪',
  'creative': '🎨',
  'inspired': '💡',
  'satisfied': '😌',
  'grateful': '🙏',
  'peaceful': '☮️',
  'melancholy': '🥺',
  'nostalgic': '🥹',
  'hopeful': '🌟',
  'determined': '🔥',
};

export default async function MoodTrendsPage() {
  const diaries = await getDiaries();
  
  // 按日期排序
  const sortedDiaries = [...diaries].sort((a, b) => a.date.localeCompare(b.date));
  
  // 提取心情数据
  const moodData = sortedDiaries
    .filter(d => d.mood)
    .map(d => ({
      date: d.date,
      mood: d.mood!,
      value: moodToValue[d.mood!] || 3,
      title: d.title,
      id: d.id
    }));

  // 按月份统计心情
  const monthlyMood: Record<string, { count: number; total: number; moods: Record<string, number> }> = {};
  moodData.forEach(d => {
    const month = d.date.substring(0, 7);
    if (!monthlyMood[month]) {
      monthlyMood[month] = { count: 0, total: 0, moods: {} };
    }
    monthlyMood[month].count++;
    monthlyMood[month].total += d.value;
    monthlyMood[month].moods[d.mood] = (monthlyMood[month].moods[d.mood] || 0) + 1;
  });

  // 计算每月平均心情
  const monthlyAvg = Object.entries(monthlyMood)
    .map(([month, data]) => ({
      month,
      avg: data.total / data.count,
      count: data.count,
      topMood: Object.entries(data.moods).sort((a, b) => b[1] - a[1])[0]?.[0] || 'neutral'
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // 心情分布
  const moodDistribution: Record<string, number> = {};
  moodData.forEach(d => {
    moodDistribution[d.mood] = (moodDistribution[d.mood] || 0) + 1;
  });

  const topMoods = Object.entries(moodDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // 心情分类
  const positiveMoods = ['happy', 'excited', 'joyful', 'cheerful', 'good', 'calm', 'productive', 'creative', 'inspired', 'satisfied', 'grateful', 'peaceful', 'hopeful', 'determined'];
  const negativeMoods = ['sad', 'anxious', 'stressed', 'angry', 'frustrated', 'tired', 'bored', 'melancholy'];
  
  const positiveCount = moodData.filter(d => positiveMoods.includes(d.mood)).length;
  const negativeCount = moodData.filter(d => negativeMoods.includes(d.mood)).length;
  const neutralCount = moodData.length - positiveCount - negativeCount;

  // 最近心情趋势
  const recentMoods = moodData.slice(-14);
  const recentAvg = recentMoods.length > 0 
    ? recentMoods.reduce((sum, d) => sum + d.value, 0) / recentMoods.length 
    : 0;
  
  const previousMoods = moodData.slice(-28, -14);
  const previousAvg = previousMoods.length > 0 
    ? previousMoods.reduce((sum, d) => sum + d.value, 0) / previousMoods.length 
    : 0;

  const trend = recentAvg - previousAvg;

  // 生成心情曲线 SVG
  const generateMoodCurve = () => {
    if (moodData.length < 2) return '';
    
    const width = 800;
    const height = 200;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    const points = moodData.slice(-30).map((d, i) => {
      const x = padding + (i / (Math.min(moodData.length, 30) - 1)) * chartWidth;
      const y = padding + (1 - (d.value - 1) / 4) * chartHeight;
      return `${x},${y}`;
    }).join(' ');

    const areaPoints = `${padding},${padding + chartHeight} ${points} ${padding + chartWidth},${padding + chartHeight}`;
    
    return { points, areaPoints, width, height, padding };
  };

  const curveData = generateMoodCurve();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* 头部 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-2xl">🦞</Link>
              <div>
                <h1 className="text-xl font-bold text-gray-800">心情趋势</h1>
                <p className="text-sm text-gray-500">追踪你的情绪变化</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/mood"
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                📅 心情日历
              </Link>
              <Link
                href="/stats"
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                📊 统计
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 概览卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-3xl mb-2">📊</div>
            <div className="text-2xl font-bold text-gray-800">{moodData.length}</div>
            <div className="text-sm text-gray-500">心情记录</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-3xl mb-2">😊</div>
            <div className="text-2xl font-bold text-green-600">{positiveCount}</div>
            <div className="text-sm text-gray-500">积极心情</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-3xl mb-2">😔</div>
            <div className="text-2xl font-bold text-red-600">{negativeCount}</div>
            <div className="text-sm text-gray-500">消极心情</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-3xl mb-2">{trend > 0 ? '📈' : trend < 0 ? '📉' : '➡️'}</div>
            <div className="text-2xl font-bold text-gray-800">
              {trend > 0 ? '+' : ''}{trend.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500">近期趋势</div>
          </div>
        </div>

        {/* 心情曲线 */}
        {curveData && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📈 心情曲线（最近30天）</h2>
            <svg viewBox={`0 0 ${curveData.width} ${curveData.height}`} className="w-full h-48">
              {/* 背景网格 */}
              <defs>
                <linearGradient id="moodGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* 网格线 */}
              {[1, 2, 3, 4, 5].map(v => (
                <line
                  key={v}
                  x1={curveData.padding}
                  y1={curveData.padding + (1 - (v - 1) / 4) * (curveData.height - curveData.padding * 2)}
                  x2={curveData.width - curveData.padding}
                  y2={curveData.padding + (1 - (v - 1) / 4) * (curveData.height - curveData.padding * 2)}
                  stroke="#e5e7eb"
                  strokeDasharray="4"
                />
              ))}
              
              {/* 区域填充 */}
              <polygon
                points={curveData.areaPoints}
                fill="url(#moodGradient)"
              />
              
              {/* 曲线 */}
              <polyline
                points={curveData.points}
                fill="none"
                stroke="#a855f7"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* 数据点 */}
              {moodData.slice(-30).map((d, i) => {
                const x = curveData.padding + (i / (Math.min(moodData.length, 30) - 1)) * (curveData.width - curveData.padding * 2);
                const y = curveData.padding + (1 - (d.value - 1) / 4) * (curveData.height - curveData.padding * 2);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#a855f7"
                    className="hover:r-6 transition-all"
                  />
                );
              })}
              
              {/* Y轴标签 */}
              <text x="10" y={curveData.padding + 5} className="text-xs fill-gray-400">😊</text>
              <text x="10" y={curveData.height - curveData.padding + 5} className="text-xs fill-gray-400">😔</text>
            </svg>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 心情分布 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">🎨 心情分布</h2>
            <div className="space-y-3">
              {topMoods.map(([mood, count]) => {
                const percentage = (count / moodData.length) * 100;
                return (
                  <div key={mood} className="flex items-center gap-3">
                    <span className="text-2xl w-10">{moodEmoji[mood] || '😐'}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 capitalize">{mood}</span>
                        <span className="text-gray-500">{count} 次 ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 月度心情 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">📅 月度心情</h2>
            <div className="space-y-3">
              {monthlyAvg.slice(-12).reverse().map(({ month, avg, count, topMood }) => (
                <div key={month} className="flex items-center gap-3">
                  <span className="text-2xl w-10">{moodEmoji[topMood] || '😐'}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{month}</span>
                      <span className="text-gray-500">{count} 篇 · 平均 {avg.toFixed(1)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          avg >= 4 ? 'bg-green-500' :
                          avg >= 3 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${(avg / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 心情建议 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">💡 心情洞察</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="text-2xl mb-2">🌟</div>
              <div className="font-medium text-gray-800">积极心情占比</div>
              <div className="text-3xl font-bold text-green-600 mt-1">
                {((positiveCount / moodData.length) * 100).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {positiveCount > negativeCount ? '继续保持！' : '多关注积极的一面'}
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium text-gray-800">最常见心情</div>
              <div className="text-3xl font-bold text-purple-600 mt-1">
                {topMoods[0] ? moodEmoji[topMoods[0][0]] : '😐'} {topMoods[0]?.[0]}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                出现 {topMoods[0]?.[1] || 0} 次
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-medium text-gray-800">心情稳定性</div>
              <div className="text-3xl font-bold text-blue-600 mt-1">
                {moodData.length > 0 
                  ? (100 - Math.abs(trend) * 20).toFixed(0) 
                  : 0}%
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {Math.abs(trend) < 0.5 ? '情绪稳定' : trend > 0 ? '情绪上升' : '情绪波动'}
              </div>
            </div>
          </div>
        </div>

        {/* 最近心情记录 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📝 最近心情记录</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moodData.slice(-9).reverse().map(d => (
              <Link
                key={d.id}
                href={`/diary/${d.id}`}
                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{moodEmoji[d.mood] || '😐'}</span>
                  <span className="text-sm text-gray-500">{d.date}</span>
                </div>
                <div className="font-medium text-gray-800 truncate">{d.title}</div>
                <div className="text-sm text-gray-500 capitalize">{d.mood}</div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}