"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 成长阶段定义
const GROWTH_STAGES = [
  {
    id: 1,
    name: "种子期",
    emoji: "🌱",
    description: "开始记录你的故事",
    color: "from-green-400 to-emerald-500",
    bgLight: "bg-green-50",
    borderColor: "border-green-200",
    requirements: {
      diaries: 1,
      features: [],
    },
    unlocks: ["写日记", "查看历史"],
    tips: ["写下你的第一篇日记", "试试给日记加上心情标签"],
  },
  {
    id: 2,
    name: "萌芽期",
    emoji: "🌿",
    description: "建立写作习惯",
    color: "from-teal-400 to-cyan-500",
    bgLight: "bg-teal-50",
    borderColor: "border-teal-200",
    requirements: {
      diaries: 5,
      features: ["/mood"],
    },
    unlocks: ["情绪追踪", "日记统计", "心情趋势"],
    tips: ["连续写日记5天", "试试情绪追踪功能"],
  },
  {
    id: 3,
    name: "成长期",
    emoji: "🌳",
    description: "深入探索自我",
    color: "from-blue-400 to-indigo-500",
    bgLight: "bg-blue-50",
    borderColor: "border-blue-200",
    requirements: {
      diaries: 15,
      features: ["/mood", "/stats", "/tags-cloud"],
    },
    unlocks: ["AI分析", "情绪报告", "标签云"],
    tips: ["探索AI日记分析", "看看你的情绪分布"],
  },
  {
    id: 4,
    name: "繁茂期",
    emoji: "🌲",
    description: "成为日记达人",
    color: "from-purple-400 to-violet-500",
    bgLight: "bg-purple-50",
    borderColor: "border-purple-200",
    requirements: {
      diaries: 30,
      features: ["/mood", "/stats", "/tags-cloud", "/insights"],
    },
    unlocks: ["高级洞察", "成长报告", "情绪预报"],
    tips: ["生成你的成长报告", "试试情绪预报功能"],
  },
  {
    id: 5,
    name: "参天期",
    emoji: "🏆",
    description: "日记大师境界",
    color: "from-amber-400 to-orange-500",
    bgLight: "bg-amber-50",
    borderColor: "border-amber-200",
    requirements: {
      diaries: 60,
      features: ["/mood", "/stats", "/tags-cloud", "/insights", "/emotion-forecast"],
    },
    unlocks: ["专属大师徽章", "全部高级功能", "成长导师"],
    tips: ["分享你的日记之旅", "帮助新用户成长"],
  },
];

// 功能探索状态
interface FeatureStatus {
  path: string;
  name: string;
  explored: boolean;
  stage: number;
}

