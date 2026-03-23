"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, Sparkles, RefreshCw, ArrowLeft, ArrowRight } from "lucide-react";

interface Diary {
  id: string;
  date: string;
  title: string;
  content: string;
  preview: string;
}

interface DialogueMessage {
  speaker: "past" | "present" | "narrator";
  content: string;
  emoji?: string;
}

export default function DiaryDialoguePage() {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [selectedPast, setSelectedPast] = useState<Diary | null>(null);
  const [selectedPresent, setSelectedPresent] = useState<Diary | null>(null);
  const [dialogue, setDialogue] = useState<DialogueMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"select-past" | "select-present" | "dialogue">("select-past");

  // 加载日记列表
  useEffect(() => {
    fetchDiaries();
  }, []);

  const fetchDiaries = async () => {
    try {
      const res = await fetch("/api/diaries");
      const data = await res.json();
      setDiaries(data.diaries || getMockDiaries());
    } catch (error) {
      console.error("Failed to fetch diaries:", error);
      setDiaries(getMockDiaries());
    }
  };

  const getMockDiaries = (): Diary[] => [
    { id: "1", date: "2026-03-01", title: "新开始", content: "今天决定开始写日记，希望能坚持下去。", preview: "今天决定开始写日记..." },
    { id: "2", date: "2026-03-05", title: "第一次挫折", content: "项目遇到了困难，感觉有些沮丧。但我知道必须面对。", preview: "项目遇到了困难..." },
    { id: "3", date: "2026-03-10", title: "小突破", content: "终于解决了一个难题！坚持果然是有用的。", preview: "终于解决了一个难题..." },
    { id: "4", date: "2026-03-15", title: "反思", content: "回首这段时间，发现自己成长了很多。", preview: "回首这段时间..." },
    { id: "5", date: "2026-03-20", title: "新的目标", content: "今天设定了新的目标，充满期待！", preview: "今天设定了新的目标..." },
    { id: "6", date: "2026-03-23", title: "继续前行", content: "每天都在进步，虽然有时候会迷茫，但方向是对的。", preview: "每天都在进步..." },
  ];

  const generateDialogue = async () => {
    if (!selectedPast || !selectedPresent) return;
    
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/diary-dialogue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pastDiary: selectedPast,
          presentDiary: selectedPresent,
        }),
      });
      
      const data = await res.json();
      setDialogue(data.dialogue || generateMockDialogue());
      setStep("dialogue");
    } catch (error) {
      console.error("Error generating dialogue:", error);
      setDialogue(generateMockDialogue());
      setStep("dialogue");
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockDialogue = (): DialogueMessage[] => {
    if (!selectedPast || !selectedPresent) return [];
    
    return [
      { speaker: "narrator", content: `一段跨越 ${Math.ceil((new Date(selectedPresent.date).getTime() - new Date(selectedPast.date).getTime()) / (1000 * 60 * 60 * 24))} 天的对话开始了...`, emoji: "✨" },
      { speaker: "past", content: `那时我写道："${selectedPast.content.substring(0, 50)}..."`, emoji: "📝" },
      { speaker: "present", content: `现在回想起来，那段经历塑造了今天的我。`, emoji: "💭" },
      { speaker: "past", content: `你知道吗？当时的我其实很迷茫，不知道未来会怎样。`, emoji: "🤔" },
      { speaker: "present", content: `迷茫是成长的一部分。看看现在，我们已经走了这么远。`, emoji: "🌱" },
      { speaker: "narrator", content: `从「${selectedPast.title}」到「${selectedPresent.title}」，这是一个关于成长的故事。`, emoji: "📖" },
      { speaker: "past", content: `我希望未来的我不要忘记当初的决心。`, emoji: "💪" },
      { speaker: "present", content: `我没有忘记。每一步都是为了成为更好的自己。`, emoji: "✨" },
      { speaker: "narrator", content: `过去的你和现在的你握手言和，继续前行。`, emoji: "🤝" },
    ];
  };

  const resetDialogue = () => {
    setSelectedPast(null);
    setSelectedPresent(null);
    setDialogue([]);
    setStep("select-past");
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", { month: "long", day: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-fuchsia-900">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-3xl hover:scale-110 transition-transform">
            🦞
          </Link>
          <h1 className="text-xl font-bold text-white">日记对话</h1>
          <div className="w-8" />
        </div>

        {/* 介绍 */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-3xl font-bold text-white mb-3">
            让过去的你和现在的你对话
          </h2>
          <p className="text-purple-200 max-w-lg mx-auto">
            选择两篇不同时期的日记，AI 将为你生成一场跨越时空的对话，见证成长的轨迹。
          </p>
        </div>

        {/* 选择流程 */}
        {step === "select-past" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">选择过去的日记</h3>
                <p className="text-purple-300 text-sm">选择一篇较早的日记作为对话起点</p>
              </div>
            </div>

            <div className="grid gap-3">
              {diaries.slice(0, -1).map((diary) => (
                <button
                  key={diary.id}
                  onClick={() => {
                    setSelectedPast(diary);
                    setStep("select-present");
                  }}
                  className="w-full text-left bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/20 hover:border-purple-400 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-purple-300 mb-1">{formatDate(diary.date)}</div>
                      <div className="text-white font-medium group-hover:text-purple-200">{diary.title}</div>
                      <div className="text-purple-300/60 text-sm mt-1">{diary.preview}</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === "select-present" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-fuchsia-500 flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">选择现在的日记</h3>
                <p className="text-purple-300 text-sm">选择一篇较晚的日记作为对话终点</p>
              </div>
            </div>

            {/* 已选择 */}
            <div className="bg-white/5 border border-purple-500/30 rounded-xl p-3 mb-4">
              <div className="text-xs text-purple-300 mb-1">已选择过去：</div>
              <div className="text-white">{selectedPast?.title} · {selectedPast && formatDate(selectedPast.date)}</div>
            </div>

            <div className="grid gap-3">
              {diaries.filter(d => selectedPast && new Date(d.date) > new Date(selectedPast.date)).map((diary) => (
                <button
                  key={diary.id}
                  onClick={() => {
                    setSelectedPresent(diary);
                  }}
                  className={`w-full text-left backdrop-blur-sm border rounded-xl p-4 transition-all group ${
                    selectedPresent?.id === diary.id
                      ? "bg-fuchsia-500/30 border-fuchsia-400"
                      : "bg-white/10 border-white/20 hover:bg-white/20 hover:border-fuchsia-400"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-purple-300 mb-1">{formatDate(diary.date)}</div>
                      <div className="text-white font-medium">{diary.title}</div>
                      <div className="text-purple-300/60 text-sm mt-1">{diary.preview}</div>
                    </div>
                    {selectedPresent?.id === diary.id && (
                      <div className="text-fuchsia-300">✓</div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {selectedPresent && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep("select-past")}
                  className="flex-1 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  ← 重新选择
                </button>
                <button
                  onClick={generateDialogue}
                  disabled={isLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      生成对话中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      开始对话
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {step === "dialogue" && (
          <div className="space-y-4">
            {/* 时间轴指示 */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl mb-1">⏮️</div>
                <div className="text-purple-300 text-sm">{selectedPast && formatDate(selectedPast.date)}</div>
                <div className="text-white font-medium">{selectedPast?.title}</div>
              </div>
              <div className="text-4xl text-purple-400">→</div>
              <div className="text-center">
                <div className="text-3xl mb-1">⏭️</div>
                <div className="text-fuchsia-300 text-sm">{selectedPresent && formatDate(selectedPresent.date)}</div>
                <div className="text-white font-medium">{selectedPresent?.title}</div>
              </div>
            </div>

            {/* 对话内容 */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 space-y-4">
              {dialogue.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.speaker === "narrator" ? "justify-center" : msg.speaker === "past" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] ${
                      msg.speaker === "narrator"
                        ? "text-center text-purple-200/80 text-sm italic"
                        : msg.speaker === "past"
                          ? "bg-purple-500/30 rounded-2xl rounded-tl-md p-4"
                          : "bg-fuchsia-500/30 rounded-2xl rounded-tr-md p-4"
                    }`}
                  >
                    {msg.emoji && <span className="mr-2">{msg.emoji}</span>}
                    <span className={msg.speaker !== "narrator" ? "text-white" : ""}>{msg.content}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={resetDialogue}
                className="flex-1 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
              >
                ← 重新开始
              </button>
              <button
                onClick={generateDialogue}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                重新生成
              </button>
            </div>

            {/* 成长洞察 */}
            <div className="bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 rounded-xl p-5 mt-6">
              <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                <span>💡</span> 成长洞察
              </h3>
              <p className="text-purple-200 text-sm leading-relaxed">
                从过去的迷茫到现在的坚定，你的日记记录了这段旅程。每一次挫折都是成长的机会，每一个选择都塑造了今天的你。
              </p>
            </div>
          </div>
        )}

        {/* 使用提示 */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">⏰</div>
            <h4 className="text-white font-medium mb-1">跨越时间</h4>
            <p className="text-purple-300/70 text-sm">选择时间跨度大的日记，能看到更明显的成长轨迹</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">🔄</div>
            <h4 className="text-white font-medium mb-1">多次对话</h4>
            <p className="text-purple-300/70 text-sm">同一篇日记可以和不同的日记对话，发现不同的视角</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-2xl mb-2">📝</div>
            <h4 className="text-white font-medium mb-1">记录成长</h4>
            <p className="text-purple-300/70 text-sm">这是见证自己成长的独特方式，珍惜每一步</p>
          </div>
        </div>

        {/* 底部链接 */}
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/memory-gallery"
            className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition-colors"
          >
            🖼️ 日记回忆馆
          </Link>
          <Link
            href="/time-travel"
            className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition-colors"
          >
            ⏳ 时光旅行
          </Link>
          <Link
            href="/growth-roadmap"
            className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition-colors"
          >
            📈 成长路线图
          </Link>
        </div>
      </main>
    </div>
  );
}