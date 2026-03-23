"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 产品定位画布模块
interface CanvasSection {
  id: string;
  title: string;
  emoji: string;
  description: string;
  questions: string[];
  answer: string;
  expanded: boolean;
}

const INITIAL_SECTIONS: CanvasSection[] = [
  {
    id: "problem",
    title: "目标用户问题",
    emoji: "🎯",
    description: "我们解决什么核心问题？",
    questions: [
      "用户的核心痛点是什么？",
      "这个问题有多严重？（1-10 分）",
      "用户现在如何解决这个问题？",
      "为什么现有解决方案不够好？",
    ],
    answer: "",
    expanded: false,
  },
  {
    id: "users",
    title: "目标用户群体",
    emoji: "👥",
    description: "我们为谁服务？",
    questions: [
      "核心用户画像是谁？",
      "他们的年龄、职业、兴趣？",
      "他们在什么场景下使用产品？",
      "用户愿意为什么付费？",
    ],
    answer: "",
    expanded: false,
  },
  {
    id: "value",
    title: "独特价值主张",
    emoji: "💎",
    description: "我们提供什么独特价值？",
    questions: [
      "一句话描述产品价值",
      "与竞品最大的不同是什么？",
      "用户为什么选择我们而不是别人？",
      "我们的核心竞争力是什么？",
    ],
    answer: "",
    expanded: false,
  },
  {
    id: "solution",
    title: "解决方案",
    emoji: "🛠️",
    description: "我们如何解决问题？",
    questions: [
      "核心功能是什么？（不超过 3 个）",
      "如何验证这个方案有效？",
      "最小可行产品（MVP）是什么？",
      "哪些功能可以砍掉？",
    ],
    answer: "",
    expanded: false,
  },
  {
    id: "channels",
    title: "获客渠道",
    emoji: "📣",
    description: "如何找到用户？",
    questions: [
      "用户在哪里聚集？",
      "最低成本的获客方式？",
      "如何让用户主动传播？",
      "第一批 100 个用户从哪里来？",
    ],
    answer: "",
    expanded: false,
  },
  {
    id: "metrics",
    title: "关键指标",
    emoji: "📊",
    description: "如何衡量成功？",
    questions: [
      "最重要的 1 个指标是什么？",
      "如何定义用户活跃？",
      "如何定义用户留存？",
      "多久看一次数据？",
    ],
    answer: "",
    expanded: false,
  },
  {
    id: "advantage",
    title: "竞争优势",
    emoji: "🏆",
    description: "我们的护城河是什么？",
    questions: [
      "什么是别人难以复制的？",
      "我们的独特资源/能力？",
      "如何保持领先？",
      "最大的威胁是什么？",
    ],
    answer: "",
    expanded: false,
  },
  {
    id: "business",
    title: "商业模式",
    emoji: "💰",
    description: "如何赚钱？",
    questions: [
      "收入来源是什么？",
      "用户愿意为什么付费？",
      "定价策略？",
      "成本结构？",
    ],
    answer: "",
    expanded: false,
  },
];

