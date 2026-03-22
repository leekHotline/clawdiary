"use client";

import { useState } from "react";
import Link from "next/link";

// 能量类型
const ENERGY_TYPES = [
  { id: "tired", emoji: "😴", label: "疲惫", desc: "身体或精神疲惫，需要休息" },
  { id: "stuck", emoji: "🧱", label: "卡住了", desc: "写作遇到瓶颈，思路不通" },
  { id: "lazy", emoji: "🦥", label: "犯懒", desc: "知道该写但就是不想动" },
  { id: "anxious", emoji: "😰", label: "焦虑", desc: "担心写不好，压力太大" },
  { id: "empty", emoji: "🫗", label: "空虚", desc: "感觉没什么可写的" },
  { id: "bored", emoji: "😐", label: "无聊", desc: "写作变得机械乏味" },
] as const;

// 能量方案库
const ENERGY_SOLUTIONS: Record<string, { quotes: string[]; prompts: string[]; actions: string[] }> = {
  tired: {
    quotes: [
      "「休息不是懒惰，而是为了走更远的路。」",
      "「今天可以只写一句话，那也是进步。」",
      "「疲惫是身体在提醒你：该对自己温柔一点了。」",
    ],
    prompts: [
      "今天最想躺在哪里？为什么？",
      "如果疲惫有颜色，它是什么颜色？",
      "给自己写一张请假条，内容是什么？",
    ],
    actions: ["深呼吸 3 次", "闭上眼睛 1 分钟", "喝一杯温水"],
  },
  stuck: {
    quotes: [
      "「写作不是在纸上行走，而是在迷雾中探索。」",
      "「卡住的时候，说明你正在爬山。」",
      "「允许自己写出垃圾，垃圾堆里能开出花。」",
    ],
    prompts: [
      "写下三个你现在想到的词，不管它们是否相关",
      "如果文字卡住了，用画图的方式表达？",
      "问自己：如果这篇文章写给 5 岁的自己，会怎么写？",
    ],
    actions: ["换个姿势坐", "站起来走 30 秒", "看窗外 10 秒"],
  },
  lazy: {
    quotes: [
      "「最难的永远是开始。」",
      "「你不是懒，你只是在蓄力。」",
      "「懒惰有时是直觉在说：这件事不对。」",
    ],
    prompts: [
      "如果今天只写一个字，你会写什么？",
      "想象明天的你感谢今天的自己做了什么？",
      "懒惰背后，你在害怕什么？",
    ],
    actions: ["数 3 下立刻行动", "设定 5 分钟计时器", "告诉某人你要开始写了"],
  },
  anxious: {
    quotes: [
      "「完美是进步的敌人。」",
      "「你的焦虑，是因为你在乎。」",
      "「写日记不是为了出版，是为了自己。」",
    ],
    prompts: [
      "把你担心的事全写下来，然后一个一个划掉",
      "如果最坏的情况发生了，会是什么样？",
      "给焦虑起个名字，和它对话",
    ],
    actions: ["做 4-7-8 呼吸法", "握紧拳头 5 秒再松开", "说出三件你感激的事"],
  },
  empty: {
    quotes: [
      "「空白不是空虚，是可能性。」",
      "「灵感不来访，你去拜访它。」",
      "「今天没什么可写，本身就是值得写的事。」",
    ],
    prompts: [
      "记录此刻：你看到了什么？听到了什么？",
      "回忆最近一次让你心动的瞬间",
      "如果今天是个颜色，它是什么？",
    ],
    actions: ["观察一个物体 30 秒", "听一首歌", "回忆一个童年的画面"],
  },
  bored: {
    quotes: [
      "「无聊是创意的开始。」",
      "「重复不是因为无聊，是因为你在磨练。」",
      "「把无聊变成游戏，一切都会改变。」",
    ],
    prompts: [
      "用三个词语形容现在的心情",
      "如果今天可以重新来过，你会改变什么？",
      "给自己设定一个荒谬的写作挑战",
    ],
    actions: ["换一支笔/换一个字体", "换个地方写", "播放一首从未听过的歌"],
  },
};

