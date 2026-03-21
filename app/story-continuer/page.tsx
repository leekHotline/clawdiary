"use client";

import { useState } from "react";
import { Sparkles, BookOpen, RefreshCw, Copy, ChevronRight } from "lucide-react";

export default function StoryContinuerPage() {
  const [userStory, setUserStory] = useState("");
  const [aiContinuation, setAiContinuation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [storyStyle, setStoryStyle] = useState("diary");
  const [storyLength, setStoryLength] = useState("medium");

  const storyStyles = [
    { id: "diary", label: "日记风格", emoji: "📔", desc: "真实、细腻、内省" },
    { id: "fiction", label: "小说风格", emoji: "📖", desc: "戏剧性、画面感强" },
    { id: "poetic", label: "散文诗", emoji: "✨", desc: "诗意、意象丰富" },
    { id: "humor", label: "轻松幽默", emoji: "😄", desc: "有趣、轻松" },
  ];

  const lengthOptions = [
    { id: "short", label: "简短", words: "50-100字" },
    { id: "medium", label: "中等", words: "150-200字" },
    { id: "long", label: "详细", words: "300-400字" },
  ];

  const handleContinue = async () => {
    if (!userStory.trim()) return;
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/story-continuer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          story: userStory,
          style: storyStyle,
          length: storyLength,
        }),
      });
      
      const data = await response.json();
      setAiContinuation(data.continuation);
    } catch (error) {
      console.error("Error:", error);
      setAiContinuation("抱歉，AI 暂时无法续写。请稍后再试。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    handleContinue();
  };

  const handleCopy = () => {
    const fullStory = userStory + "\n\n" + aiContinuation;
    navigator.clipboard.writeText(fullStory);
  };

  const exampleStarters = [
    "那天的阳光格外刺眼，我没想到会遇见她...",
    "如果你问我人生最重要的决定是什么，我会说是那一天...",
    "电话响了，是一个陌生的号码，我犹豫了一下还是接了...",
    "窗外的雨声让我想起了很多年前的一个夏天...",
    "我从来没有告诉任何人这个秘密，直到今天...",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* 星空背景效果 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="stars" />
        <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full animate-pulse" />
        <div className="absolute top-40 right-40 w-1 h-1 bg-white rounded-full animate-pulse delay-100" />
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-200" />
        <div className="absolute bottom-40 right-1/4 w-2 h-2 bg-purple-300 rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-60 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse delay-400" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 pt-8 pb-16">
        {/* 标题 */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-3">
            <span className="text-5xl">📝</span>
            <h1 className="text-4xl font-bold text-white">
              AI 故事续写器
            </h1>
          </div>
          <p className="text-purple-200 max-w-lg mx-auto">
            写下你的开头，让 AI 帮你续写。人机共创，意想不到的惊喜。
          </p>
        </div>

        {/* 主创作区 */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
          {/* 配置栏 */}
          <div className="border-b border-white/10 p-4 flex flex-wrap items-center gap-6 bg-black/10">
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">风格:</span>
              <div className="flex gap-2">
                {storyStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setStoryStyle(style.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      storyStyle === style.id
                        ? "bg-purple-500 text-white"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                    title={style.desc}
                  >
                    {style.emoji} {style.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-sm">长度:</span>
              <div className="flex gap-2">
                {lengthOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setStoryLength(opt.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                      storyLength === opt.id
                        ? "bg-pink-500 text-white"
                        : "bg-white/10 text-white/70 hover:bg-white/20"
                    }`}
                    title={opt.words}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 用户输入区 */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-purple-300" />
              <span className="text-purple-200 font-medium">你的故事开头</span>
            </div>
            <textarea
              value={userStory}
              onChange={(e) => setUserStory(e.target.value)}
              placeholder="在这里写下你的故事开头..."
              className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder-white/40 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
            
            {/* 示例开头 */}
            <div className="mt-4">
              <p className="text-white/40 text-sm mb-2">试试这些开头：</p>
              <div className="flex flex-wrap gap-2">
                {exampleStarters.slice(0, 3).map((starter, i) => (
                  <button
                    key={i}
                    onClick={() => setUserStory(starter)}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-white/60 hover:text-white/80 transition-all truncate max-w-xs"
                  >
                    {starter.substring(0, 25)}...
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 生成按钮 */}
          <div className="px-6 pb-6">
            <button
              onClick={handleContinue}
              disabled={isLoading || !userStory.trim()}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  AI 正在创作中...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  AI 续写故事
                </>
              )}
            </button>
          </div>

          {/* AI 续写结果 */}
          {aiContinuation && (
            <div className="border-t border-white/10 p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-300" />
                  <span className="text-pink-200 font-medium">AI 续写</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleRegenerate}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition-all"
                    title="重新生成"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCopy}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition-all"
                    title="复制全文"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-white/90 leading-relaxed">
                {aiContinuation}
              </div>
              
              {/* 完整故事预览 */}
              <div className="mt-6 p-4 bg-black/20 rounded-xl border border-white/5">
                <p className="text-white/50 text-sm mb-2">完整故事预览：</p>
                <p className="text-white/80 text-sm leading-relaxed">
                  <span className="text-purple-300">{userStory}</span>
                  <span className="text-white/60">{" "}</span>
                  <span className="text-pink-300">{aiContinuation}</span>
                </p>
              </div>
              
              {/* 保存到日记 */}
              <div className="mt-4 flex justify-end">
                <a
                  href={`/chat-diary?content=${encodeURIComponent(userStory + "\n\n" + aiContinuation)}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium text-sm transition-all"
                >
                  保存到日记
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* 创作提示 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
            <div className="text-2xl mb-2">💡</div>
            <h3 className="text-white font-medium mb-1">写作提示</h3>
            <p className="text-white/50 text-sm">
              好的开头能激发更好的续写。试试留下悬念或情感转折。
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
            <div className="text-2xl mb-2">🔄</div>
            <h3 className="text-white font-medium mb-1">重新生成</h3>
            <p className="text-white/50 text-sm">
              不满意续写结果？点击重新生成，AI 会给你不同的惊喜。
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
            <div className="text-2xl mb-2">✍️</div>
            <h3 className="text-white font-medium mb-1">人机共创</h3>
            <p className="text-white/50 text-sm">
              你可以继续编辑 AI 续写的内容，形成独特的合作故事。
            </p>
          </div>
        </div>

        {/* 底部链接 */}
        <div className="mt-8 text-center">
          <a
            href="/prompts"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-colors"
          >
            需要更多写作灵感？查看提示词库 →
          </a>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .stars {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(2px 2px at 20px 30px, white, transparent),
                            radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
                            radial-gradient(1px 1px at 90px 40px, white, transparent),
                            radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.9), transparent),
                            radial-gradient(1px 1px at 230px 80px, white, transparent);
          background-size: 250px 150px;
          animation: twinkle 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}