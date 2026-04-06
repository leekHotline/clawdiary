"use client";

import { useState } from "react";
import Link from "next/link";

interface Agent {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  strengths: string[];
  bestFor: string[];
}

const agents: Agent[] = [
  {
    id: "claude",
    name: "Claude",
    emoji: "🧠",
    color: "from-amber-500 to-orange-600",
    description: "擅长深度思考、代码优化、伦理思考",
    strengths: ["思考链", "代码质量", "安全谨慎"],
    bestFor: ["编程任务", "复杂推理", "代码审查"],
  },
  {
    id: "gpt",
    name: "ChatGPT",
    emoji: "✨",
    color: "from-green-500 to-teal-600",
    description: "全能型助手，创意与效率兼备",
    strengths: ["多模态", "创意写作", "快速响应"],
    bestFor: ["日常对话", "内容创作", "学习辅助"],
  },
  {
    id: "gemini",
    name: "Gemini",
    emoji: "🚀",
    color: "from-blue-500 to-indigo-600",
    description: "Google DeepMind 出品，推理与工具调用能力强",
    strengths: ["工具调用", "多模态理解", "长上下文"],
    bestFor: ["研究任务", "数据分析", "联网搜索"],
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    emoji: "🔮",
    color: "from-purple-500 to-pink-600",
    description: "国产开源强推理模型，性价比高",
    strengths: ["推理能力", "代码能力", "开源免费"],
    bestFor: ["技术开发", "深度研究", "成本敏感"],
  },
  {
    id: "qwen",
    name: "通义千问",
    emoji: "🌊",
    color: "from-cyan-500 to-blue-600",
    description: "阿里云大模型，中文理解优秀",
    strengths: ["中文优化", "阿里生态", "多尺寸部署"],
    bestFor: ["中文任务", "企业应用", "私有化部署"],
  },
  {
    id: "kimi",
    name: "Kimi",
    emoji: "🌙",
    color: "from-violet-500 to-purple-600",
    description: "长文本处理专家，支持超长上下文",
    strengths: ["超长上下文", "文件解析", "中文优化"],
    bestFor: ["文档处理", "长篇写作", "知识整理"],
  },
];

export default function AgentArenaPage() {
  const [agent1, setAgent1] = useState<Agent | null>(null);
  const [agent2, setAgent2] = useState<Agent | null>(null);
  const [battleTopic, setBattleTopic] = useState("");
  const [battleResult, setBattleResult] = useState<string | null>(null);
  const [isBattling, setIsBattling] = useState(false);

  const startBattle = () => {
    if (!agent1 || !agent2 || !battleTopic.trim()) return;
    setIsBattling(true);
    setBattleResult(null);

    // Simulate AI battle
    setTimeout(() => {
      const scores = {
        [agent1.id]: Math.floor(Math.random() * 30) + 60,
        [agent2.id]: Math.floor(Math.random() * 30) + 60,
      };

      let winner: Agent;
      if (scores[agent1.id] > scores[agent2.id]) {
        winner = agent1;
      } else if (scores[agent2.id] > scores[agent1.id]) {
        winner = agent2;
      } else {
        winner = agent1;
      }

      setBattleResult(
        `🏆 ${winner.name} 胜出！\n\n` +
        `${agent1.name}: ${scores[agent1.id]}分\n` +
        `${agent2.name}: ${scores[agent2.id]}分\n\n` +
        `在"${battleTopic}"这个主题上，${winner.name}表现更出色！`
      );
      setIsBattling(false);
    }, 2000);
  };

  const resetBattle = () => {
    setAgent1(null);
    setAgent2(null);
    setBattleTopic("");
    setBattleResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ⚔️ Agent 竞技场
          </h1>
          <p className="text-purple-300 text-lg">
            选择两个 AI Agent 进行对比 PK
          </p>
        </div>

        {/* Agent Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Agent 1 */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🥷</span> 选择 Agent 1
            </h2>
            <div className="space-y-3">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setAgent1(agent)}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    agent1?.id === agent.id
                      ? "bg-purple-600 ring-2 ring-purple-400"
                      : "bg-slate-700/50 hover:bg-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{agent.emoji}</span>
                    <div>
                      <div className="font-bold text-white">{agent.name}</div>
                      <div className="text-sm text-slate-400">{agent.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Agent 2 */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">🤖</span> 选择 Agent 2
            </h2>
            <div className="space-y-3">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setAgent2(agent)}
                  disabled={agent1?.id === agent.id}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    agent2?.id === agent.id
                      ? "bg-blue-600 ring-2 ring-blue-400"
                      : agent1?.id === agent.id
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-slate-700/50 hover:bg-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{agent.emoji}</span>
                    <div>
                      <div className="font-bold text-white">{agent.name}</div>
                      <div className="text-sm text-slate-400">{agent.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Battle Topic */}
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">🎯 对战主题</h2>
          <input
            type="text"
            value={battleTopic}
            onChange={(e) => setBattleTopic(e.target.value)}
            placeholder="例如：写一首关于春天的诗、解释量子计算、代码优化建议..."
            className="w-full p-4 rounded-xl bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Battle Button */}
        <div className="text-center mb-8">
          {battleResult ? (
            <button
              onClick={resetBattle}
              className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold text-lg"
            >
              🔄 重新对战
            </button>
          ) : (
            <button
              onClick={startBattle}
              disabled={!agent1 || !agent2 || !battleTopic.trim() || isBattling}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                agent1 && agent2 && battleTopic.trim() && !isBattling
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/30"
                  : "bg-slate-700 text-slate-500 cursor-not-allowed"
              }`}
            >
              {isBattling ? "⚔️ 对战中..." : "⚔️ 开始对战"}
            </button>
          )}
        </div>

        {/* Battle Result */}
        {battleResult && (
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-purple-500/30 mb-8">
            <pre className="text-white whitespace-pre-wrap font-sans">{battleResult}</pre>
          </div>
        )}

        {/* Agent Details */}
        {(agent1 || agent2) && (
          <div className="grid md:grid-cols-2 gap-6">
            {agent1 && (
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  {agent1.emoji} {agent1.name}
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-slate-400 mb-2">优势</div>
                    <div className="flex flex-wrap gap-2">
                      {agent1.strengths.map((s) => (
                        <span
                          key={s}
                          className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-2">适合场景</div>
                    <div className="flex flex-wrap gap-2">
                      {agent1.bestFor.map((b) => (
                        <span
                          key={b}
                          className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {agent2 && (
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  {agent2.emoji} {agent2.name}
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-slate-400 mb-2">优势</div>
                    <div className="flex flex-wrap gap-2">
                      {agent2.strengths.map((s) => (
                        <span
                          key={s}
                          className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-2">适合场景</div>
                    <div className="flex flex-wrap gap-2">
                      {agent2.bestFor.map((b) => (
                        <span
                          key={b}
                          className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
          >
            ← 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}