export default function GrowthPathPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [diaryCount, setDiaryCount] = useState(0);
  const [currentStage, setCurrentStage] = useState(1);
  const [progress, setProgress] = useState(0);
  const [exploredFeatures, setExploredFeatures] = useState<string[]>([]);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);

  useEffect(() => {
    loadGrowthData();
  }, []);

  const loadGrowthData = async () => {
    try {
      // 获取日记数据
      const diariesRes = await fetch("/api/diaries");
      const diaries = await diariesRes.json();
      setDiaryCount(diaries.length || 0);

      // 从 localStorage 获取已探索的功能
      const explored = JSON.parse(localStorage.getItem("exploredFeatures") || "[]");
      setExploredFeatures(explored);

      // 计算当前阶段
      let stage = 1;
      for (const s of GROWTH_STAGES) {
        const diaryMet = (diaries.length || 0) >= s.requirements.diaries;
        const featuresMet = s.requirements.features.every((f) => explored.includes(f));
        if (diaryMet && featuresMet) {
          stage = s.id;
        }
      }
      setCurrentStage(stage);

      // 计算到下一阶段的进度
      const nextStage = GROWTH_STAGES.find((s) => s.id === stage + 1);
      if (nextStage) {
        const diaryProgress = Math.min(
          ((diaries.length || 0) / nextStage.requirements.diaries) * 50,
          50
        );
        const featureProgress =
          (nextStage.requirements.features.filter((f) => explored.includes(f)).length /
            nextStage.requirements.features.length) *
          50;
        setProgress(diaryProgress + featureProgress);
      } else {
        setProgress(100);
      }
    } catch (error) {
      console.error("加载成长数据失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 记录功能探索
  const markFeatureExplored = (path: string) => {
    if (!exploredFeatures.includes(path)) {
      const updated = [...exploredFeatures, path];
      setExploredFeatures(updated);
      localStorage.setItem("exploredFeatures", JSON.stringify(updated));
    }
  };

  // 获取阶段状态
  const getStageStatus = (stageId: number) => {
    if (stageId < currentStage) return "completed";
    if (stageId === currentStage) return "current";
    return "locked";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">🌱</div>
          <p className="text-gray-500">正在计算你的成长路径...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* 返回按钮 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 transition-colors"
        >
          <span>←</span>
          <span>返回首页</span>
        </Link>

        {/* 标题区 */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">
            {GROWTH_STAGES.find((s) => s.id === currentStage)?.emoji}
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">成长路径</h1>
          <p className="text-gray-500 max-w-md mx-auto">
            从种子到参天大树，记录你每一阶段的成长
          </p>
        </div>

        {/* 当前状态卡片 */}
        <div
          className={`bg-gradient-to-r ${
            GROWTH_STAGES.find((s) => s.id === currentStage)?.color
          } rounded-3xl p-8 text-white mb-8 shadow-lg`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-white/80 text-sm">当前阶段</div>
              <div className="text-3xl font-bold flex items-center gap-2">
                <span>{GROWTH_STAGES.find((s) => s.id === currentStage)?.emoji}</span>
                <span>{GROWTH_STAGES.find((s) => s.id === currentStage)?.name}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white/80 text-sm">日记总数</div>
              <div className="text-3xl font-bold">{diaryCount}</div>
            </div>
          </div>

          {/* 进度条 */}
          {currentStage < GROWTH_STAGES.length && (
            <div className="mt-4">
              <div className="flex justify-between text-white/80 text-sm mb-2">
                <span>距离下一阶段</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-3 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="text-white/70 text-sm mt-2">
                下一阶段: {GROWTH_STAGES.find((s) => s.id === currentStage + 1)?.name}{" "}
                {GROWTH_STAGES.find((s) => s.id === currentStage + 1)?.emoji}
              </div>
            </div>
          )}

          {currentStage === GROWTH_STAGES.length && (
            <div className="mt-4 text-center">
              <div className="text-2xl">🎉 恭喜！你已达到最高阶段！</div>
              <div className="text-white/80 mt-1">继续记录，保持成长</div>
            </div>
          )}
        </div>

        {/* 阶段路径图 */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📍</span>
            <span>成长地图</span>
          </h2>
          <div className="relative">
            {/* 连接线 */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-green-400 to-blue-500 -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${((currentStage - 1) / (GROWTH_STAGES.length - 1)) * 100}%` }}
            />

            {/* 阶段节点 */}
            <div className="relative z-10 flex justify-between">
              {GROWTH_STAGES.map((stage) => {
                const status = getStageStatus(stage.id);
                return (
                  <div
                    key={stage.id}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => setSelectedStage(selectedStage === stage.id ? null : stage.id)}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl transition-all ${
                        status === "completed"
                          ? "bg-gradient-to-r " + stage.color + " text-white shadow-lg scale-110"
                          : status === "current"
                          ? "bg-white border-4 border-current shadow-lg scale-110 animate-pulse"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {status === "completed" ? "✓" : stage.emoji}
                    </div>
                    <div
                      className={`mt-2 text-sm font-medium ${
                        status === "current" ? "text-gray-800" : "text-gray-500"
                      }`}
                    >
                      {stage.name}
                    </div>
                    <div className="text-xs text-gray-400">{stage.requirements.diaries}篇</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 选中阶段详情 */}
        {selectedStage && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 border-2 border-gray-100 animate-fadeIn">
            {(() => {
              const stage = GROWTH_STAGES.find((s) => s.id === selectedStage)!;
              const status = getStageStatus(selectedStage);
              const diaryMet = diaryCount >= stage.requirements.diaries;
              const featuresMet = stage.requirements.features.every((f) =>
                exploredFeatures.includes(f)
              );

              return (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-3xl">{stage.emoji}</span>
                        <h3 className="text-xl font-bold text-gray-800">{stage.name}</h3>
                        {status === "completed" && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
                            已达成
                          </span>
                        )}
                        {status === "current" && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                            进行中
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500">{stage.description}</p>
                    </div>
                  </div>

                  {/* 解锁内容 */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">🔓 解锁内容</div>
                    <div className="flex flex-wrap gap-2">
                      {stage.unlocks.map((unlock, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-full text-sm"
                        >
                          {unlock}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 达成条件 */}
                  {status !== "completed" && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">📋 达成条件</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className={diaryMet ? "text-green-500" : "text-gray-300"}>
                            {diaryMet ? "✓" : "○"}
                          </span>
                          <span className={diaryMet ? "text-gray-600" : "text-gray-400"}>
                            写满 {stage.requirements.diaries} 篇日记（当前 {diaryCount} 篇）
                          </span>
                        </div>
                        {stage.requirements.features.length > 0 && (
                          <div className="flex items-start gap-2">
                            <span className={featuresMet ? "text-green-500" : "text-gray-300"}>
                              {featuresMet ? "✓" : "○"}
                            </span>
                            <div className={featuresMet ? "text-gray-600" : "text-gray-400"}>
                              <span>探索以下功能：</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {stage.requirements.features.map((f) => (
                                  <Link
                                    key={f}
                                    href={f}
                                    onClick={() => markFeatureExplored(f)}
                                    className={`px-2 py-0.5 rounded text-xs ${
                                      exploredFeatures.includes(f)
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                    }`}
                                  >
                                    {f}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 成长建议 */}
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">💡 成长建议</div>
                    <ul className="space-y-1">
                      {stage.tips.map((tip, i) => (
                        <li key={i} className="flex items-center gap-2 text-gray-600 text-sm">
                          <span className="text-gray-400">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* 快速行动 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🚀</span>
            <span>快速行动</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-all"
            >
              <span className="text-2xl">✍️</span>
              <div>
                <div className="font-medium text-gray-800">写日记</div>
                <div className="text-sm text-gray-500">记录今天的故事</div>
              </div>
            </Link>
            <Link
              href="/mood"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-all"
            >
              <span className="text-2xl">😊</span>
              <div>
                <div className="font-medium text-gray-800">记录心情</div>
                <div className="text-sm text-gray-500">追踪情绪变化</div>
              </div>
            </Link>
            <Link
              href="/stats"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all"
            >
              <span className="text-2xl">📊</span>
              <div>
                <div className="font-medium text-gray-800">查看统计</div>
                <div className="text-sm text-gray-500">了解你的成长</div>
              </div>
            </Link>
          </div>
        </div>

        {/* 底部提示 */}
        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>🌟 坚持记录，每一步都是成长</p>
        </div>
      </main>
    </div>
  );
}