"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 情绪到颜色的映射
const EMOTION_COLORS: Record<string, { color: string; name: string; hex: string }> = {
  happy: { color: "bg-amber-400", name: "阳光金", hex: "#FBBF24" },
  excited: { color: "bg-orange-500", name: "活力橙", hex: "#F97316" },
  calm: { color: "bg-sky-400", name: "宁静蓝", hex: "#38BDF8" },
  peaceful: { color: "bg-teal-400", name: "平和绿", hex: "#2DD4BF" },
  grateful: { color: "bg-pink-400", name: "感恩粉", hex: "#F472B6" },
  love: { color: "bg-rose-500", name: "爱心红", hex: "#F43F5E" },
  inspired: { color: "bg-violet-500", name: "灵感紫", hex: "#8B5CF6" },
  creative: { color: "bg-fuchsia-500", name: "创意洋红", hex: "#D946EF" },
  anxious: { color: "bg-slate-400", name: "忧虑灰", hex: "#94A3B8" },
  sad: { color: "bg-indigo-500", name: "忧郁蓝", hex: "#6366F1" },
  angry: { color: "bg-red-600", name: "怒火红", hex: "#DC2626" },
  tired: { color: "bg-stone-400", name: "疲惫棕", hex: "#A8A29E" },
  hopeful: { color: "bg-emerald-400", name: "希望绿", hex: "#34D399" },
  nostalgic: { color: "bg-amber-600", name: "怀旧褐", hex: "#D97706" },
  proud: { color: "bg-yellow-500", name: "自豪金", hex: "#EAB308" },
};

// 调色盘主题
const PALETTE_THEMES = [
  { id: "sunset", name: "日落黄昏", colors: ["#FF6B6B", "#FFA07A", "#FFD93D", "#6BCB77", "#4D96FF"] },
  { id: "ocean", name: "深海蓝调", colors: ["#1A535C", "#4ECDC4", "#71FFD9", "#F7FFF7", "#FF6B6B"] },
  { id: "forest", name: "森林晨曦", colors: ["#2D5A27", "#5B8C5A", "#8BC34A", "#CDDC39", "#FFEB3B"] },
  { id: "lavender", name: "薰衣草田", colors: ["#E0B0FF", "#D8BFD8", "#DDA0DD", "#FF69B4", "#FF1493"] },
  { id: "autumn", name: "秋日暖阳", colors: ["#D2691E", "#FF8C00", "#FFD700", "#B8860B", "#8B4513"] },
  { id: "aurora", name: "极光幻彩", colors: ["#00FF87", "#60EFF0", "#7B2CBF", "#E0Aaff", "#FF6B6B"] },
];

// 模拟情绪数据
const MOCK_EMOTIONS = [
  { emotion: "happy", intensity: 80, timestamp: new Date().toISOString() },
  { emotion: "calm", intensity: 60, timestamp: new Date(Date.now() - 3600000).toISOString() },
  { emotion: "inspired", intensity: 70, timestamp: new Date(Date.now() - 7200000).toISOString() },
  { emotion: "grateful", intensity: 50, timestamp: new Date(Date.now() - 10800000).toISOString() },
];

interface ColorCard {
  hex: string;
  name: string;
  emotion: string;
  percentage: number;
}

interface Palette {
  id: string;
  name: string;
  colors: ColorCard[];
  createdAt: string;
  mood: string;
}

