"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// 风格维度
const STYLE_DIMENSIONS = [
  { id: "emotion", name: "情感倾向", emoji: "😊", desc: "文字中的情绪色彩" },
  { id: "formality", name: "正式程度", emoji: "🎩", desc: "语言的正式与随性" },
  { id: "creativity", name: "创意指数", emoji: "🎨", desc: "表达的独特性" },
  { id: "depth", name: "思考深度", emoji: "🧠", desc: "内容的深度与洞察" },
  { id: "warmth", name: "温暖指数", emoji: "☀️", desc: "文字传递的温度" },
  { id: "clarity", name: "清晰度", emoji: "💎", desc: "表达的清晰明了" },
];

// 示例文本
const SAMPLE_TEXTS = [
  {
    title: "感恩日记",
    content: `今天是一个特别美好的日子。早晨阳光透过窗帘洒进房间，让我感到无比温暖。

下午和朋友一起去了那家新开的咖啡馆，我们聊了很多，从工作到生活，从梦想到现实。她说的那句话让我印象深刻："有时候，我们不需要立刻找到答案，只需要继续前行。"

晚上回到家，我站在窗前看着城市的灯火，突然意识到：生活中的美好，往往就藏在这些平凡的瞬间里。感恩今天，感恩所有。`,
    tags: ["温暖", "感恩", "日常"],
  },
  {
    title: "工作反思",
    content: `本周的项目进展不如预期。分析原因：

1. 前期需求调研不够深入，导致中期频繁修改方向
2. 团队沟通效率有待提升，信息同步存在延迟
3. 个人时间管理需要优化，核心任务优先级要更明确

下周行动计划：
- 每日站会严格控制时间在15分钟内
- 周一完成需求文档的最终确认
- 设置番茄钟，提高专注度

失败不可怕，可怕的是不从失败中学习。这次经验值得记录和反思。`,
    tags: ["工作", "反思", "成长"],
  },
  {
    title: "诗意随想",
    content: `雨落。
窗棂轻响。
思绪如水，漫过时光的堤岸。

我站在这里，
看云卷云舒，
看故事在雨中缓缓展开。
有些人来了，又走了，
像雨滴落入泥土，
消失了，却滋润了什么。

也许，所有相遇都是久别重逢。
也许，所有告别都是为了更好的再见。

此刻，我只愿：
心静如水，
笔走如云。`,
    tags: ["诗意", "随想", "情绪"],
  },
];

// 风格类型
const STYLE_TYPES = [
  {
    id: "warm-narrator",
    name: "温暖讲述者",
    emoji: "🌅",
    desc: "善于用温暖的笔触记录生活，文字充满人情味",
    traits: ["情感丰富", "细节生动", "善于共情"],
    suggestions: ["尝试增加更多场景描写", "可以用更多比喻增强感染力"],
  },
  {
    id: "rational-analyst",
    name: "理性分析师",
    emoji: "📊",
    desc: "逻辑清晰，善于结构化思考和分析问题",
    traits: ["条理分明", "善于总结", "注重实用"],
    suggestions: ["可以适当加入情感表达", "试试用故事来传递观点"],
  },
  {
    id: "poetic-dreamer",
    name: "诗意梦想家",
    emoji: "🌙",
    desc: "文字如诗如画，善于用意象和比喻表达内心",
    traits: ["意象丰富", "情感细腻", "意境深远"],
    suggestions: ["注意保持内容的可理解性", "可以尝试叙事性更强的风格"],
  },
  {
    id: "humorous-observer",
    name: "幽默观察者",
    emoji: "😄",
    desc: "善于发现生活中的趣事，文字轻松有趣",
    traits: ["幽默风趣", "视角独特", "轻松活泼"],
    suggestions: ["可以增加一些深度思考", "试试在不同场景运用幽默"],
  },
  {
    id: "deep-thinker",
    name: "深度思考者",
    emoji: "🧘",
    desc: "善于深度反思，文字充满哲思和洞察",
    traits: ["洞察深刻", "反思性强", "思想厚重"],
    suggestions: ["可以尝试更轻松的表达方式", "加入一些具体案例会更生动"],
  },
];

