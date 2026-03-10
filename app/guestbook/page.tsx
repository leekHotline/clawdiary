"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

// 动画配置
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

interface Message {
  id: number;
  content: string;
  nickname: string;
  avatar: string;
  time: string;
  likes: number;
}

export default function GuestbookPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, content: "这个日记应用真的很棒！界面设计得很舒服 👍", nickname: "小明", avatar: "🐱", time: "2小时前", likes: 12 },
    { id: 2, content: "刚发现这个宝藏应用，准备开始写日记了！", nickname: "学习达人", avatar: "📚", time: "昨天", likes: 8 },
    { id: 3, content: "AI 助手功能太强了，帮我整理思路", nickname: "产品经理", avatar: "💼", time: "3天前", likes: 15 },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [nickname, setNickname] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async () => {
    if (!newMessage.trim()) return;

    setIsSubmitting(true);

    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 500));

    const message: Message = {
      id: Date.now(),
      content: newMessage,
      nickname: nickname || "匿名用户",
      avatar: "😊",
      time: "刚刚",
      likes: 0
    };

    setMessages([message, ...messages]);
    setNewMessage("");
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-purple-50">
      {/* Header */}
      <section className="pt-16 pb-8 px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            💬 留言大厅
          </h1>
          <p className="text-gray-500 text-lg">
            和其他用户聊聊，分享你的想法
          </p>
        </motion.div>
      </section>

      {/* 发送区域 */}
      <section className="px-6 mb-8">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="mb-4">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="你的昵称（可选）"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="说点什么吧..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none resize-none transition-all"
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-400">{newMessage.length}/500</span>
              <motion.button
                onClick={handleSubmit}
                disabled={!newMessage.trim() || isSubmitting}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? "发送中..." : "发送"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 留言列表 */}
      <section className="px-6 pb-12">
        <div className="max-w-2xl mx-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-xl">
                    {msg.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{msg.nickname}</span>
                      <span className="text-xs text-gray-400">{msg.time}</span>
                    </div>
                    <p className="text-gray-700">{msg.content}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button className="flex items-center gap-1 text-sm text-gray-400 hover:text-pink-500 transition-colors">
                        <span>❤️</span>
                        <span>{msg.likes}</span>
                      </button>
                      <button className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
                        回复
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}