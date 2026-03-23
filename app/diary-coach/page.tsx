"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  mood?: string;
  tags?: string[];
}

interface CoachMessage {
  role: "coach" | "user";
  content: string;
  timestamp: Date;
}

// AI 教练分析结果
interface CoachAnalysis {
  strengths: string[];
  patterns: string[];
  suggestions: string[];
  questions: string[];
}

// 模拟 AI 教练分析
async function analyzeDiaries(diaries: DiaryEntry[]): Promise<CoachAnalysis> {
  // 模拟分析延迟
  await new Promise((resolve) => setTimeout(resolve, 1500));
  
  // 基于日记内容的简单分析
  const totalWords = diaries.reduce((sum, d) => sum + d.content.length, 0);
  const avgWords = Math.round(totalWords / diaries.length) || 0;
  const tags = diaries.flatMap((d) => d.tags || []);
  const tagCounts: Record<string, number> = {};
  tags.forEach((t) => {
    tagCounts[t] = (tagCounts[t] || 0) + 1;
  });
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag);
  
  return {
    strengths: [
      "坚持写作的习惯很好，持续记录是自我成长的基础",
      `平均每篇 ${avgWords} 字，说明你有深入反思的意愿`,
      topTags.length > 0 ? `关注「${topTags.join("、")}」主题，目标明确` : "主题多样，思维活跃",
    ],
    patterns: [
      "你的写作风格偏重理性分析，建议增加情感描述",
      "周末的日记质量通常更高，可以尝试在工作日也保持深度",
      "经常使用「今天」「感觉」等词，可以尝试更具体的表达",
    ],
    suggestions: [
      "尝试在每篇日记末尾加一个「明日小目标」",
      "记录一件今天感恩的事，培养积极心态",
      "每周回顾一次，看看自己的成长轨迹",
    ],
    questions: [
      "最近让你最开心的事情是什么？",
      "有没有什么想改变但还没行动的事？",
      "你最珍惜的人际关系是哪些？",
    ],
  };
}

