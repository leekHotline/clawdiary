"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// 视频脚本数据结构
interface VideoScene {
  id: number;
  timestamp: string;
  visual: string;
  narration: string;
  mood: string;
  bgMusic: string;
}

interface VideoScript {
  title: string;
  duration: string;
  theme: string;
  scenes: VideoScene[];
  bgMusic: string;
  style: string;
}

// 主题选项
const THEMES = [
  { id: "daily", label: "日常生活", emoji: "📅", color: "from-blue-400 to-blue-600" },
  { id: "travel", label: "旅行回忆", emoji: "✈️", color: "from-cyan-400 to-teal-500" },
  { id: "growth", label: "成长故事", emoji: "🌱", color: "from-green-400 to-emerald-600" },
  { id: "love", label: "情感记录", emoji: "💕", color: "from-pink-400 to-rose-600" },
  { id: "dream", label: "梦想追逐", emoji: "🌟", color: "from-purple-400 to-violet-600" },
  { id: "memory", label: "珍贵回忆", emoji: "📸", color: "from-amber-400 to-orange-600" },
];

// 风格选项
const STYLES = [
  { id: "cinematic", label: "电影感", emoji: "🎬" },
  { id: "vlog", label: "Vlog 风", emoji: "📹" },
  { id: "documentary", label: "纪录片", emoji: "🎥" },
  { id: "poetic", label: "诗意风格", emoji: "🎭" },
];

// 背景音乐选项
const BGM_OPTIONS = [
  { id: "piano", label: "钢琴轻音乐", emoji: "🎹" },
  { id: "guitar", label: "吉他民谣", emoji: "🎸" },
  { id: "ambient", label: "环境音乐", emoji: "🌊" },
  { id: "upbeat", label: "轻快节奏", emoji: "🎉" },
];

// 模拟生成视频脚本
async function generateVideoScript(
  diaryContent: string,
  theme: string,
  style: string,
  bgMusic: string
): Promise<VideoScript> {
  // 这里应该调用 AI API，现在使用模拟数据
  const scenes: VideoScene[] = [
    {
      id: 1,
      timestamp: "00:00-00:05",
      visual: "🌅 晨光透过窗帘，床头的闹钟显示早晨 7:00",
      narration: "新的一天，从期待开始...",
      mood: "温暖",
      bgMusic: "轻柔渐入",
    },
    {
      id: 2,
      timestamp: "00:05-00:15",
      visual: "☕ 手冲咖啡的热气缓缓升起，窗外的阳光洒在桌面上",
      narration: "一杯咖啡，一本书，这是属于我的宁静时光。",
      mood: "平静",
      bgMusic: "主旋律",
    },
    {
      id: 3,
      timestamp: "00:15-00:30",
      visual: "🚶 漫步在树荫下的小路，落叶随风飘动",
      narration: "生活的美好，往往藏在那些不经意的瞬间里。",
      mood: "惬意",
      bgMusic: "节奏渐强",
    },
    {
      id: 4,
      timestamp: "00:30-00:45",
      visual: "🌆 城市的黄昏，天边燃烧着橘红色的晚霞",
      narration: "每一个日落，都是一天故事的完美句点。",
      mood: "感动",
      bgMusic: "高潮",
    },
    {
      id: 5,
      timestamp: "00:45-01:00",
      visual: "🌙 夜幕降临，星星点点的灯光点亮城市",
      narration: "感谢今天，期待明天。",
      mood: "满足",
      bgMusic: "渐弱收尾",
    },
  ];

  return {
    title: "平凡的一天",
    duration: "60秒",
    theme: THEMES.find((t) => t.id === theme)?.label || "日常生活",
    scenes,
    bgMusic: BGM_OPTIONS.find((b) => b.id === bgMusic)?.label || "钢琴轻音乐",
    style: STYLES.find((s) => s.id === style)?.label || "电影感",
  };
}

