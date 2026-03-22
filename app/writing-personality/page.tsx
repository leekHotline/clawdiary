"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 写作人格类型定义
interface PersonalityType {
  id: string;
  name: string;
  emoji: string;
  color: string;
  gradient: string;
  description: string;
  strengths: string[];
  advice: string;
  famousWriter: string;
}

// 所有人格类型
const PERSONALITY_TYPES: PersonalityType[] = [
  {
    id: "deep-thinker",
    name: "深度思考者",
    emoji: "🧠",
    color: "from-purple-500 to-indigo-600",
    gradient: "bg-gradient-to-br from-purple-500/20 to-indigo-600/20",
    description: "你是一位善于深入思考的写作者。你的日记充满哲思和洞察，喜欢探索事物的本质。",
    strengths: ["逻辑清晰", "见解独到", "善于反思", "思维深度"],
    advice: "偶尔记录生活中的小确幸，让情感与理性平衡发展。",
    famousWriter: "周国平"
  },
  {
    id: "emotion-recorder",
    name: "情感记录者",
    emoji: "💕",
    color: "from-pink-500 to-rose-600",
    gradient: "bg-gradient-to-br from-pink-500/20 to-rose-600/20",
    description: "你是一位敏感细腻的写作者。你的日记充满情感波澜，善于捕捉内心的每一丝涟漪。",
    strengths: ["情感丰富", "细腻敏感", "共情能力强", "表达真挚"],
    advice: "在情感记录之外，尝试加入更多理性的分析和思考。",
    famousWriter: "三毛"
  },
  {
    id: "goal-chaser",
    name: "目标追踪者",
    emoji: "🎯",
    color: "from-green-500 to-emerald-600",
    gradient: "bg-gradient-to-br from-green-500/20 to-emerald-600/20",
    description: "你是一位目标导向的写作者。你的日记是成长的阶梯，记录着每一次进步和突破。",
    strengths: ["目标明确", "行动力强", "持续进步", "自我驱动"],
    advice: "除了目标，也记录过程中的感受和意外的收获。",
    famousWriter: "李笑来"
  },
  {
    id: "life-observer",
    name: "生活观察家",
    emoji: "🔍",
    color: "from-amber-500 to-orange-600",
    gradient: "bg-gradient-to-br from-amber-500/20 to-orange-600/20",
    description: "你是一位善于观察的写作者。你用日记记录生活的点点滴滴，发现平凡中的美好。",
    strengths: ["观察入微", "细节敏感", "生活热爱", "发现美好"],
    advice: "在观察之外，多加入自己的思考和情感反应。",
    famousWriter: "汪曾祺"
  },
  {
    id: "creative-dreamer",
    name: "创意梦想家",
    emoji: "✨",
    color: "from-cyan-500 to-blue-600",
    gradient: "bg-gradient-to-br from-cyan-500/20 to-blue-600/20",
    description: "你是一位富有创造力的写作者。你的日记充满想象力和新点子，是天生的创意者。",
    strengths: ["想象力丰富", "创意无限", "思维活跃", "勇于尝试"],
    advice: "把创意落实到行动，让梦想照进现实。",
    famousWriter: "村上春树"
  },
  {
    id: "gratitude-practitioner",
    name: "感恩践行者",
    emoji: "🙏",
    color: "from-yellow-500 to-amber-600",
    gradient: "bg-gradient-to-br from-yellow-500/20 to-amber-600/20",
    description: "你是一位心怀感恩的写作者。你的日记充满感激和正能量，懂得珍惜生活中的美好。",
    strengths: ["心态积极", "懂得感恩", "正能量满满", "人际和谐"],
    advice: "在感恩之外，也接纳生活中的不完美，允许负面情绪的表达。",
    famousWriter: "林清玄"
  }
];

// 分析维度
interface AnalysisDimension {
  name: string;
  score: number;
  maxScore: number;
  color: string;
  description: string;
}

// 测试结果
interface TestResult {
  personality: PersonalityType;
  dimensions: AnalysisDimension[];
  writingStyle: string[];
  topKeywords: string[];
  growthPath: string;
  tip: string;
}

