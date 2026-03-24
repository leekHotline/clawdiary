"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface AITask {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "idle" | "running" | "completed" | "error";
  progress: number;
  lastRun?: string;
  result?: string;
  category: string;
  estimatedTime: string;
}

interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  estimatedTime: string;
  action: () => Promise<string>;
}

// 初始化函数：从 localStorage 读取历史（移到组件外部避免重复创建）
function getInitialTaskHistory(): { tasks: AITask[]; results: Record<string, string> } {
  if (typeof window === 'undefined') return { tasks: [], results: {} };
  const saved = localStorage.getItem("ai-tasks-history");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return { tasks: parsed.tasks || [], results: parsed.results || {} };
    } catch {
      console.error("加载任务历史失败");
    }
  }
  return { tasks: [], results: {} };
}

const taskTemplates: TaskTemplate[] = [
  {
    id: "summarize-week",
    name: "周报生成",
    description: "AI 分析本周日记，生成精彩周报",
    icon: "📊",
    category: "分析",
    estimatedTime: "30秒",
    action: async () => {
      await new Promise((r) => setTimeout(r, 2000));
      return "本周你共写了 5 篇日记，主要关注：工作效率、情绪管理、健康习惯。推荐下周重点：增加感恩日记。";
    },
  },
  {
    id: "mood-analysis",
    name: "情绪洞察",
    description: "分析近期情绪变化，发现潜在模式",
    icon: "🎭",
    category: "洞察",
    estimatedTime: "20秒",
    action: async () => {
      await new Promise((r) => setTimeout(r, 1500));
      return "你的情绪整体稳定，周三和周五的情绪指数最高。建议：保持规律作息，继续写感恩日记。";
    },
  },
  {
    id: "goal-progress",
    name: "目标追踪",
    description: "追踪你设定的目标完成情况",
    icon: "🎯",
    category: "追踪",
    estimatedTime: "15秒",
    action: async () => {
      await new Promise((r) => setTimeout(r, 1000));
      return "目标「每周写 3 篇日记」：本周完成 5/3 ✅ 已超额完成！继续保持！";
    },
  },
  {
    id: "generate-prompt",
    name: "智能提示词",
    description: "根据你的写作风格生成个性化提示词",
    icon: "✨",
    category: "创作",
    estimatedTime: "25秒",
    action: async () => {
      await new Promise((r) => setTimeout(r, 1800));
      return "为你定制的提示词：\n「今天有什么让你感到自豪的小事？写下来，哪怕很微小。」\n这个提示词很适合你的写作风格。";
    },
  },
  {
    id: "memory-refresh",
    name: "记忆刷新",
    description: "回顾上周的重要时刻和灵感",
    icon: "🧠",
    category: "回顾",
    estimatedTime: "20秒",
    action: async () => {
      await new Promise((r) => setTimeout(r, 1200));
      return "上周亮点：\n• 周一：完成重要项目\n• 周三：学会新技能\n• 周五：和朋友愉快聊天\n继续保持这种节奏！";
    },
  },
  {
    id: "writing-tips",
    name: "写作建议",
    description: "AI 分析你的写作，给出改进建议",
    icon: "📝",
    category: "提升",
    estimatedTime: "30秒",
    action: async () => {
      await new Promise((r) => setTimeout(r, 2200));
      return "写作建议：\n1. 尝试更多细节描写\n2. 加入情绪反思\n3. 可以用更多比喻\n你的文字已经很有温度，继续加油！";
    },
  },
];

const categories = [
  { id: "all", name: "全部", icon: "🌟" },
  { id: "分析", name: "数据分析", icon: "📊" },
  { id: "洞察", name: "智能洞察", icon: "💡" },
  { id: "追踪", name: "目标追踪", icon: "🎯" },
  { id: "创作", name: "创作辅助", icon: "✨" },
  { id: "回顾", name: "记忆回顾", icon: "🧠" },
  { id: "提升", name: "成长提升", icon: "📈" },
];

