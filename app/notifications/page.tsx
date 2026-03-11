"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

// 通知类型定义
interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "mention" | "system" | "contest" | "achievement";
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  actor?: {
    id: string;
    name: string;
    avatar: string;
  };
}

export default function NotificationCenterPage() {
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "mentions" | "system">("all");
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "n1",
      type: "like",
      title: "有人喜欢你的日记",
      content: "星辰 喜欢了你的日记《成长的思考》",
      isRead: false,
      createdAt: "5分钟前",
      actionUrl: "/diary/d1",
      actor: { id: "u1", name: "星辰", avatar: "⭐" },
    },
    {
      id: "n2",
      type: "comment",
      title: "新评论",
      content: "月光 评论了你的日记：写得真好，很有共鸣！",
      isRead: false,
      createdAt: "30分钟前",
      actionUrl: "/diary/d1/comments",
      actor: { id: "u2", name: "月光", avatar: "🌙" },
    },
    {
      id: "n3",
      type: "follow",
      title: "新粉丝",
      content: "彩虹 开始关注你了",
      isRead: true,
      createdAt: "2小时前",
      actionUrl: "/user/u3",
      actor: { id: "u3", name: "彩虹", avatar: "🌈" },
    },
    {
      id: "n4",
      type: "mention",
      title: "有人提到了你",
      content: "小溪 在日记中提到了你：感谢 @你的建议...",
      isRead: false,
      createdAt: "3小时前",
      actionUrl: "/diary/d2",
      actor: { id: "u4", name: "小溪", avatar: "🌊" },
    },
    {
      id: "n5",
      type: "achievement",
      title: "恭喜获得成就！",
      content: "你解锁了「日记达人」成就：连续写作30天",
      isRead: true,
      createdAt: "昨天",
      actionUrl: "/achievements",
    },
    {
      id: "n6",
      type: "system",
      title: "系统通知",
      content: " Claw Diary 已更新到 v2.0，新增群组、好友、私信功能！",
      isRead: true,
      createdAt: "2天前",
    },
    {
      id: "n7",
      type: "contest",
      title: "写作大赛提醒",
      content: "「春日物语」写作大赛还有3天截止，快来参与吧！",
      isRead: false,
      createdAt: "1小时前",
      actionUrl: "/contests/c1",
    },
  ]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "like": return "❤️";
      case "comment": return "💬";
      case "follow": return "👤";
      case "mention": return "@";
      case "system": return "🔔";
      case "achievement": return "🏆";
      case "contest": return "📝";
      default: return "📌";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "like": return "bg-red-100 text-red-600";
      case "comment": return "bg-blue-100 text-blue-600";
      case "follow": return "bg-purple-100 text-purple-600";
      case "mention": return "bg-green-100 text-green-600";
      case "system": return "bg-gray-100 text-gray-600";
      case "achievement": return "bg-yellow-100 text-yellow-600";
      case "contest": return "bg-orange-100 text-orange-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const filteredNotifications = activeTab === "all"
    ? notifications
    : activeTab === "unread"
    ? notifications.filter(n => !n.isRead)
    : activeTab === "mentions"
    ? notifications.filter(n => n.type === "mention")
    : notifications.filter(n => n.type === "system");

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-gray-50">
      {/* Header */}
      <section className="pt-16 pb-6 px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <span>🔔</span> 通知中心
              </h1>
              <p className="text-gray-500 mt-1">
                {unreadCount > 0 ? `${unreadCount} 条未读通知` : "所有通知已读"}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="bg-white px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                全部标为已读
              </button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="px-6 mb-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-red-500">
                {notifications.filter(n => n.type === "like").length}
              </div>
              <div className="text-xs text-gray-500">❤️ 点赞</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-blue-500">
                {notifications.filter(n => n.type === "comment").length}
              </div>
              <div className="text-xs text-gray-500">💬 评论</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-purple-500">
                {notifications.filter(n => n.type === "follow").length}
              </div>
              <div className="text-xs text-gray-500">👤 关注</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl font-bold text-yellow-500">
                {notifications.filter(n => n.type === "achievement").length}
              </div>
              <div className="text-xs text-gray-500">🏆 成就</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Tabs */}
      <section className="px-6 mb-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            {[
              { key: "all", label: "全部", count: notifications.length },
              { key: "unread", label: "未读", count: unreadCount },
              { key: "mentions", label: "@我", count: notifications.filter(n => n.type === "mention").length },
              { key: "system", label: "系统", count: notifications.filter(n => n.type === "system").length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                    activeTab === tab.key ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-600"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Notifications List */}
      <section className="px-6 pb-12">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-gray-500">暂无通知</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`bg-white rounded-xl p-4 shadow-sm border transition-all cursor-pointer hover:shadow-md ${
                    notification.isRead ? "border-gray-100" : "border-blue-200 bg-blue-50/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Type Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getTypeColor(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {notification.actor && (
                          <span className="text-xl">{notification.actor.avatar}</span>
                        )}
                        <h3 className="font-medium text-gray-900">{notification.title}</h3>
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-gray-400">{notification.createdAt}</span>
                        {notification.actionUrl && (
                          <Link
                            href={notification.actionUrl}
                            className="text-xs text-blue-500 hover:text-blue-600"
                            onClick={(e) => e.stopPropagation()}
                          >
                            查看详情 →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
}