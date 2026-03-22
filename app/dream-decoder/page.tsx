'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// 梦境元素库
const DREAM_ELEMENTS = {
  symbols: [
    { name: '水', emoji: '💧', meaning: '情绪、潜意识、净化、变化' },
    { name: '飞行', emoji: '🦅', meaning: '自由、超越、逃避、雄心' },
    { name: '坠落', emoji: '⬇️', meaning: '失控、焦虑、不安全感' },
    { name: '蛇', emoji: '🐍', meaning: '转变、隐藏的力量、恐惧、治愈' },
    { name: '死亡', emoji: '💀', meaning: '结束、新生、转变、告别过去' },
    { name: '追逃', emoji: '🏃', meaning: '逃避问题、压力、未解决的冲突' },
    { name: '房子', emoji: '🏠', meaning: '自我、安全感、家庭、内心空间' },
    { name: '牙齿脱落', emoji: '🦷', meaning: '自我形象焦虑、失去感、成长' },
    { name: '考试', emoji: '📝', meaning: '压力、自我评估、害怕失败' },
    { name: '婴儿', emoji: '👶', meaning: '新开始、纯真、脆弱、创造力' },
    { name: '动物', emoji: '🐾', meaning: '本能、直觉、原始自我' },
    { name: '车辆', emoji: '🚗', meaning: '人生方向、掌控感、旅程' },
    { name: '火', emoji: '🔥', meaning: '激情、愤怒、净化、毁灭与重生' },
    { name: '树', emoji: '🌳', meaning: '成长、生命力、家族、连接' },
    { name: '镜子', emoji: '🪞', meaning: '自我认知、真相、反思' },
  ],
  emotions: [
    { name: '恐惧', emoji: '😨', insight: '可能反映现实中的焦虑或逃避' },
    { name: '喜悦', emoji: '😊', insight: '内心深处的渴望得到满足' },
    { name: '困惑', emoji: '😕', insight: '面临选择或方向不明确' },
    { name: '悲伤', emoji: '😢', insight: '未处理的情感或失去' },
    { name: '愤怒', emoji: '😠', insight: '压抑的情绪需要释放' },
    { name: '平静', emoji: '😌', insight: '内心和谐、接受现状' },
    { name: '惊讶', emoji: '😲', insight: '意外的变化或发现' },
    { name: '渴望', emoji: '🥺', insight: '未被满足的需求' },
  ],
};

interface DreamAnalysis {
  symbols: { name: string; emoji: string; meaning: string }[];
  emotion: { name: string; emoji: string; insight: string };
  themes: string[];
  suggestions: string[];
  reflection: string;
}