export default function DiaryVideoPage() {
  const [diaries, setDiaries] = useState<any[]>([]);
  const [selectedDiary, setSelectedDiary] = useState<any>(null);
  const [theme, setTheme] = useState("daily");
  const [style, setStyle] = useState("cinematic");
  const [bgMusic, setBgMusic] = useState("piano");
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoScript, setVideoScript] = useState<VideoScript | null>(null);
  const [customText, setCustomText] = useState("");

  useEffect(() => {
    loadDiaries();
  }, []);

  const loadDiaries = async () => {
    try {
      const res = await fetch("/api/diaries");
      const data = await res.json();
      setDiaries(data.slice(0, 10) || []);
    } catch (error) {
      console.error("加载日记失败:", error);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const content = selectedDiary
        ? `${selectedDiary.title}\n\n${selectedDiary.content}`
        : customText;

      if (!content.trim()) {
        alert("请选择一篇日记或输入内容");
        setIsGenerating(false);
        return;
      }

      const script = await generateVideoScript(content, theme, style, bgMusic);
      setVideoScript(script);
    } catch (error) {
      console.error("生成失败:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExport = () => {
    if (!videoScript) return;

    const exportData = {
      标题: videoScript.title,
      时长: videoScript.duration,
      主题: videoScript.theme,
      风格: videoScript.style,
      背景音乐: videoScript.bgMusic,
      分镜脚本: videoScript.scenes.map((s) => ({
        时间: s.timestamp,
        画面: s.visual,
        旁白: s.narration,
        情绪: s.mood,
        音乐提示: s.bgMusic,
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `video-script-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-6xl mx-auto px-6 py-8">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">🎬 日记视频工坊</h1>
            <p className="text-white/60">将你的日记转化为精美的短视频脚本</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
          >
            ← 返回首页
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：选择和配置 */}
          <div className="space-y-6">
            {/* 日记选择 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>📝</span> 选择日记
              </h2>

              {diaries.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {diaries.map((diary) => (
                    <button
                      key={diary.id}
                      onClick={() => {
                        setSelectedDiary(diary);
                        setCustomText("");
                      }}
                      className={`w-full text-left p-3 rounded-xl transition-all ${
                        selectedDiary?.id === diary.id
                          ? "bg-purple-500/50 border-2 border-purple-400"
                          : "bg-white/5 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      <div className="text-white font-medium truncate">
                        {diary.title}
                      </div>
                      <div className="text-white/50 text-sm truncate">
                        {diary.content?.substring(0, 50)}...
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-white/50">
                  <div className="text-4xl mb-2">📭</div>
                  <p>暂无日记，请先写日记</p>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-white/10">
                <label className="text-white/70 text-sm mb-2 block">
                  或者输入自定义内容：
                </label>
                <textarea
                  value={customText}
                  onChange={(e) => {
                    setCustomText(e.target.value);
                    setSelectedDiary(null);
                  }}
                  placeholder="描述你想制作视频的故事..."
                  className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/30 resize-none focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            {/* 主题选择 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span>🎨</span> 视频主题
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`p-3 rounded-xl transition-all text-center ${
                      theme === t.id
                        ? `bg-gradient-to-br ${t.color} ring-2 ring-white/50`
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <div className="text-2xl mb-1">{t.emoji}</div>
                    <div className="text-white text-sm">{t.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 风格和音乐 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <span>🎬</span> 视频风格
                </h3>
                <div className="space-y-2">
                  {STYLES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      className={`w-full p-2 rounded-lg transition-all flex items-center gap-2 ${
                        style === s.id
                          ? "bg-purple-500/50 border border-purple-400"
                          : "bg-white/5 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      <span>{s.emoji}</span>
                      <span className="text-white text-sm">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <span>🎵</span> 背景音乐
                </h3>
                <div className="space-y-2">
                  {BGM_OPTIONS.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBgMusic(b.id)}
                      className={`w-full p-2 rounded-lg transition-all flex items-center gap-2 ${
                        bgMusic === b.id
                          ? "bg-purple-500/50 border border-purple-400"
                          : "bg-white/5 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      <span>{b.emoji}</span>
                      <span className="text-white text-sm">{b.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 生成按钮 */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-2xl text-white font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>AI 正在创作中...</span>
                </>
              ) : (
                <>
                  <span>✨</span>
                  <span>生成视频脚本</span>
                </>
              )}
            </button>
          </div>

          {/* 右侧：预览结果 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            {videoScript ? (
              <div className="space-y-6">
                {/* 视频信息 */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {videoScript.title}
                    </h2>
                    <p className="text-white/60">
                      {videoScript.theme} · {videoScript.style} · {videoScript.duration}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleExport}
                      className="px-4 py-2 bg-green-500/50 hover:bg-green-500/70 rounded-xl text-white transition-colors flex items-center gap-2"
                    >
                      <span>📥</span>
                      <span>导出脚本</span>
                    </button>
                    <button
                      onClick={() => setVideoScript(null)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors"
                    >
                      重新生成
                    </button>
                  </div>
                </div>

                {/* 分镜脚本 */}
                <div className="space-y-4">
                  {videoScript.scenes.map((scene, index) => (
                    <div
                      key={scene.id}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-purple-500/50 rounded text-white text-xs font-mono">
                          {scene.timestamp}
                        </span>
                        <span className="text-white/60 text-sm">#{index + 1}</span>
                        <span className="ml-auto text-sm px-2 py-1 bg-white/10 rounded text-white/70">
                          {scene.mood}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <div className="text-white/50 text-xs mb-1">🎬 画面</div>
                          <p className="text-white text-sm">{scene.visual}</p>
                        </div>
                        <div>
                          <div className="text-white/50 text-xs mb-1">🎙️ 旁白</div>
                          <p className="text-white text-sm italic">"{scene.narration}"</p>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-white/40">
                        🎵 音乐提示: {scene.bgMusic}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 音乐信息 */}
                <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🎵</span>
                    <div>
                      <div className="text-white font-medium">背景音乐</div>
                      <div className="text-white/70 text-sm">{videoScript.bgMusic}</div>
                    </div>
                  </div>
                </div>

                {/* 使用提示 */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                    <span>💡</span> 使用提示
                  </h3>
                  <ul className="text-white/60 text-sm space-y-1">
                    <li>• 导出脚本后可导入剪映、Premiere 等视频软件</li>
                    <li>• 画面描述可作为 AI 绘图提示词</li>
                    <li>• 旁白可用于文字转语音生成配音</li>
                    <li>• 建议配合 CapCut、Runway 等 AI 视频工具使用</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="text-8xl mb-6 opacity-50">🎬</div>
                <h3 className="text-xl text-white/80 mb-2">准备好了吗？</h3>
                <p className="text-white/50 max-w-sm">
                  选择一篇日记或输入内容，选择你喜欢的主题和风格，AI 将为你生成专业的视频脚本
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 底部相关入口 */}
        <div className="mt-8 grid grid-cols-4 gap-4">
          <Link
            href="/write"
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-colors"
          >
            <span className="text-2xl block mb-2">📝</span>
            <span className="text-white/70 text-sm">写新日记</span>
          </Link>
          <Link
            href="/diary"
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-colors"
          >
            <span className="text-2xl block mb-2">📚</span>
            <span className="text-white/70 text-sm">日记列表</span>
          </Link>
          <Link
            href="/ai-gallery"
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-colors"
          >
            <span className="text-2xl block mb-2">🖼️</span>
            <span className="text-white/70 text-sm">AI 画廊</span>
          </Link>
          <Link
            href="/export"
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-colors"
          >
            <span className="text-2xl block mb-2">📤</span>
            <span className="text-white/70 text-sm">导出中心</span>
          </Link>
        </div>
      </main>
    </div>
  );
}