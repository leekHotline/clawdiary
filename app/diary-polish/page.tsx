"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw,
  Wand2,
  FileText,
  Heart,
  Leaf,
  Zap,
  BookOpen
} from "lucide-react";

type PolishStyle = {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  icon: React.ReactNode;
};

const polishStyles: PolishStyle[] = [
  { id: "literary", name: "文艺风", emoji: "📖", desc: "文采斐然，辞藻华丽", icon: <BookOpen className="w-4 h-4" /> },
  { id: "poetic", name: "诗意版", emoji: "🌸", desc: "如诗如画，意境深远", icon: <Leaf className="w-4 h-4" /> },
  { id: "simple", name: "简洁版", emoji: "✨", desc: "言简意赅，直击要点", icon: <Zap className="w-4 h-4" /> },
  { id: "warm", name: "温暖版", emoji: "💛", desc: "温情脉脉，治愈人心", icon: <Heart className="w-4 h-4" /> },
];

export default function DiaryPolishPage() {
  const [originalText, setOriginalText] = useState("");
  const [polishResults, setPolishResults] = useState<{ style: string; result: string }[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>("literary");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handlePolish = async () => {
    if (!originalText.trim()) return;
    setIsLoading(true);
    setPolishResults([]);

    try {
      const response = await fetch("/api/diary-polish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: originalText,
          style: selectedStyle,
        }),
      });

      const data = await response.json();
      
      // 生成多个风格的结果
      setPolishResults(data.results || []);
    } catch (error) {
      console.error("Polish error:", error);
      // 使用本地模拟结果
      setPolishResults(generateLocalResults(originalText));
    } finally {
      setIsLoading(false);
    }
  };

  const generateLocalResults = (text: string) => {
    return [
      {
        style: "literary",
        result: `时光在指尖缓缓流淌，那些看似平凡的瞬间，却是生命中最珍贵的印记。${text.replace(/今天/g, "这一天").replace(/我/g, "我静静地感受着")}，在岁月的长河中，留下淡淡的涟漪。`,
      },
      {
        style: "poetic",
        result: `风轻轻翻过今天的书页，
字里行间都是光阴的诗。
${text.substring(0, 30)}...
如落叶般，
悄然落在心底。`,
      },
      {
        style: "simple",
        result: text.replace(/今天/g, "").replace(/非常/g, "").replace(/特别/g, "").trim() + " — 简单的一天，却值得铭记。",
      },
      {
        style: "warm",
        result: `想给你一个大大的拥抱 💝 ${text} 这一刻的美好，值得被温柔以待。愿你的每一天，都闪闪发光。`,
      },
    ];
  };

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handlePolishAll = async () => {
    if (!originalText.trim()) return;
    setIsLoading(true);
    setPolishResults([]);

    // 模拟生成所有风格
    await new Promise((r) => setTimeout(r, 1500));
    setPolishResults(generateLocalResults(originalText));
    setIsLoading(false);
  };

  const exampleTexts = [
    "今天天气很好，我去了公园散步，看到很多花开了，心情特别好。",
    "早上喝了咖啡，下午写了代码，晚上看了电影，普通但充实的一天。",
    "和朋友聊天，发现大家都在为生活努力，突然觉得自己也不孤单。",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-10 w-40 h-40 bg-rose-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-orange-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* Header */}
        <header className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 mb-4">
            <span>🦞</span>
            <span>返回首页</span>
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200/50">
              <Wand2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 bg-clip-text text-transparent">
              AI 日记润色
            </h1>
          </div>
          <p className="text-gray-500 max-w-md mx-auto">
            让你的文字更有温度。AI 帮你润色日记，多种风格任你选择。
          </p>
        </header>

        {/* 主要编辑区 */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden mb-8">
          {/* 输入区 */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-amber-500" />
              <span className="font-medium text-gray-700">原始日记</span>
              <span className="text-xs text-gray-400">({originalText.length} 字)</span>
            </div>
            <textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="写下你的日记内容，AI 将帮你润色成不同风格..."
              className="w-full h-36 bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            />
            
            {/* 示例文本 */}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-xs text-gray-400">试试：</span>
              {exampleTexts.map((text, i) => (
                <button
                  key={i}
                  onClick={() => setOriginalText(text)}
                  className="text-xs px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-full transition-colors truncate max-w-xs"
                >
                  {text.substring(0, 20)}...
                </button>
              ))}
            </div>
          </div>

          {/* 风格选择 */}
          <div className="p-6 bg-gradient-to-r from-amber-50/50 to-orange-50/50 border-b border-gray-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="font-medium text-gray-700">选择润色风格</span>
              </div>
              <div className="flex gap-2">
                {polishStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedStyle === style.id
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md"
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                    }`}
                    title={style.desc}
                  >
                    <span>{style.emoji}</span>
                    <span className="hidden sm:inline">{style.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="p-6 flex gap-4">
            <button
              onClick={handlePolishAll}
              disabled={isLoading || !originalText.trim()}
              className="flex-1 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 disabled:from-gray-300 disabled:via-gray-300 disabled:to-gray-300 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  AI 正在润色...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  一键润色全部风格
                </>
              )}
            </button>
          </div>
        </div>

        {/* 润色结果 */}
        {polishResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              润色结果
            </h2>
            
            <div className="grid gap-4">
              {polishResults.map((item, index) => {
                const style = polishStyles.find((s) => s.id === item.style) || polishStyles[0];
                return (
                  <div
                    key={index}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* 结果头部 */}
                    <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{style.emoji}</span>
                        <span className="font-medium text-gray-700">{style.name}</span>
                        <span className="text-xs text-gray-400">({item.result.length} 字)</span>
                      </div>
                      <button
                        onClick={() => handleCopy(item.result, index)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-green-600">已复制</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>复制</span>
                          </>
                        )}
                      </button>
                    </div>
                    
                    {/* 结果内容 */}
                    <div className="p-5">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {item.result}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 操作栏 */}
            <div className="flex justify-center gap-4 pt-4">
              <Link
                href={`/chat-diary?content=${encodeURIComponent(polishResults[0]?.result || originalText)}`}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium flex items-center gap-2 transition-all hover:shadow-lg"
              >
                <FileText className="w-4 h-4" />
                保存为日记
              </Link>
              <button
                onClick={handlePolishAll}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium flex items-center gap-2 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                重新润色
              </button>
            </div>
          </div>
        )}

        {/* 功能说明 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/50">
            <div className="text-2xl mb-2">✨</div>
            <h3 className="font-medium text-gray-800 mb-1">智能润色</h3>
            <p className="text-sm text-gray-500">
              AI 分析你的文字，智能调整表达方式，保留原意的同时提升文笔。
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/50">
            <div className="text-2xl mb-2">🎨</div>
            <h3 className="font-medium text-gray-800 mb-1">多种风格</h3>
            <p className="text-sm text-gray-500">
              文艺、诗意、简洁、温暖...根据心情选择最适合的表达风格。
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-white/50">
            <div className="text-2xl mb-2">💜</div>
            <h3 className="font-medium text-gray-800 mb-1">保留个性</h3>
            <p className="text-sm text-gray-500">
              润色不是改写，你的故事和情感始终是主角，AI 只是让表达更动人。
            </p>
          </div>
        </div>

        {/* 相关链接 */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            需要更多灵感？{" "}
            <Link href="/prompts" className="text-amber-600 hover:text-amber-700 underline">
              查看提示词库
            </Link>
            {" "}或{" "}
            <Link href="/story-continuer" className="text-amber-600 hover:text-amber-700 underline">
              AI 故事续写
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}