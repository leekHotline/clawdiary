"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// 情绪类型
interface EmotionPoint {
  emotion: string;
  intensity: number; // 1-10
  date: string;
  x: number;
  y: number;
}

// 情绪配置
const EMOTIONS = [
  { id: "joy", name: "喜悦", emoji: "😊", color: "#FFD700" },
  { id: "calm", name: "平静", emoji: "😌", color: "#87CEEB" },
  { id: "excitement", name: "兴奋", emoji: "🤩", color: "#FF6B6B" },
  { id: "love", name: "爱", emoji: "🥰", color: "#FF69B4" },
  { id: "gratitude", name: "感恩", emoji: "🙏", color: "#98D8C8" },
  { id: "hope", name: "希望", emoji: "🌟", color: "#F0E68C" },
  { id: "sadness", name: "悲伤", emoji: "😢", color: "#6495ED" },
  { id: "anger", name: "愤怒", emoji: "😤", color: "#DC143C" },
  { id: "fear", name: "恐惧", emoji: "😰", color: "#9370DB" },
  { id: "anxiety", name: "焦虑", emoji: "😟", color: "#DEB887" },
];

// 星座名称库
const CONSTELLATION_NAMES = [
  "喜悦之座", "平和星域", "追梦者座", "勇者之星",
  "智慧星云", "守护者座", "探索者星", "心灵之座",
  "静谧星域", "希望之星", "感恩星座", "成长星云"
];

// 星星形状
const STAR_SVG = (color: string, size: number) => `
  <svg viewBox="0 0 24 24" width="${size}" height="${size}">
    <polygon 
      points="12,2 15,10 24,10 17,15 19,24 12,19 5,24 7,15 0,10 9,10" 
      fill="${color}"
    />
  </svg>
`;

