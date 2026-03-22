'use client';

import { useState } from 'react';
import Link from 'next/link';

// 场景配置
const SCENARIOS = [
  { id: 'life', name: '生活点滴', emoji: '🌟', prompt: '日常生活中的小确幸、感悟、发现' },
  { id: 'growth', name: '成长反思', emoji: '🌱', prompt: '个人成长、学习收获、突破挑战' },
  { id: 'emotion', name: '情绪探索', emoji: '💭', prompt: '内心感受、情绪波动、心理状态' },
  { id: 'work', name: '工作手记', emoji: '💼', prompt: '工作心得、职场见闻、项目进展' },
  { id: 'relationship', name: '人际交往', emoji: '🤝', prompt: '与家人朋友同事的互动故事' },
  { id: 'dream', name: '梦想规划', emoji: '🚀', prompt: '未来目标、人生愿景、行动计划' },
];

// 生成创意开头
const generateCreativeOpenings = (keyword: string, scenario: string): string[] => {
  const templates: Record<string, string[][]> = {
    life: [
      [
        `今天看到"${keyword}"，突然想起了很久以前的一件事...`,
        `关于${keyword}，我有一个有趣的小故事。`,
        `说起${keyword}，让我想起今天发生的一件小事。`,
      ],
      [
        `今天最让我印象深刻的，是和${keyword}有关的一瞬间。`,
        `如果把今天用一个词来概括，那就是"${keyword}"。`,
        `${keyword}，这个看似普通的词，今天对我有了新的意义。`,
      ],
    ],
    growth: [
      [
        `今天在学习${keyword}的过程中，我有了一个重要发现...`,
        `关于${keyword}，我终于想明白了一件事。`,
        `今天我对${keyword}有了全新的认识。`,
      ],
      [
        `回顾这段经历，${keyword}给了我很多启发。`,
        `我曾经对${keyword}感到困惑，但今天我找到了答案。`,
        `今天是一个转折点，关于${keyword}，我决定做出改变。`,
      ],
    ],
    emotion: [
      [
        `今天的心情，可以用"${keyword}"来形容。`,
        `当我想到${keyword}时，内心涌起一种复杂的感受...`,
        `关于${keyword}，我有很多情绪想要表达。`,
      ],
      [
        `${keyword}，这是我今天最深的感受。`,
        `今天经历了很多，但最让我触动的是和${keyword}有关的那个瞬间。`,
        `写下"${keyword}"这个词的时候，我的心跳似乎快了一拍。`,
      ],
    ],
    work: [
      [
        `今天工作中遇到的${keyword}问题，让我学到了新东西...`,
        `关于${keyword}，我在今天的会议上有了新的想法。`,
        `今天处理${keyword}相关的事务，让我对工作有了新的思考。`,
      ],
      [
        `工作日记：今天最关键的突破是关于${keyword}的。`,
        `回顾今天的工作，${keyword}是绕不开的主题。`,
        `今天在${keyword}这个项目上，我迈出了重要一步。`,
      ],
    ],
    relationship: [
      [
        `今天和${keyword}相关的对话，让我想了很多...`,
        `关于${keyword}，今天发生了一件让我感动的小事。`,
        `${keyword}，这个词让我想起了某个重要的人。`,
      ],
      [
        `今天与${keyword}有关的互动，让我重新审视了这段关系。`,
        `写下${keyword}时，我想起了今天的一段对话。`,
        `今天有人提到了${keyword}，那一刻我突然很想念某人。`,
      ],
    ],
    dream: [
      [
        `关于${keyword}，我终于下定决心要开始行动了。`,
        `今天我对"${keyword}"这个目标，有了更清晰的规划。`,
        `${keyword}，这是我想要达成的梦想之一。`,
      ],
      [
        `想到${keyword}，我的内心既兴奋又忐忑...`,
        `今天我向着${keyword}迈出了一小步，虽然微小但很珍贵。`,
        `写下${keyword}时，我看到了未来的某种可能。`,
      ],
    ],
  };

  const scenarioTemplates = templates[scenario] || templates.life;
  const allOpenings = scenarioTemplates.flat();
  
  // 随机返回3-4个不同的开头
  const shuffled = [...allOpenings].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
};

