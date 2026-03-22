"use client";

import { useState } from "react";
import Link from "next/link";

// AI 伙伴类型定义
interface DiaryBuddy {
  id: string;
  name: string;
  emoji: string;
  personality: string;
  style: string;
  greeting: string;
  tips: string[];
  color: string;
  bgGradient: string;
}

// 可选的 AI 伙伴列表
const buddies: DiaryBuddy[] = [
  {
    id: "sunshine",
    name: "小阳",
    emoji: "☀️",
    personality: "温暖阳光，总是充满正能量",
    style: "积极鼓励型",
    greeting: "你好呀！今天也是元气满满的一天！让我们一起记录今天的美好吧～ ✨",
    tips: [
      "试试用三个词形容今天的心情",
      "今天有什么让你微笑的事情吗？",
      "即使是小事，也值得被记录哦！"
    ],
    color: "text-amber-600",
    bgGradient: "from-amber-400 to-orange-500"
  },
  {
    id: "scholar",
    name: "墨墨",
    emoji: "📚",
    personality: "博学睿智，喜欢深度思考",
    style: "哲思引导型",
    greeting: "今日有何所思？每一个平凡的日子都藏着值得深思的瞬间。让我们开始今天的记录。",
    tips: [
      "今天学到了什么新东西？",
      "有什么想法值得深入探讨？",
      "记录一个让你停顿思考的时刻"
    ],
    color: "text-indigo-600",
    bgGradient: "from-indigo-400 to-purple-500"
  },
  {
    id: "adventurer",
    name: "小野",
    emoji: "🌟",
    personality: "冒险精神，充满好奇心",
    style: "探索发现型",
    greeting: "嘿！今天有什么新鲜事？让我们一起探索今天的小冒险！🌍",
    tips: [
      "今天尝试了什么新事物？",
      "有什么意想不到的发现？",
      "记录一次小小的冒险"
    ],
    color: "text-emerald-600",
    bgGradient: "from-emerald-400 to-teal-500"
  },
  {
    id: "dreamer",
    name: "云云",
    emoji: "🌙",
    personality: "温柔浪漫，喜欢幻想",
    style: "诗意感性型",
    greeting: "在这静谧的时刻，让我们一起捕捉今天闪烁的星光... ✨",
    tips: [
      "今天有什么让你感动的瞬间？",
      "用一句话写一首小诗",
      "记录一个美好的想象"
    ],
    color: "text-violet-600",
    bgGradient: "from-violet-400 to-purple-500"
  },
  {
    id: "cheerleader",
    name: "啦啦",
    emoji: "💪",
    personality: "活力四射，永远支持你",
    style: "热情激励型",
    greeting: "你做到了！你又来写日记了！超级棒！让我们把今天变成文字吧！🎉",
    tips: [
      "今天最让你骄傲的事是什么？",
      "给自己一个大大的赞！",
      "写下你的一个小成就"
    ],
    color: "text-rose-600",
    bgGradient: "from-rose-400 to-pink-500"
  },
  {
    id: "zen",
    name: "禅禅",
    emoji: "🧘",
    personality: "平和宁静，追求内心平衡",
    style: "正念冥想型",
    greeting: "让我们放慢呼吸，感受当下这一刻。今天，你的心在说什么？",
    tips: [
      "此刻，你的身体感觉如何？",
      "今天有什么情绪流过你的心？",
      "写下一个让你平静的时刻"
    ],
    color: "text-slate-600",
    bgGradient: "from-slate-400 to-gray-500"
  }
];

// 生成随机鼓励语
const encouragements = [
  "你的坚持真的很棒！",
  "每一篇日记都是珍贵的记忆。",
  "今天的你比昨天更进步了！",
  "写下就是胜利的开始！",
  "你的故事值得被记录。"
];

