"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 写作风格类型
interface WritingStyle {
  emotional: number; // 0-100 情感浓度
  analytical: number; // 0-100 理性分析
  creative: number; // 0-100 创意程度
  concise: number; // 0-100 简洁度
}

// 用户/伙伴类型
interface Buddy {
  id: string;
  name: string;
  avatar: string;
  style: WritingStyle;
  tags: string[];
  streak: number; // 连续写作天数
  totalDiaries: number;
  matchScore: number;
  intro: string;
  writingSample: string;
  lookingFor: string[];
}

// 模拟的写作风格分析结果
const styleAnalysis: WritingStyle = {
  emotional: 72,
  analytical: 45,
  creative: 68,
  concise: 38,
};

// 模拟的潜在伙伴数据
const potentialBuddies: Buddy[] = [
  {
    id: "buddy-1",
    name: "星光写手",
    avatar: "🌟",
    style: { emotional: 75, analytical: 40, creative: 70, concise: 42 },
    tags: ["情感", "诗歌", "夜晚", "反思"],
    streak: 42,
    totalDiaries: 156,
    matchScore: 92,
    intro: "喜欢在深夜写诗，记录内心的细微波动",
    writingSample: "今夜的星光很淡，像那些想说却没说出口的话...",
    lookingFor: ["互相点评", "写作打卡", "情感共鸣"],
  },
  {
    id: "buddy-2",
    name: "晨间思考者",
    avatar: "🌅",
    style: { emotional: 55, analytical: 78, creative: 45, concise: 65 },
    tags: ["思考", "晨间", "成长", "复盘"],
    streak: 89,
    totalDiaries: 312,
    matchScore: 85,
    intro: "每天早上5点起床写日记，相信反思的力量",
    writingSample: "今天的关键发现是：成功不是终点，失败也不是终结...",
    lookingFor: ["共读打卡", "目标追踪", "成长伙伴"],
  },
  {
    id: "buddy-3",
    name: "故事猎人",
    avatar: "📖",
    style: { emotional: 68, analytical: 35, creative: 92, concise: 25 },
    tags: ["故事", "创意", "观察", "生活"],
    streak: 23,
    totalDiaries: 89,
    matchScore: 88,
    intro: "把日常琐事写成故事，每个人都是自己人生的主角",
    writingSample: "街角卖花的老奶奶今天换了朵花，那是一朵向日葵...",
    lookingFor: ["故事交换", "创意挑战", "写作游戏"],
  },
  {
    id: "buddy-4",
    name: "感恩小记",
    avatar: "🌸",
    style: { emotional: 85, analytical: 30, creative: 55, concise: 70 },
    tags: ["感恩", "正能量", "小确幸", "治愈"],
    streak: 156,
    totalDiaries: 423,
    matchScore: 95,
    intro: "每天记录三件感恩的小事，发现生活处处是美好",
    writingSample: "今天感恩的三件事：晨光、热咖啡、陌生人微笑...",
    lookingFor: ["感恩打卡", "正能量分享", "互相鼓励"],
  },
  {
    id: "buddy-5",
    name: "极简记录者",
    avatar: "✨",
    style: { emotional: 40, analytical: 65, creative: 35, concise: 95 },
    tags: ["极简", "效率", "日志", "清单"],
    streak: 67,
    totalDiaries: 201,
    matchScore: 72,
    intro: "用最少的文字记录最有价值的事，效率至上",
    writingSample: "今日完成：1.项目启动会 2.健身45分钟 3.读完一章书",
    lookingFor: ["效率挑战", "清单对比", "习惯追踪"],
  },
];

// 匹配计算函数
function calculateMatchScore(userStyle: WritingStyle, buddyStyle: WritingStyle): number {
  // 风格相似度计算（越相似分数越高）
  const emotionalDiff = Math.abs(userStyle.emotional - buddyStyle.emotional);
  const analyticalDiff = Math.abs(userStyle.analytical - buddyStyle.analytical);
  const creativeDiff = Math.abs(userStyle.creative - buddyStyle.creative);
  const conciseDiff = Math.abs(userStyle.concise - buddyStyle.concise);
  
  // 计算平均差异
  const avgDiff = (emotionalDiff + analyticalDiff + creativeDiff + conciseDiff) / 4;
  
  // 转换为匹配分数（差异越小分数越高）
  return Math.round(100 - avgDiff);
}

// 获取风格标签
function getStyleLabel(style: WritingStyle): string {
  const labels: string[] = [];
  
  if (style.emotional > 70) labels.push("感性派");
  else if (style.emotional < 40) labels.push("理性派");
  
  if (style.creative > 70) labels.push("创意型");
  else if (style.creative < 40) labels.push("务实型");
  
  if (style.concise > 70) labels.push("简洁风");
  else if (style.concise < 40) labels.push("详尽风");
  
  return labels.join(" · ") || "平衡型";
}