// 生成结构框架
const generateFrameworks = (keyword: string, scenario: string): { title: string; sections: string[] }[] => {
  const frameworks: Record<string, { title: string; sections: string[] }[]> = {
    life: [
      {
        title: '记叙式',
        sections: [
          `📸 引子：${keyword}的出现`,
          '📖 经过：事情的来龙去脉',
          '💡 感悟：这件事带给我的思考',
          '✨ 结尾：我学到/感受到的',
        ],
      },
      {
        title: '对比式',
        sections: [
          `💭 以前对"${keyword}"的看法`,
          '🔄 改变的契机是什么',
          '🎯 现在有了怎样的新认识',
          '📝 这对我的生活意味着什么',
        ],
      },
    ],
    growth: [
      {
        title: '复盘式',
        sections: [
          `🎯 关于${keyword}的目标是什么`,
          '⏳ 过程中遇到了什么困难',
          '🔧 我是如何解决/突破的',
          '📈 这教会了我什么',
        ],
      },
      {
        title: '反思式',
        sections: [
          `🔍 我对${keyword}的现状分析`,
          '🤔 为什么会这样？深层原因',
          '💪 我可以做什么改变',
          '🌟 期望的结果是什么',
        ],
      },
    ],
    emotion: [
      {
        title: '情绪流动式',
        sections: [
          `🌊 此刻关于${keyword}的情绪`,
          '🗺️ 这种情绪从何而来',
          '🌈 我如何与它共处',
          '🌱 它想告诉我什么',
        ],
      },
      {
        title: '对话式',
        sections: [
          `💬 如果${keyword}能说话，它会说什么`,
          '🪞 它照见了我内心怎样的角落',
          '🤝 我想对它说什么',
          '🕊️ 和解/释怀/接纳',
        ],
      },
    ],
    work: [
      {
        title: '问题解决式',
        sections: [
          `📋 关于${keyword}的背景和问题`,
          '🔍 分析：原因是什么',
          '💡 解决方案：我做了什么',
          '📊 结果和后续计划',
        ],
      },
      {
        title: '成长日志式',
        sections: [
          `📌 今天${keyword}相关的工作内容`,
          '⚡ 遇到的挑战和解决方式',
          '🎓 我学到的新技能/知识',
          '🚀 明天的行动计划',
        ],
      },
    ],
    relationship: [
      {
        title: '故事式',
        sections: [
          `👥 和${keyword}相关的人物`,
          '📖 今天发生了什么',
          '💭 我的感受和反应',
          '💕 这段关系对我的意义',
        ],
      },
      {
        title: '感恩式',
        sections: [
          `🙏 因为${keyword}，我想感谢...`,
          '✨ 具体发生了什么让我感动',
          '💫 这给我的生活带来了什么',
          '💌 我想对TA说的话',
        ],
      },
    ],
    dream: [
      {
        title: '愿景式',
        sections: [
          `🎯 我的${keyword}目标是什么`,
          '🗺️ 达成路径：分几步走',
          '⏰ 时间线：什么时候完成',
          '💪 我现在可以做的第一步',
        ],
      },
      {
        title: '行动式',
        sections: [
          `🔥 为什么${keyword}对我重要`,
          '🧱 实现它的关键要素',
          '🚧 现在的障碍是什么',
          '📅 本周行动计划',
        ],
      },
    ],
  };

  return frameworks[scenario] || frameworks.life;
};

