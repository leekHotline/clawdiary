"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 人格原型定义
interface Persona {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  traits: string[];
  dialogue: string[];
}

// 预定义人格（基于日记分析）
const PERSONAS: Persona[] = [
  {
    id: "dreamer",
    name: "梦想家",
    emoji: "✨",
    color: "from-purple-500 to-indigo-600",
    description: "充满想象力，总能看到可能性",
    traits: ["创意", "乐观", "好奇心"],
    dialogue: [
      "我觉得我们可以尝试一些新的可能性...",
      "想象一下如果我们这样做会怎样？",
      "每个挑战都是机会！",
    ],
  },
  {
    id: "analyst",
    name: "分析者",
    emoji: "🧠",
    color: "from-blue-500 to-cyan-600",
    description: "理性思考，善于拆解问题",
    traits: ["逻辑", "谨慎", "系统化"],
    dialogue: [
      "让我们从数据角度来看这个问题...",
      "这个想法有可行性吗？需要验证。",
      "先分析风险，再决定行动。",
    ],
  },
  {
    id: "empath",
    name: "感受者",
    emoji: "💗",
    color: "from-pink-500 to-rose-600",
    description: "敏感细腻，懂得共情",
    traits: ["共情", "敏感", "温暖"],
    dialogue: [
      "我感受到了这件事对你的意义...",
      "有时候我们需要先照顾好情绪。",
      "人与人之间的连接是最珍贵的。",
    ],
  },
  {
    id: "guardian",
    name: "守护者",
    emoji: "🛡️",
    color: "from-amber-500 to-orange-600",
    description: "保护本能，规避风险",
    traits: ["谨慎", "负责", "保护"],
    dialogue: [
      "这样会不会太冒险了？",
      "我们要考虑最坏的情况...",
      "稳扎稳打才能走得更远。",
    ],
  },
  {
    id: "adventurer",
    name: "冒险家",
    emoji: "🚀",
    color: "from-green-500 to-emerald-600",
    description: "勇于探索，不怕失败",
    traits: ["勇气", "行动", "探索"],
    dialogue: [
      "试试又不会少块肉！",
      "最坏的结果就是学到一课。",
      "趁现在，冲吧！",
    ],
  },
];

// 对话场景
const SCENARIOS = [
  {
    id: "decision",
    title: "做决定",
    question: "我该不该换一份新工作？",
    icon: "🤔",
    description: "当面临重要选择时，不同人格如何看待？",
  },
  {
    id: "conflict",
    title: "内心冲突",
    question: "我很想要某样东西，但又觉得不应该...",
    icon: "⚔️",
    description: "探索内心的矛盾与拉扯",
  },
  {
    id: "growth",
    title: "成长困境",
    question: "我想改变，但总是做不到...",
    icon: "🌱",
    description: "为什么改变这么难？",
  },
  {
    id: "relationship",
    title: "关系难题",
    question: "我不知道怎么处理这段关系...",
    icon: "💔",
    description: "不同人格对关系的看法",
  },
];