export default function DiaryBuddyPage() {
  const [selectedBuddy, setSelectedBuddy] = useState<DiaryBuddy | null>(null);
  const [currentTip, setCurrentTip] = useState(0);
  const [diaryContent, setDiaryContent] = useState("");
  const [isWriting, setIsWriting] = useState(false);
  const [buddyResponse, setBuddyResponse] = useState("");

  // 选择伙伴
  const handleSelectBuddy = (buddy: DiaryBuddy) => {
    setSelectedBuddy(buddy);
    setIsWriting(false);
    setDiaryContent("");
    setBuddyResponse("");
  };

  // 开始写作
  const handleStartWriting = () => {
    setIsWriting(true);
    setCurrentTip(Math.floor(Math.random() * selectedBuddy!.tips.length));
  };

  // 获取下一个提示
  const handleNextTip = () => {
    setCurrentTip((prev) => (prev + 1) % selectedBuddy!.tips.length);
  };

  // 提交日记并获取伙伴回复
  const handleSubmitDiary = () => {
    if (!diaryContent.trim()) return;
    
    // 模拟 AI 伙伴的回复
    const responses = [
      `哇，你今天经历了很多呢！${encouragements[Math.floor(Math.random() * encouragements.length)]} 明天继续加油！`,
      `读完你的日记，我能感受到你的用心。每一个字都很有力量！`,
      `谢谢你愿意和我分享这些。记住，${encouragements[Math.floor(Math.random() * encouragements.length)]}`,
      `今天的日记写得真好！你真的越来越擅长记录生活了～`
    ];
    setBuddyResponse(responses[Math.floor(Math.random() * responses.length)]);
  };

  // 重置选择
  const handleReset = () => {
    setSelectedBuddy(null);
    setIsWriting(false);
    setDiaryContent("");
    setBuddyResponse("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-indigo-50 to-purple-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-60 h-60 bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-60 h-60 bg-pink-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 py-12">
        {/* 返回按钮 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 transition-colors"
        >
          <span>←</span>
          <span>返回首页</span>
        </Link>

        {/* 标题区域 */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🤝</div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            AI 日记伙伴
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            选择一个陪伴你写日记的 AI 伙伴，让每天的记录更有趣、更有动力
          </p>
        </div>

        {/* 未选择伙伴时：展示伙伴选择 */}
        {!selectedBuddy && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buddies.map((buddy) => (
              <button
                key={buddy.id}
                onClick={() => handleSelectBuddy(buddy)}
                className={`group relative bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-lg hover:border-${buddy.id === 'sunshine' ? 'amber' : buddy.id === 'scholar' ? 'indigo' : buddy.id === 'adventurer' ? 'emerald' : buddy.id === 'dreamer' ? 'violet' : buddy.id === 'cheerleader' ? 'rose' : 'slate'}-200 transition-all text-left`}
              >
                {/* 伙伴图标 */}
                <div className="text-5xl mb-4">{buddy.emoji}</div>
                
                {/* 伙伴信息 */}
                <h3 className={`text-xl font-bold ${buddy.color} mb-1`}>
                  {buddy.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{buddy.personality}</p>
                
                {/* 风格标签 */}
                <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${buddy.bgGradient} text-white`}>
                  {buddy.style}
                </div>
                
                {/* hover 提示 */}
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-gray-700 font-medium">点击选择</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 已选择伙伴但未开始写作：展示伙伴介绍 */}
        {selectedBuddy && !isWriting && (
          <div className="max-w-lg mx-auto">
            <div className={`bg-gradient-to-br ${selectedBuddy.bgGradient} rounded-3xl p-8 text-white shadow-xl mb-6`}>
              <div className="text-6xl mb-4 text-center">{selectedBuddy.emoji}</div>
              <h2 className="text-2xl font-bold text-center mb-2">{selectedBuddy.name}</h2>
              <p className="text-white/90 text-center mb-4">{selectedBuddy.personality}</p>
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <p className="text-lg leading-relaxed">"{selectedBuddy.greeting}"</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleStartWriting}
                className={`flex-1 bg-gradient-to-r ${selectedBuddy.bgGradient} text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all`}
              >
                开始写日记 📝
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
              >
                换一个
              </button>
            </div>
          </div>
        )}

        {/* 正在写作 */}
        {selectedBuddy && isWriting && !buddyResponse && (
          <div className="max-w-2xl mx-auto">
            {/* 伙伴提示 */}
            <div className="flex items-start gap-4 mb-6">
              <div className="text-4xl">{selectedBuddy.emoji}</div>
              <div className="flex-1 bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-bold ${selectedBuddy.color}`}>{selectedBuddy.name}</span>
                  <span className="text-xs text-gray-400">给你的小建议</span>
                </div>
                <p className="text-gray-700">{selectedBuddy.tips[currentTip]}</p>
                <button
                  onClick={handleNextTip}
                  className="mt-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                >
                  换一个提示 →
                </button>
              </div>
            </div>

            {/* 写作区域 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 mb-6">
              <textarea
                value={diaryContent}
                onChange={(e) => setDiaryContent(e.target.value)}
                placeholder="写下今天的日记..."
                className="w-full h-64 bg-transparent border-none outline-none resize-none text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <button
                onClick={handleSubmitDiary}
                disabled={!diaryContent.trim()}
                className={`flex-1 bg-gradient-to-r ${selectedBuddy.bgGradient} text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                完成日记 ✓
              </button>
              <button
                onClick={() => setIsWriting(false)}
                className="px-6 py-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
              >
                返回
              </button>
            </div>

            {/* 字数统计 */}
            {diaryContent.length > 0 && (
              <div className="mt-4 text-center text-sm text-gray-400">
                已写 {diaryContent.length} 字
              </div>
            )}
          </div>
        )}

        {/* 伙伴回复 */}
        {selectedBuddy && isWriting && buddyResponse && (
          <div className="max-w-lg mx-auto text-center">
            {/* 伙伴回复 */}
            <div className={`bg-gradient-to-br ${selectedBuddy.bgGradient} rounded-3xl p-8 text-white shadow-xl mb-6`}>
              <div className="text-6xl mb-4">{selectedBuddy.emoji}</div>
              <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm mb-4">
                <p className="text-lg leading-relaxed">{buddyResponse}</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-white/80">
                <span>🎉</span>
                <span>今日日记完成！</span>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <Link
                href="/growth"
                className={`flex-1 bg-gradient-to-r ${selectedBuddy.bgGradient} text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all text-center`}
              >
                查看我的日记 📚
              </Link>
              <button
                onClick={handleReset}
                className="px-6 py-4 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
              >
                选择新伙伴
              </button>
            </div>
          </div>
        )}

        {/* 功能说明 */}
        {!selectedBuddy && (
          <div className="mt-16 text-center">
            <h2 className="text-lg font-bold text-gray-700 mb-4">💡 如何选择伙伴？</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/50 rounded-xl p-4">
                <div className="text-2xl mb-2">🎯</div>
                <p className="text-sm text-gray-600">根据你的性格选择最适合的伙伴</p>
              </div>
              <div className="bg-white/50 rounded-xl p-4">
                <div className="text-2xl mb-2">💬</div>
                <p className="text-sm text-gray-600">伙伴会给你写作提示和鼓励</p>
              </div>
              <div className="bg-white/50 rounded-xl p-4">
                <div className="text-2xl mb-2">🌟</div>
                <p className="text-sm text-gray-600">每天可以换不同伙伴，保持新鲜感</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}