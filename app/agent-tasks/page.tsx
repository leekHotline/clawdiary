"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface TaskTemplate {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: string;
  steps: string[];
  prompt: string;
}

const taskTemplates: TaskTemplate[] = [
  {
    id: "code-review",
    name: "代码审查助手",
    emoji: "🔍",
    category: "开发",
    description: "分析代码质量、找出潜在问题、提供优化建议",
    steps: [
      "粘贴需要审查的代码",
      "选择审查维度",
      "获取详细分析报告"
    ],
    prompt: `请作为资深代码审查专家，分析以下代码：

代码：
\`\`\`
{code}
\`\`\`

请从以下维度进行审查：
1. 代码规范与风格
2. 潜在 bug 与安全问题
3. 性能优化建议
4. 代码可读性与维护性
5. 架构设计建议

请给出具体的改进建议和示例代码。`
  },
  {
    id: "docs-generator",
    name: "文档生成器",
    emoji: "📚",
    category: "开发",
    description: "自动生成 API 文档、README、技术说明",
    steps: [
      "输入代码或描述",
      "选择文档类型",
      "导出 Markdown 文档"
    ],
    prompt: `请为以下代码生成专业文档：

代码内容：
\`\`\`
{code}
\`\`\`

请生成：
1. 功能概述
2. 使用方法
3. 参数说明
4. 返回值说明
5. 示例代码
6. 注意事项`
  },
  {
    id: "debug-helper",
    name: "调试助手",
    emoji: "🐛",
    category: "开发",
    description: "分析错误信息、定位问题根因、提供修复方案",
    steps: [
      "粘贴错误信息或描述问题",
      "提供相关代码片段",
      "获取解决方案"
    ],
    prompt: `请帮我分析并解决以下问题：

问题描述：{description}

相关代码：
\`\`\`
{code}
\`\`\`

请分析：
1. 可能的原因
2. 逐步排查步骤
3. 修复代码示例
4. 预防建议`
  },
  {
    id: "refactor",
    name: "代码重构助手",
    emoji: "🛠️",
    category: "开发",
    description: "优化代码结构、提升可维护性、改进性能",
    steps: [
      "输入需要重构的代码",
      "选择重构目标",
      "获取优化后的代码"
    ],
    prompt: `请重构以下代码，重构目标是：{goal}

原始代码：
\`\`\`
{code}
\`\`\`

请提供：
1. 重构后的代码
2. 主要改进点说明
3. 潜在风险提示`
  },
  {
    id: "test-generator",
    name: "测试生成器",
    emoji: "🧪",
    category: "开发",
    description: "自动生成单元测试、集成测试、端到端测试",
    steps: [
      "提供源代码",
      "选择测试类型",
      "获取测试用例"
    ],
    prompt: `请为以下代码生成测试用例：

源代码：
\`\`\`
{code}
\`\`\`

请使用 {language} 生成：
1. 单元测试用例
2. 边界条件测试
3. 错误处理测试
4. 测试覆盖率说明`
  },
  {
    id: "translate",
    name: "翻译与本地化",
    emoji: "🌍",
    category: "内容",
    description: "翻译文本、调整文化适配、优化表达",
    steps: [
      "输入源文本",
      "选择目标语言和风格",
      "获取翻译结果"
    ],
    prompt: `请翻译以下内容：

源文本：{text}

目标语言：{language}
风格：{style}

请：
1. 准确翻译原文
2. 保持本地化适配
3. 提供多种翻译选项`
  },
  {
    id: "summarize",
    name: "内容摘要",
    emoji: "📝",
    category: "内容",
    description: "提取关键信息、生成简洁摘要、提炼要点",
    steps: [
      "输入长文本或链接",
      "选择摘要长度",
      "获取结构化摘要"
    ],
    prompt: `请总结以下内容：

{content}

请生成：
1. 一句话概述
2. 关键要点（3-5条）
3. 详细摘要（{length}）
4. 思维导图结构`
  },
  {
    id: "brainstorm",
    name: "头脑风暴",
    emoji: "💡",
    category: "创意",
    description: "生成创意点子、扩展思维边界、探索可能性",
    steps: [
      "描述问题或主题",
      "设定限制条件",
      "获取创意方案"
    ],
    prompt: `请针对以下主题进行头脑风暴：

主题：{topic}
限制条件：{constraints}

请提供：
1. 10个创意方向
2. 每个方向的简要说明
3. 潜在的实施难点
4. 创新点评分（1-10）`
  }
];