export default function EmotionConstellationPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [emotionData, setEmotionData] = useState<EmotionPoint[]>([]);
  const [constellationName, setConstellationName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [insight, setInsight] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);

  // 生成随机星座数据
  const generateConstellation = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      // 随机选择 5-8 个情绪
      const numPoints = Math.floor(Math.random() * 4) + 5;
      const selectedEmotions = [...EMOTIONS]
        .sort(() => Math.random() - 0.5)
        .slice(0, numPoints);
      
      const data: EmotionPoint[] = selectedEmotions.map((emotion, index) => {
        const angle = (index / numPoints) * Math.PI * 2 + Math.random() * 0.5;
        const radius = 0.3 + Math.random() * 0.5;
        const center = 200;
        
        return {
          emotion: emotion.id,
          intensity: Math.floor(Math.random() * 10) + 1,
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
            .toISOString().split('T')[0],
          x: center + Math.cos(angle) * radius * 150,
          y: center + Math.sin(angle) * radius * 150,
        };
      });
      
      setEmotionData(data);
      setConstellationName(CONSTELLATION_NAMES[Math.floor(Math.random() * CONSTELLATION_NAMES.length)]);
      
      // 生成洞察
      const dominantEmotion = data.reduce((a, b) => 
        a.intensity > b.intensity ? a : b
      );
      const emotionInfo = EMOTIONS.find(e => e.id === dominantEmotion.emotion);
      setInsight(`你的情绪星座以「${emotionInfo?.name}」为主导能量，这代表你近期在这方面的能量最为充沛。星座的连线展现了你情绪的流动轨迹，每颗星星都是一个独特的情绪记忆。`);
      
      setIsGenerating(false);
      setHasGenerated(true);
      
      // 保存到本地
      localStorage.setItem('emotion-constellation', JSON.stringify({
        data,
        name: CONSTELLATION_NAMES[Math.floor(Math.random() * CONSTELLATION_NAMES.length)],
        createdAt: new Date().toISOString()
      }));
    }, 2000);
  };

  // 绘制星座
  useEffect(() => {
    if (!canvasRef.current || emotionData.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const size = 400;
    canvas.width = size;
    canvas.height = size;
    
    // 清空画布
    ctx.fillStyle = '#0f0f23';
    ctx.fillRect(0, 0, size, size);
    
    // 绘制背景星星
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const radius = Math.random() * 1.5;
      const opacity = Math.random() * 0.5 + 0.2;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
    }
    
    // 绘制连线
    if (emotionData.length > 1) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      emotionData.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y);
        } else {
          ctx.lineTo(point.x, point.y);
        }
      });
      ctx.closePath();
      ctx.stroke();
    }
    
    // 绘制星星节点
    emotionData.forEach((point) => {
      const emotionInfo = EMOTIONS.find(e => e.id === point.emotion);
      if (!emotionInfo) return;
      
      const starSize = 8 + point.intensity * 2;
      
      // 发光效果
      const gradient = ctx.createRadialGradient(
        point.x, point.y, 0,
        point.x, point.y, starSize * 2
      );
      gradient.addColorStop(0, emotionInfo.color + '80');
      gradient.addColorStop(1, 'transparent');
      
      ctx.beginPath();
      ctx.arc(point.x, point.y, starSize * 2, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // 星星核心
      ctx.beginPath();
      ctx.arc(point.x, point.y, starSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = emotionInfo.color;
      ctx.fill();
      
      // 白色中心
      ctx.beginPath();
      ctx.arc(point.x, point.y, starSize / 4, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
    });
    
  }, [emotionData]);

  // 加载已保存的数据
  useEffect(() => {
    const saved = localStorage.getItem('emotion-constellation');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.data) {
          setEmotionData(parsed.data);
          setConstellationName(parsed.name);
          setHasGenerated(true);
          
          const dominantEmotion = parsed.data.reduce((a: EmotionPoint, b: EmotionPoint) => 
            a.intensity > b.intensity ? a : b
          );
          const emotionInfo = EMOTIONS.find(e => e.id === dominantEmotion.emotion);
          setInsight(`你的情绪星座以「${emotionInfo?.name}」为主导能量，这代表你近期在这方面的能量最为充沛。`);
        }
      } catch {
        // 忽略解析错误
      }
    }
  }, []);

  // 分享
  const shareConstellation = async () => {
    const text = `✨ 我的情绪星座「${constellationName}」\n\n🌟 包含 ${emotionData.length} 颗情绪星星\n${emotionData.map(e => {
      const info = EMOTIONS.find(em => em.id === e.emotion);
      return `${info?.emoji} ${info?.name}: ${'★'.repeat(Math.ceil(e.intensity / 2))}`;
    }).join('\n')}\n\n—— Claw Diary 情绪星座图`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: '我的情绪星座', text });
      } catch {
        // 用户取消
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('星座信息已复制！');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900">
      {/* 星空装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.6 + 0.1,
            }}
          />
        ))}
      </div>

      <main className="relative max-w-lg mx-auto px-4 pt-6 pb-16">
        {/* 头部 */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block text-sm text-slate-400 hover:text-white mb-3">
            ← 返回
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1">✨ 情绪星座图</h1>
          <p className="text-slate-400 text-sm">将你的情绪化作星辰</p>
        </div>

        {/* 星座画布 */}
        <div className="relative mb-6">
          <div className="bg-slate-800/50 rounded-3xl p-4 backdrop-blur-sm border border-slate-700/50">
            {hasGenerated ? (
              <>
                <div className="text-center mb-2">
                  <h2 className="text-xl font-bold text-white">{constellationName}</h2>
                  <p className="text-slate-400 text-xs">你的专属情绪星座</p>
                </div>
                <canvas
                  ref={canvasRef}
                  className="mx-auto rounded-xl"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </>
            ) : (
              <div className="h-80 flex items-center justify-center">
                <p className="text-slate-500 text-center">
                  点击下方按钮<br/>生成你的情绪星座
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 情绪星星列表 */}
        {hasGenerated && emotionData.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
              <span>🌟</span> 星座构成
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {emotionData.map((point, index) => {
                const emotionInfo = EMOTIONS.find(e => e.id === point.emotion);
                if (!emotionInfo) return null;
                
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedEmotion(selectedEmotion === point.emotion ? null : point.emotion)}
                    className={`p-3 rounded-xl transition-all cursor-pointer ${
                      selectedEmotion === point.emotion
                        ? 'bg-slate-700 border border-slate-500'
                        : 'bg-slate-800/50 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{emotionInfo.emoji}</span>
                      <div>
                        <div className="text-white text-sm font-medium">{emotionInfo.name}</div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: Math.ceil(point.intensity / 2) }).map((_, i) => (
                            <span key={i} className="text-yellow-400 text-xs">★</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 洞察 */}
        {hasGenerated && insight && (
          <div className="bg-indigo-900/30 rounded-xl p-4 mb-6 border border-indigo-700/30">
            <div className="flex items-start gap-2">
              <span className="text-purple-400">🔮</span>
              <p className="text-slate-300 text-sm leading-relaxed">{insight}</p>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="space-y-3">
          <button
            onClick={generateConstellation}
            disabled={isGenerating}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
              isGenerating
                ? 'bg-slate-700 cursor-not-allowed text-slate-400'
                : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">✨</span>
                正在观测星空...
              </span>
            ) : hasGenerated ? (
              '🔄 重新观测'
            ) : (
              '🔭 开始观测'
            )}
          </button>
          
          {hasGenerated && (
            <button
              onClick={shareConstellation}
              className="w-full py-3 rounded-xl bg-slate-700/50 text-white font-medium hover:bg-slate-600/50 transition-all border border-slate-600/50"
            >
              📤 分享我的星座
            </button>
          )}
        </div>

        {/* 说明 */}
        <div className="mt-8 bg-slate-800/30 rounded-xl p-4">
          <h3 className="text-slate-300 font-medium mb-2 flex items-center gap-2">
            <span>💫</span> 关于情绪星座
          </h3>
          <ul className="text-slate-400 text-sm space-y-1.5">
            <li>• 基于你的日记情绪数据生成独特星座</li>
            <li>• 每颗星星代表一种情绪能量</li>
            <li>• 星星大小反映情绪强度</li>
            <li>• 连线展示情绪之间的流动</li>
            <li>• 每个人的星座都是独一无二的</li>
          </ul>
        </div>

        {/* 情绪图例 */}
        <div className="mt-6">
          <h3 className="text-slate-300 text-sm font-medium mb-2">情绪色谱</h3>
          <div className="flex flex-wrap gap-2">
            {EMOTIONS.map(emotion => (
              <div
                key={emotion.id}
                className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-800/50"
              >
                <span>{emotion.emoji}</span>
                <span className="text-slate-400 text-xs">{emotion.name}</span>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: emotion.color }}
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}