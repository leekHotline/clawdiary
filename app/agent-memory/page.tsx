"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 技能数据（与 agent-skills 同步）
interface Skill {
  id: string;
  name: string;
  description: string;
  emoji: string;
  level: number;
  maxLevel: number;
  xp: number;
  category: string;
  unlocked: boolean;
}

interface SavedPrompt {
  id: string;
  name: string;
  prompt: string;
  category: string;
  createdAt: number;
  uses: number;
}

interface Achievement {
  id: string;
  name: string;
  emoji: string;
  unlocked: boolean;
  date?: number;
}

// 模拟用户技能数据
const userSkills: Skill[] = [
  { id: "storytelling", name: "故事编织", description: "将日常变成精彩故事", emoji: "📖", level: 3, maxLevel: 5, xp: 280, category: "creativity", unlocked: true },
  { id: "metaphor", name: "隐喻大师", description: "用比喻让表达更生动", emoji: "🔮", level: 2, maxLevel: 5, xp: 150, category: "creativity", unlocked: true },
  { id: "pattern-recognition", name: "模式识别", description: "发现隐藏的规律", emoji: "🔍", level: 4, maxLevel: 5, xp: 380, category: "analysis", unlocked: true },
  { id: "data-insight", name: "数据洞察", description: "从数字中提取智慧", emoji: "📊", level: 2, maxLevel: 5, xp: 180, category: "analysis", unlocked: true },
  { id: "empathy", name: "共情理解", description: "真正听懂他人的心声", emoji: "💝", level: 3, maxLevel: 5, xp: 290, category: "communication", unlocked: true },
  { id: "clarity", name: "清晰表达", description: "把复杂说得简单", emoji: "✨", level: 4, maxLevel: 5, xp: 420, category: "communication", unlocked: true },
  { id: "task-mastery", name: "任务掌控", description: "高效完成每一件事", emoji: "✅", level: 5, maxLevel: 5, xp: 500, category: "execution", unlocked: true },
  { id: "focus", name: "专注力", description: "深度投入当下", emoji: "🎯", level: 3, maxLevel: 5, xp: 260, category: "execution", unlocked: true },
  { id: "knowledge-absorption", name: "知识吸收", description: "快速理解新概念", emoji: "🧠", level: 4, maxLevel: 5, xp: 400, category: "learning", unlocked: true },
  { id: "reflection", name: "深度反思", description: "从经验中学习", emoji: "🪞", level: 3, maxLevel: 5, xp: 280, category: "learning", unlocked: true },
  { id: "observation", name: "敏锐观察", description: "看到别人忽略的细节", emoji: "🔬", level: 3, maxLevel: 5, xp: 270, category: "insight", unlocked: true },
  { id: "connection", name: "关联思维", description: "发现事物间的联系", emoji: "🔗", level: 2, maxLevel: 5, xp: 190, category: "insight", unlocked: true },
];

// 模拟已保存的 Prompt
const initialSavedPrompts: SavedPrompt[] = [
  {
    id: "1",
    name: "代码审查专家",
    prompt: "请作为资深代码审查专家，分析以下代码并从代码规范、潜在问题、性能优化等维度给出建议...",
    category: "开发",
    createdAt: Date.now() - 86400000 * 3,
    uses: 12
  },
  {
    id: "2",
    name: "写作教练",
    prompt: "请作为写作教练，帮我分析这段文字的风格特点，给出改进建议...",
    category: "写作",
    createdAt: Date.now() - 86400000 * 7,
    uses: 8
  },
  {
    id: "3",
    name: "学习规划师",
    prompt: "请作为学习规划师，根据我的学习目标和时间安排，制定详细的学习计划...",
    category: "学习",
    createdAt: Date.now() - 86400000 * 2,
    uses: 5
  }
];