// 生成灵感问题
const generateQuestions = (keyword: string, scenario: string): string[] => {
  const questions: Record<string, string[]> = {
    life: [
      `${keyword}让你想起了谁？为什么？`,
      `如果用一种颜色形容${keyword}，会是什么颜色？`,
      `关于${keyword}，你最早的记忆是什么？`,
      `如果把${keyword}比作一个季节，你觉得是哪个？`,
      `${keyword}对你来说意味着什么？`,
    ],
    growth: [
      `你是什么时候开始关注${keyword}的？`,
      `在${keyword}方面，你最大的进步是什么？`,
      `如果要在${keyword}上更进一步，你需要什么帮助？`,
      `关于${keyword}，你最自豪的时刻是什么？`,
      `${keyword}教会了你什么人生道理？`,
    ],
    emotion: [
      `当你想到${keyword}时，身体有什么感觉？`,
      `${keyword}让你联想到什么画面？`,
      `如果${keyword}是一种天气，会是什么样的？`,
      `谁最能理解你对${keyword}的感受？`,
      `关于${keyword}，你最想对谁倾诉？`,
    ],
    work: [
      `${keyword}对你的职业发展有什么影响？`,
      `在${keyword}方面，你有什么独特的方法？`,
      `关于${keyword}，你最近遇到的最大挑战是什么？`,
      `如果可以改变${keyword}的一点，你会改什么？`,
      `${keyword}上你欣赏的榜样是谁？`,
    ],
    relationship: [
      `${keyword}让你想起了哪段关系？`,
      `在${keyword}方面，你和谁配合得最好？`,
      `关于${keyword}，你最想改善哪段关系？`,
      `谁教会了你关于${keyword}的重要一课？`,
      `${keyword}在你的社交圈中扮演什么角色？`,
    ],
    dream: [
      `5年后，${keyword}会变成什么样？`,
      `实现${keyword}后，你的生活会有什么不同？`,
      `关于${keyword}，你最大的担忧是什么？`,
      `谁是你实现${keyword}路上的支持者？`,
      `如果失败了，你会怎么面对${keyword}？`,
    ],
  };

  const scenarioQuestions = questions[scenario] || questions.life;
  return scenarioQuestions.sort(() => Math.random() - 0.5).slice(0, 4);
};