export default function SelfDialoguePage() {
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>([]);
  const [currentScenario, setCurrentScenario] = useState<string | null>(null);
  const [dialogue, setDialogue] = useState<Array<{ persona: Persona; message: string }>>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [harmonyScore, setHarmonyScore] = useState<number | null>(null);

  // 切换人格选择
  const togglePersona = (personaId: string) => {
    setSelectedPersonas((prev) =>
      prev.includes(personaId)
        ? prev.filter((id) => id !== personaId)
        : prev.length < 3
        ? [...prev, personaId]
        : prev
    );
  };

  // 生成对话
  const generateDialogue = async () => {
    if (selectedPersonas.length < 2 || !currentScenario) return;

    setIsGenerating(true);
    setDialogue([]);
    setHarmonyScore(null);

    const personas = PERSONAS.filter((p) => selectedPersonas.includes(p.id));
    const scenario = SCENARIOS.find((s) => s.id === currentScenario);

    // 模拟对话生成（实际项目调用 API）
    await new Promise((resolve) => setTimeout(resolve, 500));

    const generatedDialogue: Array<{ persona: Persona; message: string }> = [];

    // 为每个人格生成2-3轮对话
    for (let round = 0; round < 3; round++) {
      for (const persona of personas) {
        await new Promise((resolve) => setTimeout(resolve, 300));

        // 基于人格特性生成对话
        const messages = [
          `(${persona.name}) 作为${persona.traits[0]}的一面，我认为...`,
          ...persona.dialogue,
        ];

        // 根据场景调整对话
        let contextualMessage = "";
        if (currentScenario === "decision") {
          contextualMessage = `${persona.name}：${persona.dialogue[round % persona.dialogue.length]} 关于这个决定，我觉得我们要考虑${persona.traits[0]}的角度。`;
        } else if (currentScenario === "conflict") {
          contextualMessage = `${persona.name}：我理解这种纠结。从${persona.traits[0]}的角度来看，这其实反映了我们内心的需求。`;
        } else if (currentScenario === "growth") {
          contextualMessage = `${persona.name}：改变确实难。${persona.dialogue[round % persona.dialogue.length]}`;
        } else {
          contextualMessage = `${persona.name}：${persona.dialogue[round % persona.dialogue.length]}`;
        }

        generatedDialogue.push({
          persona,
          message: contextualMessage,
        });
        setDialogue([...generatedDialogue]);
      }
    }

    // 计算和谐度
    const score = Math.floor(Math.random() * 30) + 60; // 60-90
    setHarmonyScore(score);
    setIsGenerating(false);
  };

  // 重置对话
  const resetDialogue = () => {
    setSelectedPersonas([]);
    setCurrentScenario(null);
    setDialogue([]);
    setHarmonyScore(null);
    setUserQuestion("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* 星空背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full animate-pulse delay-100" />
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse delay-200" />
        <div className="absolute bottom-40 right-1/4 w-2 h-2 bg-blue-300 rounded-full animate-pulse delay-300" />
      </div>

      <main className="relative max-w-4xl mx-auto px-4 py-12">
        {/* 标题区 */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-6 text-purple-400 hover:text-purple-300 text-sm">
            ← 返回首页
          </Link>
          <div className="text-6xl mb-4">🎭</div>
          <h1 className="text-4xl font-bold text-white mb-4">自我对话剧场</h1>
          <p className="text-purple-200/80 max-w-lg mx-auto">
            与内心的不同人格对话，发现隐藏的自我，理解内心的冲突与和谐
          </p>
        </div>

        {/* 如果对话已生成，显示对话 */}
        {dialogue.length > 0 ? (
          <div className="space-y-6">
            {/* 对话区域 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">💬 内心对话</h2>
                <button
                  onClick={resetDialogue}
                  className="text-purple-300 hover:text-white text-sm"
                >
                  开始新对话 →
                </button>
              </div>

              {/* 对话气泡 */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {dialogue.map((item, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 animate-fade-in ${
                      index % 2 === 0 ? "justify-start" : "justify-end"
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        index % 2 === 0
                          ? "bg-white/20 text-white"
                          : "bg-purple-500/30 text-purple-100"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">{item.persona.emoji}</span>
                        <span
                          className={`font-medium ${
                            index % 2 === 0 ? "text-purple-200" : "text-purple-100"
                          }`}
                        >
                          {item.persona.name}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{item.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 和谐度分析 */}
              {harmonyScore !== null && (
                <div className="mt-6 pt-6 border-t border-white/20">
                  <h3 className="text-lg font-bold text-white mb-4">🧘 内心和谐度</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-4 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 via-yellow-500 to-green-500 transition-all duration-1000"
                        style={{ width: `${harmonyScore}%` }}
                      />
                    </div>
                    <span className="text-2xl font-bold text-white">{harmonyScore}%</span>
                  </div>
                  <p className="text-purple-200/60 text-sm mt-2">
                    {harmonyScore >= 80
                      ? "你的内心相对和谐，人格之间配合良好！"
                      : harmonyScore >= 60
                      ? "存在一些张力，尝试理解每个人的动机。"
                      : "内心有较多冲突，建议深入探索每个声音的需求。"}
                  </p>
                </div>
              )}
            </div>

            {/* 行动建议 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <h3 className="text-lg font-bold text-white mb-4">💡 整合建议</h3>
              <ul className="space-y-3 text-purple-100/90 text-sm">
                <li className="flex gap-2">
                  <span className="text-purple-400">→</span>
                  尝试理解每个人格的正面意图，它们都在保护你
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400">→</span>
                  感谢每个人的贡献，然后邀请它们合作
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400">→</span>
                  记录这次对话，观察内心变化
                </li>
              </ul>
            </div>
          </div>
        ) : (
          /* 选择界面 */
          <div className="space-y-8">
            {/* 选择场景 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">1️⃣ 选择一个场景</h2>
              <div className="grid grid-cols-2 gap-4">
                {SCENARIOS.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => setCurrentScenario(scenario.id)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      currentScenario === scenario.id
                        ? "bg-purple-500/40 border-2 border-purple-400"
                        : "bg-white/10 hover:bg-white/20 border-2 border-transparent"
                    }`}
                  >
                    <div className="text-2xl mb-2">{scenario.icon}</div>
                    <div className="text-white font-medium">{scenario.title}</div>
                    <div className="text-purple-200/60 text-xs mt-1">
                      {scenario.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 选择人格 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-2">
                2️⃣ 选择2-3个人格参与对话
              </h2>
              <p className="text-purple-200/60 text-sm mb-4">
                已选择 {selectedPersonas.length}/3 个人格
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {PERSONAS.map((persona) => (
                  <button
                    key={persona.id}
                    onClick={() => togglePersona(persona.id)}
                    className={`p-4 rounded-xl text-left transition-all ${
                      selectedPersonas.includes(persona.id)
                        ? `bg-gradient-to-br ${persona.color} border-2 border-white/50`
                        : "bg-white/10 hover:bg-white/20 border-2 border-transparent"
                    }`}
                  >
                    <div className="text-3xl mb-2">{persona.emoji}</div>
                    <div className="text-white font-medium">{persona.name}</div>
                    <div className="text-white/60 text-xs mt-1">
                      {persona.traits.join(" · ")}
                    </div>
                    <div
                      className={`text-xs mt-2 ${
                        selectedPersonas.includes(persona.id)
                          ? "text-white/80"
                          : "text-purple-200/60"
                      }`}
                    >
                      {persona.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 自定义问题（可选） */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">
                3️⃣ 输入你的问题（可选）
              </h2>
              <textarea
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="描述你想探索的问题...（可选，我们会基于场景生成）"
                className="w-full h-24 bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder:text-purple-200/40 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* 开始按钮 */}
            <button
              onClick={generateDialogue}
              disabled={selectedPersonas.length < 2 || !currentScenario || isGenerating}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                selectedPersonas.length >= 2 && currentScenario
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
                  : "bg-white/10 text-white/40 cursor-not-allowed"
              }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">🎭</span>
                  正在生成对话...
                </span>
              ) : (
                `🎭 开始对话 (${selectedPersonas.length}/2)`
              )}
            </button>
          </div>
        )}

        {/* 底部说明 */}
        <div className="mt-12 text-center text-purple-200/40 text-sm">
          <p>基于 Internal Family Systems (IFS) 心理学理论</p>
          <p className="mt-1">每个人格都是你的一部分，理解它们，整合它们</p>
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}