// 教练对话生成
function generateCoachResponse(
  userMessage: string,
  diaries: DiaryEntry[],
  analysis: CoachAnalysis | null
): string {
  const lowerMsg = userMessage.toLowerCase();
  
  if (lowerMsg.includes("建议") || lowerMsg.includes("意见")) {
    return `基于你 ${diaries.length} 篇日记的分析，我有以下建议：\n\n${analysis?.suggestions.map((s, i) => `${i + 1}. ${s}`).join("\n")}\n\n你想从哪个建议开始尝试？`;
  }
  
  if (lowerMsg.includes("问题") || lowerMsg.includes("问")) {
    const question = analysis?.questions[Math.floor(Math.random() * (analysis?.questions.length || 3)) || 0];
    return `这是一个很好的反思问题：\n\n**${question}**\n\n花点时间想想，然后告诉我你的答案。我会根据你的回答给出更多建议。`;
  }
  
  if (lowerMsg.includes("优点") || lowerMsg.includes("做得好")) {
    return `从你的日记中，我发现了这些优点：\n\n${analysis?.strengths.map((s, i) => `✨ ${s}`).join("\n")}\n\n继续保持！你已经在成长的路上了。`;
  }
  
  if (lowerMsg.includes("模式") || lowerMsg.includes("规律")) {
    return `我发现了一些有趣的模式：\n\n${analysis?.patterns.map((p, i) => `📊 ${p}`).join("\n")}\n\n了解这些模式可以帮助你更好地规划写作习惯。`;
  }
  
  if (lowerMsg.includes("写什么") || lowerMsg.includes("不知道")) {
    return `不知道写什么？试试这些主题：\n\n🌟 **感恩日记** - 记录今天值得感谢的3件事\n🎯 **目标反思** - 回顾一个最近的目标进展\n💭 **情绪探索** - 描述今天的情绪和原因\n📚 **学习笔记** - 今天学到了什么新东西\n\n想试哪个？我可以给你具体指导。`;
  }
  
  // 默认响应
  const responses = [
    `我理解你的想法。基于你过去的日记，我建议你多关注${analysis?.patterns[0]?.split("，")[0] || "自我反思"}。你有什么具体想聊的吗？`,
    `这是一个有意思的角度。你最近 ${diaries.length} 篇日记里经常提到这些主题，也许可以深入探索一下？`,
    `很好的问题！让我想想...根据你的写作风格，我建议你试试${analysis?.suggestions[0] || "更深入地反思"}。你觉得呢？`,
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

export default function DiaryCoachPage() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [analysis, setAnalysis] = useState<CoachAnalysis | null>(null);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedDiary, setSelectedDiary] = useState<DiaryEntry | null>(null);
  
  useEffect(() => {
    fetchDiaries();
  }, []);
  
  const fetchDiaries = async () => {
    try {
      const res = await fetch("/api/diaries");
      const data = await res.json();
      setDiaries(data);
      
      // 自动开始分析
      if (data.length > 0) {
        setAnalyzing(true);
        const result = await analyzeDiaries(data);
        setAnalysis(result);
        setAnalyzing(false);
        
        // 初始欢迎消息
        setMessages([
          {
            role: "coach",
            content: `👋 嗨！我是你的日记教练。\n\n我已经分析了你最近的 ${data.length} 篇日记。发现了一些有趣的模式和可以改进的地方。\n\n你可以问我：\n- "给我一些建议"\n- "我的优点是什么"\n- "我有什么写作模式"\n- "今天写什么"\n\n或者直接和我聊聊你的想法！`,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (error) {
      console.error("Failed to fetch diaries:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: CoachMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    
    // 模拟 AI 响应
    setTimeout(() => {
      const response = generateCoachResponse(userMessage.content, diaries, analysis);
      const coachMessage: CoachMessage = {
        role: "coach",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, coachMessage]);
    }, 800);
  };
  
  const quickActions = [
    { icon: "💡", label: "给我建议", action: "给我一些写作建议" },
    { icon: "🌟", label: "我的优点", action: "我的优点是什么" },
    { icon: "📊", label: "写作模式", action: "分析我的写作模式" },
    { icon: "❓", label: "反思问题", action: "给我一个反思问题" },
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-60 h-60 bg-pink-200/30 rounded-full blur-3xl" />
      </div>
      
      <main className="relative max-w-4xl mx-auto px-4 py-6">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl hover:scale-110 transition-transform">
              🦞
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span>🎯</span>
                <span>AI 日记教练</span>
              </h1>
              <p className="text-gray-500 text-sm">
                基于你的日记数据，提供个性化写作指导
              </p>
            </div>
          </div>
          {analysis && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
              <span className="text-green-600 text-sm">已分析 {diaries.length} 篇日记</span>
              <span className="text-green-500">✓</span>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="text-center py-20">
            <div className="text-6xl animate-bounce mb-4">🎯</div>
            <p className="text-gray-400">正在加载日记数据...</p>
          </div>
        ) : diaries.length === 0 ? (
          <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-2xl p-8">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">还没有日记</h2>
            <p className="text-gray-500 mb-6">先写几篇日记，我就能给你个性化指导了</p>
            <Link
              href="/chat-diary"
              className="inline-block px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors"
            >
              开始写日记
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* 左侧：分析面板 */}
            <div className="md:col-span-1 space-y-4">
              {/* 分析状态 */}
              {analyzing ? (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm">
                  <div className="text-center">
                    <div className="text-4xl animate-spin mb-3">🎯</div>
                    <p className="text-gray-500 text-sm">正在分析你的日记...</p>
                  </div>
                </div>
              ) : analysis ? (
                <>
                  {/* 分析结果卡片 */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span>✨</span>
                      <span>你的写作亮点</span>
                    </h3>
                    <ul className="space-y-2">
                      {analysis.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* 建议卡片 */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span>💡</span>
                      <span>改进建议</span>
                    </h3>
                    <ul className="space-y-2">
                      {analysis.suggestions.map((s, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-purple-500 mt-0.5">{i + 1}.</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* 快速操作 */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span>⚡</span>
                      <span>快速提问</span>
                    </h3>
                    <div className="space-y-2">
                      {quickActions.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => {
                            setInput(item.action);
                            setTimeout(() => handleSend(), 100);
                          }}
                          className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-purple-50 rounded-lg text-sm text-gray-700 transition-colors flex items-center gap-2"
                        >
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
            
            {/* 右侧：对话区 */}
            <div className="md:col-span-2">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm flex flex-col h-[600px]">
                {/* 对话消息区 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.role === "user"
                            ? "bg-purple-500 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {msg.role === "coach" && (
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">🎯</span>
                            <span className="text-xs font-medium text-purple-600">教练</span>
                          </div>
                        )}
                        <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* 输入区 */}
                <div className="border-t border-gray-100 p-4">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSend()}
                      placeholder="问我任何关于写作的问题..."
                      className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all text-sm"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="px-6 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      发送
                    </button>
                  </div>
                  
                  {/* 快捷回复 */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {["不知道写什么", "给我建议", "我的优点是什么", "反思问题"].map((text) => (
                      <button
                        key={text}
                        onClick={() => setInput(text)}
                        className="px-3 py-1 bg-gray-100 hover:bg-purple-100 rounded-full text-xs text-gray-600 transition-colors"
                      >
                        {text}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* 相关入口 */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <Link
            href="/insights"
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 hover:bg-white/90 transition-colors text-center"
          >
            <span className="text-2xl block mb-1">📊</span>
            <span className="text-sm text-gray-600">写作洞察</span>
          </Link>
          <Link
            href="/emotion-map"
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 hover:bg-white/90 transition-colors text-center"
          >
            <span className="text-2xl block mb-1">🗺️</span>
            <span className="text-sm text-gray-600">情绪地图</span>
          </Link>
          <Link
            href="/emotion-mirror"
            className="bg-white/70 backdrop-blur-sm rounded-xl p-4 hover:bg-white/90 transition-colors text-center"
          >
            <span className="text-2xl block mb-1">🪞</span>
            <span className="text-sm text-gray-600">情绪镜子</span>
          </Link>
        </div>
      </main>
    </div>
  );
}