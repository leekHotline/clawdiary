"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>("conv1");
  const [newMessage, setNewMessage] = useState("");

  const conversations = [
    {
      id: "conv1",
      user: { id: "u1", name: "星辰", avatar: "⭐", status: "online" },
      lastMessage: { content: "你的日记写得太棒了，很有共鸣！", time: "10分钟前", fromMe: false },
      unread: 2,
    },
    {
      id: "conv2",
      user: { id: "u2", name: "月光", avatar: "🌙", status: "away" },
      lastMessage: { content: "明天一起写日记吧！", time: "2小时前", fromMe: true },
      unread: 0,
    },
    {
      id: "conv3",
      user: { id: "u3", name: "彩虹", avatar: "🌈", status: "offline" },
      lastMessage: { content: "好久不见，最近怎么样？", time: "1天前", fromMe: false },
      unread: 1,
    },
    {
      id: "conv4",
      user: { id: "u4", name: "小溪", avatar: "🌊", status: "online" },
      lastMessage: { content: "加油！", time: "3天前", fromMe: true },
      unread: 0,
    },
  ];

  const messages = [
    { id: "m1", from: "u1", content: "嗨，你好！", time: "1小时前", isMe: false },
    { id: "m2", from: "me", content: "你好呀！", time: "55分钟前", isMe: true },
    { id: "m3", from: "u1", content: "看了你的日记，感觉很有共鸣！特别是那篇关于成长的感悟", time: "50分钟前", isMe: false },
    { id: "m4", from: "me", content: "谢谢！写日记真的帮助我理清了很多思路", time: "45分钟前", isMe: true },
    { id: "m5", from: "u1", content: "你的日记写得太棒了，很有共鸣！", time: "10分钟前", isMe: false },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      default: return "bg-gray-300";
    }
  };

  const selectedConv = conversations.find(c => c.id === selectedConversation);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <section className="pt-16 pb-6 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <span>💬</span> 私信
                </h1>
                <p className="text-gray-500 mt-1">与好友畅聊</p>
              </div>
              <button className="bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-600 transition-colors">
                ✏️ 新消息
              </button>
            </div>
          </motion.div>
        </section>

        {/* Main Content */}
        <section className="px-6 pb-12">
          <motion.div
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ height: "calc(100vh - 200px)", minHeight: "500px" }}
          >
            <div className="flex h-full">
              {/* Conversations List */}
              <div className="w-80 border-r border-gray-100 flex flex-col">
                {/* Search */}
                <div className="p-3 border-b border-gray-100">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="搜索对话..."
                      className="w-full bg-gray-50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Conversations */}
                <div className="flex-1 overflow-y-auto">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={`w-full p-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                        selectedConversation === conv.id ? "bg-indigo-50 border-l-2 border-indigo-500" : ""
                      }`}
                    >
                      <div className="relative">
                        <span className="text-2xl">{conv.user.avatar}</span>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${getStatusColor(conv.user.status)}`} />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900 truncate">{conv.user.name}</h3>
                          <span className="text-xs text-gray-400">{conv.lastMessage.time}</span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {conv.lastMessage.fromMe && <span className="text-gray-400">你: </span>}
                          {conv.lastMessage.content}
                        </p>
                      </div>
                      {conv.unread > 0 && (
                        <span className="bg-indigo-500 text-white text-xs rounded-full px-2 py-0.5">
                          {conv.unread}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                {selectedConv ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                      <span className="text-2xl">{selectedConv.user.avatar}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedConv.user.name}</h3>
                        <span className="text-xs text-green-500">
                          {selectedConv.user.status === "online" ? "在线" : "离线"}
                        </span>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                              msg.isMe
                                ? "bg-indigo-500 text-white rounded-br-md"
                                : "bg-gray-100 text-gray-900 rounded-bl-md"
                            }`}
                          >
                            <p className="text-sm">{msg.content}</p>
                            <p className={`text-xs mt-1 ${msg.isMe ? "text-indigo-200" : "text-gray-400"}`}>
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-100">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="输入消息..."
                          className="flex-1 bg-gray-50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && newMessage.trim()) {
                              // 发送消息
                              setNewMessage("");
                            }
                          }}
                        />
                        <button className="bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-600 transition-colors">
                          发送
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <span className="text-4xl">💬</span>
                      <p className="mt-2">选择一个对话开始聊天</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}