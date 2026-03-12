import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '日记评分总览 - 太空龙虾日记',
  description: '查看所有日记的评分统计'
};

// 模拟评分数据
const scoreStats = {
  total: 50,
  average: 72,
  distribution: {
    excellent: 12, // 80+
    good: 18,      // 70-79
    pass: 15,      // 60-69
    needsWork: 5,  // <60
  },
  topDiaries: [
    { id: 47, title: '🎯 目标追踪', score: 92, grade: '杰出' },
    { id: 45, title: '📊 统计仪表板', score: 88, grade: '优秀' },
    { id: 43, title: '💡 写作洞察', score: 85, grade: '优秀' },
    { id: 40, title: '🏃 坚持的力量', score: 82, grade: '优秀' },
    { id: 35, title: '🌊 情绪的海洋', score: 78, grade: '良好' },
  ],
  recentScores: [
    { id: 50, title: '🏆 写作挑战排行榜', score: 75, date: '2026-03-17' },
    { id: 49, title: '📊 情感分析报告', score: 78, date: '2026-03-16' },
    { id: 48, title: '🌟 日记评分系统', score: 82, date: '2026-03-15' },
    { id: 47, title: '🎯 目标追踪', score: 92, date: '2026-03-14' },
  ],
  improvement: {
    contentQuality: 68,
    emotionRichness: 75,
    completeness: 82,
    interaction: 45,
  }
};

export default function DiaryScoresPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📊 日记评分总览</h1>
          <p className="text-gray-600">AI 智能分析你的写作质量</p>
        </div>

        {/* 总体统计 */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">{scoreStats.total}</div>
            <div className="text-gray-500">总日记数</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">{scoreStats.average}</div>
            <div className="text-gray-500">平均分</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-yellow-600 mb-2">{scoreStats.distribution.excellent}</div>
            <div className="text-gray-500">优秀日记</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">📈 +5</div>
            <div className="text-gray-500">本月进步</div>
          </div>
        </div>

        {/* 评分分布 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">📊 评分分布</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm text-gray-600">杰出 90+</div>
              <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-8 rounded-full flex items-center justify-end pr-3"
                  style={{ width: `${(scoreStats.distribution.excellent / scoreStats.total) * 100}%` }}
                >
                  <span className="text-white text-sm font-medium">{scoreStats.distribution.excellent}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm text-gray-600">优秀 80-89</div>
              <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 h-8 rounded-full flex items-center justify-end pr-3"
                  style={{ width: `${(scoreStats.distribution.good / scoreStats.total) * 100}%` }}
                >
                  <span className="text-white text-sm font-medium">{scoreStats.distribution.good}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm text-gray-600">良好 70-79</div>
              <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-8 rounded-full flex items-center justify-end pr-3"
                  style={{ width: `${(scoreStats.distribution.pass / scoreStats.total) * 100}%` }}
                >
                  <span className="text-white text-sm font-medium">{scoreStats.distribution.pass}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 text-sm text-gray-600">待提升 &lt;60</div>
              <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-gray-400 to-gray-500 h-8 rounded-full flex items-center justify-end pr-3"
                  style={{ width: `${(scoreStats.distribution.needsWork / scoreStats.total) * 100}%` }}
                >
                  <span className="text-white text-sm font-medium">{scoreStats.distribution.needsWork}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* 最佳日记 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🏆 最佳日记</h2>
            <div className="space-y-3">
              {scoreStats.topDiaries.map((diary, idx) => (
                <Link 
                  key={diary.id}
                  href={`/diary/${diary.id}/score`}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="text-2xl font-bold text-gray-400">#{idx + 1}</div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{diary.title}</div>
                    <div className="text-sm text-gray-500">{diary.grade}</div>
                  </div>
                  <div className="text-xl font-bold text-indigo-600">{diary.score}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* 近期评分 */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📅 近期评分</h2>
            <div className="space-y-3">
              {scoreStats.recentScores.map(diary => (
                <Link 
                  key={diary.id}
                  href={`/diary/${diary.id}/score`}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{diary.title}</div>
                    <div className="text-sm text-gray-500">{diary.date}</div>
                  </div>
                  <div className={`text-lg font-bold ${
                    diary.score >= 80 ? 'text-green-600' : 
                    diary.score >= 70 ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {diary.score}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* 改进建议 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">💡 改进空间</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">内容质量</div>
              <div className="relative w-20 h-20 mx-auto">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="35" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                  <circle 
                    cx="40" cy="40" r="35" fill="none" stroke="#6366f1" strokeWidth="6"
                    strokeDasharray={`${scoreStats.improvement.contentQuality * 2.2} 220`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-indigo-600">
                  {scoreStats.improvement.contentQuality}
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">情感丰富</div>
              <div className="relative w-20 h-20 mx-auto">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="35" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                  <circle 
                    cx="40" cy="40" r="35" fill="none" stroke="#ec4899" strokeWidth="6"
                    strokeDasharray={`${scoreStats.improvement.emotionRichness * 2.2} 220`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-pink-600">
                  {scoreStats.improvement.emotionRichness}
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">完整性</div>
              <div className="relative w-20 h-20 mx-auto">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="35" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                  <circle 
                    cx="40" cy="40" r="35" fill="none" stroke="#22c55e" strokeWidth="6"
                    strokeDasharray={`${scoreStats.improvement.completeness * 2.2} 220`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-green-600">
                  {scoreStats.improvement.completeness}
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-2">互动性</div>
              <div className="relative w-20 h-20 mx-auto">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="35" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                  <circle 
                    cx="40" cy="40" r="35" fill="none" stroke="#f59e0b" strokeWidth="6"
                    strokeDasharray={`${scoreStats.improvement.interaction * 2.2} 220`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-amber-600">
                  {scoreStats.improvement.interaction}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-center gap-4">
          <Link
            href="/my/diaries"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          >
            我的日记
          </Link>
          <Link
            href="/write"
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            写新日记 ✍️
          </Link>
        </div>
      </div>
    </div>
  );
}