// 简单的文本分析函数
function analyzeText(text: string) {
  const wordCount = text.length;
  const sentences = text.split(/[。！？\n]/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.length > 0 ? wordCount / sentences.length : 0;
  
  // 情感词汇检测
  const positiveWords = ["美好", "温暖", "感恩", "快乐", "喜欢", "爱", "希望", "幸福", "精彩", "棒"];
  const negativeWords = ["难过", "悲伤", "焦虑", "担心", "疲惫", "压力", "困难", "问题", "失败"];
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  positiveWords.forEach(w => {
    if (text.includes(w)) positiveCount++;
  });
  negativeWords.forEach(w => {
    if (text.includes(w)) negativeCount++;
  });
  
  // 标点符号分析
  const questionMarks = (text.match(/[？?]/g) || []).length;
  const exclamationMarks = (text.match(/[！!]/g) || []).length;
  const commas = (text.match(/[，,]/g) || []).length;
  
  // 判断风格
  const emotion = positiveCount > negativeCount ? 70 + positiveCount * 3 : 30 + (negativeCount > 0 ? 0 : 50);
  const formality = avgSentenceLength > 30 ? 70 : 40;
  const creativity = questionMarks > 2 || text.includes("。") && text.includes("\n\n") ? 75 : 50;
  const depth = wordCount > 200 && questionMarks > 1 ? 80 : 50;
  const warmth = positiveCount > 2 ? 80 : 50;
  const clarity = avgSentenceLength < 40 ? 80 : 50;
  
  // 判断风格类型
  let styleType = STYLE_TYPES[0]; // 默认温暖讲述者
  
  if (text.includes("1.") || text.includes("•") || text.includes("-")) {
    styleType = STYLE_TYPES[1]; // 理性分析师
  } else if (text.includes("\n\n") && avgSentenceLength < 15) {
    styleType = STYLE_TYPES[2]; // 诗意梦想家
  } else if (questionMarks > 3) {
    styleType = STYLE_TYPES[4]; // 深度思考者
  }
  
  return {
    dimensions: {
      emotion: Math.min(100, emotion),
      formality: Math.min(100, formality),
      creativity: Math.min(100, creativity),
      depth: Math.min(100, depth),
      warmth: Math.min(100, warmth),
      clarity: Math.min(100, clarity),
    },
    styleType,
    stats: {
      wordCount,
      sentenceCount: sentences.length,
      avgSentenceLength: Math.round(avgSentenceLength),
      positiveScore: positiveCount,
      negativeScore: negativeCount,
    },
    keywords: extractKeywords(text),
  };
}

// 提取关键词
function extractKeywords(text: string): string[] {
  const keywords: string[] = [];
  const patterns = [
    /美好|温暖|感恩|快乐|幸福/g,
    /工作|项目|团队|目标/g,
    /生活|日常|今天|每天/g,
    /思考|反思|学习|成长/g,
    /朋友|家人|关系|爱/g,
  ];
  
  patterns.forEach(p => {
    const matches = text.match(p);
    if (matches) {
      matches.forEach(m => {
        if (!keywords.includes(m)) keywords.push(m);
      });
    }
  });
  
  return keywords.slice(0, 8);
}

// 进度条组件
function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`absolute inset-y-0 left-0 ${color} rounded-full transition-all duration-1000`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

// 雷达图组件 (简化版)
function RadarChart({ data }: { data: Record<string, number> }) {
  const size = 200;
  const center = size / 2;
  const maxRadius = 80;
  
  const dimensions = Object.keys(data);
  const angleStep = (2 * Math.PI) / dimensions.length;
  
  const points = dimensions.map((key, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const value = data[key] / 100;
    const x = center + maxRadius * value * Math.cos(angle);
    const y = center + maxRadius * value * Math.sin(angle);
    return { x, y };
  });
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  
  // 背景六边形
  const bgPoints = dimensions.map((_, i) => {
    const angle = i * angleStep - Math.PI / 2;
    return {
      x: center + maxRadius * Math.cos(angle),
      y: center + maxRadius * Math.sin(angle),
    };
  });
  const bgPath = bgPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  
  return (
    <svg width={size} height={size} className="mx-auto">
      {/* 背景网格 */}
      {[0.25, 0.5, 0.75, 1].map((scale, i) => (
        <polygon
          key={i}
          points={dimensions.map((_, j) => {
            const angle = j * angleStep - Math.PI / 2;
            const x = center + maxRadius * scale * Math.cos(angle);
            const y = center + maxRadius * scale * Math.sin(angle);
            return `${x},${y}`;
          }).join(' ')}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      ))}
      
      {/* 数据区域 */}
      <path
        d={pathD}
        fill="rgba(139, 92, 246, 0.2)"
        stroke="rgb(139, 92, 246)"
        strokeWidth="2"
      />
      
      {/* 标签 */}
      {dimensions.map((key, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const labelRadius = maxRadius + 25;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        const dim = STYLE_DIMENSIONS.find(d => d.id === key);
        return (
          <text
            key={key}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-gray-500"
          >
            {dim?.emoji}
          </text>
        );
      })}
    </svg>
  );
}

export default function StyleAnalyzerPage() {
  const [inputText, setInputText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof analyzeText> | null>(null);
  const [activeTab, setActiveTab] = useState<"input" | "sample">("input");

  const handleAnalyze = () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    
    // 模拟分析延迟
    setTimeout(() => {
      const analysis = analyzeText(inputText);
      setResult(analysis);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleSampleSelect = (sample: typeof SAMPLE_TEXTS[0]) => {
    setInputText(sample.content);
    setActiveTab("input");
  };

  const handleReset = () => {
    setInputText("");
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-violet-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-fuchsia-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-10">
          <Link href="/" className="inline-block text-sm text-purple-600 hover:text-purple-700 mb-4">
            ← 返回首页
          </Link>
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-5xl">🎭</span>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              写作风格分析器
            </h1>
          </div>
          <p className="text-gray-500 max-w-md mx-auto">
            AI 分析你的写作风格，发现你的独特表达方式
          </p>
        </header>

        {!result ? (
          /* 输入区域 */
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 overflow-hidden">
            {/* Tab 切换 */}
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => setActiveTab("input")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "input"
                    ? "text-purple-600 bg-purple-50 border-b-2 border-purple-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                ✍️ 输入文字
              </button>
              <button
                onClick={() => setActiveTab("sample")}
                className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === "sample"
                    ? "text-purple-600 bg-purple-50 border-b-2 border-purple-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                📝 示例文本
              </button>
            </div>

            {activeTab === "input" ? (
              <div className="p-6">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="在此粘贴你的日记或文章，AI 将分析你的写作风格...

支持分析：
• 情感倾向与情绪表达
• 语言风格与表达习惯
• 思考深度与洞察力
• 内容主题偏好"
                  className="w-full h-64 bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-700 placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none"
                />
                
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-400">
                    {inputText.length} 字
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={!inputText.trim() || isAnalyzing}
                    className="px-8 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isAnalyzing ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        分析中...
                      </span>
                    ) : (
                      "✨ 开始分析"
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <p className="text-gray-500 mb-4">选择一个示例文本，体验风格分析功能：</p>
                <div className="space-y-3">
                  {SAMPLE_TEXTS.map((sample, i) => (
                    <button
                      key={i}
                      onClick={() => handleSampleSelect(sample)}
                      className="w-full text-left bg-gray-50 hover:bg-purple-50 rounded-xl p-4 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-800 group-hover:text-purple-600">
                            {sample.title}
                          </div>
                          <div className="flex gap-2 mt-1">
                            {sample.tags.map(tag => (
                              <span key={tag} className="text-xs px-2 py-0.5 bg-gray-100 group-hover:bg-purple-100 rounded text-gray-500">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="text-gray-300 group-hover:text-purple-400">→</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* 分析结果 */
          <div className="space-y-6">
            {/* 风格类型卡片 */}
            <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-3xl p-6 text-white shadow-lg">
              <div className="flex items-start gap-4">
                <div className="text-5xl">{result.styleType.emoji}</div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">你的风格：{result.styleType.name}</h2>
                  <p className="text-white/90">{result.styleType.desc}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {result.styleType.traits.map(trait => (
                      <span key={trait} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 维度分析 */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* 雷达图 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📊</span>
                  <span>风格雷达</span>
                </h3>
                <RadarChart data={result.dimensions} />
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  {STYLE_DIMENSIONS.slice(0, 6).map(dim => (
                    <div key={dim.id} className="text-xs">
                      <span className="text-gray-400">{dim.emoji}</span>
                      <span className="text-gray-500 ml-1">{dim.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 详细维度 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📈</span>
                  <span>详细分析</span>
                </h3>
                <div className="space-y-4">
                  {STYLE_DIMENSIONS.map(dim => (
                    <div key={dim.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                          <span>{dim.emoji}</span>
                          <span>{dim.name}</span>
                        </span>
                        <span className="text-sm font-medium text-purple-600">
                          {result.dimensions[dim.id as keyof typeof result.dimensions]}%
                        </span>
                      </div>
                      <ProgressBar
                        value={result.dimensions[dim.id as keyof typeof result.dimensions]}
                        color="bg-gradient-to-r from-violet-500 to-fuchsia-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "字数", value: result.stats.wordCount, emoji: "📝" },
                { label: "句子数", value: result.stats.sentenceCount, emoji: "📖" },
                { label: "平均句长", value: result.stats.avgSentenceLength, emoji: "📏" },
                { label: "关键词", value: result.keywords.length, emoji: "🏷️" },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 text-center shadow-sm border border-white/50"
                >
                  <div className="text-2xl mb-1">{stat.emoji}</div>
                  <div className="text-xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* 关键词 */}
            {result.keywords.length > 0 && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🏷️</span>
                  <span>关键词云</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((keyword, i) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-gradient-to-r from-violet-100 to-fuchsia-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 写作建议 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>💡</span>
                <span>成长建议</span>
              </h3>
              <div className="space-y-3">
                {result.styleType.suggestions.map((suggestion, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-xl"
                  >
                    <span className="text-purple-500 text-lg">✨</span>
                    <span className="text-gray-700">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <button
                onClick={handleReset}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                🔄 重新分析
              </button>
              <Link
                href="/write"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity text-center"
              >
                ✍️ 去写日记
              </Link>
            </div>
          </div>
        )}

        {/* 底部链接 */}
        <div className="mt-12 text-center space-y-2">
          <p className="text-gray-400 text-sm">更多写作工具</p>
          <div className="flex justify-center gap-4 text-sm">
            <Link href="/writing-assistant" className="text-purple-600 hover:text-purple-700">
              🤖 写作助手
            </Link>
            <Link href="/writing-stats" className="text-pink-600 hover:text-pink-700">
              📊 写作统计
            </Link>
            <Link href="/inspiration-lab" className="text-violet-600 hover:text-violet-700">
              🎨 灵感实验室
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}