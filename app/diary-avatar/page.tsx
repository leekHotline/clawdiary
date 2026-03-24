"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Message {
  role: "user" | "avatar";
  content: string;
  timestamp: Date;
}

interface AvatarPersona {
  name: string;
  emoji: string;
  personality: string;
  mood: string;
  memoryCount: number;
  created: string;
}

const defaultPersona: AvatarPersona = {
  name: "日记小精灵",
  emoji: "🧚",
  personality: "温柔细腻，记得你所有的故事",
  mood: "好奇而期待",
  memoryCount: 0,
  created: new Date().toISOString(),
};

export default function DiaryAvatarPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [persona, setPersona] = useState<AvatarPersona | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 加载保存的对话和人格
  useEffect(() => {
    const savedPersona = localStorage.getItem("diaryAvatarPersona");
    const savedMessages = localStorage.getItem("diaryAvatarMessages");

    if (savedPersona) {
      setPersona(JSON.parse(savedPersona));
    }
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      setMessages(parsed.map((m: Message) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })));
      setShowIntro(false);
    }
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 初始化化身
  const initAvatar = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/diary-avatar/init", { method: "POST" });
      const data = await res.json();
      
      const newPersona = data.persona || defaultPersona;
      setPersona(newPersona);
      localStorage.setItem("diaryAvatarPersona", JSON.stringify(newPersona));
      
      // 添加欢迎消息
      const welcomeMsg: Message = {
        role: "avatar",
        content: `嗨！我是${newPersona.name} ${newPersona.emoji}\n\n我已经准备好和你聊天啦！你可以问我关于你过去的日记，或者聊聊你现在的心情～`,
        timestamp: new Date(),
      };
      setMessages([welcomeMsg]);
      localStorage.setItem("diaryAvatarMessages", JSON.stringify([welcomeMsg]));
      setShowIntro(false);
    } catch (error) {
      // 使用默认人格
      setPersona(defaultPersona);
      const welcomeMsg: Message = {
        role: "avatar",
        content: `嗨！我是日记小精灵 🧚\n\n我已经准备好和你聊天啦！你可以问我关于你过去的日记，或者聊聊你现在的心情～`,
        timestamp: new Date(),
      };
      setMessages([welcomeMsg]);
      localStorage.setItem("diaryAvatarPersona", JSON.stringify(defaultPersona));
      localStorage.setItem("diaryAvatarMessages", JSON.stringify([welcomeMsg]));
      setShowIntro(false);
    }
    setIsLoading(false);
  };

  // 发送消息
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/diary-avatar/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input.trim(),
          history: messages.slice(-10),
          persona,
        }),
      });
      const data = await res.json();

      const avatarMessage: Message = {
        role: "avatar",
        content: data.response || "让我想想...你的故事真的很精彩呢！",
        timestamp: new Date(),
      };

      const updatedMessages = [...newMessages, avatarMessage];
      setMessages(updatedMessages);
      localStorage.setItem("diaryAvatarMessages", JSON.stringify(updatedMessages));
    } catch (error) {
      // 模拟回复
      const fallbackResponses = [
        `嗯...这让我想起了你之前写过的一些故事呢～ ${persona?.emoji || "🧚"}`,
        "我懂你的感受，有时候生活就是这样充满了惊喜和挑战～",
        "你知道吗？每一段经历都是宝贵的回忆呢！",
        "听起来你今天心情不错呀～来和我多聊聊吧！",
        "这个故事让我想起了你的成长轨迹，你一直在进步呢！",
      ];
      
      const avatarMessage: Message = {
        role: "avatar",
        content: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
        timestamp: new Date(),
      };

      const updatedMessages = [...newMessages, avatarMessage];
      setMessages(updatedMessages);
      localStorage.setItem("diaryAvatarMessages", JSON.stringify(updatedMessages));
    }

    setIsLoading(false);
  };

  // 清除对话
  const clearChat = () => {
    if (confirm("确定要清除所有对话记录吗？")) {
      setMessages([]);
      localStorage.removeItem("diaryAvatarMessages");
      setShowIntro(true);
    }
  };

  // 快捷话题
  const quickTopics = [
    { emoji: "💭", text: "我今天心情怎么样？" },
    { emoji: "📖", text: "讲讲我最难忘的日记" },
    { emoji: "🎯", text: "我的成长轨迹是什么？" },
    { emoji: "🌟", text: "给我一句鼓励的话" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-fuchsia-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-pink-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-10 w-40 h-40 bg-rose-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-32 h-32 bg-fuchsia-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-2xl mx-auto px-4 pt-6 pb-20">
        {/* 顶部栏 */}
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/"
            className="inline-flex items-center text-gray-500 hover:text-gray-700"
          >
            <span className="mr-2">←</span>
            返回
          </Link>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              清除对话
            </button>
          )}
        </div>

        {/* 标题区 */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">{persona?.emoji || "🧚"}</div>
          <h1 className="text-2xl font-bold text-gray-800">
            {persona?.name || "日记化身"}
          </h1>
          {persona && (
            <p className="text-sm text-gray-500 mt-1">{persona.personality}</p>
          )}
        </div>

        {/* Intro 状态 - 初始化引导 */}
        {showIntro && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50 text-center">
            <div className="text-6xl mb-6">✨</div>
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              唤醒你的日记化身
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              日记化身会记住你所有的故事，<br />
              你可以随时和它聊天，回顾过去，展望未来
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 bg-rose-50 rounded-xl">
                <div className="text-2xl mb-2">💬</div>
                <div className="text-sm font-medium text-gray-700">随时对话</div>
                <div className="text-xs text-gray-400">像朋友一样聊天</div>
              </div>
              <div className="p-4 bg-pink-50 rounded-xl">
                <div className="text-2xl mb-2">🧠</div>
                <div className="text-sm font-medium text-gray-700">记忆所有</div>
                <div className="text-xs text-gray-400">记住你的每篇日记</div>
              </div>
              <div className="p-4 bg-fuchsia-50 rounded-xl">
                <div className="text-2xl mb-2">🎭</div>
                <div className="text-sm font-medium text-gray-700">独特人格</div>
                <div className="text-xs text-gray-400">根据你的风格生成</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl mb-2">🌱</div>
                <div className="text-sm font-medium text-gray-700">持续成长</div>
                <div className="text-xs text-gray-400">随着日记一起进化</div>
              </div>
            </div>

            <button
              onClick={initAvatar}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isLoading ? "唤醒中..." : "唤醒日记化身 ✨"}
            </button>
          </div>
        )}

        {/* 对话区域 */}
        {!showIntro && messages.length > 0 && (
          <>
            <div className="space-y-4 mb-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white rounded-br-md"
                        : "bg-white/80 backdrop-blur-sm text-gray-700 rounded-bl-md shadow-sm border border-white/50"
                    }`}
                  >
                    {msg.role === "avatar" && (
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{persona?.emoji || "🧚"}</span>
                        <span className="text-xs font-medium text-gray-500">{persona?.name}</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">
                      {msg.content}
                    </p>
                    <div
                      className={`text-xs mt-1 ${
                        msg.role === "user" ? "text-white/60" : "text-gray-400"
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString("zh-CN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/80 backdrop-blur-sm px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-white/50">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{persona?.emoji || "🧚"}</span>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 快捷话题 */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
              {quickTopics.map((topic, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setInput(topic.text);
                  }}
                  className="flex-shrink-0 px-3 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-gray-600 hover:bg-white/80 transition-colors border border-white/50"
                >
                  {topic.emoji} {topic.text}
                </button>
              ))}
            </div>
          </>
        )}

        {/* 输入区域 */}
        {!showIntro && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-rose-50 via-rose-50/95 to-transparent">
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="和你的日记化身聊天..."
                  className="flex-1 px-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 focus:outline-none focus:ring-2 focus:ring-rose-300 text-gray-700 placeholder-gray-400"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="px-5 py-3 bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  发送
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 底部说明 */}
        <div className="mt-8 text-center text-xs text-gray-400">
          <p>🧚 日记化身会记住你所有的故事</p>
        </div>
      </main>
    </div>
  );
}