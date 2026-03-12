import Link from "next/link";

export const metadata = {
  title: "写作提醒 - Claw Diary",
  description: "设置写作提醒，养成日记习惯",
};

// 模拟提醒数据
const reminderTypes = [
  { id: "daily", name: "每日提醒", icon: "📅", desc: "每天固定时间提醒" },
  { id: "streak", name: "连续提醒", icon: "🔥", desc: "保持写作连续性" },
  { id: "mood", name: "心情提醒", icon: "😊", desc: "记录心情变化" },
  { id: "goal", name: "目标提醒", icon: "🎯", desc: "达成写作目标" },
];

const activeReminders = [
  {
    id: 1,
    type: "daily",
    name: "晚间写作提醒",
    time: "21:00",
    days: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    enabled: true,
    streak: 45,
    lastTriggered: "2026-03-12 21:00",
  },
  {
    id: 2,
    type: "daily",
    name: "晨间反思",
    time: "08:00",
    days: ["周一", "周三", "周五"],
    enabled: true,
    streak: 12,
    lastTriggered: "2026-03-10 08:00",
  },
  {
    id: 3,
    type: "goal",
    name: "周目标检查",
    time: "周日 20:00",
    days: ["周日"],
    enabled: false,
    streak: 0,
    lastTriggered: null,
  },
];

const reminderHistory = [
  { date: "2026-03-12", time: "21:00", type: "晚间写作", action: "已写", response: "completed" },
  { date: "2026-03-11", time: "21:00", type: "晚间写作", action: "已写", response: "completed" },
  { date: "2026-03-11", time: "08:00", type: "晨间反思", action: "跳过", response: "skipped" },
  { date: "2026-03-10", time: "21:00", type: "晚间写作", action: "已写", response: "completed" },
  { date: "2026-03-10", time: "08:00", type: "晨间反思", action: "已写", response: "completed" },
];

const reminderStats = {
  totalReminders: 156,
  completionRate: 89,
  currentStreak: 45,
  longestStreak: 62,
  avgResponseTime: "2分钟",
  bestTime: "21:00",
  responseDistribution: {
    completed: 139,
    skipped: 12,
    snoozed: 5,
  },
};

const smartSuggestions = [
  {
    icon: "📊",
    title: "最佳写作时间",
    desc: "根据你的历史数据，21:00 是你最可能完成写作的时间",
    action: "设置此时间",
  },
  {
    icon: "🎯",
    title: "目标提醒建议",
    desc: "每周日晚上检查本周目标完成情况",
    action: "添加提醒",
  },
  {
    icon: "🔥",
    title: "连续性保护",
    desc: "已连续45天写作，建议开启连续保护提醒",
    action: "开启保护",
  },
];

export default function RemindersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      {/* 头部 */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-cyan-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-500 hover:text-gray-700">
                ← 返回首页
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  ⏰ 写作提醒
                </h1>
                <p className="text-sm text-gray-500">养成日记习惯</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors">
              + 添加提醒
            </button>
          </div>
        </div>
      </header>

      {/* 统计概览 */}
      <section className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500">完成率</div>
            <div className="text-2xl font-bold text-green-600">{reminderStats.completionRate}%</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500">当前连续</div>
            <div className="text-2xl font-bold text-orange-600">{reminderStats.currentStreak}天</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500">总提醒</div>
            <div className="text-2xl font-bold text-blue-600">{reminderStats.totalReminders}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500">最佳时间</div>
            <div className="text-2xl font-bold text-purple-600">{reminderStats.bestTime}</div>
          </div>
        </div>
      </section>

      {/* 智能建议 */}
      <section className="max-w-6xl mx-auto px-4 pb-6">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl p-6 text-white">
          <h2 className="font-semibold mb-4">💡 智能建议</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {smartSuggestions.map((suggestion, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{suggestion.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-medium">{suggestion.title}</h3>
                    <p className="text-sm text-cyan-100 mt-1">{suggestion.desc}</p>
                    <button className="text-sm text-white mt-2 hover:underline">
                      {suggestion.action} →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 活跃提醒 */}
      <main className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">活跃提醒</h2>
          <div className="space-y-4">
            {activeReminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`border rounded-xl p-4 ${
                  reminder.enabled ? "border-cyan-200 bg-cyan-50" : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      reminder.enabled ? "bg-cyan-500 text-white" : "bg-gray-300 text-gray-500"
                    }`}>
                      {reminder.type === "daily" ? "📅" : reminder.type === "goal" ? "🎯" : "⏰"}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{reminder.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-gray-500">{reminder.time}</span>
                        <span className="text-gray-300">·</span>
                        <span className="text-sm text-gray-500">
                          {reminder.days.length === 7 ? "每天" : reminder.days.join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {reminder.streak > 0 && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">{reminder.streak}</div>
                        <div className="text-xs text-gray-500">连续</div>
                      </div>
                    )}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={reminder.enabled}
                        readOnly
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 提醒类型 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">提醒类型</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {reminderTypes.map((type) => (
              <div
                key={type.id}
                className="border border-gray-200 rounded-xl p-4 hover:border-cyan-300 hover:bg-cyan-50 transition-colors cursor-pointer"
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <h3 className="font-medium text-gray-800 text-sm">{type.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 历史记录 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">提醒历史</h2>
            <span className="text-sm text-gray-500">最近 5 条</span>
          </div>
          <div className="space-y-3">
            {reminderHistory.map((record, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    record.response === "completed" ? "bg-green-500" :
                    record.response === "skipped" ? "bg-yellow-500" : "bg-gray-400"
                  }`} />
                  <span className="text-gray-800">{record.type}</span>
                  <span className="text-sm text-gray-500">{record.date} {record.time}</span>
                </div>
                <span className={`text-sm ${
                  record.response === "completed" ? "text-green-600" : "text-gray-500"
                }`}>
                  {record.action}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 响应分布 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">响应分布</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${(reminderStats.responseDistribution.completed / reminderStats.totalReminders) * 100}%` }}
                />
                <div
                  className="h-full bg-yellow-500"
                  style={{ width: `${(reminderStats.responseDistribution.snoozed / reminderStats.totalReminders) * 100}%` }}
                />
                <div
                  className="h-full bg-gray-400"
                  style={{ width: `${(reminderStats.responseDistribution.skipped / reminderStats.totalReminders) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-600">已完成 {reminderStats.responseDistribution.completed}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="text-sm text-gray-600">稍后 {reminderStats.responseDistribution.snoozed}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full" />
              <span className="text-sm text-gray-600">跳过 {reminderStats.responseDistribution.skipped}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}