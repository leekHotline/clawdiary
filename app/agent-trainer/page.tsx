"use client";

import { useState } from "react";
import Link from "next/link";

export default function AgentTrainerPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("beginner");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const levels = [
    { id: "beginner", name: "初学者", emoji: "🌱" },
    { id: "intermediate", name: "进阶", emoji: "🚀" },
    { id: "advanced", name: "专家", emoji: "⚡" },
  ];

  const challenges = [
    {
      id: 1,
      level: "beginner",
      title: "编写第一个 Prompt",
      description: "学会如何写出清晰的指令，让 AI 更好地理解你的需求",
      difficulty: "简单",
      duration: "10分钟",
    },
    {
      id: 2,
      level: "beginner",
      title: "角色扮演技巧",
      description: "学习如何设定角色，让 AI 扮演特定身份提供更专业的回答",
      difficulty: "简单",
      duration: "15分钟",
    },
    {
      id: 3,
      level: "intermediate",
      title: "上下文管理",
      description: "掌握如何在多轮对话中有效管理上下文和记忆",
      difficulty: "中等",
      duration: "20分钟",
    },
    {
      id: 4,
      level: "intermediate",
      title: "思维链提示",
      description: "学习让 AI 展示推理过程，提高复杂任务准确性",
      difficulty: "中等",
      duration: "25分钟",
    },
    {
      id: 5,
      level: "advanced",
      title: "Agent 工作流设计",
      description: "设计多步骤自动化的 Agent 工作流程",
      difficulty: "困难",
      duration: "45分钟",
    },
    {
      id: 6,
      level: "advanced",
      title: "Few-shot 示例工程",
      description: "通过精心设计的示例引导 AI 输出高质量结果",
      difficulty: "困难",
      duration: "40分钟",
    },
  ];

  const filteredChallenges = challenges.filter(
    (c) => c.level === selectedLevel
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-2xl hover:scale-110 transition-transform">
                🦞
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">Agent 训练场</h1>
                <p className="text-xs text-gray-400">Learn AI Agent prompting like a pro</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>📚 {challenges.length} 个练习</span>
            </div>
          </div>
        </div>
      </header>

      {/* Level Selector */}
      <div className="sticky top-[73px] z-40 backdrop-blur-xl bg-slate-900/50 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-center gap-4">
            {selectedLevel === "beginner" ? (
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl font-medium bg-green-600 text-white shadow-lg shadow-green-500/30 scale-105">
                <span className="text-2xl">🌱</span>
                <span>初学者</span>
              </button>
            ) : (
              <button onClick={() => setSelectedLevel("beginner")} className="flex items-center gap-2 px-6 py-3 rounded-2xl font-medium bg-white/5 text-gray-400 hover:bg-white/10">
                <span className="text-2xl">🌱</span>
                <span>初学者</span>
              </button>
            )}
            {selectedLevel === "intermediate" ? (
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl font-medium bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105">
                <span className="text-2xl">🚀</span>
                <span>进阶</span>
              </button>
            ) : (
              <button onClick={() => setSelectedLevel("intermediate")} className="flex items-center gap-2 px-6 py-3 rounded-2xl font-medium bg-white/5 text-gray-400 hover:bg-white/10">
                <span className="text-2xl">🚀</span>
                <span>进阶</span>
              </button>
            )}
            {selectedLevel === "advanced" ? (
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl font-medium bg-purple-600 text-white shadow-lg shadow-purple-500/30 scale-105">
                <span className="text-2xl">⚡</span>
                <span>专家</span>
              </button>
            ) : (
              <button onClick={() => setSelectedLevel("advanced")} className="flex items-center gap-2 px-6 py-3 rounded-2xl font-medium bg-white/5 text-gray-400 hover:bg-white/10">
                <span className="text-2xl">⚡</span>
                <span>专家</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8 p-6 rounded-3xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            选择你的第一个挑战
          </h2>
          <p className="text-gray-400">
            从实际练习中掌握 AI Agent 的精髓
          </p>
        </div>

        {/* Challenges Grid */}
        <div className="space-y-4">
          {filteredChallenges.map((challenge) => (
            <div
              key={challenge.id}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {challenge.title}
                  </h3>
                  <p className="text-sm text-gray-400">{challenge.description}</p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                    ⏱️ {challenge.duration}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-orange-500/20 text-orange-400">
                    {challenge.difficulty}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-3">
                <button className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors">
                  开始练习 →
                </button>
                <button className="px-4 py-3 rounded-xl bg-white/5 text-gray-400 hover:bg-white/10 transition-colors">
                  📖 复习资料
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredChallenges.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🚧</div>
            <p className="text-gray-400">该级别暂无挑战，敬请期待</p>
          </div>
        )}

        {/* Pro Tips */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
          <div className="flex items-start gap-4">
            <div className="text-3xl">💡</div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">学习建议</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>• 从简单任务开始，逐步增加复杂度</li>
                <li>• 每完成一个挑战，记录你的 Prompt 和心得</li>
                <li>• 尝试修改示例 Prompt，观察输出变化</li>
                <li>• 加入社区讨论，获取更多灵感</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>🦞 Claw Diary Agent 训练场 · 让 AI 成为你的超级助手</p>
        </div>
      </footer>
    </div>
  );
}