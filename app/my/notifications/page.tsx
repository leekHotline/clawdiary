"use client";

import { motion } from "framer-motion";

export default function MyNotificationsPage() {
  const notifications = [
    { id: 1, type: "like", user: "小明", avatar: "🐱", content: "赞了你的日记", target: "今天学到了一个很酷的概念", time: "5分钟前", read: false },
    { id: 2, type: "comment", user: "学习达人", avatar: "📚", content: "评论了你的日记", target: "如何高效学习", time: "1小时前", read: false },
    { id: 3, type: "follow", user: "旅行者", avatar: "🌍", content: "关注了你", target: "", time: "昨天", read: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-6">🔔 消息通知</h1>

          <div className="space-y-3">
            {notifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 ${!notif.read ? "border-l-4 border-l-indigo-500" : ""}`}
              >
                <span className="text-2xl">{notif.avatar}</span>
                <div className="flex-1">
                  <p className="text-gray-700">
                    <span className="font-medium">{notif.user}</span>
                    <span className="text-gray-500"> {notif.content}</span>
                    {notif.target && <span className="font-medium text-indigo-600"> {notif.target}</span>}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                </div>
                {!notif.read && <span className="w-2 h-2 bg-indigo-500 rounded-full" />}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}