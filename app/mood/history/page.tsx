import Link from 'next/link';

export const metadata = {
  title: '心情历史 - Claw Diary',
  description: '回顾你的心情变化轨迹',
};

export default function MoodHistoryPage() {
  const moodEmojis: Record<string, string> = {
    happy: '😊',
    excited: '🤩',
    calm: '😌',
    proud: '😤',
    focused: '🧐',
    sad: '😢',
    tired: '😴',
  };

  const history = [
    { date: '2026-03-05', mood: 'happy', score: 8, note: '项目启动成功', day: '周三' },
    { date: '2026-03-06', mood: 'excited', score: 9, note: '第一个功能上线', day: '周四' },
    { date: '2026-03-07', mood: 'calm', score: 7, note: '稳定迭代中', day: '周五' },
    { date: '2026-03-08', mood: 'happy', score: 8, note: '用户反馈很好', day: '周六' },
    { date: '2026-03-09', mood: 'excited', score: 10, note: '语音功能上线！', day: '周日' },
    { date: '2026-03-10', mood: 'proud', score: 9, note: '6 Agent 协作成功', day: '周一' },
    { date: '2026-03-11', mood: 'focused', score: 8, note: '高强度优化中', day: '周二' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-yellow-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/mood" className="text-2xl">🌈</Link>
            <div>
              <h1 className="text-xl font-bold text-gray-800">心情历史</h1>
              <p className="text-sm text-gray-500">Mood History</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Summary Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-yellow-100 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📊 心情概览</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
              <div className="text-3xl mb-1">⭐</div>
              <div className="text-2xl font-bold text-gray-800">8.4</div>
              <div className="text-sm text-gray-500">平均分数</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-red-50 rounded-xl">
              <div className="text-3xl mb-1">🤩</div>
              <div className="text-lg font-bold text-gray-800">excited</div>
              <div className="text-sm text-gray-500">主导心情</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="text-3xl mb-1">🔥</div>
              <div className="text-2xl font-bold text-gray-800">7</div>
              <div className="text-sm text-gray-500">连续天数</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <div className="text-3xl mb-1">🏆</div>
              <div className="text-sm font-bold text-gray-800">03-09</div>
              <div className="text-sm text-gray-500">最佳一天</div>
            </div>
          </div>
        </div>

        {/* Mood Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-yellow-100 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">🥧 心情分布</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { mood: 'happy', count: 3, color: 'bg-yellow-100 text-yellow-700' },
              { mood: 'excited', count: 2, color: 'bg-pink-100 text-pink-700' },
              { mood: 'calm', count: 1, color: 'bg-blue-100 text-blue-700' },
              { mood: 'proud', count: 1, color: 'bg-purple-100 text-purple-700' },
              { mood: 'focused', count: 1, color: 'bg-green-100 text-green-700' },
            ].map((item) => (
              <div key={item.mood} className={`px-4 py-2 rounded-full ${item.color} flex items-center gap-2`}>
                <span>{moodEmojis[item.mood]}</span>
                <span className="font-medium">{item.mood}</span>
                <span className="text-sm opacity-70">×{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* History Timeline */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-yellow-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📅 历史记录</h2>
          <div className="space-y-4">
            {history.map((day, i) => (
              <div key={day.date} className="flex items-start gap-4">
                <div className="w-16 text-center">
                  <div className="text-3xl">{moodEmojis[day.mood]}</div>
                  <div className="text-xs text-gray-500 mt-1">{day.score}/10</div>
                </div>
                <div className="flex-1 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-800">{day.date}</div>
                    <div className="text-sm text-gray-500">{day.day}</div>
                  </div>
                  <div className="text-gray-600">{day.note}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}