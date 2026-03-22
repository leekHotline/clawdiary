"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import html2canvas from "html2canvas";

// 卡片模板类型
interface CardTemplate {
  id: string;
  name: string;
  gradient: string;
  textColor: string;
  pattern?: string;
  description: string;
}

// 卡片模板列表
const CARD_TEMPLATES: CardTemplate[] = [
  {
    id: "sunset",
    name: "日落橙",
    gradient: "bg-gradient-to-br from-orange-400 via-rose-500 to-purple-600",
    textColor: "text-white",
    description: "温暖浪漫的日落色调"
  },
  {
    id: "ocean",
    name: "深海蓝",
    gradient: "bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-400",
    textColor: "text-white",
    description: "清新宁静的海洋风格"
  },
  {
    id: "forest",
    name: "森林绿",
    gradient: "bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600",
    textColor: "text-white",
    description: "自然生机的森林气息"
  },
  {
    id: "lavender",
    name: "薰衣草紫",
    gradient: "bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600",
    textColor: "text-white",
    description: "优雅神秘的紫色调"
  },
  {
    id: "cherry",
    name: "樱花粉",
    gradient: "bg-gradient-to-br from-pink-400 via-rose-400 to-red-400",
    textColor: "text-white",
    description: "甜美浪漫的樱花风格"
  },
  {
    id: "minimal",
    name: "极简白",
    gradient: "bg-gradient-to-br from-gray-50 via-white to-gray-100",
    textColor: "text-gray-800",
    description: "简洁干净的极简风格"
  },
  {
    id: "dark",
    name: "暗夜黑",
    gradient: "bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900",
    textColor: "text-white",
    description: "沉稳大气的暗黑风格"
  },
  {
    id: "golden",
    name: "金色年华",
    gradient: "bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500",
    textColor: "text-white",
    description: "温暖明亮的金色风格"
  }
];

// 字体选项
const FONT_OPTIONS = [
  { id: "sans", name: "默认", class: "font-sans" },
  { id: "serif", name: "衬线", class: "font-serif" },
  { id: "mono", name: "等宽", class: "font-mono" }
];

// 示例日记内容
const SAMPLE_DIARIES = [
  {
    title: "春日的第一缕阳光",
    content: "今天阳光很好，透过窗户洒在书桌上。我坐在那里，看着光束中的尘埃飞舞，突然觉得很安心。生活就是这样，总有一些细小的美好在等待被发现。",
    date: "2026年3月22日",
    author: "🦞 龙虾"
  },
  {
    title: "关于成长",
    content: "成长是一场漫长的旅途。有时候我们会迷路，会跌倒，但每一次站起来，我们都比之前更强大。今天的你，已经比昨天更好了。",
    date: "2026年3月21日",
    author: "🦞 龙虾"
  },
  {
    title: "深夜随想",
    content: "城市在夜晚变得安静，只剩下零星的车声和远处的灯光。我喜欢这样的时刻，可以安静地思考，和自己对话。",
    date: "2026年3月20日",
    author: "🦞 龙虾"
  }
];

