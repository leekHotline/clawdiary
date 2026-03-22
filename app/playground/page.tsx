"use client";

import { useState } from "react";
import Link from "next/link";

export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<"learn" | "practice" | "templates">("learn");
  const [selectedPattern, setSelectedPattern] = useState<number | null>(null);
  const [userInput, setUserInput] = useState("");
  const [showResult, setShowResult] = useState(false);

  const patterns = [
    {
      id: 1,
      name: "角色设定",
      emoji: "🎭",
      principle: "赋予 AI 明确的角色身份",
      template: "你是一位[角色]，请帮我[任务]。",
      example: "你是一位资深产品经理，请帮我分析这个功能的用户价值。",
      tip: "角色可以是职业、性格、风格等，越具体越好",
    },
    {
      id: 2,
      name: "任务分解",
      emoji: "📋",
      principle: "将复杂任务拆解为简单步骤",
      template: "请按以下步骤完成：1. 2. 3.",
      example: "请按以下步骤分析：1. 找出核心问题 2. 列出可能方案 3. 给出推荐建议",
      tip: "步骤清晰，AI 输出更有条理",
    },
    {
      id: 3,
      name: "示例引导",
      emoji: "📝",
      principle: "用具体例子教 AI 你想要的格式",
      template: "请参考以下格式：\n[示例输入] -> [示例输出]",
      example: "请参考以下格式：\n[开心] -> 今天心情很棒，阳光明媚！\n[焦虑] -> 感到有些紧张，需要放松。",
      tip: "示例越典型，AI 理解越准确",
    },
    {
      id: 4,
      name: "约束条件",
      emoji: "🎯",
      principle: "设定明确的范围和限制",
      template: "请[任务]，要求：1. [限制1] 2. [限制2]",
      example: "请总结这篇文章，要求：1. 不超过100字 2. 保留关键数据 3. 用第一人称",
      tip: "约束让输出更精准可控",
    },
    {
      id: 5,
      name: "思维链",
      emoji: "🧠",
      principle: "引导 AI 展示推理过程",
      template: "请一步步思考：[问题]",
      example: "请一步步思考：如果用户留存率下降10%，我们应该如何分析原因？",
      tip: "让 AI 展示思考过程，结果更可靠",
    },
    {
      id: 6,
      name: "多角色对话",
      emoji: "🗣️",
      principle: "让 AI 从不同角度思考",
      template: "请分别从[角色A]和[角色B]的角度分析[问题]",
      example: "请分别从用户体验和商业价值的角度分析这个功能设计。",
      tip: "多视角让分析更全面",
    },
  ];

  const templates = [
    {
      category: "写作助手",
      items: [
        {
          name: "日记生成",
          prompt: "你是一位贴心的日记助手。请根据我提供的事件，帮我写一篇温暖、有感悟的日记。风格要自然流畅，包含对事件的思考和感受。",
          tags: ["日记", "写作", "反思"],
        },
        {
          name: "文章改写",
          prompt: "请帮我改写这段文字，保持原意不变，但让表达更加生动有趣。注意：1. 使用更丰富的词汇 2. 增加一些修辞手法 3. 控制在原文长度左右",
          tags: ["改写", "润色", "优化"],
        },
        {
          name: "周报生成",
          prompt: "你是一位专业的项目助手。请根据我提供的工作事项，帮我生成一份结构清晰的周报，包含：本周完成、下周计划、需要支持三部分。",
          tags: ["周报", "总结", "工作"],
        },
      ],
    },
    {
      category: "创意工具",
      items: [
        {
          name: "头脑风暴",
          prompt: "你是一位创意专家。请帮我就[主题]进行头脑风暴，给出10个有趣的想法。每个想法请简短说明其价值和可行性。",
          tags: ["创意", "头脑风暴", "灵感"],
        },
        {
          name: "故事创作",
          prompt: "你是一位擅长讲故事的作家。请根据我给的关键词，创作一个引人入胜的短篇故事。故事要有起承转合，结尾要让人回味。",
          tags: ["故事", "创作", "小说"],
        },
        {
          name: "产品命名",
          prompt: "你是一位品牌命名专家。请为[产品描述]提供5个有创意的名字建议，每个名字要解释其寓意和适用场景。",
          tags: ["命名", "品牌", "产品"],
        },
      ],
    },
    {
      category: "学习助手",
      items: [
        {
          name: "概念解释",
          prompt: "你是一位善于讲解的老师。请用简单易懂的语言解释[概念]，要求：1. 用日常生活中的类比 2. 给出具体例子 3. 控制在200字以内",
          tags: ["学习", "解释", "理解"],
        },
        {
          name: "学习计划",
          prompt: "你是一位学习规划师。请帮我想一份[技能]的学习计划，为期30天，每天有具体的学习任务和练习建议。考虑从基础到进阶的递进。",
          tags: ["学习", "计划", "技能"],
        },
        {
          name: "面试准备",
          prompt: "你是一位经验丰富的面试官。请针对[职位]，给我出5个常见面试问题，并告诉我优秀的回答思路和要点。",
          tags: ["面试", "求职", "准备"],
        },
      ],
    },
    {
      category: "分析工具",
      items: [
        {
          name: "问题分析",
          prompt: "你是一位分析专家。请用5W2H方法分析[问题]，找出关键因素和可能的解决方案。请用结构化的方式呈现。",
          tags: ["分析", "问题", "方法"],
        },
        {
          name: "决策辅助",
          prompt: "你是一位决策顾问。我正在考虑[选择]，请帮我列出每个选项的：1. 优势 2. 劣势 3. 可能风险 4. 潜在收益，帮我做出更明智的选择。",
          tags: ["决策", "选择", "权衡"],
        },
        {
          name: "数据洞察",
          prompt: "你是一位数据分析专家。请分析这些数据[数据]，给出：1. 关键发现 2. 异常点 3. 可行的行动建议。用通俗的语言解释。",
          tags: ["数据", "分析", "洞察"],
        },
      ],
    },
  ];

  const practiceExercises = [
    {
      level: "初级",
      emoji: "🌱",
      task: "写一个提示词，让 AI 帮你生成一份简单的购物清单",
      hint: "提示：告诉 AI 你要做什么类型的餐食，让它列出食材",
      expectedElements: ["角色设定", "明确任务"],
    },
    {
      level: "中级",
      emoji: "🌿",
      task: "写一个提示词，让 AI 以特定风格重写一句话",
      hint: "提示：指定风格（如幽默、正式、诗意）和具体要求",
      expectedElements: ["风格约束", "示例引导"],
    },
    {
      level: "高级",
      emoji: "🌳",
      task: "写一个提示词，让 AI 作为多方辩论主持人",
      hint: "提示：定义不同观点的角色，让他们对话碰撞",
      expectedElements: ["多角色", "思维链", "结构化输出"],
    },
  ];

  const [currentExercise, setCurrentExercise] = useState(0);
  const [practiceInput, setPracticeInput] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-2xl hover:scale-110 transition-transform">
                🦞
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">AI Prompt 练习场</h1>
                <p className="text-xs text-gray-400">学习提示词技巧，成为 AI 沟通高手</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/chat-diary"
                className="px-4 py-2 rounded-lg bg-purple-600/20 text-purple-300 text-sm hover:bg-purple-600/30 transition-colors"
              >
                💬 写日记
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="sticky top-[73px] z-40 backdrop-blur-xl bg-slate-900/60 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: "learn", name: "学习技巧", emoji: "📚" },
              { id: "practice", name: "练习挑战", emoji: "🎯" },
              { id: "templates", name: "模板库", emoji: "📝" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-3 text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "text-white border-b-2 border-purple-500"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <span className="mr-2">{tab.emoji}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Learning Section */}
        {activeTab === "learn" && (
          <div className="space-y-8">
            {/* Intro */}
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-purple-500/30">
              <div className="flex items-center gap-4">
                <div className="text-5xl">🎨</div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">掌握提示词的艺术</h2>
                  <p className="text-gray-400">
                    好的提示词能让 AI 输出质量提升 10 倍。学习这 6 个核心模式，成为 AI 沟通高手！
                  </p>
                </div>
              </div>
            </div>

            {/* Pattern Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              {patterns.map((pattern) => (
                <div
                  key={pattern.id}
                  onClick={() => setSelectedPattern(selectedPattern === pattern.id ? null : pattern.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedPattern === pattern.id
                      ? "bg-purple-600/20 border-purple-500"
                      : "bg-white/5 border-white/10 hover:border-purple-500/50"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-3xl">{pattern.emoji}</div>
                    <div>
                      <h3 className="font-semibold text-white">{pattern.name}</h3>
                      <p className="text-xs text-gray-400">{pattern.principle}</p>
                    </div>
                  </div>

                  {selectedPattern === pattern.id && (
                    <div className="mt-4 space-y-3 animate-fadeIn">
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">模板</div>
                        <code className="text-sm text-purple-300">{pattern.template}</code>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-3">
                        <div className="text-xs text-gray-400 mb-1">示例</div>
                        <p className="text-sm text-gray-300">{pattern.example}</p>
                      </div>
                      <div className="flex items-start gap-2 text-sm">
                        <span className="text-yellow-400">💡</span>
                        <span className="text-gray-400">{pattern.tip}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Tips */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>⚡</span>
                <span>快速技巧</span>
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: "具体比模糊好", desc: "说'写一篇关于咖啡的文章'比'写点什么'效果好10倍" },
                  { title: "给示例", desc: "提供一个理想输出的示例，AI 会更容易理解你的期望" },
                  { title: "迭代优化", desc: "第一次结果不满意？追问'请更简洁一点'或'换个角度'" },
                ].map((tip, i) => (
                  <div key={i} className="bg-slate-800/30 rounded-xl p-4">
                    <div className="font-medium text-white mb-1">{tip.title}</div>
                    <div className="text-sm text-gray-400">{tip.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Practice Section */}
        {activeTab === "practice" && (
          <div className="space-y-8">
            {/* Progress */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">练习挑战</h2>
                <div className="text-sm text-gray-400">
                  进度: {currentExercise + 1} / {practiceExercises.length}
                </div>
              </div>
              <div className="flex gap-2">
                {practiceExercises.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full ${
                      i <= currentExercise ? "bg-purple-500" : "bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Current Exercise */}
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-purple-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl">{practiceExercises[currentExercise].emoji}</div>
                <div>
                  <span className="text-xs text-purple-300 bg-purple-500/20 px-2 py-1 rounded">
                    {practiceExercises[currentExercise].level}
                  </span>
                  <h3 className="text-lg font-semibold text-white mt-1">挑战任务</h3>
                </div>
              </div>
              <p className="text-gray-300 mb-4 text-lg">{practiceExercises[currentExercise].task}</p>
              <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-400 flex items-start gap-2">
                  <span>💭</span>
                  <span>{practiceExercises[currentExercise].hint}</span>
                </div>
              </div>

              {/* Input Area */}
              <textarea
                value={practiceInput}
                onChange={(e) => setPracticeInput(e.target.value)}
                placeholder="在这里写下你的提示词..."
                className="w-full h-32 bg-slate-800/50 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none resize-none"
              />

              {/* Expected Elements */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-400">考察点：</span>
                {practiceExercises[currentExercise].expectedElements.map((el) => (
                  <span key={el} className="px-2 py-1 bg-slate-700/50 rounded text-xs text-gray-300">
                    {el}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    // Simple feedback logic
                    if (practiceInput.length > 20) {
                      alert("很好！你的提示词有一定复杂度。记住使用我们学过的模式来优化它！");
                    } else {
                      alert("再想想，提示词可以更详细一些。试着加入角色设定或具体要求。");
                    }
                  }}
                  className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-500 transition-colors"
                >
                  提交检验
                </button>
                <button
                  onClick={() => setPracticeInput("")}
                  className="px-6 py-2.5 bg-white/10 text-gray-300 rounded-lg font-medium hover:bg-white/20 transition-colors"
                >
                  重置
                </button>
                {currentExercise < practiceExercises.length - 1 && (
                  <button
                    onClick={() => {
                      setCurrentExercise(currentExercise + 1);
                      setPracticeInput("");
                    }}
                    className="px-6 py-2.5 bg-white/10 text-gray-300 rounded-lg font-medium hover:bg-white/20 transition-colors ml-auto"
                  >
                    下一题 →
                  </button>
                )}
              </div>
            </div>

            {/* Tips for Success */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">🏆 评分标准</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                  <div className="text-green-400 font-medium mb-1">优秀 ⭐⭐⭐</div>
                  <div className="text-sm text-gray-400">使用2+个模式，具体且可执行</div>
                </div>
                <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                  <div className="text-yellow-400 font-medium mb-1">良好 ⭐⭐</div>
                  <div className="text-sm text-gray-400">使用1个模式，有一定细节</div>
                </div>
                <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                  <div className="text-red-400 font-medium mb-1">待提升 ⭐</div>
                  <div className="text-sm text-gray-400">过于简单，需要更多细节</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Templates Section */}
        {activeTab === "templates" && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-purple-500/20 rounded-lg px-4 py-2">
                <span className="text-purple-300 text-sm">共 {templates.reduce((acc, t) => acc + t.items.length, 0)} 个模板</span>
              </div>
              <div className="bg-pink-500/20 rounded-lg px-4 py-2">
                <span className="text-pink-300 text-sm">{templates.length} 个分类</span>
              </div>
            </div>

            {/* Template Categories */}
            {templates.map((category) => (
              <div key={category.category} className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                <div className="bg-white/5 px-5 py-3 border-b border-white/10">
                  <h3 className="font-semibold text-white">{category.category}</h3>
                </div>
                <div className="p-4 space-y-3">
                  {category.items.map((item) => (
                    <div
                      key={item.name}
                      className="bg-slate-800/30 rounded-xl p-4 hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-white">{item.name}</h4>
                        <div className="flex gap-1">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-400 bg-slate-900/50 rounded-lg p-3 mt-2 font-mono">
                        {item.prompt}
                      </p>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.prompt);
                          alert("已复制到剪贴板！");
                        }}
                        className="mt-3 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        📋 复制提示词
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Submit Template */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-white/10 text-center">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="text-lg font-semibold text-white mb-2">有好用的提示词？</h3>
              <p className="text-sm text-gray-400 mb-4">分享你的提示词模板，帮助更多人</p>
              <Link
                href="/feedback?type=prompt"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-500 transition-colors"
              >
                提交模板
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>🦞 Claw Diary Prompt 练习场 · 让 AI 更懂你</p>
          <div className="mt-2 flex items-center justify-center gap-4 text-xs">
            <Link href="/tools" className="text-purple-400 hover:underline">
              AI 工具箱
            </Link>
            <Link href="/quickstart" className="text-purple-400 hover:underline">
              快速上手
            </Link>
            <Link href="/help" className="text-purple-400 hover:underline">
              帮助中心
            </Link>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}