"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// AI Agent 定义
interface Agent {
  id: string;
  name: string;
  avatar: string;
  role: string;
  description: string;
  capabilities: string[];
  status: "active" | "idle" | "working";
  tasksCompleted: number;
  lastActive: string;
  color: string;
}

// 协作场景
interface CollabScenario {
  id: string;
  name: string;
  description: string;
  agents: string[];
  steps: string[];
  duration: string;
  icon: string;
}

const agents: Agent[] = [
  {
    id: "diary-writer",
    name: "日记写手",
    avatar: "📝",
    role: "内容创作",
    description: "自动生成日记内容，润色文字，记录生活点滴",
    capabilities: ["日记生成", "内容润色", "风格分析", "情感捕捉"],
    status: "active",
    tasksCompleted: 128,
    lastActive: "刚刚",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "mood-analyst",
    name: "情绪分析师",
    avatar: "🎭",
    role: "情绪洞察",
    description: "分析日记中的情绪模式，预测心情趋势",
    capabilities: ["情绪识别", "趋势预测", "模式发现", "情绪建议"],
    status: "working",
    tasksCompleted: 89,
    lastActive: "运行中",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "habit-coach",
    name: "习惯教练",
    avatar: "🎯",
    role: "习惯培养",
    description: "追踪习惯完成情况，提供个性化建议",
    capabilities: ["习惯追踪", "目标设定", "进度提醒", "成就激励"],
    status: "idle",
    tasksCompleted: 56,
    lastActive: "1小时前",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "insight-hunter",
    name: "洞察猎手",
    avatar: "🔍",
    role: "数据分析",
    description: "从日记中挖掘隐藏洞见，发现生活规律",
    capabilities: ["数据挖掘", "关联分析", "洞察生成", "报告撰写"],
    status: "active",
    tasksCompleted: 203,
    lastActive: "5分钟前",
    color: "from-orange-500 to-amber-500",
  },
  {
    id: "memory-keeper",
    name: "记忆守护者",
    avatar: "🧠",
    role: "记忆管理",
    description: "整理重要时刻，生成回忆时间线",
    capabilities: ["记忆整理", "时间线生成", "里程碑识别", "回忆唤醒"],
    status: "idle",
    tasksCompleted: 45,
    lastActive: "3小时前",
    color: "from-indigo-500 to-violet-500",
  },
  {
    id: "creative-spark",
    name: "创意火花",
    avatar: "✨",
    role: "灵感激发",
    description: "生成写作灵感，提供创意提示词",
    capabilities: ["灵感生成", "提示词创作", "创意扩展", "头脑风暴"],
    status: "active",
    tasksCompleted: 167,
    lastActive: "10分钟前",
    color: "from-rose-500 to-pink-500",
  },
];

const collabScenarios: CollabScenario[] = [
  {
    id: "weekly-review",
    name: "周报自动生成",
    description: "多个 Agent 协作，自动分析本周日记并生成周报",
    agents: ["日记写手", "情绪分析师", "洞察猎手"],
    steps: [
      "洞察猎手收集本周日记数据",
      "情绪分析师分析情绪趋势",
      "日记写手生成周报文本",
      "记忆守护者整理本周亮点",
    ],
    duration: "约 2 分钟",
    icon: "📊",
  },
  {
    id: "goal-coaching",
    name: "目标达成辅导",
    description: "追踪你的目标进度，提供个性化建议",
    agents: ["习惯教练", "洞察猎手", "创意火花"],
    steps: [
      "习惯教练检查目标进度",
      "洞察猎手分析达成模式",
      "创意火花生成改进建议",
    ],
    duration: "约 1 分钟",
    icon: "🎯",
  },
  {
    id: "memory-movie",
    name: "回忆电影",
    description: "将你的重要时刻编译成故事线",
    agents: ["记忆守护者", "日记写手", "情绪分析师"],
    steps: [
      "记忆守护者识别重要时刻",
      "情绪分析师分析情感弧线",
      "日记写手编写故事脚本",
    ],
    duration: "约 3 分钟",
    icon: "🎬",
  },
  {
    id: "inspiration-booster",
    name: "灵感加油站",
    description: "当灵感枯竭时，多个 Agent 协作为你充电",
    agents: ["创意火花", "洞察猎手", "日记写手"],
    steps: [
      "洞察猎手分析你的兴趣点",
      "创意火花生成定向灵感",
      "日记写手创作示范片段",
    ],
    duration: "约 1 分钟",
    icon: "💡",
  },
];