export default function ProductCanvasPage() {
  const [sections, setSections] = useState<CanvasSection[]>([]);
  const [showExport, setShowExport] = useState(false);
  const [savedDate, setSavedDate] = useState<string>("");

  // 加载保存的定位
  useEffect(() => {
    const saved = localStorage.getItem("product-canvas");
    const savedDate = localStorage.getItem("product-canvas-date");
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged = INITIAL_SECTIONS.map(s => {
        const found = parsed.find((p: any) => p.id === s.id);
        return found ? { ...s, answer: found.answer || "" } : s;
      });
      setSections(merged);
      if (savedDate) setSavedDate(savedDate);
    } else {
      setSections(INITIAL_SECTIONS);
    }
  }, []);

  // 保存定位
  const saveAnswer = (id: string, answer: string) => {
    const newSections = sections.map(s =>
      s.id === id ? { ...s, answer } : s
    );
    setSections(newSections);
    localStorage.setItem("product-canvas", JSON.stringify(newSections));
    localStorage.setItem("product-canvas-date", new Date().toISOString());
  };

  // 切换展开状态
  const toggleExpand = (id: string) => {
    setSections(sections.map(s =>
      s.id === id ? { ...s, expanded: !s.expanded } : s
    ));
  };

  // 导出定位
  const exportCanvas = () => {
    const canvas = {
      date: new Date().toISOString(),
      productName: "ClawDiary / AI 初创企业",
      sections: sections.map(s => ({
        title: s.title,
        description: s.description,
        answer: s.answer,
      })),
    };

    const blob = new Blob([JSON.stringify(canvas, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `product-canvas-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  // 清空所有
  const clearAll = () => {
    if (confirm("确定要清空所有定位内容吗？")) {
      setSections(INITIAL_SECTIONS);
      localStorage.removeItem("product-canvas");
      localStorage.removeItem("product-canvas-date");
      setSavedDate("");
    }
  };

  // 计算完成度
  const completedSections = sections.filter(s => s.answer.trim().length > 0).length;
  const completionRate = (completedSections / sections.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <Link href="/" className="text-sm text-purple-300 hover:text-purple-200 mb-4 inline-block">
            ← 返回首页
          </Link>
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-5xl">🧭</span>
            <h1 className="text-3xl font-bold text-white">产品定位画布</h1>
          </div>
          <p className="text-purple-300">思考 ClawDiary 作为 AI 初创企业的核心价值</p>
          {savedDate && (
            <p className="text-xs text-purple-400 mt-2">
              📅 上次保存：{new Date(savedDate).toLocaleString("zh-CN")}
            </p>
          )}
        </header>

        {/* Progress */}
        <div className="mb-8 bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">定位完成度</h2>
            <span className="text-2xl font-bold text-purple-400">{completionRate.toFixed(0)}%</span>
          </div>
          <div className="h-4 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="text-sm text-purple-300 mt-2">
            已完成 {completedSections}/{sections.length} 个模块
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => exportCanvas()}
            className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium hover:shadow-lg transition-all"
          >
            📥 导出定位
          </button>
          <button
            onClick={() => clearAll()}
            className="px-6 py-3 bg-white/10 rounded-xl text-white font-medium hover:bg-white/20 transition-all"
          >
            🗑️ 清空
          </button>
        </div>

        {/* Canvas Sections */}
        <div className="grid gap-6">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all"
            >
              {/* Header */}
              <button
                onClick={() => toggleExpand(section.id)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{section.emoji}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{section.title}</h3>
                    <p className="text-sm text-purple-300">{section.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {section.answer.trim().length > 0 && (
                    <span className="text-sm text-green-400">✅ 已填写</span>
                  )}
                  <span className={`text-2xl transition-transform ${section.expanded ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </div>
              </button>

              {/* Content */}
              {section.expanded && (
                <div className="px-6 pb-6 border-t border-white/10 pt-4">
                  {/* Questions */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-purple-400 mb-3">思考问题：</h4>
                    <ul className="space-y-2">
                      {section.questions.map((q, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-purple-200">
                          <span className="text-purple-500 mt-0.5">•</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Answer */}
                  <div>
                    <label className="text-sm font-medium text-purple-400 block mb-2">
                      你的答案：
                    </label>
                    <textarea
                      value={section.answer}
                      onChange={(e) => saveAnswer(section.id, e.target.value)}
                      placeholder="在这里写下你的思考..."
                      className="w-full h-32 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                    />
                    <p className="text-xs text-purple-400 mt-2">
                      {section.answer.length} 字符 · 自动保存到本地
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-purple-500/20">
          <h3 className="font-bold text-white mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>使用建议</span>
          </h3>
          <ul className="text-sm text-purple-300 space-y-2">
            <li>• 每个模块至少花 10 分钟深入思考</li>
            <li>• 答案要具体，避免空泛的描述</li>
            <li>• 定期回顾和更新定位（建议每周一次）</li>
            <li>• 与团队讨论，达成共识</li>
            <li>• 定位确定后，所有功能决策都应服务于定位</li>
          </ul>
        </div>

        {/* Reference */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <Link
            href="/feature-audit"
            className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors border border-white/10"
          >
            <div className="text-2xl mb-2">🔍</div>
            <div className="font-medium text-white">产品体检中心</div>
            <div className="text-xs text-purple-400">评估现有功能，做减法</div>
          </Link>
          <Link
            href="/quickstart"
            className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors border border-white/10"
          >
            <div className="text-2xl mb-2">🚀</div>
            <div className="font-medium text-white">快速上手指南</div>
            <div className="text-xs text-purple-400">用户体验流程</div>
          </Link>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 text-purple-400 text-sm">
          <p>🧬 产品定位画布 · 想清楚再行动</p>
          <p className="mt-1 text-xs text-purple-500">ClawDiary → AI 初创企业的战略思考工具</p>
        </footer>
      </main>
    </div>
  );
}