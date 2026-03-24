"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// 日记数据结构
interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
}

// 对话消息
interface Message {
  id: string;
  role: "user" | "diary";
  content: string;
  timestamp: Date;
}

// 模拟日记数据
const MOCK_DIARIES: DiaryEntry[] = [
  {
    id: "1",
    date: "2026-03-23",
    title: "一个充实的周末",
    content: "今天终于把拖延了很久的项目收尾了。虽然过程有些艰难，但完成的那一刻真的很有成就感。晚上和朋友们一起吃了火锅，聊了很多，感觉压力释放了不少。也许我应该学会更好地平衡工作和生活，不要总是把自己逼得太紧。",
    mood: "满足",
    tags: ["工作", "朋友", "放松"],
  },
  {
    id: "2",
    date: "2026-03-20",
    title: "春分的思考",
    content: "今天是春分，阳光很好。在公园散步的时候，突然意识到自己已经很久没有好好感受四季的变化了。小时候总觉得时间很慢，现在却觉得一年转瞬即逝。也许应该给自己定一些小目标，让每一天都更有意义。",
    mood: "平静",
    tags: ["春天", "思考", "目标"],
  },
  {
    id: "3",
    date: "2026-03-18",
    title: "小小的挫折",
    content: "今天的会议不太顺利，方案被否决了。虽然理性上知道这是正常的工作流程，但情感上还是有些失落。不过团队成员的安慰让我很感动，也许失败本身就是成长的一部分。明天继续努力。",
    mood: "低落",
    tags: ["工作", "挫折", "团队"],
  },
  {
    id: "4",
    date: "2026-03-15",
    title: "一个新的想法",
    content: "最近在思考 AI 对生活的影响。以前总觉得 AI 是遥远的未来，现在它已经无处不在了。我决定开始学习使用 AI 工具来提升效率，而不是害怕被取代。拥抱变化，才能不被时代抛弃。",
    mood: "好奇",
    tags: ["AI", "学习", "未来"],
  },
  {
    id: "5",
    date: "2026-03-10",
    title: "简单的快乐",
    content: "今天自己做了一顿饭，虽然很简单，但吃得特别香。原来幸福可以这么简单——一餐热饭，一本好书，一首喜欢的歌。不需要太多，刚刚好就好。",
    mood: "幸福",
    tags: ["生活", "简单", "感恩"],
  },
];

// AI 回复生成
function generateDiaryResponse(diary: DiaryEntry, userMessage: string): string {
  const responses: Record<string, string[]> = {
    "为什么": [
      `那时候我确实在思考${diary.tags[0] || "这件事"}。回过头看，我觉得是因为...`,
      `其实当时写这段话的时候，我的内心是${diary.mood}的。你问这个问题，让我重新审视了自己的动机...`,
      `这个"为什么"其实我也一直在问自己。也许答案就藏在那些简单的日常里...`,
    ],
    "怎么样": [
      `现在回想起来，那次经历让我学会了...`,
      `如果让我重新选择，我可能还是会这么做，因为...`,
      `那次之后，我对${diary.tags[0] || "这件事"}有了不同的理解...`,
    ],
    "感觉": [
      `写那篇日记的时候，我的心情确实是${diary.mood}的。现在再读，感觉又不一样了...`,
      `你能感受到我当时的心情吗？那种${diary.mood}的感觉，现在想来仍然清晰...`,
      `有时候文字比记忆更诚实。看到你问这个，让我想起了更多当时的细节...`,
    ],
    "后悔": [
      `坦白说，我没有后悔。每一个选择都塑造了现在的我...`,
      `如果要说后悔，可能是没有早点开始做这件事...`,
      `人生没有彩排，我选择相信一切都是最好的安排...`,
    ],
    "建议": [
      `如果我能回到那时，我会告诉自己：${diary.content.slice(0, 30)}...其实不需要太在意别人的眼光。`,
      `给你一个建议：珍惜当下，就像那天的我珍惜那刻的${diary.mood}一样。`,
      `我想说的是，每一个平凡的日子都值得被记录，因为它们串联起来就是人生。`,
    ],
    "default": [
      `读到你这个问题，让我想起了写那篇日记时的情景...${diary.content.slice(0, 50)}...那时候的我确实很${diary.mood}。`,
      `那篇日记记录了我生命中很重要的一刻。现在重新审视，我觉得...`,
      `你知道吗，${diary.date}那天的阳光特别好，就像我的心情一样${diary.mood}。你问这个让我重新回味了那个时刻...`,
      `时间过去这么久了，再次谈起这个话题，我有了新的感悟...`,
      `日记里的每一个字，都是真实的我。谢谢你让我重新审视那段经历...`,
    ],
  };

  // 根据关键词匹配回复类型
  for (const [key, replyList] of Object.entries(responses)) {
    if (key !== "default" && userMessage.includes(key)) {
      return replyList[Math.floor(Math.random() * replyList.length)];
    }
  }

  return responses.default[Math.floor(Math.random() * responses.default.length)];
}

