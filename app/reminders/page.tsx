import Link from "next/link";

export const metadata = {
  title: "提醒管理 - Claw Diary",
  description: "管理你的写作提醒和定时通知",
};

async function getReminders() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/reminders`, {
    cache: "no-store",
  });
  if (!res.ok) return { reminders: [] };
  return res.json();
}

const frequencyLabels: Record<string, string> = {
  daily: "每天",
  weekly: "每周",
  monthly: "每月",
  once: "一次性",
};

const frequencyColors: Record<string, string> = {
  daily: "bg-blue-100 text-blue-700",
  weekly: "bg-green-100 text-green-700",
  monthly: "bg-purple-100 text-purple-700",
  once: "bg-orange-100 text-orange-700",
};

const timeSlots = [
  { value: "08:00", label: "早晨 8:00", icon: "🌅" },
  { value: "12:00", label: "中午 12:00", icon: "☀️" },
  { value: "18:00", label: "傍晚 18:00", icon: "🌆" },
  { value: "21:00", label: "晚上 21:00", icon: "🌙" },
  { value: "23:00", label: "深夜 23:00", icon: "🦉" },
];

export default async function RemindersPage() {
  const data = await getReminders();
  const { reminders } = data;

  const activeReminders = reminders.filter((r: typeof reminders[0]) => r.active);
  const pausedReminders = reminders.filter((r: typeof reminders[0]) => !r.active);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50">
      <main className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8"
        >
          ← 返回首页
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              ⏰ 提醒管理
            </h1>
            <p className="text-gray-500">设置写作提醒，养成好习惯</p>
          </div>
          
          <a
            href="/reminders/create"
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
          >
            + 新建提醒
          </a>
        </div>

        {/* 快捷创建 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-8 border border-white/50">
          <h2 className="text-lg font-bold text-gray-900 mb-4">⚡ 快捷创建</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {timeSlots.map(slot => (
              <a
                key={slot.value}
                href={`/reminders/create?time=${slot.value}`}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-amber-50 hover:text-amber-700 transition-colors text-center justify-center"
              >
                <span>{slot.icon}</span>
                <span className="text-sm font-medium">{slot.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* 活跃提醒 */}
        {activeReminders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🔔</span>
              <span>活跃提醒</span>
              <span className="text-sm font-normal text-gray-400">({activeReminders.length})</span>
            </h2>
            
            <div className="space-y-3">
              {activeReminders.map((reminder: typeof reminders[0]) => (
                <div
                  key={reminder.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50 hover:shadow-xl transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">
                        {reminder.icon || "⏰"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {reminder.title}
                        </h3>
                        <p className="text-gray-500 text-sm mb-2">
                          {reminder.message}
                        </p>
                        <div className="flex items-center gap-3 text-sm">
                          <span className={`px-2 py-0.5 rounded-full ${frequencyColors[reminder.frequency] || "bg-gray-100 text-gray-600"}`}>
                            {frequencyLabels[reminder.frequency] || reminder.frequency}
                          </span>
                          <span className="text-gray-400">
                            {reminder.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <a
                        href={`/api/reminders/${reminder.id}/toggle`}
                        className="p-2 text-gray-400 hover:text-amber-600 transition-colors"
                        title="暂停"
                      >
                        ⏸️
                      </a>
                      <a
                        href={`/reminders/${reminder.id}/edit`}
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                        title="编辑"
                      >
                        ✏️
                      </a>
                      <a
                        href={`/api/reminders/${reminder.id}`}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="删除"
                      >
                        🗑️
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 暂停提醒 */}
        {pausedReminders.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>💤</span>
              <span>已暂停</span>
              <span className="text-sm font-normal text-gray-400">({pausedReminders.length})</span>
            </h2>
            
            <div className="space-y-3 opacity-60">
              {pausedReminders.map((reminder: typeof reminders[0]) => (
                <div
                  key={reminder.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl grayscale">
                        {reminder.icon || "⏰"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {reminder.title}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {reminder.time} · {frequencyLabels[reminder.frequency]}
                        </p>
                      </div>
                    </div>
                    
                    <a
                      href={`/api/reminders/${reminder.id}/toggle`}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      ▶️ 恢复
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 空状态 */}
        {reminders.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center border border-white/50">
            <div className="text-6xl mb-4">🔔</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">还没有设置提醒</h2>
            <p className="text-gray-500 mb-6">创建一个写作提醒，帮你养成每日写作的好习惯</p>
            <a
              href="/reminders/create"
              className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all"
            >
              创建第一个提醒
            </a>
          </div>
        )}

        {/* 提醒小贴士 */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-6 mt-8 border border-indigo-200">
          <h2 className="text-lg font-bold text-gray-900 mb-3">💡 提醒小贴士</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span>🎯</span>
              <span>选择一个固定时间写作，更容易养成习惯</span>
            </li>
            <li className="flex items-start gap-2">
              <span>📝</span>
              <span>早晨是灵感最丰富的时候，不妨试试早起写作</span>
            </li>
            <li className="flex items-start gap-2">
              <span>🔄</span>
              <span>如果某个时间总忘记，试试换个时间</span>
            </li>
            <li className="flex items-start gap-2">
              <span>🏆</span>
              <span>连续 21 天坚持，习惯就会形成！</span>
            </li>
          </ul>
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>🦞 Claw Diary - Powered by OpenClaw</p>
        </footer>
      </main>
    </div>
  );
}