export default function DiaryCardPage() {
  const [step, setStep] = useState<"edit" | "design" | "preview">("edit");
  const [title, setTitle] = useState(SAMPLE_DIARIES[0].title);
  const [content, setContent] = useState(SAMPLE_DIARIES[0].content);
  const [author, setAuthor] = useState(SAMPLE_DIARIES[0].author);
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate>(CARD_TEMPLATES[0]);
  const [selectedFont, setSelectedFont] = useState("sans");
  const [showDate, setShowDate] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  // 当前日期
  const currentDate = new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  // 下载卡片
  const downloadCard = async () => {
    if (!cardRef.current) return;
    
    setDownloading(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true
      });
      
      const link = document.createElement("a");
      link.download = `diary-card-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("下载失败:", error);
    } finally {
      setDownloading(false);
    }
  };

  // 加载示例日记
  const loadSampleDiary = (index: number) => {
    const sample = SAMPLE_DIARIES[index];
    setTitle(sample.title);
    setContent(sample.content);
    setAuthor(sample.author);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-purple-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pink-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-5xl mx-auto px-6 pt-8 pb-16">
        {/* 头部 */}
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-rose-600 mb-4 inline-block">
            ← 返回首页
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🎨</span>
            <h1 className="text-3xl font-bold text-gray-800">日记卡片生成器</h1>
          </div>
          <p className="text-gray-500">
            将你的日记内容转化为精美卡片，分享到社交媒体
          </p>
        </div>

        {/* 步骤指示器 */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {["编辑内容", "选择样式", "预览下载"].map((label, index) => (
            <div key={index} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  step === ["edit", "design", "preview"][index]
                    ? "bg-rose-500 text-white"
                    : index < ["edit", "design", "preview"].indexOf(step)
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {index < ["edit", "design", "preview"].indexOf(step) ? "✓" : index + 1}
              </div>
              <span
                className={`ml-2 text-sm ${
                  step === ["edit", "design", "preview"][index]
                    ? "text-rose-600 font-medium"
                    : "text-gray-400"
                }`}
              >
                {label}
              </span>
              {index < 2 && (
                <div className="w-12 h-0.5 mx-4 bg-gray-200" />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 左侧：编辑/设置区域 */}
          <div className="space-y-6">
            {step === "edit" && (
              <>
                {/* 内容编辑 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span>📝</span> 编辑内容
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        标题
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="日记标题"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none"
                        maxLength={30}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        内容
                      </label>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="日记内容..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none resize-none"
                        rows={5}
                        maxLength={200}
                      />
                      <p className="text-xs text-gray-400 mt-1 text-right">
                        {content.length}/200
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        作者署名
                      </label>
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="作者名"
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-300 focus:border-rose-400 outline-none"
                        maxLength={20}
                      />
                    </div>
                  </div>
                </div>

                {/* 快速填充 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span>💡</span> 示例日记
                  </h3>
                  <div className="space-y-2">
                    {SAMPLE_DIARIES.map((sample, index) => (
                      <button
                        key={index}
                        onClick={() => loadSampleDiary(index)}
                        className="w-full text-left p-3 rounded-xl bg-gray-50 hover:bg-rose-50 transition-colors group"
                      >
                        <div className="font-medium text-gray-700 group-hover:text-rose-600">
                          {sample.title}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {sample.content.substring(0, 40)}...
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setStep("design")}
                  className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  下一步：选择样式 →
                </button>
              </>
            )}

            {step === "design" && (
              <>
                {/* 模板选择 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span>🎨</span> 选择模板
                  </h3>
                  
                  <div className="grid grid-cols-4 gap-3">
                    {CARD_TEMPLATES.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template)}
                        className={`aspect-square rounded-xl ${template.gradient} p-3 transition-all hover:scale-105 ${
                          selectedTemplate.id === template.id
                            ? "ring-3 ring-rose-500 ring-offset-2"
                            : ""
                        }`}
                      >
                        <div className={`text-xs ${template.textColor} font-medium truncate`}>
                          {template.name}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 字体选择 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span>🔤</span> 字体样式
                  </h3>
                  
                  <div className="flex gap-3">
                    {FONT_OPTIONS.map((font) => (
                      <button
                        key={font.id}
                        onClick={() => setSelectedFont(font.id)}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                          selectedFont === font.id
                            ? "bg-rose-500 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        } ${font.class}`}
                      >
                        {font.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 显示选项 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span>⚙️</span> 显示选项
                  </h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-gray-600">显示日期</span>
                      <button
                        onClick={() => setShowDate(!showDate)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          showDate ? "bg-rose-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            showDate ? "translate-x-6" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </label>
                    
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-gray-600">显示 Logo</span>
                      <button
                        onClick={() => setShowLogo(!showLogo)}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          showLogo ? "bg-rose-500" : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            showLogo ? "translate-x-6" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("edit")}
                    className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    ← 上一步
                  </button>
                  <button
                    onClick={() => setStep("preview")}
                    className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    预览卡片 →
                  </button>
                </div>
              </>
            )}

            {step === "preview" && (
              <>
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span>✨</span> 卡片已生成
                  </h3>
                  
                  <p className="text-gray-500 mb-4">
                    你的日记卡片已经准备好了！点击下方按钮下载或分享。
                  </p>

                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-4 mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">分享建议</h4>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• 推荐尺寸：1200×1600 像素</li>
                      <li>• 适合分享到朋友圈、微博、小红书</li>
                      <li>• 卡片将以 PNG 格式保存</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("design")}
                    className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    ← 修改样式
                  </button>
                  <button
                    onClick={downloadCard}
                    disabled={downloading}
                    className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {downloading ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        下载中...
                      </>
                    ) : (
                      <>
                        <span>📥</span>
                        下载卡片
                      </>
                    )}
                  </button>
                </div>

                {/* 重新开始 */}
                <button
                  onClick={() => {
                    setStep("edit");
                    setTitle(SAMPLE_DIARIES[0].title);
                    setContent(SAMPLE_DIARIES[0].content);
                    setAuthor(SAMPLE_DIARIES[0].author);
                  }}
                  className="w-full py-3 text-gray-500 hover:text-rose-600 transition-colors"
                >
                  创建新卡片
                </button>
              </>
            )}
          </div>

          {/* 右侧：卡片预览 */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>👁️</span> 实时预览
              </h3>
              
              {/* 卡片 */}
              <div
                ref={cardRef}
                className={`aspect-[3/4] rounded-2xl ${selectedTemplate.gradient} p-6 flex flex-col justify-between shadow-xl`}
              >
                {/* 顶部 Logo */}
                {showLogo && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🦞</span>
                    <span className={`font-bold ${selectedTemplate.textColor} opacity-80`}>
                      Claw Diary
                    </span>
                  </div>
                )}

                {/* 主内容 */}
                <div className="flex-1 flex flex-col justify-center">
                  <h2
                    className={`text-2xl font-bold ${selectedTemplate.textColor} mb-4 ${
                      FONT_OPTIONS.find((f) => f.id === selectedFont)?.class || ""
                    }`}
                  >
                    {title || "日记标题"}
                  </h2>
                  <p
                    className={`text-sm ${selectedTemplate.textColor} opacity-90 leading-relaxed ${
                      FONT_OPTIONS.find((f) => f.id === selectedFont)?.class || ""
                    }`}
                  >
                    "{content || "日记内容..."}"
                  </p>
                </div>

                {/* 底部信息 */}
                <div className="flex items-center justify-between">
                  <div className={`text-sm ${selectedTemplate.textColor} opacity-70`}>
                    {author || "作者"}
                  </div>
                  {showDate && (
                    <div className={`text-xs ${selectedTemplate.textColor} opacity-50`}>
                      {currentDate}
                    </div>
                  )}
                </div>
              </div>

              {/* 模板信息 */}
              <div className="mt-4 text-center text-sm text-gray-500">
                当前模板：<span className="font-medium text-rose-600">{selectedTemplate.name}</span>
                <span className="text-gray-400 mx-2">·</span>
                {selectedTemplate.description}
              </div>
            </div>
          </div>
        </div>

        {/* 功能说明 */}
        <div className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-white/50">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span>📌</span> 使用说明
          </h3>
          <ul className="text-sm text-gray-500 space-y-2">
            <li>• 三步生成精美日记卡片：编辑内容 → 选择样式 → 下载分享</li>
            <li>• 支持 8 种精美模板，多种字体样式可选</li>
            <li>• 卡片尺寸优化，适合各大社交平台分享</li>
            <li>• 内容长度限制 200 字，确保最佳展示效果</li>
          </ul>
        </div>

        {/* 相关功能 */}
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">相关功能</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/diary-templates"
              className="bg-white/70 backdrop-blur-sm rounded-xl p-4 hover:bg-white/90 transition-colors group"
            >
              <div className="text-2xl mb-2">📝</div>
              <div className="font-medium text-gray-700 group-hover:text-rose-600">日记模板</div>
              <div className="text-sm text-gray-500">多种日记写作模板</div>
            </Link>
            <Link
              href="/writing-personality"
              className="bg-white/70 backdrop-blur-sm rounded-xl p-4 hover:bg-white/90 transition-colors group"
            >
              <div className="text-2xl mb-2">🧠</div>
              <div className="font-medium text-gray-700 group-hover:text-rose-600">写作人格</div>
              <div className="text-sm text-gray-500">发现你的写作风格</div>
            </Link>
            <Link
              href="/chat-diary"
              className="bg-white/70 backdrop-blur-sm rounded-xl p-4 hover:bg-white/90 transition-colors group"
            >
              <div className="text-2xl mb-2">💬</div>
              <div className="font-medium text-gray-700 group-hover:text-rose-600">AI对话日记</div>
              <div className="text-sm text-gray-500">聊天生成日记</div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative text-center py-8 text-gray-400 text-sm">
        <p>🦞 Claw Diary · 记录每一天的成长</p>
      </footer>
    </div>
  );
}