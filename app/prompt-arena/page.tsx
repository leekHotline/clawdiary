"use client";

import { useState } from "react";
import Link from "next/link";

interface PromptTemplate {
  id: string;
  name: string;
  emoji: string;
  category: string;
  prompt: string;
}

const promptTemplates: PromptTemplate[] = [
  {
    id: "code-review",
    name: "代码审查",
    emoji: "🔍",
    category: "开发",
    prompt: "请审查以下代码，找出潜在问题和优化空间：\n\n```\n{{code}}\n```\n\n请按以下格式输出：\n1. 问题列表\n2. 优化建议\n3. 总体评价",
  },
  {
    id: "explain-like-5",
    name: "通俗解释",
    emoji: "🎓",
    category: "学习",
    prompt: "用通俗易懂的语言解释以下概念，就像对5岁孩子说话一样：\n\n{{topic}}\n\n请用简单的比喻来帮助理解。",
  },
  {
    id: "writing-improvement",
    name: "写作改进",
    emoji: "✏️",
    category: "写作",
    prompt: "请改进以下文本，使其更清晰、更有吸引力：\n\n{{content}}\n\n请指出具体改了什么，为什么这样改更好。",
  },
  {
    id: "brainstorm",
    name: "头脑风暴",
    emoji: "💡",
    category: "创意",
    prompt: "围绕以下主题，生成10个创意想法：\n\n{{topic}}\n\n每个想法请用一句话描述，并标注可能的执行难度。",
  },
  {
    id: "system-design",
    name: "系统设计",
    emoji: "🏗️",
    category: "架构",
    prompt: "设计一个系统来满足以下需求：\n\n需求：{{requirements}}\n\n请提供：\n1. 系统架构图（文字描述）\n2. 核心技术选型\n3. 关键模块说明\n4. 潜在挑战与解决方案",
  },
  {
    id: "interview-prep",
    name: "面试准备",
    emoji: "🎯",
    category: "求职",
    prompt: "我正在准备面试，以下是职位描述：\n\n职位：{{job}}\n\n请提供：\n1. 可能会问的技术问题\n2. 最佳答案要点\n3. 追问可能会问什么",
  },
];

const aiProviders = [
  { id: "claude", name: "Claude", emoji: "🧠" },
  { id: "gpt", name: "ChatGPT", emoji: "✨" },
  { id: "deepseek", name: "DeepSeek", emoji: "🔮" },
  { id: "kimi", name: "Kimi", emoji: "🌙" },
];

export default function PromptArenaPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedAI, setSelectedAI] = useState("claude");
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const handleTemplateSelect = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setCustomPrompt(template.prompt);
    // Extract variables like {{code}}, {{topic}}, etc.
    const matches = template.prompt.match(/\{\{(\w+)\}\}/g);
    const vars: Record<string, string> = {};
    matches?.forEach((m) => {
      const key = m.replace(/\{\{|\}/g, "");
      vars[key] = "";
    });
    setVariables(vars);
    setGeneratedPrompt(template.prompt);
  };

  const handleVariableChange = (key: string, value: string) => {
    const newVars = { ...variables, [key]: value };
    setVariables(newVars);
    
    // Replace variables in prompt
    let result = customPrompt;
    Object.entries(newVars).forEach(([k, v]) => {
      result = result.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), v || `[${k}]`);
    });
    setGeneratedPrompt(result);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">⚔️</span>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Prompt 竞技场
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            选择模板 → 填入变量 → 生成完美 Prompt
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template Selection */}
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-5 border border-slate-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>📋</span> Prompt 模板
            </h2>
            <div className="space-y-2">
              {promptTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    selectedTemplate?.id === template.id
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50"
                      : "bg-slate-700/30 hover:bg-slate-700/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{template.emoji}</span>
                    <span className="font-medium">{template.name}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{template.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Variable Inputs */}
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-5 border border-slate-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>📝</span> 填入变量
            </h2>
            {selectedTemplate ? (
              <div className="space-y-4">
                {Object.keys(variables).map((key) => (
                  <div key={key}>
                    <label className="block text-sm text-slate-400 mb-1 capitalize">
                      {key}
                    </label>
                    <textarea
                      value={variables[key]}
                      onChange={(e) => handleVariableChange(key, e.target.value)}
                      placeholder={`输入 ${key}...`}
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none resize-none"
                      rows={3}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-slate-500 text-center py-10">
                从左侧选择一个模板开始
              </div>
            )}
          </div>

          {/* Generated Result */}
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-5 border border-slate-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🎯</span> 生成结果
            </h2>
            {selectedTemplate ? (
              <div className="space-y-4">
                <div className="bg-slate-900/50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono">
                    {generatedPrompt || "填入变量后生成 Prompt..."}
                  </pre>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  {copied ? (
                    <>
                      <span>✅</span> 已复制!
                    </>
                  ) : (
                    <>
                      <span>📋</span> 复制 Prompt
                    </>
                  )}
                </button>
                <div className="flex gap-2">
                  {aiProviders.map((ai) => (
                    <button
                      key={ai.id}
                      onClick={() => setSelectedAI(ai.id)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedAI === ai.id
                          ? "bg-cyan-500/20 border border-cyan-500"
                          : "bg-slate-700/50 border border-transparent"
                      }`}
                    >
                      {ai.emoji} {ai.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-center py-10">
                生成结果将显示在这里
              </div>
            )}
          </div>
        </div>

        {/* Quick Custom Prompt */}
        <div className="mt-8 bg-slate-800/50 backdrop-blur rounded-2xl p-5 border border-slate-700">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>✏️</span> 自定义 Prompt
          </h2>
          <textarea
            value={customPrompt}
            onChange={(e) => {
              setCustomPrompt(e.target.value);
              setGeneratedPrompt(e.target.value);
              setSelectedTemplate(null);
            }}
            placeholder="或者直接在这里编写自定义 Prompt...&#10;&#10;支持使用 {{变量名}} 格式定义变量"
            className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-4 text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            rows={5}
          />
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <span>←</span> 返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