export default function AITasksPage() {
  const taskIdCounter = useRef(0);

  // 生成唯一任务ID
  const generateTaskId = (templateId: string) => {
    taskIdCounter.current += 1;
    return `${templateId}-${taskIdCounter.current}`;
  };

  // 使用惰性初始化从 localStorage 读取状态
  const [tasks, setTasks] = useState<AITask[]>(() => getInitialTaskHistory().tasks);
  const [activeCategory, setActiveCategory] = useState("all");
  const [runningTasks, setRunningTasks] = useState<string[]>([]);
  const [completedResults, setCompletedResults] = useState<Record<string, string>>(() => getInitialTaskHistory().results);

  // 保存任务状态
  useEffect(() => {
    localStorage.setItem(
      "ai-tasks-history",
      JSON.stringify({ tasks, results: completedResults })
    );
  }, [tasks, completedResults]);

  const runTask = async (template: TaskTemplate) => {
    const taskId = generateTaskId(template.id);
    
    // 添加新任务
    const newTask: AITask = {
      id: taskId,
      name: template.name,
      description: template.description,
      icon: template.icon,
      status: "running",
      progress: 0,
      category: template.category,
      estimatedTime: template.estimatedTime,
    };
    
    setTasks((prev) => [newTask, ...prev]);
    setRunningTasks((prev) => [...prev, taskId]);

    // 模拟进度
    const progressInterval = setInterval(() => {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, progress: Math.min(t.progress + 10, 90) }
            : t
        )
      );
    }, 200);

    // 执行任务
    try {
      const result = await template.action();
      
      clearInterval(progressInterval);
      
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: "completed",
                progress: 100,
                lastRun: new Date().toLocaleString(),
                result,
              }
            : t
        )
      );
      setCompletedResults((prev) => ({ ...prev, [taskId]: result }));
    } catch {
      clearInterval(progressInterval);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: "error", progress: 0 } : t
        )
      );
    }

    setRunningTasks((prev) => prev.filter((id) => id !== taskId));
  };

  const filteredTemplates =
    activeCategory === "all"
      ? taskTemplates
      : taskTemplates.filter((t) => t.category === activeCategory);

  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const runningCount = tasks.filter((t) => t.status === "running").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-6xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-3xl hover:scale-110 transition-transform">
              🦞
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <span>🤖</span>
                <span>AI 任务中心</span>
              </h1>
              <p className="text-gray-400 text-sm">
                让 AI 为你工作，追踪任务进度
              </p>
            </div>
          </div>

          {/* 状态指示 */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full">
              <span className={`w-2 h-2 rounded-full ${runningCount > 0 ? "bg-green-400 animate-pulse" : "bg-gray-500"}`} />
              <span className="text-sm text-gray-300">
                {runningCount > 0 ? `${runningCount} 任务运行中` : "空闲"}
              </span>
            </div>
            <div className="px-4 py-2 bg-indigo-500/20 rounded-full text-indigo-300 text-sm">
              ✅ {completedCount} 已完成
            </div>
          </div>
        </div>

        {/* 分类标签 */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* 任务模板网格 */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>⚡</span>
            <span>快速启动</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group relative bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-indigo-500/50 transition-all hover:shadow-xl hover:shadow-indigo-500/10"
              >
                {/* 图标和标题 */}
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-400">{template.description}</p>
                  </div>
                </div>

                {/* 底部信息 */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <span>⏱️</span>
                    {template.estimatedTime}
                  </span>
                  <button
                    onClick={() => runTask(template)}
                    disabled={runningTasks.length > 0}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm font-medium hover:bg-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <span>▶️</span>
                    <span>运行</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 任务历史 */}
        {tasks.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>📋</span>
              <span>任务历史</span>
              <button
                onClick={() => {
                  setTasks([]);
                  setCompletedResults({});
                }}
                className="ml-auto text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                清空历史
              </button>
            </h2>
            <div className="space-y-3">
              {tasks.slice(0, 10).map((task) => (
                <div
                  key={task.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <div className="flex items-center gap-4">
                    {/* 状态图标 */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                        task.status === "running"
                          ? "bg-indigo-500/30 animate-pulse"
                          : task.status === "completed"
                          ? "bg-green-500/30"
                          : "bg-red-500/30"
                      }`}
                    >
                      {task.status === "running" ? "⏳" : task.status === "completed" ? "✅" : "❌"}
                    </div>

                    {/* 任务信息 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{task.icon} {task.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">
                          {task.category}
                        </span>
                      </div>
                      {task.status === "running" && (
                        <div className="mt-2">
                          <div className="w-full bg-white/10 rounded-full h-1.5">
                            <div
                              className="bg-indigo-500 h-1.5 rounded-full transition-all"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 mt-1">{task.progress}%</span>
                        </div>
                      )}
                      {task.lastRun && (
                        <span className="text-xs text-gray-500">{task.lastRun}</span>
                      )}
                    </div>

                    {/* 结果预览 */}
                    {task.result && (
                      <button
                        onClick={() => {
                          const result = completedResults[task.id];
                          if (result) {
                            alert(result);
                          }
                        }}
                        className="px-3 py-1 bg-white/10 text-gray-300 rounded-lg text-sm hover:bg-white/20 transition-colors"
                      >
                        查看结果
                      </button>
                    )}
                  </div>

                  {/* 结果内容 */}
                  {task.result && (
                    <div className="mt-3 p-3 bg-white/5 rounded-lg text-sm text-gray-300 whitespace-pre-wrap">
                      {task.result}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 空状态 */}
        {tasks.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-white mb-2">开始你的第一个任务</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              选择上方的任务模板，让 AI 为你自动分析和处理数据
            </p>
          </div>
        )}

        {/* 功能说明 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-5">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-bold text-white mb-2">透明追踪</h3>
            <p className="text-sm text-gray-400">
              实时查看 AI 任务进度，了解每个步骤
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-5">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="font-bold text-white mb-2">一键执行</h3>
            <p className="text-sm text-gray-400">
              预设任务模板，点击即可运行，省时省力
            </p>
          </div>
          <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-xl p-5">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-bold text-white mb-2">智能分析</h3>
            <p className="text-sm text-gray-400">
              AI 自动分析数据，生成个性化洞察
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}