// 成就数据
const achievements: Achievement[] = [
  { id: "first-prompt", name: "初次调教", emoji: "🎯", unlocked: true, date: Date.now() - 86400000 * 30 },
  { id: "prompt-master", name: "Prompt 大师", emoji: "🏆", unlocked: true, date: Date.now() - 86400000 * 15 },
  { id: "skill-collector", name: "技能收集者", emoji: "🎖️", unlocked: true, date: Date.now() - 86400000 * 10 },
  { id: "memory-keeper", name: "记忆守护者", emoji: "💾", unlocked: true, date: Date.now() - 86400000 * 5 },
  { id: "agent-evolver", name: "Agent 进化者", emoji: "🧬", unlocked: false },
  { id: "prompt-wizard", name: "Prompt 巫师", emoji: "🧙", unlocked: false },
];

// Prompt 模板
const promptTemplates = [
  { id: "1", name: "角色扮演", emoji: "🎭", category: "通用" },
  { id: "2", name: "一步步思考", emoji: "🧠", category: "思考" },
  { id: "3", name: "few-shot 示例", emoji: "📝", category: "示例" },
  { id: "4", name: "格式限定", emoji: "📋", category: "输出" },
  { id: "5", name: " Chain of Thought", emoji: "🔗", category: "思考" },
  { id: "6", name: "RAG 上下文", emoji: "📚", category: "知识" },
];