export default function AgentTasksPage() {
  const [activeCategory, setActiveCategory] = useState<string>("全部");
  const [selectedTask, setSelectedTask] = useState<TaskTemplate | null>(null);
  const [inputCode, setInputCode] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = ["全部", "开发", "内容", "创意"];

  const filteredTasks = activeCategory === "全部" 
    ? taskTemplates 
    : taskTemplates.filter(t => t.category === activeCategory);

  const generatePrompt = (task: TaskTemplate) => {
    setIsGenerating(true);
    setSelectedTask(task);
    
    // Simulate generating prompt
    const prompt = task.prompt
      .replace("{code}", inputCode || "[请输入代码]")
      .replace("{description}", inputCode || "[请描述问题]")
      .replace("{content}", inputCode || "[请输入内容]")
      .replace("{text}", inputCode || "[请输入文本]")
      .replace("{language}", "中文")
      .replace("{style}", "专业")
      .replace("{goal}", "提升可读性和性能")
      .replace("{topic}", inputCode || "[请输入主题]")
      .replace("{constraints}", "无")
      .replace("{length}", "200字");
    
    setTimeout(() => {
      setGeneratedPrompt(prompt);
      setIsGenerating(false);
    }, 500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            🤖 Agent 任务工坊
          </h1>
          <p className="text-purple-200 text-lg">
            选择任务类型，AI 自动生成专属提示词，让 AI 完成你的任务
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full transition-all ${
                activeCategory === cat
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/50"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => generatePrompt(task)}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 cursor-pointer hover:bg-white/20 transition-all border border-white/10 hover:border-purple-500/50 group"
            >
              <div className="text-4xl mb-4">{task.emoji}</div>
              <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-300 transition-colors">
                {task.name}
              </h3>
              <p className="text-white/60 text-sm mb-4">
                {task.description}
              </p>
              <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                {task.category}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Interactive Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10"
        >
          <h2 className="text-2xl font-bold text-white mb-6">
            ✨ 创建你的专属任务
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input */}
            <div>
              <label className="text-white/70 block mb-2">输入你的需求</label>
              <textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="粘贴代码、描述问题、输入主题..."
                className="w-full h-64 bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 resize-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
              />
              <p className="text-white/40 text-sm mt-2">
                根据你选择的模板，AI 会自动调整提示词
              </p>
            </div>

            {/* Output */}
            <div>
              <label className="text-white/70 block mb-2">生成的提示词</label>
              <div className="h-64 bg-black/30 border border-white/10 rounded-xl p-4 overflow-auto">
                {generatedPrompt ? (
                  <pre className="text-green-300 text-sm whitespace-pre-wrap font-mono">
                    {generatedPrompt}
                  </pre>
                ) : (
                  <p className="text-white/30 text-center mt-20">
                    选择一个任务模板开始生成
                  </p>
                )}
              </div>
              {generatedPrompt && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => copyToClipboard(generatedPrompt)}
                    className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    📋 复制提示词
                  </button>
                  <button
                    onClick={() => {
                      setInputCode("");
                      setGeneratedPrompt("");
                      setSelectedTask(null);
                    }}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                  >
                    🗑️ 清空
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Selected Task Info */}
          {selectedTask && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-8 p-6 bg-purple-500/10 rounded-2xl border border-purple-500/20"
            >
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="text-2xl">{selectedTask.emoji}</span>
                {selectedTask.name} - 执行步骤
              </h3>
              <div className="flex flex-wrap gap-3">
                {selectedTask.steps.map((step, i) => (
                  <span 
                    key={i}
                    className="px-4 py-2 bg-white/10 rounded-full text-white/70 text-sm"
                  >
                    {i + 1}. {step}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Tips */}
        <div className="mt-8 text-center">
          <p className="text-white/40 text-sm">
            💡 提示：选择任务模板后在上方输入内容，AI 会自动生成适合的提示词
          </p>
        </div>
      </div>
    </div>
  );
}