export default function DreamDecoderPage() {
  const [dreamText, setDreamText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<DreamAnalysis | null>(null);
  const [savedDreams, setSavedDreams] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('dream-records');
    if (saved) {
      setSavedDreams(JSON.parse(saved));
    }
  }, []);

  const analyzeDream = async () => {
    if (!dreamText.trim()) return;
    setIsAnalyzing(true);

    try {
      const response = await fetch('/api/dream-decoder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dream: dreamText }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data);
      } else {
        // 离线分析
        const offlineAnalysis = performOfflineAnalysis(dreamText);
        setAnalysis(offlineAnalysis);
      }
    } catch (error) {
      // 离线分析
      const offlineAnalysis = performOfflineAnalysis(dreamText);
      setAnalysis(offlineAnalysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const performOfflineAnalysis = (text: string): DreamAnalysis => {
    const lowerText = text.toLowerCase();
    
    // 检测符号
    const detectedSymbols = DREAM_ELEMENTS.symbols.filter(
      s => lowerText.includes(s.name) || lowerText.includes(s.emoji)
    ).slice(0, 3);

    // 如果没检测到，随机选几个
    const symbols = detectedSymbols.length > 0 
      ? detectedSymbols 
      : DREAM_ELEMENTS.symbols.slice(0, 3).map(s => ({
          name: s.name,
          emoji: s.emoji,
          meaning: s.meaning,
        }));

    // 随机情绪
    const emotion = DREAM_ELEMENTS.emotions[Math.floor(Math.random() * DREAM_ELEMENTS.emotions.length)];

    // 主题分析
    const themes: string[] = [];
    if (lowerText.includes('飞') || lowerText.includes('天空')) themes.push('超越与自由');
    if (lowerText.includes('水') || lowerText.includes('海') || lowerText.includes('河')) themes.push('情感流动');
    if (lowerText.includes('追') || lowerText.includes('逃') || lowerText.includes('跑')) themes.push('压力与逃避');
    if (lowerText.includes('死') || lowerText.includes('失去')) themes.push('转变与告别');
    if (lowerText.includes('家') || lowerText.includes('房子')) themes.push('安全与归属');
    if (themes.length === 0) themes.push('内在探索', '潜意识信息');

    // 建议
    const suggestions = [
      '记录梦境细节，寻找重复出现的元素',
      '思考最近生活中是否有相关的事件或情绪',
      '问问自己：这个梦境想告诉我什么？',
      '梦境往往反映内心深处的渴望或担忧',
      '尝试在日记中与梦境对话',
    ].slice(0, 3);

    // 反思
    const reflections = [
      `这个梦境似乎在探索"${themes[0]}"的主题。梦境中的符号往往是我们潜意识的投射，帮助我们理解内心深处的想法和感受。`,
      `梦境中的${symbols.map(s => s.name).join('、')}象征着${symbols[0]?.meaning.split('、')[0]}等含义。这可能与您最近的生活经历有关。`,
      `从${emotion.name}的情绪色彩来看，这个梦境可能在处理内心深处的某些情感。建议您在清醒时也关注这种感受。`,
    ];

    return {
      symbols,
      emotion,
      themes,
      suggestions,
      reflection: reflections.join('\n\n'),
    };
  };

  const saveDream = () => {
    if (!analysis) return;
    const record = {
      id: Date.now(),
      text: dreamText,
      analysis,
      createdAt: new Date().toISOString(),
    };
    const updated = [record, ...savedDreams];
    setSavedDreams(updated);
    localStorage.setItem('dream-records', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-violet-900">
      {/* 星空背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.8 + 0.2,
            }}
          />
        ))}
        <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-2xl mx-auto px-4 pt-8 pb-16">
        {/* 头部 */}
        <div className="text-center mb-8">
          <Link href="/" className="text-indigo-300 text-sm hover:text-white transition-colors">
            ← 返回首页
          </Link>
          <div className="mt-4">
            <span className="text-6xl">🌙</span>
          </div>
          <h1 className="text-3xl font-bold text-white mt-4 mb-2">梦境解码器</h1>
          <p className="text-indigo-200">探索潜意识的秘密，解读梦境的象征</p>
        </div>

        {/* 输入区域 */}
        {!analysis && (
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
            <div className="mb-4">
              <label className="text-indigo-200 text-sm mb-2 block">描述你的梦境...</label>
              <textarea
                value={dreamText}
                onChange={(e) => setDreamText(e.target.value)}
                placeholder="昨晚我梦见..."
                className="w-full h-40 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
              />
            </div>

            {/* 快捷标签 */}
            <div className="flex flex-wrap gap-2 mb-4">
              {DREAM_ELEMENTS.symbols.slice(0, 8).map((s) => (
                <button
                  key={s.name}
                  onClick={() => setDreamText(prev => prev + s.name)}
                  className="px-3 py-1 bg-white/10 text-indigo-200 rounded-full text-sm hover:bg-white/20 transition-colors"
                >
                  {s.emoji} {s.name}
                </button>
              ))}
            </div>

            <button
              onClick={analyzeDream}
              disabled={!dreamText.trim() || isAnalyzing}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  解码中...
                </span>
              ) : (
                '✨ 解码梦境'
              )}
            </button>
          </div>
        )}

        {/* 分析结果 */}
        {analysis && (
          <div className="space-y-6">
            {/* 返回按钮 */}
            <button
              onClick={() => {
                setAnalysis(null);
                setDreamText('');
              }}
              className="text-indigo-300 text-sm hover:text-white transition-colors"
            >
              ← 解码新梦境
            </button>

            {/* 符号解读 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>🔮</span> 梦境符号
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {analysis.symbols.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white/5 rounded-xl p-3">
                    <span className="text-2xl">{s.emoji}</span>
                    <div>
                      <div className="font-medium text-white">{s.name}</div>
                      <div className="text-sm text-indigo-200">{s.meaning}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 情绪色彩 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span>🎭</span> 情绪色彩
              </h3>
              <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
                <span className="text-3xl">{analysis.emotion.emoji}</span>
                <div>
                  <div className="font-medium text-white">{analysis.emotion.name}</div>
                  <div className="text-sm text-indigo-200">{analysis.emotion.insight}</div>
                </div>
              </div>
            </div>

            {/* 核心主题 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span>🎯</span> 核心主题
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.themes.map((t, i) => (
                  <span key={i} className="px-3 py-1 bg-purple-500/30 text-purple-100 rounded-full text-sm">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* 深度解读 */}
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md rounded-2xl p-5 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span>💡</span> 深度解读
              </h3>
              <p className="text-indigo-100 leading-relaxed whitespace-pre-line">
                {analysis.reflection}
              </p>
            </div>

            {/* 行动建议 */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span>📝</span> 行动建议
              </h3>
              <ul className="space-y-2">
                {analysis.suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-indigo-200">
                    <span className="text-purple-400">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={saveDream}
                className="flex-1 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <span>💾</span> 保存梦境
              </button>
              <Link
                href="/chat-diary"
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium text-center hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>📖</span> 写入日记
              </Link>
            </div>
          </div>
        )}

        {/* 历史记录按钮 */}
        {savedDreams.length > 0 && !analysis && (
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="mt-6 w-full py-3 bg-white/5 text-indigo-200 rounded-xl hover:bg-white/10 transition-colors"
          >
            📚 查看历史梦境 ({savedDreams.length})
          </button>
        )}

        {/* 历史记录 */}
        {showHistory && savedDreams.length > 0 && (
          <div className="mt-4 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-medium">历史梦境</h3>
              <button
                onClick={() => setShowHistory(false)}
                className="text-indigo-300 text-sm"
              >
                收起
              </button>
            </div>
            {savedDreams.slice(0, 5).map((dream) => (
              <div key={dream.id} className="bg-white/5 rounded-xl p-3">
                <div className="text-xs text-indigo-300 mb-1">
                  {new Date(dream.createdAt).toLocaleDateString('zh-CN')}
                </div>
                <p className="text-indigo-100 text-sm line-clamp-2">{dream.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* 底部说明 */}
        <div className="mt-8 text-center text-indigo-300/60 text-xs">
          <p>🌙 梦境解读仅供参考，帮助您探索内心世界</p>
        </div>
      </main>
    </div>
  );
}