export default function AgentMemoryPage() {
  const [activeTab, setActiveTab] = useState<"skills" | "prompts" | "practice" | "achievements">("skills");
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>(initialSavedPrompts);
  const [showNewPromptModal, setShowNewPromptModal] = useState(false);
  const [newPromptName, setNewPromptName] = useState("");
  const [newPromptText, setNewPromptText] = useState("");
  const [newPromptCategory, setNewPromptCategory] = useState("通用");
  const [practiceInput, setPracticeInput] = useState("");
  const [practiceOutput, setPracticeOutput] = useState("");
  const [isPracticing, setIsPracticing] = useState(false);

  const totalXP = userSkills.reduce((sum, s) => sum + s.xp, 0);
  const unlockedSkills = userSkills.filter(s => s.unlocked).length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  const handleSavePrompt = () => {
    if (!newPromptName.trim() || !newPromptText.trim()) return;
    
    const newPrompt: SavedPrompt = {
      id: Date.now().toString(),
      name: newPromptName,
      prompt: newPromptText,
      category: newPromptCategory,
      createdAt: Date.now(),
      uses: 0
    };
    
    setSavedPrompts([newPrompt, ...savedPrompts]);
    setNewPromptName("");
    setNewPromptText("");
    setNewPromptCategory("通用");
    setShowNewPromptModal(false);
  };

  const handleDeletePrompt = (id: string) => {
    setSavedPrompts(savedPrompts.filter(p => p.id !== id));
  };

  const handlePractice = async () => {
    if (!practiceInput.trim()) return;
    
    setIsPracticing(true);
    setPracticeOutput("");
    
    // 模拟 AI 响应
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setPracticeOutput(`📝 **AI 优化后的 Prompt：**

✅ **优化建议：**
1. 明确指定角色和背景
2. 添加具体示例 (few-shot)
3. 限定输出格式
4. 添加思考步骤要求

✨ **优化后的 Prompt：**
${practiceInput.trim()}

---
💡 **提示：** 将优化后的 Prompt 保存到"我的 Prompt 库"中，方便后续使用。`);
    
    setIsPracticing(false);
  };

  const loadPrompt = (prompt: string) => {
    setPracticeInput(prompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="text-2xl hover:scale-110 transition-transform">
                🦞
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">Agent 记忆库</h1>
                <p className="text-xs text-gray-400">记录你的 AI 进化旅程</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 bg-yellow-500/20 rounded-lg text-yellow-300 text-sm">
                🏆 {unlockedAchievements}/{achievements.length}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full text-sm text-cyan-300 mb-6 border border-blue-500/30">
            <span>🧬</span>
            <span>你的 AI 进化记忆</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Agent <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">记忆库</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            记录你解锁的技能、保存的 Prompt、达成的成就，成为更强大的 AI Agent
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
            <div className="text-3xl font-bold text-blue-400">{unlockedSkills}</div>
            <div className="text-xs text-gray-500 mt-1">已解锁技能</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
            <div className="text-3xl font-bold text-purple-400">{savedPrompts.length}</div>
            <div className="text-xs text-gray-500 mt-1">保存的 Prompt</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
            <div className="text-3xl font-bold text-yellow-400">{totalXP.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">累计 XP</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
            <div className="text-3xl font-bold text-green-400">{unlockedAchievements}</div>
            <div className="text-xs text-gray-500 mt-1">达成成就</div>
          </div>
        </div>

        {/* 标签导航 */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: "skills", emoji: "🌳", label: "技能树" },
            { id: "prompts", emoji: "💾", label: "我的 Prompt" },
            { id: "practice", emoji: "⚡", label: "Prompt 练习" },
            { id: "achievements", emoji: "🏆", label: "成就" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>

        {/* 技能树标签页 */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>🌳</span>
                  <span>已解锁技能</span>
                </h3>
                <Link
                  href="/agent-skills"
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  查看完整技能树 →
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {userSkills.map(skill => (
                  <div
                    key={skill.id}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      skill.unlocked
                        ? "bg-blue-500/10 border-blue-500/50 hover:scale-105"
                        : "bg-gray-800/50 border-gray-700/50 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{skill.emoji}</span>
                      <span className="text-xs text-yellow-400">{skill.xp} XP</span>
                    </div>
                    <h4 className="font-semibold text-white text-sm mb-1">{skill.name}</h4>
                    <p className="text-xs text-gray-400 mb-2">{skill.description}</p>
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                        style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-right">
                      Lv.{skill.level}/{skill.maxLevel}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 推荐入口 */}
            <div className="grid md:grid-cols-2 gap-4">
              <Link
                href="/agent-tasks"
                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30 hover:scale-[1.02] transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">📋</span>
                  <h4 className="text-lg font-semibold text-white">任务工坊</h4>
                </div>
                <p className="text-gray-400 text-sm">使用 8 种 AI 任务模板快速生成提示词</p>
              </Link>
              <Link
                href="/agent-trainer"
                className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-orange-500/30 hover:scale-[1.02] transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">🎯</span>
                  <h4 className="text-lg font-semibold text-white">训练场</h4>
                </div>
                <p className="text-gray-400 text-sm">AI Prompt 练习平台，提升你的提示词技能</p>
              </Link>
            </div>
          </div>
        )}

        {/* 我的 Prompt 标签页 */}
        {activeTab === "prompts" && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={() => setShowNewPromptModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
              >
                + 新建 Prompt
              </button>
            </div>

            {savedPrompts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">💾</div>
                <h3 className="text-xl font-semibold text-white mb-2">还没有保存的 Prompt</h3>
                <p className="text-gray-400 mb-4">创建你的第一个 AI Prompt 吧</p>
                <button
                  onClick={() => setShowNewPromptModal(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl"
                >
                  创建 Prompt
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {savedPrompts.map(prompt => (
                  <div
                    key={prompt.id}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-blue-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-white">{prompt.name}</h4>
                        <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded-full">
                          {prompt.category}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => loadPrompt(prompt.prompt)}
                          className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                          title="使用"
                        >
                          ⚡
                        </button>
                        <button
                          onClick={() => handleDeletePrompt(prompt.id)}
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          title="删除"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{prompt.prompt}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>使用 {prompt.uses} 次</span>
                      <span>创建于 {new Date(prompt.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Prompt 技巧提示 */}
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
              <h4 className="text-sm font-semibold text-white mb-4">💡 Prompt 技巧</h4>
              <div className="grid md:grid-cols-3 gap-4">
                {promptTemplates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => loadPrompt(`请作为${template.name}专家，帮我...`)}
                    className="flex items-center gap-2 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <span>{template.emoji}</span>
                    <span className="text-sm text-gray-300">{template.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Prompt 练习标签页 */}
        {activeTab === "practice" && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>⚡</span>
                <span>Prompt 练习场</span>
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                输入你的 Prompt，AI 会帮你分析和优化
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">输入你的 Prompt</label>
                  <textarea
                    value={practiceInput}
                    onChange={(e) => setPracticeInput(e.target.value)}
                    placeholder="在这里输入你的 Prompt，例如：帮我写一封邮件..."
                    className="w-full h-32 bg-slate-800 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
                
                <button
                  onClick={handlePractice}
                  disabled={isPracticing || !practiceInput.trim()}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isPracticing ? "🤔 分析中..." : "🚀 分析并优化 Prompt"}
                </button>
                
                {practiceOutput && (
                  <div className="bg-slate-800 rounded-xl p-4 border border-blue-500/30">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap">{practiceOutput}</pre>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => {
                          setNewPromptName("优化后的 Prompt");
                          setNewPromptText(practiceOutput.split("✨ **优化后的 Prompt：**")[1]?.split("---")[0]?.trim() || practiceInput);
                          setNewPromptCategory("优化");
                          setShowNewPromptModal(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                      >
                        💾 保存到库
                      </button>
                      <button
                        onClick={() => setPracticeOutput("")}
                        className="px-4 py-2 bg-white/10 text-gray-300 rounded-lg text-sm"
                      >
                        清空
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 快速模板 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h4 className="text-sm font-semibold text-white mb-4">📋 快速开始模板</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {[
                  { name: "写作助手", prompt: "请作为专业写作助手，帮我润色以下文字，使其更通顺流畅：" },
                  { name: "代码解释", prompt: "请详细解释以下代码的功能和工作原理：" },
                  { name: "学习教练", prompt: "请作为学习教练，为我制定一个学习计划，目标是：" },
                  { name: "思维导师", prompt: "请作为思维导师，用苏格拉底提问法帮我分析这个问题：" },
                ].map((template, i) => (
                  <button
                    key={i}
                    onClick={() => loadPrompt(template.prompt)}
                    className="p-3 bg-white/5 rounded-lg text-left hover:bg-white/10 transition-colors"
                  >
                    <span className="text-sm text-white">{template.name}</span>
                    <p className="text-xs text-gray-500 mt-1 truncate">{template.prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 成就标签页 */}
        {activeTab === "achievements" && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`p-6 rounded-xl text-center transition-all ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/50"
                    : "bg-white/5 border border-white/10 opacity-50"
                }`}
              >
                <div className="text-4xl mb-3">{achievement.emoji}</div>
                <h4 className="font-semibold text-white mb-1">{achievement.name}</h4>
                {achievement.unlocked && achievement.date ? (
                  <p className="text-xs text-gray-500">
                    达成于 {new Date(achievement.date).toLocaleDateString()}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">未解锁</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 新建 Prompt 弹窗 */}
      {showNewPromptModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowNewPromptModal(false)}
        >
          <div
            className="bg-slate-800 rounded-2xl p-6 max-w-lg w-full border border-white/10"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-4">新建 Prompt</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">名称</label>
                <input
                  type="text"
                  value={newPromptName}
                  onChange={(e) => setNewPromptName(e.target.value)}
                  placeholder="例如：代码审查专家"
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">分类</label>
                <select
                  value={newPromptCategory}
                  onChange={(e) => setNewPromptCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="通用">通用</option>
                  <option value="开发">开发</option>
                  <option value="写作">写作</option>
                  <option value="学习">学习</option>
                  <option value="生活">生活</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Prompt 内容</label>
                <textarea
                  value={newPromptText}
                  onChange={(e) => setNewPromptText(e.target.value)}
                  placeholder="在这里输入你的 Prompt..."
                  className="w-full h-40 bg-slate-900 border border-white/10 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewPromptModal(false)}
                className="flex-1 py-3 bg-white/10 text-gray-300 rounded-xl font-medium hover:bg-white/20 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSavePrompt}
                disabled={!newPromptName.trim() || !newPromptText.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium disabled:opacity-50 transition-all"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
