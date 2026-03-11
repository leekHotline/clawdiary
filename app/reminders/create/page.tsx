'use client';

import Link from "next/link";

const frequencyOptions = [
  { value: "daily", label: "每天", icon: "📅", desc: "每天固定时间提醒" },
  { value: "weekly", label: "每周", icon: "📆", desc: "每周特定时间提醒" },
  { value: "monthly", label: "每月", icon: "🗓️", desc: "每月特定日期提醒" },
  { value: "once", label: "一次性", icon: "⏰", desc: "只提醒一次" },
];

const iconOptions = ["📝", "🔔", "⏰", "📅", "🎯", "💪", "📚", "✨", "🌟", "🦞"];

const presetMessages = [
  "该写日记啦！记录今天的心情吧",
  "今天写日记了吗？",
  "每天记录一点点，生活更精彩",
  "今天有什么值得记录的？",
  "写作时间到了！",
  "拿起笔，记录今天的故事",
];

export default function CreateReminderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50">
      <main className="max-w-2xl mx-auto px-4 py-12">
        <Link
          href="/reminders"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-8"
        >
          ← 返回提醒列表
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ⏰ 创建提醒
          </h1>
          <p className="text-gray-500">设置一个写作提醒，养成好习惯</p>
        </div>

        <form action="/api/reminders" method="POST" className="space-y-6">
          {/* 提醒标题 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              提醒标题
            </label>
            <input
              type="text"
              name="title"
              placeholder="例如：每日写作提醒"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* 提醒内容 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              提醒内容
            </label>
            <textarea
              name="message"
              placeholder="例如：今天写日记了吗？记录一下今天的心情吧！"
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none"
              required
            />
            
            {/* 预设消息 */}
            <div className="mt-3">
              <span className="text-xs text-gray-400">快速选择：</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {presetMessages.map((msg, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      const textarea = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
                      if (textarea) textarea.value = msg;
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-amber-50 hover:text-amber-700 transition-colors"
                  >
                    {msg.substring(0, 10)}...
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 提醒时间 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              提醒时间
            </label>
            <input
              type="time"
              name="time"
              defaultValue="21:00"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
              required
            />
            
            {/* 快捷时间选择 */}
            <div className="mt-3 grid grid-cols-5 gap-2">
              {["08:00", "12:00", "18:00", "21:00", "23:00"].map(time => (
                <button
                  key={time}
                  type="button"
                  onClick={() => {
                    const input = document.querySelector('input[type="time"]') as HTMLInputElement;
                    if (input) input.value = time;
                  }}
                  className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-amber-50 hover:text-amber-700 transition-colors"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* 重复频率 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              重复频率
            </label>
            <div className="grid grid-cols-2 gap-3">
              {frequencyOptions.map(option => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-amber-300 hover:bg-amber-50/50 transition-all has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50"
                >
                  <input
                    type="radio"
                    name="frequency"
                    value={option.value}
                    defaultChecked={option.value === "daily"}
                    className="text-amber-500 focus:ring-amber-500"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {option.icon} {option.label}
                    </div>
                    <div className="text-xs text-gray-500">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* 图标选择 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/50">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              选择图标
            </label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map(icon => (
                <label
                  key={icon}
                  className="w-12 h-12 flex items-center justify-center text-2xl border border-gray-200 rounded-xl cursor-pointer hover:border-amber-300 hover:bg-amber-50/50 transition-all has-[:checked]:border-amber-500 has-[:checked]:bg-amber-50"
                >
                  <input
                    type="radio"
                    name="icon"
                    value={icon}
                    defaultChecked={icon === "📝"}
                    className="sr-only"
                  />
                  {icon}
                </label>
              ))}
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex gap-4">
            <Link
              href="/reminders"
              className="flex-1 px-6 py-4 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors text-center"
            >
              取消
            </Link>
            <button
              type="submit"
              className="flex-1 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
            >
              创建提醒
            </button>
          </div>
        </form>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>🦞 Claw Diary - Powered by OpenClaw</p>
        </footer>
      </main>
    </div>
  );
}