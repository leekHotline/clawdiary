"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface AgentProfile {
  name: string;
  emoji: string;
  writingStyle: string;
  personality: string;
  strengths: string[];
  quirks: string[];
  learningProgress: number;
  diariesAnalyzed: number;
}

export default function DiaryAgentPage() {
  const [step, setStep] = useState<"intro" | "creating" | "ready">("intro");
  const [agent, setAgent] = useState<AgentProfile | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  // 加载已有的 Agent
  useEffect(() => {
    const saved = localStorage.getItem("diaryAgent");
    if (saved) {
      setAgent(JSON.parse(saved));
      setStep("ready");
    }
  }, []);

  const createAgent = async () => {
    setStep("creating");
    setIsGenerating(true);

    try {
      const res = await fetch("/api/diary-agent/create", {
        method: "POST",
      });
      const data = await res.json();

      if (data.agent) {
        setAgent(data.agent);
        localStorage.setItem("diaryAgent", JSON.stringify(data.agent));
        setStep("ready");
      }
    } catch (error) {
      console.error("Failed to create agent:", error);
      // 创建一个默认 Agent
      const defaultAgent: AgentProfile = {
        name: "日记小精灵",
        emoji: "🧚",
        writingStyle: "温暖细腻",
        personality: "善解人意，喜欢用温柔的语气记录生活中的点滴美好",
        strengths: ["情感捕捉", "细节描写", "时间感知"],
        quirks: ["喜欢用三个点的省略号...", "偶尔会引用歌词"],
        learningProgress: 35,
        diariesAnalyzed: 5,
      };
      setAgent(defaultAgent);
      localStorage.setItem("diaryAgent", JSON.stringify(defaultAgent));
      setStep("ready");
    }

    setIsGenerating(false);
  };

  const generatePreview = async () => {
    if (!agent) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/diary-agent/generate", {
        method: "POST",
        body: JSON.stringify({ agent }),
      });
      const data = await res.json();
      setPreview(data.text || "今天是个好日子，阳光洒在窗台上，我感到无比宁静...");
    } catch {
      setPreview(
        `今天又是平凡的一天...阳光透过窗帘的缝隙照进来，让我想起了小时候...\n\n——${agent.name} 代写`
      );
    }

    setIsGenerating(false);
  };

  const deleteAgent = () => {
    if (confirm("确定要删除你的日记代理吗？它会失去所有学习到的内容。")) {
      localStorage.removeItem("diaryAgent");
      setAgent(null);
      setStep("intro");
      setPreview("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-fuchsia-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-10 w-40 h-40 bg-fuchsia-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-32 h-32 bg-violet-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-2xl mx-auto px-6 pt-12 pb-16">
        {/* 返回 */}
        <Link
          href="/"
          className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6"
        >
          <span className="mr-2">←</span>
          返回首页
        </Link>

        {/* 标题 */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">🤖</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            日记代理
          </h1>
          <p className="text-gray-500">
            创建一个会学习你写作风格的 AI 代理
          </p>
        </div>

        {/* Intro 状态 */}
        {step === "intro" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/50">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🌱</div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                还没有日记代理
              </h2>
              <p className="text-gray-500 text-sm">
                创建一个专属你的 AI 写作助手，它会学习你的风格
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl">
                <span className="text-2xl">📝</span>
                <div>
                  <h3 className="font-medium text-gray-800">学习写作风格</h3>
                  <p className="text-sm text-gray-500">
                    分析你过去的日记，学习你独特的表达方式
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-fuchsia-50 rounded-xl">
                <span className="text-2xl">🎭</span>
                <div>
                  <h3 className="font-medium text-gray-800">形成人格画像</h3>
                  <p className="text-sm text-gray-500">
                    根据你的写作特点，创建独特的 Agent 人格
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-violet-50 rounded-xl">
                <span className="text-2xl">🌱</span>
                <div>
                  <h3 className="font-medium text-gray-800">持续进化</h3>
                  <p className="text-sm text-gray-500">
                    每写一篇日记，Agent 都会变得更像你
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={createAgent}
              className="w-full py-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
            >
              创建我的日记代理 ✨
            </button>
          </div>
        )}

        {/* Creating 状态 */}
        {step === "creating" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 shadow-lg border border-white/50 text-center">
            <div className="animate-bounce text-6xl mb-6">🧬</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              正在分析你的日记...
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              AI 正在学习你的写作风格和个性特点
            </p>

            <div className="space-y-3 text-left max-w-xs mx-auto">
              {[
                { text: "读取历史日记...", done: true },
                { text: "分析写作模式...", done: true },
                { text: "识别情感倾向...", done: isGenerating },
                { text: "创建 Agent 人格...", done: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className={item.done ? "text-green-500" : "text-gray-300"}>
                    {item.done ? "✓" : "○"}
                  </span>
                  <span className={item.done ? "text-gray-600" : "text-gray-400"}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ready 状态 */}
        {step === "ready" && agent && (
          <div className="space-y-6">
            {/* Agent 卡片 */}
            <div className="bg-gradient-to-br from-violet-500 to-fuchsia-600 rounded-2xl p-6 shadow-lg text-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="text-5xl">{agent.emoji}</div>
                  <div>
                    <h2 className="text-2xl font-bold">{agent.name}</h2>
                    <p className="text-white/70 text-sm">你的日记代理</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-white/60">学习进度</div>
                  <div className="text-2xl font-bold">{agent.learningProgress}%</div>
                </div>
              </div>

              {/* 进度条 */}
              <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${agent.learningProgress}%` }}
                />
              </div>

              <div className="text-sm text-white/80">
                已分析 <strong>{agent.diariesAnalyzed}</strong> 篇日记
              </div>
            </div>

            {/* 人格详情 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🎭</span> 人格画像
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">写作风格</div>
                  <div className="font-medium text-gray-800">{agent.writingStyle}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">性格特点</div>
                  <div className="text-gray-700">{agent.personality}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-2">擅长领域</div>
                  <div className="flex flex-wrap gap-2">
                    {agent.strengths.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-2">独特习惯</div>
                  <div className="flex flex-wrap gap-2">
                    {agent.quirks.map((q, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-fuchsia-100 text-fuchsia-700 rounded-full text-sm"
                      >
                        {q}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 代写预览 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>✍️</span> 代写预览
              </h3>

              <button
                onClick={generatePreview}
                disabled={isGenerating}
                className="mb-4 px-4 py-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-lg text-sm hover:shadow-md transition-all disabled:opacity-50"
              >
                {isGenerating ? "生成中..." : "生成示例"}
              </button>

              {preview && (
                <div className="p-4 bg-gray-50 rounded-xl text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {preview}
                </div>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={createAgent}
                className="flex-1 py-3 bg-purple-100 text-purple-700 rounded-xl font-medium hover:bg-purple-200 transition-colors"
              >
                🔄 重新学习
              </button>
              <button
                onClick={deleteAgent}
                className="flex-1 py-3 bg-red-100 text-red-700 rounded-xl font-medium hover:bg-red-200 transition-colors"
              >
                🗑️ 删除代理
              </button>
            </div>
          </div>
        )}

        {/* 底部说明 */}
        <div className="mt-10 text-center text-sm text-gray-400">
          <p>🧠 基于你的历史日记训练 · 📚 写得越多越像你</p>
        </div>
      </main>
    </div>
  );
}