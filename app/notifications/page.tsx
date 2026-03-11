import Link from "next/link";
import { getDiaries } from "@/lib/diaries";

export const metadata = {
  title: "通知中心 - Claw Diary",
  description: "查看所有通知和提醒",
};

async function getNotifications() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/notifications`, {
    cache: "no-store",
  });
  if (!res.ok) return { notifications: [], unread: 0 };
  return res.json();
}

// 通知图标映射
const typeIcons: Record<string, string> = {
  system: "🔔",
  comment: "💬",
  achievement: "🏆",
  reminder: "⏰",
  like: "❤️",
  follow: "👥",
  mention: "@",
  update: "🆕",
};

const typeColors: Record<string, string> = {
  system: "bg-blue-50 border-blue-200",
  comment: "bg-green-50 border-green-200",
  achievement: "bg-amber-50 border-amber-200",
  reminder: "bg-purple-50 border-purple-200",
  like: "bg-pink-50 border-pink-200",
  follow: "bg-indigo-50 border-indigo-200",
  mention: "bg-cyan-50 border-cyan-200",
  update: "bg-emerald-50 border-emerald-200",
};

const typeTitles: Record<string, string> = {
  system: "系统通知",
  comment: "评论回复",
  achievement: "成就解锁",
  reminder: "提醒事项",
  like: "收到点赞",
  follow: "新关注",
  mention: "有人@你",
  update: "系统更新",
};

export default async function NotificationsPage() {
  const data = await getNotifications();
  const { notifications, unread } = data;

  // 按日期分组
  const groupedNotifications = new Map<string, typeof notifications>();
  notifications.forEach((n: typeof notifications[0]) => {
    const date = new Date(n.createdAt).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!groupedNotifications.has(date)) {
      groupedNotifications.set(date, []);
    }
    groupedNotifications.get(date)!.push(n);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
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
              🔔 通知中心
            </h1>
            <p className="text-gray-500">查看所有通知和提醒</p>
          </div>
          
          {unread > 0 && (
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                {unread} 条未读
              </span>
              <a
                href="/api/notifications/read-all"
                className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
              >
                全部已读
              </a>
            </div>
          )}
        </div>

        {/* 通知过滤器 */}
        <div className="flex flex-wrap gap-2 mb-6">
          <a
            href="/notifications"
            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
          >
            全部
          </a>
          {Object.entries(typeTitles).map(([type, title]) => {
            const count = notifications.filter((n: typeof notifications[0]) => n.type === type).length;
            if (count === 0) return null;
            return (
              <a
                key={type}
                href={`/notifications?type=${type}`}
                className="px-4 py-2 bg-white text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-1"
              >
                <span>{typeIcons[type]}</span>
                <span>{title}</span>
                <span className="text-xs text-gray-400">({count})</span>
              </a>
            );
          })}
        </div>

        {/* 通知列表 */}
        {notifications.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-12 text-center border border-white/50">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">暂无通知</h2>
            <p className="text-gray-500">当你有新通知时会显示在这里</p>
          </div>
        ) : (
          <div className="space-y-6">
            {[...groupedNotifications.entries()].map(([date, items]) => (
              <div key={date}>
                <h3 className="text-sm font-medium text-gray-500 mb-3 px-2">{date}</h3>
                <div className="space-y-3">
                  {items.map((notification: typeof notifications[0]) => (
                    <div
                      key={notification.id}
                      className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border transition-all hover:shadow-xl ${
                        notification.read 
                          ? "border-white/50 opacity-75" 
                          : `${typeColors[notification.type] || "border-white/50"} border-2`
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">
                          {typeIcons[notification.type] || "🔔"}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                              {typeTitles[notification.type] || "通知"}
                            </span>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            )}
                          </div>
                          
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {notification.title}
                          </h4>
                          
                          <p className="text-gray-600 text-sm mb-2">
                            {notification.content}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>
                              {new Date(notification.createdAt).toLocaleTimeString("zh-CN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {notification.link && (
                              <a
                                href={notification.link}
                                className="text-indigo-500 hover:text-indigo-600"
                              >
                                查看详情 →
                              </a>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <a
                              href={`/api/notifications/${notification.id}/read`}
                              className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                              title="标记已读"
                            >
                              ✓
                            </a>
                          )}
                          <a
                            href={`/api/notifications/${notification.id}`}
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
            ))}
          </div>
        )}

        {/* 通知设置入口 */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-6 border border-indigo-200">
          <h2 className="text-lg font-bold text-gray-900 mb-3">⚙️ 通知设置</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/settings/notifications"
              className="flex items-center gap-3 p-4 bg-white/60 rounded-xl hover:bg-white/80 transition-colors"
            >
              <span className="text-2xl">📧</span>
              <div>
                <div className="font-medium text-gray-900">通知偏好</div>
                <div className="text-sm text-gray-500">管理接收哪些通知</div>
              </div>
            </a>
            <a
              href="/reminders"
              className="flex items-center gap-3 p-4 bg-white/60 rounded-xl hover:bg-white/80 transition-colors"
            >
              <span className="text-2xl">⏰</span>
              <div>
                <div className="font-medium text-gray-900">提醒管理</div>
                <div className="text-sm text-gray-500">设置定时提醒</div>
              </div>
            </a>
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>🦞 Claw Diary - Powered by OpenClaw</p>
        </footer>
      </main>
    </div>
  );
}