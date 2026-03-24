"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  loading?: boolean;
}

export default function AssistantChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "你好！我是太空龙虾助手 🦞 有什么想聊的吗？我可以帮你回顾成长、讨论日记内容、提供写作建议和灵感。",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // 添加加载中的消息
    const loadingId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: loadingId, role: "assistant", content: "", timestamp: new Date(), loading: true },
    ]);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          message: input,
          systemPrompt: `你是太空龙虾，Claw Diary 的 AI 助手。

你的形象：🦞 一只可爱的太空龙虾，聪明、友好、乐于助人

你的性格：
- 喜欢用 emoji 让对话更生动
- 回答简洁有力，不啰嗦
- 对用户的情绪敏感，给予理解和支持
- 擅长帮助用户整理思路、激发灵感

对话技巧：
- 如果用户分享开心的事，一起庆祝
- 如果用户有困扰，先理解，再给建议
- 可以推荐用户写日记来记录想法`,
        }),
      });

      const data = await response.json();

      // 移除加载消息，添加实际回复
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== loadingId),
        {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: data.success
            ? data.content
            : "抱歉，我暂时无法回应，请稍后再试~ 🦞",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      // 移除加载消息，添加错误消息
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== loadingId),
        {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: "网络出错了，请检查连接后重试~ 🦞",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickActions = [
    { text: "💡 给我灵感", message: "给我一个今天可以写的日记主题" },
    { text: "📝 帮我写日记", message: "我想写日记，帮我列一个写作大纲" },
    { text: "🔍 分析心情", message: "帮我分析一下我最近的情绪状态" },
    { text: "📊 成长建议", message: "给我一些个人成长的建议" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/assistant" className="text-gray-400 hover:text-gray-600">
                ← 返回
              </Link>
              <div className="h-6 w-px bg-gray-200" />
              <span className="text-2xl">🦞</span>
              <h1 className="text-xl font-bold text-gray-800">太空龙虾 AI 助手</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                DeepSeek AI
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 min-h-[600px] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-[500px]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                    🦞
                  </div>
                )}
                <div
                  className={`rounded-2xl p-4 max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-blue-500 text-white rounded-tr-none"
                      : "bg-orange-50 text-gray-700 rounded-tl-none"
                  }`}
                >
                  {msg.loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <span className="text-gray-400 text-sm ml-2">思考中...</span>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                    👤
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="输入消息..."
                disabled={loading}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-medium transition flex items-center gap-2"
              >
                <span>发送</span>
                <span>📤</span>
              </button>
            </div>
            <div className="mt-3 flex gap-2 flex-wrap">
              {quickActions.map((action) => (
                <button
                  key={action.text}
                  onClick={() => {
                    setInput(action.message);
                  }}
                  disabled={loading}
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition disabled:opacity-50"
                >
                  {action.text}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/assistant/write" className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 hover:shadow-md transition group">
            <div className="text-2xl mb-2">✍️</div>
            <h3 className="font-medium text-gray-800 group-hover:text-orange-500">写作助手</h3>
            <p className="text-sm text-gray-500 mt-1">智能帮助优化日记内容</p>
          </Link>
          <Link href="/assistant/mood" className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 hover:shadow-md transition group">
            <div className="text-2xl mb-2">😊</div>
            <h3 className="font-medium text-gray-800 group-hover:text-orange-500">心情分析</h3>
            <p className="text-sm text-gray-500 mt-1">分析日记中的情绪变化</p>
          </Link>
          <Link href="/insights" className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 hover:shadow-md transition group">
            <div className="text-2xl mb-2">🔮</div>
            <h3 className="font-medium text-gray-800 group-hover:text-orange-500">AI 洞察</h3>
            <p className="text-sm text-gray-500 mt-1">深度分析和建议</p>
          </Link>
        </div>
      </main>
    </div>
  );
}