export default function EmotionPalettePage() {
  const [currentPalette, setCurrentPalette] = useState<Palette | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedPalettes, setSavedPalettes] = useState<Palette[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"palette" | "gradient" | "mosaic">("palette");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 加载保存的调色盘
    try {
      const saved = localStorage.getItem("emotion-palettes");
      if (saved) {
        setSavedPalettes(JSON.parse(saved));
      }
    } catch {
      // localStorage 不可用
    }
    // 生成初始调色盘
    generatePalette();
  }, []);

  const generatePalette = async (themeId?: string) => {
    setIsGenerating(true);
    
    // 模拟生成延迟
    await new Promise((r) => setTimeout(r, 800));
    
    // 获取情绪数据
    const emotions = MOCK_EMOTIONS;
    const totalIntensity = emotions.reduce((sum, e) => sum + e.intensity, 0);
    
    // 生成颜色卡片
    const colors: ColorCard[] = emotions.map((e) => {
      const colorInfo = EMOTION_COLORS[e.emotion] || EMOTION_COLORS.calm;
      return {
        hex: colorInfo.hex,
        name: colorInfo.name,
        emotion: e.emotion,
        percentage: Math.round((e.intensity / totalIntensity) * 100),
      };
    });
    
    // 如果选择了主题，应用主题颜色
    if (themeId) {
      const theme = PALETTE_THEMES.find((t) => t.id === themeId);
      if (theme) {
        theme.colors.forEach((hex, i) => {
          if (colors[i]) {
            colors[i].hex = hex;
          }
        });
      }
    }
    
    // 生成调色盘名称
    const moodNames = ["温暖", "清新", "梦幻", "活力", "宁静", "热情", "温柔", "神秘"];
    const randomMood = moodNames[Math.floor(Math.random() * moodNames.length)];
    
    const newPalette: Palette = {
      id: Date.now().toString(),
      name: `${randomMood}心情调色盘`,
      colors,
      createdAt: new Date().toISOString(),
      mood: randomMood,
    };
    
    setCurrentPalette(newPalette);
    setIsGenerating(false);
  };

  const savePalette = () => {
    if (!currentPalette) return;
    const newSaved = [currentPalette, ...savedPalettes].slice(0, 10);
    setSavedPalettes(newSaved);
    try {
      localStorage.setItem("emotion-palettes", JSON.stringify(newSaved));
    } catch {
      // localStorage 不可用
    }
  };

  const copyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
  };

  const sharePalette = () => {
    if (!currentPalette) return;
    const colorsText = currentPalette.colors.map((c) => c.hex).join(" → ");
    const text = `🎨 我的情绪调色盘：${currentPalette.name}\n\n${colorsText}\n\n#ClawDiary #情绪调色盘`;
    if (navigator.share) {
      navigator.share({ title: currentPalette.name, text });
    } else {
      navigator.clipboard.writeText(text);
      alert("已复制到剪贴板！");
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-6xl animate-pulse">🎨</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50">
      {/* 装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-10 w-60 h-60 bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-orange-200/30 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-6 py-8">
        {/* 返回按钮 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <span>←</span>
          <span>返回首页</span>
        </Link>

        {/* 头部 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl">🎨</span>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              情绪调色盘
            </h1>
          </div>
          <p className="text-gray-500 max-w-md mx-auto">
            根据你的心情生成专属色彩方案，每一天都是一幅画
          </p>
        </div>

        {/* 主题选择 */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            onClick={() => {
              setSelectedTheme(null);
              generatePalette();
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedTheme === null
                ? "bg-gray-800 text-white shadow-lg"
                : "bg-white/70 text-gray-600 hover:bg-white"
            }`}
          >
            🎲 随机生成
          </button>
          {PALETTE_THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => {
                setSelectedTheme(theme.id);
                generatePalette(theme.id);
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTheme === theme.id
                  ? "bg-gray-800 text-white shadow-lg"
                  : "bg-white/70 text-gray-600 hover:bg-white"
              }`}
            >
              {theme.name}
            </button>
          ))}
        </div>

        {/* 视图模式 */}
        <div className="flex justify-center gap-2 mb-6">
          {[
            { mode: "palette", label: "调色盘", emoji: "🎨" },
            { mode: "gradient", label: "渐变", emoji: "🌈" },
            { mode: "mosaic", label: "马赛克", emoji: "🧩" },
          ].map((item) => (
            <button
              key={item.mode}
              onClick={() => setViewMode(item.mode as typeof viewMode)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                viewMode === item.mode
                  ? "bg-violet-600 text-white shadow-lg"
                  : "bg-white/70 text-gray-600 hover:bg-white"
              }`}
            >
              {item.emoji} {item.label}
            </button>
          ))}
        </div>

        {/* 调色盘展示 */}
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl animate-spin">🎨</div>
            <p className="mt-4 text-gray-500">正在生成你的专属调色盘...</p>
          </div>
        ) : currentPalette ? (
          <div className="space-y-6">
            {/* 调色盘名称 */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800">{currentPalette.name}</h2>
              <p className="text-sm text-gray-400">
                生成于 {new Date(currentPalette.createdAt).toLocaleString("zh-CN")}
              </p>
            </div>

            {/* 调色盘展示区 */}
            {viewMode === "palette" && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {currentPalette.colors.map((color, i) => (
                    <div
                      key={i}
                      onClick={() => copyColor(color.hex)}
                      className="group cursor-pointer"
                    >
                      <div
                        className="h-28 rounded-2xl shadow-md group-hover:shadow-xl transition-all group-hover:scale-105 mb-3"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="text-center">
                        <p className="font-medium text-gray-800">{color.name}</p>
                        <p className="text-xs text-gray-400">{color.hex}</p>
                        <p className="text-xs text-gray-500 mt-1">{color.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewMode === "gradient" && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
                <div
                  className="h-48 rounded-2xl shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${currentPalette.colors.map((c) => c.hex).join(", ")})`,
                  }}
                />
                <div className="mt-4 flex justify-center gap-2">
                  {currentPalette.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full shadow-md border-2 border-white"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {viewMode === "mosaic" && (
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
                <div className="grid grid-cols-4 gap-2">
                  {currentPalette.colors.map((color, i) => (
                    <div key={i} className="space-y-2">
                      <div
                        className="h-24 rounded-xl"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div
                        className="h-16 rounded-xl opacity-60"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div
                        className="h-12 rounded-xl opacity-30"
                        style={{ backgroundColor: color.hex }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => generatePalette(selectedTheme || undefined)}
                className="px-6 py-3 bg-white text-gray-700 rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>🎲</span>
                <span>重新生成</span>
              </button>
              <button
                onClick={savePalette}
                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>💾</span>
                <span>保存调色盘</span>
              </button>
              <button
                onClick={sharePalette}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center gap-2"
              >
                <span>📤</span>
                <span>分享</span>
              </button>
            </div>

            {/* 颜色详情 */}
            <div className="bg-white/50 rounded-2xl p-6">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span>🎭</span>
                <span>情绪色彩解析</span>
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {currentPalette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 bg-white/70 rounded-xl p-4"
                  >
                    <div
                      className="w-12 h-12 rounded-xl shadow-md flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-800">{color.name}</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                          {color.emotion}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{color.hex}</code>
                        <span className="text-xs text-gray-400">{color.percentage}%</span>
                      </div>
                    </div>
                    <button
                      onClick={() => copyColor(color.hex)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      📋
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {/* 已保存的调色盘 */}
        {savedPalettes.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span>💖</span>
              <span>已保存的调色盘</span>
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {savedPalettes.map((palette) => (
                <div
                  key={palette.id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
                  onClick={() => setCurrentPalette(palette)}
                >
                  <div className="flex gap-2 mb-3">
                    {palette.colors.map((color, i) => (
                      <div
                        key={i}
                        className="flex-1 h-12 rounded-lg"
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{palette.name}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(palette.createdAt).toLocaleDateString("zh-CN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 使用场景 */}
        <div className="mt-12 bg-white/50 rounded-2xl p-6">
          <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span>✨</span>
            <span>调色盘用途</span>
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/70 rounded-xl p-4">
              <div className="text-2xl mb-2">🖼️</div>
              <h4 className="font-medium text-gray-800 mb-1">壁纸配色</h4>
              <p className="text-gray-500">根据心情选择壁纸主题，让桌面也变得有情绪</p>
            </div>
            <div className="bg-white/70 rounded-xl p-4">
              <div className="text-2xl mb-2">🎨</div>
              <h4 className="font-medium text-gray-800 mb-1">创作灵感</h4>
              <p className="text-gray-500">为设计、绘画、穿搭提供色彩参考</p>
            </div>
            <div className="bg-white/70 rounded-xl p-4">
              <div className="text-2xl mb-2">📊</div>
              <h4 className="font-medium text-gray-800 mb-1">情绪追踪</h4>
              <p className="text-gray-500">通过颜色回顾情绪变化，直观感受心情</p>
            </div>
          </div>
        </div>

        {/* 提示 */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>💡 每天记录心情，获取不同的专属调色盘</p>
          <p className="mt-1">点击颜色可复制色值，用于你的创作 ✨</p>
        </div>
      </main>
    </div>
  );
}