// 模拟生成测试结果
function generateTestResult(): TestResult {
  // 随机选择人格类型
  const personality = PERSONALITY_TYPES[Math.floor(Math.random() * PERSONALITY_TYPES.length)];
  
  // 生成分析维度
  const dimensions: AnalysisDimension[] = [
    {
      name: "深度思考",
      score: Math.floor(Math.random() * 30) + 70,
      maxScore: 100,
      color: "bg-purple-500",
      description: "你对事物有深入的理解和独到的见解"
    },
    {
      name: "情感表达",
      score: Math.floor(Math.random() * 30) + 70,
      maxScore: 100,
      color: "bg-pink-500",
      description: "你善于表达内心的情感和感受"
    },
    {
      name: "目标驱动",
      score: Math.floor(Math.random() * 30) + 60,
      maxScore: 100,
      color: "bg-green-500",
      description: "你有明确的目标和行动计划"
    },
    {
      name: "创意思维",
      score: Math.floor(Math.random() * 30) + 65,
      maxScore: 100,
      color: "bg-cyan-500",
      description: "你有丰富的想象力和创造力"
    },
    {
      name: "观察敏锐",
      score: Math.floor(Math.random() * 30) + 75,
      maxScore: 100,
      color: "bg-amber-500",
      description: "你善于发现生活中的细节"
    }
  ];

  const writingStyles = [
    "善于用比喻和象征表达思想",
    "文字简洁有力，直击要害",
    "情感真挚，容易引起共鸣",
    "结构清晰，逻辑性强",
    "善于从日常小事中提炼哲理"
  ];

  const keywords = ["成长", "思考", "感恩", "学习", "坚持", "梦想", "改变", "希望"];

  const growthPaths = [
    "继续保持深度思考的习惯，同时增加情感表达的温度",
    "你的写作风格独特，建议尝试更多元化的题材",
    "你的文字充满力量，可以尝试创作更长篇幅的内容",
    "善于观察是你的优势，深入挖掘会更有收获"
  ];

  const tips = [
    "💡 试试每天写三件感恩的事，培养积极心态",
    "💡 尝试用不同视角写同一件事，拓展思维",
    "💡 给未来的自己写封信，设定长期目标",
    "💡 偶尔用第三人称写日记，增加客观视角"
  ];

  return {
    personality,
    dimensions,
    writingStyle: writingStyles.slice(0, 3),
    topKeywords: keywords.slice(0, 5),
    growthPath: growthPaths[Math.floor(Math.random() * growthPaths.length)],
    tip: tips[Math.floor(Math.random() * tips.length)]
  };
}

// 问题组件
function QuestionCard({ 
  question, 
  options, 
  onAnswer, 
  currentIndex, 
  total 
}: { 
  question: string;
  options: { text: string; value: string }[];
  onAnswer: (value: string) => void;
  currentIndex: number;
  total: number;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 w-full max-w-lg">
      {/* 进度条 */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>问题 {currentIndex + 1} / {total}</span>
          <span>{Math.round(((currentIndex + 1) / total) * 100)}%</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* 问题 */}
      <h3 className="text-xl font-bold text-white mb-6">{question}</h3>

      {/* 选项 */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelected(option.value)}
            className={`w-full text-left p-4 rounded-xl transition-all ${
              selected === option.value
                ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-2 border-purple-500"
                : "bg-white/5 border border-white/10 hover:border-white/30"
            }`}
          >
            <span className="text-white">{option.text}</span>
          </button>
        ))}
      </div>

      {/* 下一步按钮 */}
      {selected && (
        <button
          onClick={() => onAnswer(selected)}
          className="w-full mt-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
        >
          继续下一题 →
        </button>
      )}
    </div>
  );
}

