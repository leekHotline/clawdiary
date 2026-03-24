"use client";

import { useState } from "react";
import Link from "next/link";

interface Option {
  id: string;
  text: string;
  pros: string[];
  cons: string[];
}

interface Decision {
  question: string;
  options: Option[];
  criteria: string[];
  recommendation: string;
  confidence: number;
  analysis: string;
}

const EXAMPLE_QUESTIONS = [
  "我应该换工作吗？",
  "要不要开始学习一门新技能？",
  "应该搬到一个新城市吗？",
  "要不要主动和某人沟通？",
  "应该选择哪个项目优先做？",
];

const DECISION_STYLES = [
  { id: "rational", name: "理性分析", emoji: "🧠", desc: "数据驱动，逻辑优先" },
  { id: "emotional", name: "内心感受", emoji: "❤️", desc: "倾听内心，直觉优先" },
  { id: "balanced", name: "平衡模式", emoji: "⚖️", desc: "综合考虑理性与感性" },
  { id: "growth", name: "成长视角", emoji: "🌱", desc: "哪个选择更有助于成长" },
];

export default function DecisionHelperPage() {
  const [step, setStep] = useState(1);
  const [question, setQuestion] = useState("");
  const [style, setStyle] = useState("balanced");
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [loading, setLoading] = useState(false);
  const [decision, setDecision] = useState<Decision | null>(null);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 4) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const analyzeDecision = async () => {
    if (!question.trim() || options.filter(o => o.trim()).length < 2) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/decision-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          options: options.filter(o => o.trim()),
          style,
        }),
      });

      const data = await response.json();
      setDecision(data);
      setStep(3);
    } catch (error) {
      console.error("Error analyzing decision:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetDecision = () => {
    setStep(1);
    setQuestion("");
    setOptions(["", ""]);
    setDecision(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-pink-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-2xl mx-auto px-6 py-12">
        {/* 导航 */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <span>←</span>
            <span>返回首页</span>
          </Link>
        </div>

        {/* 标题 */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI 决策助手</h1>
          <p className="text-gray-500">让 AI 帮你理清思路，做出更好的决定</p>
        </div>

        {/* 步骤指示器 */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                  step >= s
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 h-1 mx-2 rounded transition-all ${
                    step > s ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-gray-100"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* 步骤 1: 输入问题 */}
        {step === 1 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              你在纠结什么决定？
            </h2>

            {/* 示例问题 */}
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-3">快速选择示例：</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setQuestion(q)}
                    className="px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* 问题输入 */}
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="描述你需要做的决定..."
              className="w-full h-32 p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-gray-700"
            />

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => question.trim() && setStep(2)}
                disabled={!question.trim()}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一步：添加选项 →
              </button>
            </div>
          </div>
        )}

        {/* 步骤 2: 添加选项和分析风格 */}
        {step === 2 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              有哪些选项？
            </h2>

            {/* 选项输入 */}
            <div className="space-y-3 mb-8">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                    {index + 1}
                  </div>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`选项 ${index + 1}...`}
                    className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                  {options.length > 2 && (
                    <button
                      onClick={() => removeOption(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 4 && (
              <button
                onClick={addOption}
                className="mb-8 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-sm"
              >
                + 添加选项
              </button>
            )}

            {/* 分析风格 */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              选择分析风格
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {DECISION_STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`p-4 rounded-2xl border-2 transition-all text-left ${
                    style === s.id
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{s.emoji}</span>
                    <span className="font-medium text-gray-800">{s.name}</span>
                  </div>
                  <p className="text-sm text-gray-500">{s.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-full font-medium hover:bg-gray-200 transition-colors"
              >
                ← 返回
              </button>
              <button
                onClick={analyzeDecision}
                disabled={loading || options.filter((o) => o.trim()).length < 2}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    分析中...
                  </span>
                ) : (
                  "开始分析 🎯"
                )}
              </button>
            </div>
          </div>
        )}

        {/* 步骤 3: 分析结果 */}
        {step === 3 && decision && (
          <div className="space-y-6">
            {/* 推荐结果 */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl p-8 text-white shadow-xl">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">💡</div>
                <h2 className="text-2xl font-bold mb-2">AI 建议</h2>
                <p className="text-white/80 text-sm">基于你的问题和选项分析</p>
              </div>
              
              <div className="bg-white/20 rounded-2xl p-6 mb-4">
                <p className="text-lg font-medium">{decision.recommendation}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/70">置信度</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{ width: `${decision.confidence}%` }}
                    />
                  </div>
                  <span className="font-medium">{decision.confidence}%</span>
                </div>
              </div>
            </div>

            {/* 详细分析 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">详细分析</h3>
              <div className="prose prose-sm text-gray-600 whitespace-pre-wrap">
                {decision.analysis}
              </div>
            </div>

            {/* 选项对比 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-white/50">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">选项对比</h3>
              <div className="space-y-4">
                {decision.options.map((option, index) => (
                  <div key={option.id} className="border border-gray-100 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="font-medium text-gray-800">{option.text}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-green-600 font-medium mb-2">✓ 优势</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {option.pros.map((pro, i) => (
                            <li key={i}>• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm text-red-500 font-medium mb-2">✗ 劣势</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {option.cons.map((con, i) => (
                            <li key={i}>• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <button
                onClick={resetDecision}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-600 rounded-full font-medium hover:bg-gray-200 transition-colors"
              >
                分析新问题
              </button>
              <button
                onClick={() => {
                  // 保存到日记功能可以后续添加
                  alert("功能开发中：将分析结果保存到日记");
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-medium hover:shadow-lg transition-all"
              >
                保存到日记
              </button>
            </div>
          </div>
        )}

        {/* 使用提示 */}
        <div className="mt-12 p-6 bg-white/50 rounded-2xl border border-white/50">
          <h3 className="font-medium text-gray-800 mb-2">💭 如何使用</h3>
          <ul className="text-sm text-gray-500 space-y-1">
            <li>• 描述你面临的决定，越具体越好</li>
            <li>• 添加至少 2 个选项，最多 4 个</li>
            <li>• 选择适合的分析风格</li>
            <li>• AI 会从多个角度帮你分析，最终由你做决定</li>
          </ul>
        </div>
      </main>
    </div>
  );
}