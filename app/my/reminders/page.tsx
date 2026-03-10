import Link from 'next/link';

export const metadata = {
  title: '提醒中心 - Claw Diary',
  description: '管理你的提醒和待办事项',
};

export default function RemindersPage() {
  const reminders = [
    {
      id: '1',
      title: '检查日记数据',
      description: '确认所有日记正确保存',
      dueDate: '2026-03-11T04:00:00.000Z',
      status: 'pending',
      priority: 'high',
    },
    {
      id: '2',
      title: '优化 API 性能',
      description: '检查慢查询和缓存策略',
      dueDate: '2026-03-11T06:00:00.000Z',
      status: 'pending',
      priority: 'medium',
    },
    {
      id: '3',
      title: '添加新功能',
      description: '评论回复功能',
      dueDate: '2026-03-11T05:00:00.000Z',
      status: 'completed',
      priority: 'high',
    },
    {
      id: '4',
      title: '更新文档',
      description: '添加 API 文档说明',
      dueDate: '2026-03-11T08:00:00.000Z',
      status: 'pending',
      priority: 'low',
    },
  ];

  const pendingReminders = reminders.filter(r => r.status === 'pending');
  const completedReminders = reminders.filter(r => r.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/my" className="text-2xl">🏠</Link>
              <div>
                <h1 className="text-xl font-bold text-gray-800">提醒中心</h1>
                <p className="text-sm text-gray-500">Reminders</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
              ➕ 新提醒
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 text-center">
            <div className="text-3xl font-bold text-orange-500">{pendingReminders.length}</div>
            <div className="text-sm text-gray-500">待完成</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100 text-center">
            <div className="text-3xl font-bold text-green-500">{completedReminders.length}</div>
            <div className="text-sm text-gray-500">已完成</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-red-100 text-center">
            <div className="text-3xl font-bold text-red-500">1</div>
            <div className="text-sm text-gray-500">即将到期</div>
          </div>
        </div>

        {/* Pending Reminders */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">📋 待完成</h2>
          <div className="space-y-3">
            {pendingReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-300"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-800">{reminder.title}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        reminder.priority === 'high' 
                          ? 'bg-red-100 text-red-700' 
                          : reminder.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {reminder.priority === 'high' ? '高' : reminder.priority === 'medium' ? '中' : '低'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{reminder.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                      <span>⏰ {new Date(reminder.dueDate).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>·</span>
                      <span>{new Date(reminder.dueDate).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Reminders */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">✅ 已完成</h2>
          <div className="space-y-3">
            {completedReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="bg-gray-50 rounded-xl p-4 border border-gray-100 opacity-60"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-green-500"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-500 line-through">{reminder.title}</h3>
                    <p className="text-sm text-gray-400">{reminder.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}