// 结果展示组件
function ResultCard({ result }: { result: TestResult }) {
  const [showShare, setShowShare] = useState(false);

  return (
    <div className="w-full max-w-2xl">
      {/* 主卡片 */}
      <div className={`${result.personality.gradient} border border-white/20 rounded-3xl p-8 mb-6`}>
        {/* 头部 */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{result.personality.emoji}</div>
          <h2 className="text-3xl font-bold text-white mb-2">你的写作人格是</h2>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {result.personality.name}
          </h1>
        </div>

        {/* 描述 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 mb-6">
          <p className="text-gray-200 text-center leading-relaxed">
            {result.personality.description}
          </p>
        </div>

        {/* 优势标签 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>💪</span> 你的优势
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.personality.strengths.map((strength, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-white/20 rounded-full text-white text-sm font-medium"
              >
                {strength}
              </span>
            ))}
          </div>
        </div>

        {/* 分析维度 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>📊</span> 能力雷达
          </h3>
          <div className="space-y-3">
            {result.dimensions.map((dim, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{dim.name}</span>
                  <span className="text-white font-bold">{dim.score}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${dim.color} transition-all duration-1000`}
                    style={{ width: `${dim.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 写作风格 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>✍️</span> 写作风格
          </h3>
          <ul className="space-y-2">
            {result.writingStyle.map((style, i) => (
              <li key={i} className="flex items-center gap-2 text-gray-300">
                <span className="text-green-400">✓</span>
                {style}
              </li>
            ))}
          </ul>
        </div>

        {/* 高频词 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>🏷️</span> 你的关键词
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {result.topKeywords.map((keyword, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-white/10 rounded-full text-sm text-gray-200"
              >
                #{keyword}
              </span>
            ))}
          </div>
        </div>

        {/* 成长建议 */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <span>🌱</span> 成长建议
          </h3>
          <p className="text-gray-200">{result.growthPath}</p>
        </div>

        {/* 小贴士 */}
        <div className="mt-4 p-4 bg-purple-500/20 rounded-xl">
          <p className="text-purple-200 text-sm">{result.tip}</p>
        </div>

        {/* 相似作家 */}
        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            你的写作风格与 <span className="text-white font-bold">{result.personality.famousWriter}</span> 相似
          </p>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setShowShare(true)}
          className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <span>📤</span> 分享我的写作人格
        </button>
        <Link
          href="/chat-diary"
          className="flex-1 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
        >
          <span>✍️</span> 开始写日记
        </Link>
      </div>

      {/* 分享提示 */}
      {showShare && (
        <div className="mt-4 p-4 bg-white/10 rounded-xl text-center">
          <p className="text-gray-300 mb-2">截图分享你的写作人格！</p>
          <p className="text-sm text-gray-500">告诉朋友：我是「{result.personality.name}」</p>
        </div>
      )}

      {/* 所有类型 */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-white mb-4 text-center">其他写作人格</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {PERSONALITY_TYPES.filter(t => t.id !== result.personality.id).map((type) => (
            <div
              key={type.id}
              className="bg-white/5 border border-white/10 rounded-xl p-3 text-center"
            >
              <div className="text-2xl mb-1">{type.emoji}</div>
              <div className="text-xs text-gray-400">{type.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function WritingPersonalityPage() {
  const [stage, setStage] = useState<"intro" | "questions" | "analyzing" | "result">("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<TestResult | null>(null);

  // 问题列表
  const questions = [
    {
      question: "当你打开日记本时，最想写的是什么？",
      options: [
        { text: "今天发生的事情和感受", value: "emotion" },
        { text: "对某个话题的深入思考", value: "thinking" },
        { text: "今天的计划和完成情况", value: "goal" },
        { text: "突然冒出来的有趣想法", value: "creative" }
      ]
    },
    {
      question: "你更倾向于在什么时候写日记？",
      options: [
        { text: "睡前，整理一天的心情", value: "emotion" },
        { text: "早起，规划新的一天", value: "goal" },
        { text: "有灵感的时候，随时记录", value: "creative" },
        { text: "空闲时，深度反思", value: "thinking" }
      ]
    },
    {
      question: "你希望日记能带给你什么？",
      options: [
        { text: "情感的宣泄和记录", value: "emotion" },
        { text: "思维的梳理和提升", value: "thinking" },
        { text: "成长的追踪和见证", value: "goal" },
        { text: "创意的积累和灵感", value: "creative" }
      ]
    },
    {
      question: "你觉得写日记最大的价值是？",
      options: [
        { text: "更好地了解自己", value: "thinking" },
        { text: "记录珍贵的回忆", value: "emotion" },
        { text: "督促自己不断进步", value: "goal" },
        { text: "激发新的想法和灵感", value: "creative" }
      ]
    },
    {
      question: "你更喜欢什么样的写作风格？",
      options: [
        { text: "细腻感性，富有诗意", value: "emotion" },
        { text: "简洁有力，逻辑清晰", value: "thinking" },
        { text: "活泼生动，充满想象", value: "creative" },
        { text: "目标导向，实用性强", value: "goal" }
      ]
    }
  ];

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // 开始分析
      setStage("analyzing");
      setTimeout(() => {
        setResult(generateTestResult());
        setStage("result");
      }, 2000);
    }
  };

  const startTest = () => {
    setStage("questions");
    setCurrentQuestion(0);
    setAnswers([]);
  };

  const resetTest = () => {
    setStage("intro");
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 头部导航 */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-3xl hover:scale-110 transition-transform">
            🦞
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/insights"
              className="px-4 py-2 bg-white/10 text-white rounded-xl text-sm hover:bg-white/20 transition-colors"
            >
              📊 写作洞察
            </Link>
            <Link
              href="/chat-diary"
              className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm hover:bg-purple-500 transition-colors"
            >
              ✍️ 写日记
            </Link>
          </div>
        </div>

        {/* 内容区 */}
        <div className="flex flex-col items-center">
          {/* 介绍页 */}
          {stage === "intro" && (
            <div className="text-center max-w-lg">
              <div className="text-8xl mb-6">🧠</div>
              <h1 className="text-4xl font-bold text-white mb-4">
                发现你的写作人格
              </h1>
              <p className="text-gray-300 mb-6 leading-relaxed">
                通过分析你的写作风格和习惯，揭示你独特的写作人格类型。
                了解你的优势，获得专属的成长建议。
              </p>
              
              <div className="grid grid-cols-3 gap-3 mb-8">
                {PERSONALITY_TYPES.slice(0, 6).map((type) => (
                  <div key={type.id} className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-2xl mb-1">{type.emoji}</div>
                    <div className="text-xs text-gray-400">{type.name}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={startTest}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/30"
              >
                开始测试 (约2分钟)
              </button>

              <p className="mt-4 text-sm text-gray-500">
                共 6 种人格类型，测完可分享
              </p>
            </div>
          )}

          {/* 问题页 */}
          {stage === "questions" && (
            <QuestionCard
              question={questions[currentQuestion].question}
              options={questions[currentQuestion].options}
              onAnswer={handleAnswer}
              currentIndex={currentQuestion}
              total={questions.length}
            />
          )}

          {/* 分析中 */}
          {stage === "analyzing" && (
            <div className="text-center">
              <div className="text-6xl mb-6 animate-bounce">🔮</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                正在分析你的写作人格...
              </h2>
              <div className="flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 结果页 */}
          {stage === "result" && result && (
            <div className="w-full flex flex-col items-center">
              <ResultCard result={result} />
              
              <button
                onClick={resetTest}
                className="mt-8 text-gray-400 hover:text-white transition-colors"
              >
                重新测试
              </button>
            </div>
          )}
        </div>

        {/* 底部推荐 */}
        {stage === "intro" && (
          <div className="mt-16">
            <h3 className="text-lg font-bold text-white mb-4 text-center">相关功能</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                href="/insights"
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-purple-500/50 transition-all group"
              >
                <div className="text-2xl mb-2">📊</div>
                <div className="font-medium text-white group-hover:text-purple-300">写作洞察</div>
                <div className="text-sm text-gray-500">数据分析你的写作习惯</div>
              </Link>
              <Link
                href="/diary-templates"
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-purple-500/50 transition-all group"
              >
                <div className="text-2xl mb-2">📝</div>
                <div className="font-medium text-white group-hover:text-purple-300">日记模板</div>
                <div className="text-sm text-gray-500">多种模板助力写作</div>
              </Link>
              <Link
                href="/challenges"
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-purple-500/50 transition-all group"
              >
                <div className="text-2xl mb-2">🏆</div>
                <div className="font-medium text-white group-hover:text-purple-300">写作挑战</div>
                <div className="text-sm text-gray-500">持续提升写作能力</div>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-6">
        <div className="max-w-4xl mx-auto px-6 text-center text-sm text-gray-500">
          <p>🦞 Claw Diary · 发现更好的自己</p>
        </div>
      </footer>
    </div>
  );
}