// 随机选择
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 呼吸练习组件
function BreathingExercise({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [count, setCount] = useState(4);
  const [isActive, setIsActive] = useState(false);

  const startBreathing = () => {
    setIsActive(true);
    let currentCount = 4;
    let currentPhase: "inhale" | "hold" | "exhale" = "inhale";
    
    const interval = setInterval(() => {
      currentCount--;
      setCount(currentCount);
      
      if (currentCount <= 0) {
        if (currentPhase === "inhale") {
          currentPhase = "hold";
          currentCount = 7;
        } else if (currentPhase === "hold") {
          currentPhase = "exhale";
          currentCount = 8;
        } else {
          currentPhase = "inhale";
          currentCount = 4;
        }
        setPhase(currentPhase);
        setCount(currentCount);
      }
    }, 1000);

    // 30秒后自动停止
    setTimeout(() => {
      clearInterval(interval);
      setIsActive(false);
      setCount(4);
      setPhase("inhale");
    }, 30000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center">
        <h3 className="text-xl font-bold mb-4">🌬️ 4-7-8 呼吸法</h3>
        
        {!isActive ? (
          <>
            <p className="text-gray-600 mb-6">
              吸气4秒 → 屏息7秒 → 呼气8秒<br/>
              连续3-4个循环，感受身体放松
            </p>
            <button
              onClick={startBreathing}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-medium hover:opacity-90 transition"
            >
              开始呼吸练习
            </button>
          </>
        ) : (
          <div className="py-8">
            <div className={`text-6xl mb-4 transition-all duration-1000 ${
              phase === "inhale" ? "scale-125 text-teal-500" :
              phase === "hold" ? "scale-110 text-blue-500" :
              "scale-100 text-indigo-500"
            }`}>
              {phase === "inhale" ? "吸气" : phase === "hold" ? "屏息" : "呼气"}
            </div>
            <div className="text-4xl font-bold text-gray-700">{count}</div>
          </div>
        )}
        
        <button
          onClick={onClose}
          className="mt-4 text-gray-400 hover:text-gray-600 text-sm"
        >
          关闭
        </button>
      </div>
    </div>
  );
}

// 能量结果
function EnergyResult({ 
  type, 
  onRefresh, 
  onStartWriting 
}: { 
  type: typeof ENERGY_TYPES[number]; 
  onRefresh: () => void;
  onStartWriting: () => void;
}) {
  const solution = ENERGY_SOLUTIONS[type.id];
  const [quote] = useState(() => pickRandom(solution.quotes));
  const [prompt] = useState(() => pickRandom(solution.prompts));
  const [showBreathing, setShowBreathing] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100">
      {/* 选择的能量类型 */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">{type.emoji}</div>
        <h2 className="text-xl font-bold text-gray-800">为你定制的能量方案</h2>
        <p className="text-gray-500 text-sm">{type.desc}</p>
      </div>

      {/* 励志语录 */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 mb-4">
        <div className="text-orange-400 text-xs mb-2">💡 今日能量</div>
        <p className="text-gray-700 font-medium">{quote}</p>
      </div>

      {/* 写作提示 */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-4">
        <div className="text-purple-400 text-xs mb-2">✍️ 写作提示</div>
        <p className="text-gray-700">{prompt}</p>
      </div>

      {/* 快速行动 */}
      <div className="mb-4">
        <div className="text-green-500 text-xs mb-2">⚡ 快速行动</div>
        <div className="flex flex-wrap gap-2">
          {solution.actions.map((action, i) => (
            <span
              key={i}
              className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm cursor-pointer hover:bg-green-100 transition"
              onClick={() => alert(`完成了！继续加油 💪`)}
            >
              {action}
            </span>
          ))}
          <span
            className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-sm cursor-pointer hover:bg-teal-100 transition"
            onClick={() => setShowBreathing(true)}
          >
            🌬️ 呼吸练习
          </span>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3">
        <button
          onClick={onRefresh}
          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition font-medium"
        >
          🔄 换一批
        </button>
        <button
          onClick={onStartWriting}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:opacity-90 transition font-medium"
        >
          ✍️ 开始写日记
        </button>
      </div>

      {showBreathing && <BreathingExercise onClose={() => setShowBreathing(false)} />}
    </div>
  );
}

export default function EnergyBoosterPage() {
  const [selectedType, setSelectedType] = useState<typeof ENERGY_TYPES[number] | null>(null);
  const [key, setKey] = useState(0);

  const handleSelect = (type: typeof ENERGY_TYPES[number]) => {
    setSelectedType(type);
  };

  const handleRefresh = () => {
    setKey(prev => prev + 1);
  };

  const handleStartWriting = () => {
    window.location.href = "/write";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 right-10 w-60 h-60 bg-orange-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-yellow-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-red-200/20 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-lg mx-auto px-4 py-8">
        {/* 头部 */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-sm text-orange-600 hover:text-orange-700 mb-4">
            ← 返回首页
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ⚡ 能量充值站
          </h1>
          <p className="text-gray-500">
            选择你现在的状态，获取专属能量方案
          </p>
        </div>

        {!selectedType ? (
          /* 选择状态 */
          <div className="space-y-3">
            {ENERGY_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => handleSelect(type)}
                className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50 hover:shadow-md hover:border-orange-200 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform">
                    {type.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800">{type.label}</div>
                    <div className="text-sm text-gray-500">{type.desc}</div>
                  </div>
                  <div className="text-gray-300 group-hover:text-orange-400 transition-colors">
                    →
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* 能量方案 */
          <EnergyResult 
            key={key}
            type={selectedType} 
            onRefresh={handleRefresh}
            onStartWriting={handleStartWriting}
          />
        )}

        {/* 底部链接 */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-gray-400 text-sm">还需要更多能量？</p>
          <div className="flex justify-center gap-4 text-sm">
            <Link href="/inspiration-lab" className="text-orange-600 hover:text-orange-700">
              🎨 灵感实验室
            </Link>
            <Link href="/daily-wisdom" className="text-purple-600 hover:text-purple-700">
              💫 每日智慧
            </Link>
            <Link href="/ai-coach" className="text-teal-600 hover:text-teal-700">
              🤖 AI教练
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}