// 实时活动日志
interface ActivityLog {
  id: number;
  agent: string;
  action: string;
  time: string;
  type: "success" | "working" | "info";
}

const generateActivityLog = (): ActivityLog[] => {
  const actions = [
    { agent: "洞察猎手", action: "完成了周数据挖掘", type: "success" as const },
    { agent: "情绪分析师", action: "正在分析今日情绪模式", type: "working" as const },
    { agent: "日记写手", action: "生成了新的写作建议", type: "success" as const },
    { agent: "习惯教练", action: "追踪了 5 个习惯目标", type: "info" as const },
    { agent: "记忆守护者", action: "整理了 12 个重要时刻", type: "success" as const },
    { agent: "创意火花", action: "生成了 3 个灵感提示词", type: "success" as const },
  ];
  
  return actions.map((a, i) => ({
    id: i + 1,
    ...a,
    time: `${Math.floor(Math.random() * 10) + 1}分钟前`,
  }));
};

export default function AgentCollabPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<CollabScenario | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => generateActivityLog());
  const [isRunning, setIsRunning] = useState(false);
  const [runProgress, setRunProgress] = useState(0);

  // 模拟实时日志更新
  useEffect(() => {
    const interval = setInterval(() => {
      setActivityLogs(generateActivityLog());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // 运行协作场景
  const runScenario = (scenario: CollabScenario) => {
    setSelectedScenario(scenario);
    setIsRunning(true);
    setRunProgress(0);

    const interval = setInterval(() => {
      setRunProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // 统计数据
  const totalTasks = agents.reduce((sum, a) => sum + a.tasksCompleted, 0);
  const activeAgents = agents.filter((a) => a.status !== "idle").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-indigo-500/5 to-transparent rounded-full" />
      </div>

      <main className="relative max-w-7xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-3xl hover:scale-110 transition-transform">
              🦞
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span>🤝</span>
                <span>AI Agent 协作广场</span>
              </h1>
              <p className="text-gray-400 text-sm">
                看见 AI 如何为你工作
              </p>
            </div>
          </div>

          {/* 实时状态 */}
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full inline-block mr-2 animate-pulse" />
              <span className="text-green-300 text-sm">{activeAgents} 个 Agent 活跃中</span>
            </div>
            <div className="px-4 py-2 bg-white/10 rounded-full text-gray-300 text-sm">
              累计完成 {totalTasks} 任务
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：Agent 卡片 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agent 网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`relative group bg-white/5 border border-white/10 rounded-2xl p-5 cursor-pointer transition-all hover:border-white/20 hover:shadow-xl ${
                    selectedAgent?.id === agent.id ? "ring-2 ring-indigo-500" : ""
                  }`}
                >
                  {/* 状态指示灯 */}
                  <div
                    className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
                      agent.status === "active"
                        ? "bg-green-400 animate-pulse"
                        : agent.status === "working"
                        ? "bg-yellow-400 animate-pulse"
                        : "bg-gray-500"
                    }`}
                  />

                  {/* 头像和名称 */}
                  <div className="flex items-center gap-4 mb-3">
                    <div
                      className={`w-14 h-14 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-2xl shadow-lg`}
                    >
                      {agent.avatar}
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{agent.name}</h3>
                      <span className="text-xs text-gray-400">{agent.role}</span>
                    </div>
                  </div>

                  {/* 描述 */}
                  <p className="text-sm text-gray-400 mb-3">{agent.description}</p>

                  {/* 能力标签 */}
                  <div className="flex flex-wrap gap-1.5">
                    {agent.capabilities.slice(0, 3).map((cap, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-gray-300"
                      >
                        {cap}
                      </span>
                    ))}
                    {agent.capabilities.length > 3 && (
                      <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs text-gray-400">
                        +{agent.capabilities.length - 3}
                      </span>
                    )}
                  </div>

                  {/* 统计 */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                    <span>✅ {agent.tasksCompleted} 任务完成</span>
                    <span>{agent.lastActive}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 协作场景 */}
            <div>
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🎬</span>
                <span>协作场景</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collabScenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-4 hover:border-indigo-500/30 transition-all"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-3xl">{scenario.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-white">{scenario.name}</h3>
                        <p className="text-xs text-gray-400">{scenario.description}</p>
                      </div>
                    </div>

                    {/* 参与的 Agent */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {scenario.agents.map((agent, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-indigo-500/20 rounded-full text-xs text-indigo-300"
                        >
                          {agent}
                        </span>
                      ))}
                    </div>

                    {/* 步骤预览 */}
                    <div className="mb-3 space-y-1">
                      {scenario.steps.slice(0, 2).map((step, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                          <span className="w-4 h-4 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                            {i + 1}
                          </span>
                          <span className="truncate">{step}</span>
                        </div>
                      ))}
                      {scenario.steps.length > 2 && (
                        <span className="text-xs text-gray-500 ml-6">
                          +{scenario.steps.length - 2} 步骤
                        </span>
                      )}
                    </div>

                    {/* 底部 */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">⏱️ {scenario.duration}</span>
                      <button
                        onClick={() => runScenario(scenario)}
                        disabled={isRunning}
                        className="px-3 py-1.5 bg-indigo-500 text-white rounded-lg text-xs font-medium hover:bg-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                      >
                        <span>▶</span>
                        <span>运行</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 运行进度 */}
            {isRunning && selectedScenario && (
              <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{selectedScenario.icon}</span>
                    <div>
                      <h3 className="font-bold text-white">{selectedScenario.name}</h3>
                      <p className="text-xs text-gray-400">协作运行中...</p>
                    </div>
                  </div>
                  <span className="text-sm text-indigo-300">{runProgress}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${runProgress}%` }}
                  />
                </div>
                {runProgress === 100 && (
                  <div className="mt-3 p-3 bg-green-500/20 rounded-lg text-sm text-green-300">
                    ✅ 协作完成！查看结果 →
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 右侧：详情和日志 */}
          <div className="space-y-6">
            {/* Agent 详情 */}
            {selectedAgent ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedAgent.color} flex items-center justify-center text-xl`}
                  >
                    {selectedAgent.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{selectedAgent.name}</h3>
                    <span className="text-xs text-gray-400">{selectedAgent.role}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-4">{selectedAgent.description}</p>

                <h4 className="text-sm font-medium text-gray-300 mb-2">核心能力</h4>
                <div className="space-y-2 mb-4">
                  {selectedAgent.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                      <span className="text-gray-400">{cap}</span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{selectedAgent.tasksCompleted}</div>
                    <div className="text-xs text-gray-500">任务完成</div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-sm font-medium ${
                        selectedAgent.status === "active"
                          ? "text-green-400"
                          : selectedAgent.status === "working"
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }`}
                    >
                      {selectedAgent.status === "active"
                        ? "活跃中"
                        : selectedAgent.status === "working"
                        ? "工作中"
                        : "空闲"}
                    </div>
                    <div className="text-xs text-gray-500">状态</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                <div className="text-4xl mb-3">👆</div>
                <p className="text-gray-400 text-sm">点击左侧 Agent 卡片查看详情</p>
              </div>
            )}

            {/* 实时活动日志 */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <span>📡</span>
                <span>实时活动</span>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 text-sm"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 ${
                        log.type === "success"
                          ? "bg-green-400"
                          : log.type === "working"
                          ? "bg-yellow-400 animate-pulse"
                          : "bg-blue-400"
                      }`}
                    />
                    <div className="flex-1">
                      <span className="text-indigo-300">{log.agent}</span>
                      <span className="text-gray-400"> {log.action}</span>
                      <div className="text-xs text-gray-600">{log.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 快捷入口 */}
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-5">
              <h3 className="font-bold text-white mb-3">🚀 快速体验</h3>
              <div className="space-y-2">
                <Link
                  href="/ai-tasks"
                  className="block px-4 py-3 bg-white/10 rounded-lg text-gray-300 hover:bg-white/20 transition-colors text-sm"
                >
                  ⚡ AI 任务中心
                </Link>
                <Link
                  href="/playground"
                  className="block px-4 py-3 bg-white/10 rounded-lg text-gray-300 hover:bg-white/20 transition-colors text-sm"
                >
                  🎮 实验场
                </Link>
                <Link
                  href="/tutorials"
                  className="block px-4 py-3 bg-white/10 rounded-lg text-gray-300 hover:bg-white/20 transition-colors text-sm"
                >
                  📚 教程中心
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}