export default function InspirationLabPage() {
  const [keyword, setKeyword] = useState('');
  const [selectedScenario, setSelectedScenario] = useState('life');
  const [openings, setOpenings] = useState<string[]>([]);
  const [frameworks, setFrameworks] = useState<{ title: string; sections: string[] }[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedOpening, setSelectedOpening] = useState<string | null>(null);
  const [savedInspirations, setSavedInspirations] = useState<string[]>([]);

  const handleGenerate = async () => {
    if (!keyword.trim()) return;
    
    setIsGenerating(true);
    
    // 模拟 AI 生成延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const generatedOpenings = generateCreativeOpenings(keyword, selectedScenario);
    const generatedFrameworks = generateFrameworks(keyword, selectedScenario);
    const generatedQuestions = generateQuestions(keyword, selectedScenario);
    
    setOpenings(generatedOpenings);
    setFrameworks(generatedFrameworks);
    setQuestions(generatedQuestions);
    setIsGenerating(false);
  };

  const handleSaveInspiration = (text: string) => {
    if (!savedInspirations.includes(text)) {
      setSavedInspirations([...savedInspirations, text]);
    }
  };

  const handleStartWriting = (opening: string) => {
    // 跳转到写作页面，带上开头
    const encodedOpening = encodeURIComponent(opening);
    window.location.href = `/write?starter=${encodedOpening}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -left-10 w-60 h-60 bg-rose-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-amber-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* 灵感光点 */}
        <div className="absolute top-20 left-1/4 w-2 h-2 bg-orange-400 rounded-full animate-ping" />
        <div className="absolute top-40 right-1/3 w-2 h-2 bg-rose-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-amber-400 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 py-8">
        {/* 头部 */}
        <div className="text-center mb-8">
          <Link href="/" className="text-orange-600 hover:text-orange-700 text-sm mb-4 inline-block">
            ← 返回首页
          </Link>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-rose-500 rounded-2xl shadow-lg mb-4">
            <span className="text-3xl">💡</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
            AI 灵感实验室
          </h1>
          <p className="text-gray-500 mt-2">输入一个关键词，让 AI 帮你开启创作灵感</p>
        </div>

        {/* 输入区域 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🎯 今天想写什么？
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="输入一个关键词，如：咖啡、雨、旅行..."
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
              />
              <button
                onClick={handleGenerate}
                disabled={!keyword.trim() || isGenerating}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    生成中
                  </span>
                ) : (
                  '✨ 灵感迸发'
                )}
              </button>
            </div>
          </div>

          {/* 场景选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              📂 选择写作场景
            </label>
            <div className="flex flex-wrap gap-2">
              {SCENARIOS.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario.id)}
                  className={`px-4 py-2 rounded-full border-2 transition-all ${
                    selectedScenario === scenario.id
                      ? 'border-orange-400 bg-orange-50 text-orange-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-1">{scenario.emoji}</span>
                  {scenario.name}
                </button>
              ))}
            </div>
            {selectedScenario && (
              <p className="text-sm text-gray-500 mt-2">
                💡 {SCENARIOS.find(s => s.id === selectedScenario)?.prompt}
              </p>
            )}
          </div>
        </div>

        {/* 生成结果 */}
        {openings.length > 0 && (
          <div className="space-y-6">
            {/* 创意开头 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">✍️</span>
                创意开头
                <span className="text-xs text-gray-400 font-normal">选择一个开始写作</span>
              </h2>
              <div className="space-y-3">
                {openings.map((opening, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      selectedOpening === opening
                        ? 'border-orange-400 bg-orange-50'
                        : 'border-gray-100 hover:border-orange-200 hover:bg-orange-50/50'
                    }`}
                    onClick={() => setSelectedOpening(opening)}
                  >
                    <p className="text-gray-700">{opening}</p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartWriting(opening);
                        }}
                        className="px-3 py-1 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-sm rounded-lg hover:shadow-md transition-all"
                      >
                        开始写作 →
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSaveInspiration(opening);
                        }}
                        className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-all"
                      >
                        {savedInspirations.includes(opening) ? '✓ 已收藏' : '♡ 收藏'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 结构框架 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">📐</span>
                结构框架
                <span className="text-xs text-gray-400 font-normal">帮你组织思路</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {frameworks.map((framework, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl border border-orange-100"
                  >
                    <h3 className="font-medium text-gray-800 mb-3">{framework.title}</h3>
                    <div className="space-y-2">
                      {framework.sections.map((section, sIndex) => (
                        <div
                          key={sIndex}
                          className="text-sm text-gray-600 py-2 border-b border-gray-100 last:border-0"
                        >
                          {section}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 灵感问题 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">❓</span>
                灵感问题
                <span className="text-xs text-gray-400 font-normal">引导你深入思考</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-3">
                {questions.map((question, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg text-gray-700 text-sm hover:bg-orange-50 hover:text-orange-700 transition-colors cursor-pointer"
                    onClick={() => {
                      setKeyword(question);
                      setTimeout(handleGenerate, 100);
                    }}
                  >
                    {question}
                  </div>
                ))}
              </div>
            </div>

            {/* 快捷操作 */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => {
                  setKeyword('');
                  setOpenings([]);
                  setFrameworks([]);
                  setQuestions([]);
                  setSelectedOpening(null);
                }}
                className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                🔄 重新开始
              </button>
              <Link
                href="/chat-diary"
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                💬 直接开始写日记
              </Link>
            </div>
          </div>
        )}

        {/* 收藏的灵感 */}
        {savedInspirations.length > 0 && (
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">💖</span>
              收藏的灵感 ({savedInspirations.length})
            </h2>
            <div className="space-y-2">
              {savedInspirations.map((inspiration, index) => (
                <div
                  key={index}
                  className="p-3 bg-orange-50 rounded-lg text-gray-700 text-sm flex justify-between items-center"
                >
                  <span>{inspiration}</span>
                  <button
                    onClick={() => handleStartWriting(inspiration)}
                    className="text-orange-600 hover:text-orange-700 text-sm"
                  >
                    写作 →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 热门关键词建议 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-3">不知道写什么？试试这些：</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['阳光', '咖啡', '周末', '朋友', '书', '梦想', '童年', '旅行'].map((word) => (
              <button
                key={word}
                onClick={() => {
                  setKeyword(word);
                  setTimeout(handleGenerate, 100);
                }}
                className="px-3 py-1 bg-white/60 text-gray-600 rounded-full text-sm hover:bg-orange-100 hover:text-orange-700 transition-colors"
              >
                #{word}
              </button>
            ))}
          </div>
        </div>

        {/* 底部 */}
        <footer className="mt-12 text-center text-gray-400 text-sm">
          <p>💡 灵感就在一念之间，抓住它</p>
        </footer>
      </main>
    </div>
  );
}