export default function DiaryChatPage() {
  const [selectedDiary, setSelectedDiary] = useState<DiaryEntry | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 选择日记后自动发送开场白
  useEffect(() => {
    if (selectedDiary && messages.length === 0) {
      setMessages([
        {
          id: "1",
          role: "diary",
          content: `你好，我是${selectedDiary.date}写日记的你。那天我写了"${selectedDiary.title}"，心情是${selectedDiary.mood}。有什么想问我吗？我可以帮你回忆那天的感受和想法。`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [selectedDiary]);

  // 发送消息
  const handleSend = async () => {
    if (!inputValue.trim() || !selectedDiary) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // 模拟 AI 思考延迟
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 700));

    const diaryResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "diary",
      content: generateDiaryResponse(selectedDiary, userMessage.content),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, diaryResponse]);
    setIsTyping(false);
  };

  // 快捷问题
  const quickQuestions = [
    "当时为什么会这样想？",
    "现在回头看有什么感觉？",
    "有什么想对现在的我说吗？",
    "那天最让你难忘的是什么？",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-violet-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-40 h-40 bg-fuchsia-300/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block text-sm text-purple-600 hover:text-purple-700 mb-3">
            ← 返回首页
          </Link>
          <div className="text-5xl mb-3">💭</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            日记对话
          </h1>
          <p className="text-gray-500 mt-1">与过去的自己对话，发现新的自己</p>
        </div>

        {!selectedDiary ? (
          // 选择日记界面
          <div className="space-y-4">
            <div className="text-center text-gray-600 mb-4">
              <p className="text-lg">📖 选择一篇日记开始对话</p>
              <p className="text-sm text-gray-400 mt-1">AI 会扮演那天的你，回答你的问题</p>
            </div>

            <div className="grid gap-3">
              {MOCK_DIARIES.map((diary) => (
                <button
                  key={diary.id}
                  onClick={() => setSelectedDiary(diary)}
                  className="w-full text-left bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-sm border border-purple-100 hover:shadow-lg hover:border-purple-300 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">📝</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full">
                          {diary.date}
                        </span>
                        <span className="text-xs text-gray-400">心情: {diary.mood}</span>
                      </div>
                      <h3 className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                        {diary.title}
                      </h3>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                        {diary.content}
                      </p>
                      <div className="flex gap-2 mt-2">
                        {diary.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // 对话界面
          <div className="flex flex-col h-[calc(100vh-200px)] min-h-[500px]">
            {/* 日记卡片 */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-purple-100 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">📝</div>
                  <div>
                    <h3 className="font-bold text-gray-800">{selectedDiary.title}</h3>
                    <p className="text-xs text-gray-500">
                      {selectedDiary.date} · 心情: {selectedDiary.mood}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedDiary(null);
                    setMessages([]);
                  }}
                  className="text-sm text-purple-600 hover:text-purple-700 px-3 py-1 hover:bg-purple-50 rounded-full transition-colors"
                >
                  换一篇
                </button>
              </div>
              <p className="text-gray-600 text-sm mt-3 line-clamp-2">{selectedDiary.content}</p>
            </div>

            {/* 消息区域 */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white"
                        : "bg-white/90 backdrop-blur-sm text-gray-800 shadow-sm border border-purple-100"
                    }`}
                  >
                    {msg.role === "diary" && (
                      <div className="flex items-center gap-2 mb-1 text-xs text-purple-500">
                        <span>💭</span>
                        <span>过去的我</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}

              {/* 打字动画 */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/90 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-sm border border-purple-100">
                    <div className="flex items-center gap-2 text-purple-500">
                      <span className="text-sm">💭</span>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 快捷问题 */}
            {messages.length <= 2 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInputValue(q);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-1.5 text-xs bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* 输入框 */}
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="问问过去的自己..."
                className="flex-1 px-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl border border-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-gray-800 placeholder-gray-400"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                发送
              </button>
            </div>

            {/* 提示 */}
            <p className="text-center text-xs text-gray-400 mt-3">
              💡 试着问一些深度问题，与过去的自己建立连接
            </p>
          </div>
        )}
      </main>
    </div>
  );
}