// 匹配度颜色
function getMatchColor(score: number): string {
  if (score >= 90) return "text-green-600 bg-green-100";
  if (score >= 80) return "text-blue-600 bg-blue-100";
  if (score >= 70) return "text-yellow-600 bg-yellow-100";
  return "text-gray-600 bg-gray-100";
}

export default function WritingBuddyPage() {
  const [step, setStep] = useState<"analyze" | "matching" | "result" | "connected">("analyze");
  const [myStyle, setMyStyle] = useState<WritingStyle | null>(null);
  const [matchedBuddies, setMatchedBuddies] = useState<Buddy[]>([]);
  const [selectedBuddy, setSelectedBuddy] = useState<Buddy | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string }[]>([]);

  // 分析写作风格
  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // 模拟分析过程
    setTimeout(() => {
      const analyzedStyle: WritingStyle = {
        emotional: Math.floor(Math.random() * 40) + 50,
        analytical: Math.floor(Math.random() * 40) + 30,
        creative: Math.floor(Math.random() * 40) + 40,
        concise: Math.floor(Math.random() * 40) + 30,
      };
      setMyStyle(analyzedStyle);
      setIsAnalyzing(false);
      setStep("matching");
      
      // 模拟匹配过程
      setTimeout(() => {
        const matched = potentialBuddies
          .map((buddy) => ({
            ...buddy,
            matchScore: calculateMatchScore(analyzedStyle, buddy.style),
          }))
          .sort((a, b) => b.matchScore - a.matchScore);
        setMatchedBuddies(matched);
        setStep("result");
      }, 1500);
    }, 2000);
  };

  // 选择伙伴
  const handleSelectBuddy = (buddy: Buddy) => {
    setSelectedBuddy(buddy);
    setChatMessages([
      {
        sender: buddy.name,
        text: `你好！我是${buddy.name} ${buddy.avatar} 很高兴认识你！看了你的写作风格，我觉得我们很合拍呢～`,
      },
    ]);
    setStep("connected");
  };

  // 发送消息
  const handleSendMessage = (text: string) => {
    setChatMessages((prev) => [
      ...prev,
      { sender: "我", text },
    ]);
    
    // 模拟伙伴回复
    setTimeout(() => {
      const responses = [
        "你说得真好！我完全理解这种感受～",
        "哈哈，这个角度很有趣呢！",
        "嗯嗯，我也有类似的经历，要不要一起写个主题？",
        "你的写作风格真的很有特色！",
        "我们可以互相点评对方的日记，怎么样？",
      ];
      setChatMessages((prev) => [
        ...prev,
        { sender: selectedBuddy!.name, text: responses[Math.floor(Math.random() * responses.length)] },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 via-purple-50 to-fuchsia-50">
      {/* 装饰性背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-fuchsia-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-70 h-70 bg-purple-200/30 rounded-full blur-3xl" />
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
            写作伙伴匹配
          </h1>
          <p className="text-gray-500 max-w-md mx-auto">
            基于你的写作风格、情绪特征和兴趣标签，为你找到最合拍的写作伙伴
          </p>
        </div>

        {/* 步骤1：分析写作风格 */}
        {step === "analyze" && (
          <div className="max-w-lg mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-white/50 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                📊 分析你的写作风格
              </h2>
              <p className="text-gray-500 mb-6">
                我们会分析你最近的日记，从情感浓度、理性分析、创意程度、简洁度四个维度，
                找到与你最合拍的写作伙伴。
              </p>

              {/* 分析维度说明 */}
              <div className="space-y-3 mb-6">
                {[
                  { icon: "💫", label: "情感浓度", desc: "文字中情感表达的程度" },
                  { icon: "🧠", label: "理性分析", desc: "思考和分析的深度" },
                  { icon: "🎨", label: "创意程度", desc: "表达方式的新颖程度" },
                  { icon: "✂️", label: "简洁度", desc: "文字的精炼程度" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="font-medium text-gray-700">{item.label}</div>
                      <div className="text-sm text-gray-400">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    正在分析你的写作风格...
                  </span>
                ) : (
                  "开始匹配 ✨"
                )}
              </button>
            </div>

            {/* 功能说明 */}
            <div className="text-center text-sm text-gray-400">
              <p>💡 匹配基于你的最近30篇日记分析</p>
              <p className="mt-1">隐私保护：分析仅在本机进行</p>
            </div>
          </div>
        )}

        {/* 步骤2：匹配中 */}
        {step === "matching" && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 animate-bounce">🔮</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              正在寻找你的写作灵魂伴侣...
            </h2>
            <p className="text-gray-400">分析中，请稍候</p>
            <div className="mt-8 flex justify-center gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-violet-400 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* 步骤3：匹配结果 */}
        {step === "result" && myStyle && (
          <div>
            {/* 我的风格卡片 */}
            <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl p-6 text-white mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">你的写作风格</h2>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {getStyleLabel(myStyle)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "情感浓度", value: myStyle.emotional, color: "bg-pink-300" },
                  { label: "理性分析", value: myStyle.analytical, color: "bg-blue-300" },
                  { label: "创意程度", value: myStyle.creative, color: "bg-purple-300" },
                  { label: "简洁度", value: myStyle.concise, color: "bg-green-300" },
                ].map((item) => (
                  <div key={item.label} className="bg-white/10 rounded-xl p-3">
                    <div className="text-sm text-white/70 mb-1">{item.label}</div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                    <div className="text-right text-sm mt-1">{item.value}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 匹配结果 */}
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              🎯 为你推荐的写作伙伴
            </h3>
            <div className="space-y-4">
              {matchedBuddies.slice(0, 3).map((buddy, index) => (
                <div
                  key={buddy.id}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* 头像 */}
                    <div className="text-4xl">{buddy.avatar}</div>
                    
                    {/* 信息 */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-bold text-gray-800">{buddy.name}</h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchColor(
                            buddy.matchScore
                          )}`}
                        >
                          匹配度 {buddy.matchScore}%
                        </span>
                        {index === 0 && (
                          <span className="bg-amber-100 text-amber-600 px-2 py-1 rounded-full text-xs font-medium">
                            ⭐ 最佳匹配
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-3">{buddy.intro}</p>
                      
                      {/* 标签 */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {buddy.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* 统计 */}
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                        <span>🔥 连续写作 {buddy.streak} 天</span>
                        <span>📝 共 {buddy.totalDiaries} 篇日记</span>
                      </div>
                      
                      {/* 写作样本 */}
                      <div className="bg-gray-50 rounded-xl p-3 mb-4">
                        <p className="text-sm text-gray-500 italic">
                          "{buddy.writingSample}"
                        </p>
                      </div>
                      
                      {/* 寻找 */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-sm text-gray-400">正在寻找：</span>
                        {buddy.lookingFor.map((item) => (
                          <span
                            key={item}
                            className="px-2 py-1 bg-violet-50 text-violet-600 rounded-full text-xs"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => handleSelectBuddy(buddy)}
                        className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium py-3 rounded-xl hover:shadow-lg transition-all"
                      >
                        开始连接 💬
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* 重新匹配 */}
            <div className="text-center mt-6">
              <button
                onClick={() => setStep("analyze")}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                重新分析我的风格 →
              </button>
            </div>
          </div>
        )}

        {/* 步骤4：已连接 */}
        {step === "connected" && selectedBuddy && (
          <div className="max-w-2xl mx-auto">
            {/* 伙伴信息 */}
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl">{selectedBuddy.avatar}</div>
              <div>
                <h2 className="font-bold text-gray-800">{selectedBuddy.name}</h2>
                <p className="text-sm text-gray-400">
                  匹配度 {selectedBuddy.matchScore}% · {getStyleLabel(selectedBuddy.style)}
                </p>
              </div>
              <div className="ml-auto flex gap-2">
                <button className="px-4 py-2 bg-white/70 rounded-xl text-sm text-gray-600 hover:bg-white transition-colors">
                  📅 约定打卡
                </button>
                <button className="px-4 py-2 bg-white/70 rounded-xl text-sm text-gray-600 hover:bg-white transition-colors">
                  📝 共写主题
                </button>
              </div>
            </div>

            {/* 聊天区域 */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 mb-4">
              <div className="h-80 overflow-y-auto p-4 space-y-4">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === "我" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl p-3 ${
                        msg.sender === "我"
                          ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 输入区域 */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="说点什么..."
                className="flex-1 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/50 focus:outline-none focus:ring-2 focus:ring-violet-300"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    handleSendMessage(e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector("input");
                  if (input?.value.trim()) {
                    handleSendMessage(input.value);
                    input.value = "";
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                发送
              </button>
            </div>

            {/* 功能按钮 */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { icon: "📖", label: "交换日记", desc: "互相阅读" },
                { icon: "🎯", label: "写作挑战", desc: "一起挑战" },
                { icon: "💡", label: "灵感分享", desc: "互相启发" },
              ].map((item) => (
                <button
                  key={item.label}
                  className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/70 transition-colors"
                >
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="font-medium text-gray-700">{item.label}</div>
                  <div className="text-xs text-gray-400">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}